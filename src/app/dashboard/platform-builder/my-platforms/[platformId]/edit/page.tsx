
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/page-header';
import { Loader2, AlertTriangle, ArrowLeft, Save, LayoutDashboard, Settings2, Palette as PaletteIcon, Move, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase/firebase';
import { doc, getDoc, updateDoc, serverTimestamp, Timestamp, collection, query, where, orderBy, onSnapshot, addDoc, deleteDoc, writeBatch, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { PlatformData, GlobalComponentDefinition, PlatformComponentInstance, PlatformLayout, ConfigurablePropertySchema } from '@/platform-builder/data-models';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getRenderableComponent } from '@/platform-builder/component-registry';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';


interface SortableItemProps {
  id: string;
  instance: PlatformComponentInstance;
  onSelectInstance: (id: string) => void;
  selectedInstanceId: string | null;
  onDeleteInstance: (id: string) => void;
}

function SortablePlatformComponentItem({ id, instance, onSelectInstance, selectedInstanceId, onDeleteInstance }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`mb-2 p-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${selectedInstanceId === instance.id ? 'ring-2 ring-primary' : 'ring-1 ring-transparent'}`}
      onClick={() => onSelectInstance(instance.id)}
    >
      <CardContent className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" {...attributes} {...listeners} className="cursor-grab p-1 h-auto">
              <Move className="h-4 w-4 text-muted-foreground" />
            </Button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{instance.type} (ID: ...{instance.id.slice(-4)})</p>
              <p className="text-xs text-muted-foreground truncate">Order: {instance.order}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90 p-1 h-auto" onClick={(e) => { e.stopPropagation(); onDeleteInstance(instance.id); }}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


export default function EditPlatformPage() {
  const params = useParams();
  const platformId = params.platformId as string;
  const { currentUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [platform, setPlatform] = useState<PlatformData | null>(null);
  const [platformName, setPlatformName] = useState<string>("");
  const [platformDescription, setPlatformDescription] = useState<string>("");

  const [globalComponents, setGlobalComponents] = useState<GlobalComponentDefinition[]>([]);
  const [currentLayout, setCurrentLayout] = useState<PlatformLayout | null>(null);
  const [componentInstances, setComponentInstances] = useState<PlatformComponentInstance[]>([]);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch Platform Data
  useEffect(() => {
    if (!platformId || !currentUser) {
      if (!platformId && !isLoading) router.push('/dashboard/platform-builder/my-platforms');
      return;
    }
    
    const platformDocRef = doc(db, 'platforms', platformId);
    const unsubscribe = onSnapshot(platformDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as PlatformData;
        if (data.tenantId !== currentUser.uid) { 
          setError("You are not authorized to edit this platform.");
          toast({ title: "Access Denied", description: "You do not have permission.", variant: "destructive" });
          router.push('/dashboard/platform-builder/my-platforms');
          setIsLoading(false); 
          return;
        }
        setPlatform(data);
        setPlatformName(data.name);
        setPlatformDescription(data.description || "");

        if (!data.defaultLayoutId && currentUser?.uid) {
          console.log(`Platform ${platformId} has no defaultLayoutId. Creating one.`);
          const newLayoutId = `default_layout_${Date.now()}`;
          const layoutRef = doc(db, 'platforms', platformId, 'layouts', newLayoutId);
          const newLayoutData: Omit<PlatformLayout, 'id'> = {
            name: 'Main Layout',
            platformId: platformId,
            tenantId: currentUser.uid, // Important for multi-tenancy
            createdAt: serverTimestamp() as Timestamp,
            lastModified: serverTimestamp() as Timestamp,
          };
          setDoc(layoutRef, newLayoutData).then(() => {
            updateDoc(platformDocRef, { defaultLayoutId: newLayoutId, lastModified: serverTimestamp() })
              .then(() => {
                console.log(`Default layout ${newLayoutId} created and linked to platform ${platformId}.`);
                // No need to set isLoading here, layout/instance effect will handle it
              })
              .catch(err => console.error("Error linking default layout:", err));
          }).catch(err => console.error("Error creating default layout document:", err));
        } else {
            // Only set isLoading to false here if no layout creation is triggered
            // The layout/instance effect will set it false after its own loading
        }
      } else {
        setError("Platform with ID \"" + platformId + "\" not found.");
        toast({ title: "Platform Not Found", variant: "destructive" });
        router.push('/dashboard/platform-builder/my-platforms');
        setIsLoading(false);
      }
    }, (err) => {
      console.error("Error fetching platform:", err);
      setError("Failed to load platform data. Please try again.");
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [platformId, currentUser, router, toast, isLoading]); // Added isLoading to dependency array as it's checked within the effect

  // Fetch Global Component Definitions
  useEffect(() => {
    const componentsColRef = collection(db, 'components');
    const q = query(componentsColRef, orderBy('displayName', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComponents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GlobalComponentDefinition));
      setGlobalComponents(fetchedComponents);
    }, (err) => {
      console.error("Error fetching global components:", err);
      toast({ title: "Error", description: "Could not load global components.", variant: "destructive" });
    });
    return () => unsubscribe();
  }, [toast]);

  // Fetch Current Layout and its Component Instances
  useEffect(() => {
    if (!platform?.defaultLayoutId) {
      setComponentInstances([]);
      setCurrentLayout(null);
      if (platform && platform.hasOwnProperty('defaultLayoutId') && !platform.defaultLayoutId) {
        // This means platform loaded, but it explicitly has no defaultLayoutId
        // This is not an error state, but a state of having no layout to load components from.
        setIsLoading(false); 
      }
      return;
    }
    
    // Set loading to true only if we are actually going to fetch
    if(!currentLayout || currentLayout.id !== platform.defaultLayoutId) {
        setIsLoading(true);
    }


    const layoutDocRef = doc(db, 'platforms', platformId, 'layouts', platform.defaultLayoutId);
    const unsubscribeLayout = onSnapshot(layoutDocRef, (layoutSnap) => {
      if (layoutSnap.exists()) {
        const layoutData = { id: layoutSnap.id, ...layoutSnap.data() } as PlatformLayout;
        setCurrentLayout(layoutData);

        const instancesColRef = collection(db, 'platforms', platformId, 'components');
        const qInstances = query(instancesColRef, where('layoutId', '==', layoutData.id), orderBy('order', 'asc'));
        
        const unsubscribeInstances = onSnapshot(qInstances, (snapshot) => {
          const fetchedInstances = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PlatformComponentInstance));
          setComponentInstances(fetchedInstances);
          setIsLoading(false); 
        }, (err) => {
          console.error("Error fetching component instances:", err);
          toast({ title: "Error", description: "Could not load component instances.", variant: "destructive"});
          setComponentInstances([]);
          setIsLoading(false);
        });
        return () => unsubscribeInstances(); 
      } else {
        console.warn(`Default layout ${platform.defaultLayoutId} not found.`);
        toast({ title: "Layout Error", description: `Layout ${platform.defaultLayoutId} not found.`, variant: "destructive"});
        setCurrentLayout(null);
        setComponentInstances([]);
        setIsLoading(false);
      }
    }, (err) => {
      console.error("Error fetching layout:", err);
      toast({ title: "Error", description: "Could not load layout.", variant: "destructive"});
      setCurrentLayout(null);
      setComponentInstances([]);
      setIsLoading(false);
    });
    return () => unsubscribeLayout(); 
  }, [platformId, platform?.defaultLayoutId, toast, currentLayout]); // Added currentLayout to dependency array


  const handleSaveChanges = async () => {
    if (!currentUser || !platform) return;
    if (!platformName.trim()) {
      toast({ title: "Validation Error", description: "Platform name cannot be empty.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    const platformDocRef = doc(db, 'platforms', platform.id);
    try {
      await updateDoc(platformDocRef, {
        name: platformName,
        description: platformDescription,
        lastModified: serverTimestamp() as Timestamp,
      });
      toast({ title: "Changes Saved", description: `Platform "${platformName}" updated.` });
    } catch (saveError) {
      console.error("Error updating platform: ", saveError);
      toast({ title: "Error Saving Changes", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };
  
  const selectedComponentInstance = componentInstances.find(inst => inst.id === selectedInstanceId);
  const selectedComponentDefinition = globalComponents.find(def => def.id === selectedComponentInstance?.definitionId);

  const handleAddComponentToCanvas = (componentDef: GlobalComponentDefinition) => {
    if (!currentLayout || !currentUser || !platformId) {
        toast({ title: "Error", description: "No active layout, user, or platform ID found.", variant: "destructive"});
        return;
    }
    const newInstance: Omit<PlatformComponentInstance, 'id' | 'createdAt' | 'lastModified'> = {
        definitionId: componentDef.id,
        type: componentDef.type, 
        tenantId: currentUser.uid, 
        platformId: platformId,
        layoutId: currentLayout.id,
        configuredValues: {}, 
        order: componentInstances.length, 
    };

    if (componentDef.configurablePropertiesSchema && typeof componentDef.configurablePropertiesSchema === 'object') {
        Object.entries(componentDef.configurablePropertiesSchema).forEach(([key, schema]) => {
            if (schema && typeof schema === 'object' && schema.defaultValue !== undefined) {
                newInstance.configuredValues[key] = schema.defaultValue;
            }
        });
    }

    addDoc(collection(db, 'platforms', platformId, 'components'), {
        ...newInstance,
        createdAt: serverTimestamp(),
        lastModified: serverTimestamp(),
    })
    .then((docRef) => {
        toast({ title: "Component Added", description: `${componentDef.displayName} added to canvas.`});
        setSelectedInstanceId(docRef.id); 
    })
    .catch(err => {
        console.error("Error adding component instance: ", err);
        toast({ title: "Error", description: "Could not add component.", variant: "destructive" });
    });
  };

  const handleDeleteInstance = async (instanceId: string) => {
    if (!platformId || !instanceId) return;
    const instanceDocRef = doc(db, 'platforms', platformId, 'components', instanceId);
    try {
      await deleteDoc(instanceDocRef);
      toast({ title: "Component Removed", description: "Component instance removed from canvas."});
      if (selectedInstanceId === instanceId) {
        setSelectedInstanceId(null); 
      }
      // Firestore listener will update the componentInstances state automatically
    } catch (deleteError) {
      console.error("Error deleting component instance:", deleteError);
      toast({ title: "Error", description: "Could not remove component instance.", variant: "destructive"});
    }
  };

  const handleUpdateInstanceProperty = (instanceId: string, propertyName: string, value: any) => {
    if (!platformId || !instanceId) return;
    const instanceDocRef = doc(db, 'platforms', platformId, 'components', instanceId);
    updateDoc(instanceDocRef, {
        [`configuredValues.${propertyName}`]: value,
        lastModified: serverTimestamp()
    }).catch(err => {
        console.error("Error updating instance property:", err);
        toast({title: "Update Error", description: "Could not update property.", variant: "destructive"});
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id && over) {
      const oldIndex = componentInstances.findIndex((item) => item.id === active.id);
      const newIndex = componentInstances.findIndex((item) => item.id === over.id);
      
      if (oldIndex === -1 || newIndex === -1) {
        console.error("Error during drag: item not found in instances array.");
        return;
      }
      const newOrderedInstances = arrayMove(componentInstances, oldIndex, newIndex);
      
      setComponentInstances(newOrderedInstances); 

      const batch = writeBatch(db);
      newOrderedInstances.forEach((instance, index) => {
        const docRef = doc(db, 'platforms', platformId, 'components', instance.id);
        batch.update(docRef, { order: index, lastModified: serverTimestamp() });
      });
      try {
        await batch.commit();
        toast({ title: "Order Saved", description: "Component order updated." });
      } catch (error) {
        console.error("Error updating component order:", error);
        toast({ title: "Order Error", description: "Failed to save new order.", variant: "destructive" });
        // Firestore listener should eventually revert to the correct server state if batch fails.
      }
    }
  };


  if (isLoading && !platform) { 
    return (
      <div className="flex flex-col h-full">
        <PageHeader title="Loading Platform..." description="Please wait..." />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <PageHeader title="Error Loading Platform" description={error} />
        <Button variant="outline" asChild>
          <Link href="/dashboard/platform-builder/my-platforms">Back to My Platforms</Link>
        </Button>
      </div>
    );
  }
  
  if (!platform) {
     return (
      <div className="flex flex-col items-center justify-center h-full">
        <PageHeader title="Platform Not Found" description="The platform data could not be loaded." />
        <Button variant="outline" asChild>
          <Link href="/dashboard/platform-builder/my-platforms">Back to My Platforms</Link>
        </Button>
      </div>
    );
  }


  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-[calc(100vh-theme(spacing.24))] overflow-hidden">
        <PageHeader
          title={`Edit Platform: ${platform.name}`}
          description={`Layout: ${currentLayout?.name || 'Loading Layout...'}`}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/platform-builder/my-platforms">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Link>
              </Button>
              <Button data-testid="platform-builder-save-details-button" onClick={handleSaveChanges} disabled={isSaving} size="sm">
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save Details
              </Button>
               <Button data-testid="platform-builder-live-preview-button" size="sm" variant="secondary" asChild>
                <Link href={`/platforms/${platformId}`} target="_blank">
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Live Preview
                </Link>
              </Button>
            </div>
          }
        />

        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 p-4 overflow-hidden">
          <div className="md:col-span-3 flex flex-col gap-4 min-h-0"> 
            <Card className="flex-shrink-0"> 
              <CardHeader>
                <CardTitle className="text-base">Platform Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="editPlatformName" className="text-xs">Name</Label>
                  <Input id="editPlatformName" value={platformName} onChange={(e) => setPlatformName(e.target.value)} disabled={isSaving} className="h-8 text-sm"/>
                </div>
                <div>
                  <Label htmlFor="editPlatformDescription" className="text-xs">Description</Label>
                  <Textarea id="editPlatformDescription" value={platformDescription} onChange={(e) => setPlatformDescription(e.target.value)} rows={2} disabled={isSaving} className="text-sm"/>
                </div>
              </CardContent>
            </Card>
            <Card className="flex-1 flex flex-col min-h-0"> 
              <CardHeader className="shrink-0"> {/* Changed flex-shrink-0 */}
                <CardTitle className="text-base flex items-center gap-1">
                  <PaletteIcon className="h-4 w-4 text-primary" /> Component Palette
                </CardTitle>
              </CardHeader>
              <ScrollArea className="flex-1">
                <CardContent className="space-y-2 py-2"> 
                  {globalComponents.length === 0 && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mx-auto my-4" />}
                  {globalComponents.map(comp => (
                    <Button
                      key={comp.id}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs h-8"
                      onClick={() => handleAddComponentToCanvas(comp)}
                      disabled={isSaving || isLoading} 
                    >
                      {comp.iconUrl ? <img src={comp.iconUrl} alt="" className="h-3 w-3 mr-2" data-ai-hint="component icon" /> : <LayoutDashboard className="h-3 w-3 mr-2"/>}
                      {comp.displayName}
                    </Button>
                  ))}
                </CardContent>
              </ScrollArea>
            </Card>
          </div>

          <div className="md:col-span-6 flex flex-col min-h-0"> 
            <Card className="flex-1 flex flex-col border-2 border-dashed min-h-0">
              <CardHeader className="shrink-0"> {/* Changed flex-shrink-0 */}
                  <CardTitle className="text-base">Canvas ({currentLayout?.name || 'No Layout'})</CardTitle>
              </CardHeader>
              <ScrollArea className="flex-1 bg-muted/20 p-4 rounded-b-md">
                {isLoading && componentInstances.length === 0 && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mx-auto my-10" />}
                {!isLoading && !currentLayout && <p className="text-sm text-muted-foreground text-center py-10">No layout selected or found for this platform.</p>}
                {!isLoading && currentLayout && componentInstances.length === 0 && <p className="text-sm text-muted-foreground text-center py-10">Drag or add components here.</p>}
                
                <SortableContext items={componentInstances.map(i => i.id)} strategy={verticalListSortingStrategy}>
                  {componentInstances.map(instance => (
                    <SortablePlatformComponentItem
                      key={instance.id}
                      id={instance.id}
                      instance={instance}
                      onSelectInstance={setSelectedInstanceId}
                      selectedInstanceId={selectedInstanceId}
                      onDeleteInstance={handleDeleteInstance}
                    />
                  ))}
                </SortableContext>
              </ScrollArea>
            </Card>
          </div>

          <div className="md:col-span-3 flex flex-col min-h-0"> 
            <Card className="flex-1 flex flex-col min-h-0">
              <CardHeader className="shrink-0"> {/* Changed flex-shrink-0 */}
                <CardTitle className="text-base flex items-center gap-1">
                  <Settings2 className="h-4 w-4 text-primary" /> Component Properties
                </CardTitle>
                {selectedComponentInstance && selectedComponentDefinition && <CardDescription className="text-xs truncate">{selectedComponentDefinition.displayName} (ID: ...{selectedComponentInstance?.id.slice(-4)})</CardDescription>}
              </CardHeader>
              <ScrollArea className="flex-1">
                <CardContent className="space-y-3 py-2"> 
                  {!selectedInstanceId && <p className="text-xs text-muted-foreground text-center py-4">Select a component on the canvas.</p>}
                  {selectedComponentInstance && selectedComponentDefinition && (
                    Object.entries(selectedComponentDefinition.configurablePropertiesSchema || {}).map(([propKey, propSchema]: [string, any]) => { 
                      if (!propSchema || typeof propSchema !== 'object' || !propSchema.type || typeof propSchema.type !== 'string') {
                        return (
                          <div key={propKey} className="text-xs text-destructive p-2 border border-destructive/50 rounded-md">
                            <p className="font-semibold">Invalid property schema for: "{propKey}"</p>
                            <p>Schema definition might be missing or malformed in Global Component.</p>
                          </div>
                        );
                      }
                      const currentPropSchema = propSchema as ConfigurablePropertySchema; 

                      return (
                        <div key={propKey} className="space-y-1">
                          <Label htmlFor={`prop-${propKey}`} className="text-xs">{currentPropSchema.label || propKey}</Label>
                          {currentPropSchema.type === 'string' || currentPropSchema.type === 'text' || currentPropSchema.type === 'color' ? (
                            <Input
                              id={`prop-${propKey}`}
                              type={currentPropSchema.type === 'color' ? 'color' : 'text'}
                              value={selectedComponentInstance.configuredValues[propKey] || currentPropSchema.defaultValue || ''}
                              onChange={(e) => handleUpdateInstanceProperty(selectedInstanceId!, propKey, e.target.value)}
                              className="h-8 text-sm"
                              placeholder={currentPropSchema.placeholder}
                              disabled={isSaving}
                            />
                          ) : currentPropSchema.type === 'textarea' ? (
                            <Textarea
                              id={`prop-${propKey}`}
                              value={selectedComponentInstance.configuredValues[propKey] || currentPropSchema.defaultValue || ''}
                              onChange={(e) => handleUpdateInstanceProperty(selectedInstanceId!, propKey, e.target.value)}
                              rows={2}
                              className="text-sm"
                              placeholder={currentPropSchema.placeholder}
                              disabled={isSaving}
                            />
                          ) : currentPropSchema.type === 'number' ? (
                            <Input
                              id={`prop-${propKey}`}
                              type="number"
                              value={selectedComponentInstance.configuredValues[propKey] || currentPropSchema.defaultValue || ''}
                              onChange={(e) => handleUpdateInstanceProperty(selectedInstanceId!, propKey, parseFloat(e.target.value))}
                              className="h-8 text-sm"
                              placeholder={currentPropSchema.placeholder}
                              disabled={isSaving}
                            />
                          ) : currentPropSchema.type === 'boolean' ? (
                            <div className="flex items-center space-x-2 pt-1">
                              <Switch
                                  id={`prop-${propKey}`}
                                  checked={selectedComponentInstance.configuredValues[propKey] !== undefined ? !!selectedComponentInstance.configuredValues[propKey] : !!currentPropSchema.defaultValue}
                                  onCheckedChange={(checked) => handleUpdateInstanceProperty(selectedInstanceId!, propKey, checked)}
                                  className="h-4 w-auto data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
                                  disabled={isSaving}
                              />
                              <Label htmlFor={`prop-${propKey}`} className="text-xs font-normal">{currentPropSchema.helperText || currentPropSchema.label || propKey}</Label>
                            </div>
                          ) : currentPropSchema.type === 'dropdown' && currentPropSchema.options ? (
                            <Select
                              value={selectedComponentInstance.configuredValues[propKey] || currentPropSchema.defaultValue || ''}
                              onValueChange={(value) => handleUpdateInstanceProperty(selectedInstanceId!, propKey, value)}
                              disabled={isSaving}
                            >
                              <SelectTrigger id={`prop-${propKey}`} className="h-8 text-sm">
                                <SelectValue placeholder={currentPropSchema.placeholder || "Select..."} />
                              </SelectTrigger>
                              <SelectContent>
                                {currentPropSchema.options.map(opt => (
                                  <SelectItem key={opt} value={opt} className="text-sm">{opt}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : ( 
                            <Input
                              id={`prop-${propKey}`}
                              value={selectedComponentInstance.configuredValues[propKey] !== undefined ? String(selectedComponentInstance.configuredValues[propKey]) : (currentPropSchema.defaultValue !== undefined ? String(currentPropSchema.defaultValue) : '')}
                              onChange={(e) => handleUpdateInstanceProperty(selectedInstanceId!, propKey, e.target.value)}
                              className="h-8 text-sm"
                              placeholder={currentPropSchema.placeholder}
                              disabled // For unhandled types
                            />
                          )}
                          {currentPropSchema.helperText && currentPropSchema.type !== 'boolean' && <p className="text-xs text-muted-foreground mt-1">{currentPropSchema.helperText}</p>}
                        </div>
                      );
                    })
                  )}
                  {selectedInstanceId && !selectedComponentDefinition && <p className="text-xs text-destructive text-center py-4">Could not find global definition for selected component.</p>}
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
