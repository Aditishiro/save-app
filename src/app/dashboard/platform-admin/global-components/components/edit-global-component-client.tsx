
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Eye } from 'lucide-react';
import { db } from '@/lib/firebase/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import type { GlobalComponentDefinition, ConfigurablePropertySchema } from '@/platform-builder/data-models';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface EditGlobalComponentClientProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  componentToEdit: GlobalComponentDefinition | null;
  onClose: () => void; // For closing and potentially refetching list
}

export default function EditGlobalComponentClient({
  isOpen,
  onOpenChange,
  componentToEdit,
  onClose,
}: EditGlobalComponentClientProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Form state
  const [componentId, setComponentId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [componentType, setComponentType] = useState('');
  const [description, setDescription] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [tagsString, setTagsString] = useState('');
  const [configurablePropertiesJson, setConfigurablePropertiesJson] = useState('');
  const [template, setTemplate] = useState('');

  const [parsedSchemaForPreview, setParsedSchemaForPreview] = useState<Record<string, ConfigurablePropertySchema> | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    if (componentToEdit) {
      setComponentId(componentToEdit.id);
      setDisplayName(componentToEdit.displayName);
      setComponentType(componentToEdit.type);
      setDescription(componentToEdit.description || '');
      setIconUrl(componentToEdit.iconUrl || '');
      setTagsString((componentToEdit.tags || []).join(', '));
      
      let initialJsonString = '';
      if (typeof componentToEdit.configurablePropertiesSchema === 'object') {
        initialJsonString = JSON.stringify(componentToEdit.configurablePropertiesSchema, null, 2);
      } else if (typeof componentToEdit.configurablePropertiesSchema === 'string') {
        // If it's already a string (e.g. from older data or direct input)
        initialJsonString = componentToEdit.configurablePropertiesSchema || '{}';
      } else {
        initialJsonString = '{}';
      }
      setConfigurablePropertiesJson(initialJsonString);
      setTemplate(componentToEdit.template || '');
    }
  }, [componentToEdit]);

  useEffect(() => {
    // Update preview when JSON string changes
    if (configurablePropertiesJson.trim() === '') {
      setParsedSchemaForPreview({});
      setJsonError(null);
      return;
    }
    try {
      const parsed = JSON.parse(configurablePropertiesJson);
      if (typeof parsed === 'object' && parsed !== null) {
        setParsedSchemaForPreview(parsed);
        setJsonError(null);
      } else {
        setJsonError("Invalid JSON: Parsed value is not an object.");
        setParsedSchemaForPreview(null);
      }
    } catch (error) {
      if (error instanceof Error) {
         setJsonError(`JSON Syntax Error: ${error.message.split('\n')[0]}`); // Show only the first line of the error
      } else {
         setJsonError("Invalid JSON syntax.");
      }
      setParsedSchemaForPreview(null);
    }
  }, [configurablePropertiesJson]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!componentToEdit || !componentId.trim() || !displayName.trim() || !componentType.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Component ID, Display Name, and Type are required.',
        variant: 'destructive',
      });
      return;
    }

    let parsedConfigurableProperties: Record<string, ConfigurablePropertySchema>;
    try {
      if (configurablePropertiesJson.trim()) {
        parsedConfigurableProperties = JSON.parse(configurablePropertiesJson);
         if (typeof parsedConfigurableProperties !== 'object' || parsedConfigurableProperties === null) {
          throw new Error("Schema must be a valid JSON object.");
        }
      } else {
        parsedConfigurableProperties = {}; 
      }
    } catch (error) {
      toast({
        title: 'Invalid JSON',
        description: `Configurable Properties Schema JSON is not valid. ${(error as Error).message}`,
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    const currentTags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    const updatedComponentDef: Partial<GlobalComponentDefinition> = {
      displayName: displayName.trim(),
      type: componentType.trim(),
      description: description.trim() || undefined,
      iconUrl: iconUrl.trim() || undefined,
      configurablePropertiesSchema: parsedConfigurableProperties,
      template: template.trim() || undefined,
      tags: currentTags.length > 0 ? currentTags : undefined,
      lastModified: serverTimestamp() as any,
    };

    try {
      const componentDocRef = doc(db, 'components', componentToEdit.id);
      await updateDoc(componentDocRef, updatedComponentDef);

      toast({
        title: 'Global Component Updated',
        description: `Component "${updatedComponentDef.displayName}" has been updated.`,
      });
      onClose(); 
    } catch (error) {
      console.error('Error updating global component:', error);
      toast({
        title: 'Error',
        description: 'Could not update global component. Check console for details.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!componentToEdit && isOpen) { // Ensure componentToEdit is available if dialog is open
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loading Component Data...</DialogTitle>
          </DialogHeader>
          <div className="p-6 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] grid grid-rows-[auto_1fr_auto] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>View/Edit Global Component: {componentToEdit?.displayName || 'Loading...'}</DialogTitle>
          <DialogDescription>
            Modify the details of this reusable UI component. Component ID cannot be changed.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editComponentId">Component ID (Read-only)</Label>
                  <Input id="editComponentId" value={componentId} readOnly disabled className="mt-1 bg-muted/50" />
                </div>
                <div>
                  <Label htmlFor="editDisplayName">Display Name</Label>
                  <Input id="editDisplayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g., Custom Button" required disabled={isSaving} className="mt-1" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="editComponentType">Component Type (Renderer Key)</Label>
                <Input id="editComponentType" value={componentType} onChange={(e) => setComponentType(e.target.value)} placeholder="e.g., Button, DataTable" required disabled={isSaving} className="mt-1" />
                <p className="text-xs text-muted-foreground mt-1">This key links to the actual rendering React component in the system.</p>
              </div>

              <div>
                <Label htmlFor="editDescription">Description (Optional)</Label>
                <Textarea id="editDescription" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Briefly describe what this component does." rows={2} disabled={isSaving} className="mt-1" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editIconUrl">Icon URL (Optional)</Label>
                  <Input id="editIconUrl" value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} placeholder="https://example.com/icon.png" disabled={isSaving} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="editTags">Tags (Optional, Comma-separated)</Label>
                  <Input 
                    id="editTags"
                    value={tagsString} 
                    onChange={(e) => setTagsString(e.target.value)} 
                    placeholder="e.g., input, display, material" 
                    disabled={isSaving} 
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="editConfigurablePropertiesJson">Configurable Properties Schema (JSON)</Label>
                <Textarea
                  id="editConfigurablePropertiesJson"
                  value={configurablePropertiesJson}
                  onChange={(e) => setConfigurablePropertiesJson(e.target.value)}
                  rows={8}
                  className={`font-mono text-xs mt-1 ${jsonError ? 'border-destructive ring-1 ring-destructive' : ''}`}
                  placeholder={`{ "text": { "type": "string", "label": "Button Text" } }`}
                  disabled={isSaving}
                />
                <p className="text-xs text-muted-foreground mt-1">Define the schema for properties users can configure.</p>
                 {jsonError && <p className="text-xs text-destructive mt-1">{jsonError}</p>}
              </div>

              <div>
                <Label htmlFor="editTemplate">Render Template (Optional, e.g., Handlebars)</Label>
                <Textarea
                  id="editTemplate"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  rows={5}
                  className="font-mono text-xs mt-1"
                  placeholder={`<button>{{props.text}}</button>`}
                  disabled={isSaving}
                />
                <p className="text-xs text-muted-foreground mt-1">Define the component's HTML structure if applicable.</p>
              </div>
            </form>

            {/* Preview Section */}
            <div className="p-6 border-l">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Eye className="mr-2 h-5 w-5 text-primary" />
                Configurable Properties Preview (Defaults)
              </h3>
              {jsonError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>JSON Error</AlertTitle>
                  <AlertDescription>{jsonError}. Preview cannot be generated.</AlertDescription>
                </Alert>
              )}
              {!jsonError && parsedSchemaForPreview && Object.keys(parsedSchemaForPreview).length > 0 && (
                <ScrollArea className="h-[400px] p-3 border rounded-md bg-muted/30">
                  <div className="space-y-3">
                    {Object.entries(parsedSchemaForPreview).map(([key, prop]) => (
                      <div key={key} className="p-2 border-b last:border-b-0">
                        <p className="text-sm font-medium">{prop.label || key}</p>
                        <p className="text-xs text-muted-foreground">
                          Type: <Badge variant="secondary" className="text-xs">{prop.type}</Badge>
                        </p>
                        {prop.defaultValue !== undefined && (
                          <p className="text-xs text-muted-foreground">
                            Default: <code className="bg-background/50 px-1 py-0.5 rounded text-foreground">{String(prop.defaultValue)}</code>
                          </p>
                        )}
                        {prop.helperText && <p className="text-xs text-muted-foreground mt-1"><em>{prop.helperText}</em></p>}
                        {prop.group && <p className="text-xs text-muted-foreground">Group: {prop.group}</p>}
                         {prop.options && Array.isArray(prop.options) && (
                            <p className="text-xs text-muted-foreground">
                                Options: {prop.options.join(', ')}
                            </p>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
              {!jsonError && (!parsedSchemaForPreview || Object.keys(parsedSchemaForPreview).length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No configurable properties defined or JSON is empty.
                </p>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-4 border-t bg-background">
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit} disabled={isSaving || !!jsonError}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

