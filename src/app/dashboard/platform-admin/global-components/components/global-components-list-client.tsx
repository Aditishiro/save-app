
'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle, Package, Edit3, Trash2, Code, Info, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/firebase/firebase';
import { collection, query, getDocs, Timestamp, orderBy, deleteDoc, doc } from 'firebase/firestore';
import type { GlobalComponentDefinition } from '@/platform-builder/data-models';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EditGlobalComponentClient from './edit-global-component-client'; // New import

export default function GlobalComponentsListClient() {
  const [components, setComponents] = useState<GlobalComponentDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [selectedComponentForEdit, setSelectedComponentForEdit] = useState<GlobalComponentDefinition | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchComponents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const componentsCollectionRef = collection(db, 'components');
      const q = query(componentsCollectionRef, orderBy('displayName', 'asc'));
      const querySnapshot = await getDocs(q);
      const fetchedComponents = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Ensure schema is stringified if it's an object, for consistent display/handling
          configurablePropertiesSchema: typeof data.configurablePropertiesSchema === 'object'
            ? JSON.stringify(data.configurablePropertiesSchema, null, 2)
            : data.configurablePropertiesSchema,
        } as GlobalComponentDefinition;
      });
      setComponents(fetchedComponents);
    } catch (err) {
      console.error("Error fetching global components: ", err);
      setError("Failed to fetch global components. Please check your Firestore rules and ensure the 'components' collection exists.");
      toast({
        title: "Fetch Error",
        description: "Could not load global components. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  const handleDeleteComponent = async (componentId: string, componentName: string) => {
    try {
      await deleteDoc(doc(db, 'components', componentId));
      setComponents(prevComponents => prevComponents.filter(comp => comp.id !== componentId));
      toast({
        title: "Component Deleted",
        description: `Global component "${componentName}" has been successfully deleted.`,
      });
    } catch (err) {
      console.error("Error deleting component: ", err);
      toast({
        title: "Error Deleting Component",
        description: `Could not delete component "${componentName}". Please try again. Ensure your Firestore rules allow deletion.`,
        variant: "destructive",
      });
    }
  };

  const handleOpenEditDialog = (component: GlobalComponentDefinition) => {
    setSelectedComponentForEdit(component);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedComponentForEdit(null);
    fetchComponents(); // Refetch components in case any changes were made
  };

  const formatDate = (timestamp: Timestamp | undefined | any) => { // Added 'any' for robustness with potential old data
    if (!timestamp) return 'N/A';
    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toLocaleDateString();
    }
    // Fallback for data that might not be a Firestore Timestamp object (e.g., string)
    try {
        return new Date(timestamp).toLocaleDateString();
    } catch (e) {
        return 'Invalid Date';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading components...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-destructive" />
        <h3 className="mt-3 text-lg font-semibold text-destructive">{error}</h3>
      </div>
    );
  }

  return (
    <TooltipProvider>
      {components.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-border rounded-lg">
          <Package className="h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="text-lg font-semibold">No Global Components Defined Yet</h3>
          <p className="text-sm text-muted-foreground">
            Use the "Create New Global Component" button to add components to the library.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {components.map((component) => (
            <Card 
              key={component.id} 
              className="flex flex-col shadow-sm cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleOpenEditDialog(component)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-md flex items-center gap-2">
                     {component.iconUrl ? <img src={component.iconUrl} alt={component.displayName} className="h-5 w-5" data-ai-hint="component icon"/> : <Package className="h-5 w-5 text-muted-foreground"/>}
                    {component.displayName}
                  </CardTitle>
                  <Badge variant="outline">{component.type}</Badge>
                </div>
                <CardDescription className="text-xs">ID: {component.id}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-1 text-sm">
                {component.description && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-muted-foreground truncate cursor-help flex items-center gap-1">
                        <Info className="h-3 w-3" /> {component.description}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="start" className="max-w-xs">
                      <p>{component.description}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {typeof component.configurablePropertiesSchema === 'string' && component.configurablePropertiesSchema.length > 2 && ( // Check if it's a non-empty string
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <p className="text-muted-foreground truncate cursor-help flex items-center gap-1">
                            <Code className="h-3 w-3" /> Configurable Properties
                        </p>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="start" className="max-w-md">
                        <ScrollArea className="h-40">
                         <pre className="text-xs whitespace-pre-wrap bg-muted p-2 rounded-md">{component.configurablePropertiesSchema}</pre>
                        </ScrollArea>
                    </TooltipContent>
                  </Tooltip>
                )}
                 {component.template && (
                     <Tooltip>
                        <TooltipTrigger asChild>
                            <p className="text-muted-foreground truncate cursor-help flex items-center gap-1">
                                <Package className="h-3 w-3" /> View Template String
                            </p>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" align="start" className="max-w-md">
                            <ScrollArea className="h-40">
                                <pre className="text-xs whitespace-pre-wrap bg-muted p-2 rounded-md">{component.template}</pre>
                            </ScrollArea>
                        </TooltipContent>
                     </Tooltip>
                 )}
                <p className="text-xs text-muted-foreground pt-1">
                  Last Modified: {formatDate(component.lastModified)}
                </p>
                 {component.tags && component.tags.length > 0 && (
                    <div className="pt-1">
                      {component.tags.map(tag => <Badge key={tag} variant="secondary" className="mr-1 mb-1 text-xs">{tag}</Badge>)}
                    </div>
                  )}
              </CardContent>
              <CardFooter className="border-t pt-3">
                <div className="flex w-full justify-end items-center gap-2">
                  {/* The main card click opens the edit dialog, so this button might be redundant or serve a different purpose */}
                  <Button variant="outline" size="xs" onClick={(e) => { e.stopPropagation(); handleOpenEditDialog(component); }}>
                    <Edit3 className="mr-1 h-3 w-3" /> Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="xs" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={(e) => e.stopPropagation()}>
                        <Trash2 className="mr-1 h-3 w-3" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the global component definition "{component.displayName}".
                          This will NOT delete instances of this component already used in platforms, but they might not render correctly if the definition is gone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteComponent(component.id, component.displayName)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      {selectedComponentForEdit && (
        <EditGlobalComponentClient
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen} // Directly pass setIsEditDialogOpen
          componentToEdit={selectedComponentForEdit}
          onClose={handleEditDialogClose} // Pass the combined close and refetch handler
        />
      )}
    </TooltipProvider>
  );
}
