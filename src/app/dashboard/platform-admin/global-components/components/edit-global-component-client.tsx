
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
import { Loader2, Save, Eye, Wand2 } from 'lucide-react';
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
  onClose: () => void; 
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
  const [templateString, setTemplateString] = useState('');

  const [parsedSchemaForPreview, setParsedSchemaForPreview] = useState<Record<string, ConfigurablePropertySchema> | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>('');

  useEffect(() => {
    if (componentToEdit) {
      setComponentId(componentToEdit.id);
      setDisplayName(componentToEdit.displayName);
      setComponentType(componentToEdit.type);
      setDescription(componentToEdit.description || '');
      setIconUrl(componentToEdit.iconUrl || '');
      setTagsString((componentToEdit.tags || []).join(', '));
      
      let initialJsonString = '{}';
      if (componentToEdit.configurablePropertiesSchema) {
          try {
            const schemaObject = typeof componentToEdit.configurablePropertiesSchema === 'string' 
                                 ? JSON.parse(componentToEdit.configurablePropertiesSchema) 
                                 : componentToEdit.configurablePropertiesSchema;
            initialJsonString = JSON.stringify(schemaObject, null, 2);
          } catch (e) {
              console.warn("Error processing schema for editing, might be invalid JSON string:", e);
              initialJsonString = typeof componentToEdit.configurablePropertiesSchema === 'string' 
                                  ? componentToEdit.configurablePropertiesSchema : '{}';
          }
      }
      setConfigurablePropertiesJson(initialJsonString);
      setTemplateString(componentToEdit.template || '');
    } else {
      setComponentId('');
      setDisplayName('');
      setComponentType('');
      setDescription('');
      setIconUrl('');
      setTagsString('');
      setConfigurablePropertiesJson('{}');
      setTemplateString('');
    }
  }, [componentToEdit]);

  useEffect(() => {
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
        setJsonError("Invalid JSON: Schema must be a valid JSON object.");
        setParsedSchemaForPreview(null);
      }
    } catch (error) {
      if (error instanceof Error) {
         setJsonError(`Schema JSON Syntax Error: ${error.message.split('\n')[0]}`);
      } else {
         setJsonError("Invalid Schema JSON syntax.");
      }
      setParsedSchemaForPreview(null);
    }
  }, [configurablePropertiesJson]);

  useEffect(() => {
    if (jsonError || !parsedSchemaForPreview || !templateString) {
      setPreviewHtml('<p class="text-muted-foreground text-center text-xs py-4">Enter valid schema and template for preview.</p>');
      return;
    }

    let html = templateString;
    try {
      Object.entries(parsedSchemaForPreview).forEach(([key, schemaProp]) => {
        const defaultValue = schemaProp.defaultValue !== undefined ? String(schemaProp.defaultValue) : '';
        const regex = new RegExp(`\\{\\{\\s*props\\.${key}\\s*\\}\\}`, 'g');
        html = html.replace(regex, defaultValue);
      });
      setPreviewHtml(html);
    } catch (e) {
      console.error("Error generating preview HTML:", e);
      setPreviewHtml('<p class="text-red-500 text-xs text-center py-4">Error generating preview.</p>');
    }
  }, [templateString, parsedSchemaForPreview, jsonError]);

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
    if (jsonError) {
      toast({
        title: 'Invalid JSON',
        description: `Configurable Properties Schema JSON is not valid: ${jsonError}`,
        variant: 'destructive',
      });
      return;
    }

    let parsedConfigurableProperties: Record<string, ConfigurablePropertySchema>;
    try {
      parsedConfigurableProperties = JSON.parse(configurablePropertiesJson);
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
      template: templateString.trim() || undefined,
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

  if (!componentToEdit && isOpen) {
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
                  <Input id="editIconUrl" value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} placeholder="https://placehold.co/40x40.png" disabled={isSaving} className="mt-1" />
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
                  placeholder={`{ "text": { "type": "string", "label": "Button Text", "defaultValue": "Click Me" } }`}
                  disabled={isSaving}
                />
                <p className="text-xs text-muted-foreground mt-1">Define the schema for properties users can configure.</p>
              </div>

              <div>
                <Label htmlFor="editTemplateString">Render Template (Optional, e.g., Handlebars-like)</Label>
                <Textarea
                  id="editTemplateString"
                  value={templateString}
                  onChange={(e) => setTemplateString(e.target.value)}
                  rows={5}
                  className="font-mono text-xs mt-1"
                  placeholder={`<button class="my-button">{{props.text}}</button>`}
                  disabled={isSaving}
                />
                <p className="text-xs text-muted-foreground mt-1">HTML structure with {{props.propertyName}} placeholders.</p>
              </div>
            </form>

            <div className="p-6 border-l flex flex-col gap-4">
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center">
                  <Eye className="mr-2 h-4 w-4 text-primary" />
                  Configurable Properties Preview (Defaults)
                </h3>
                {jsonError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Schema JSON Error</AlertTitle>
                    <AlertDescription>{jsonError}. Fix to see preview.</AlertDescription>
                  </Alert>
                )}
                {!jsonError && parsedSchemaForPreview && Object.keys(parsedSchemaForPreview).length > 0 && (
                  <ScrollArea className="h-[200px] p-3 border rounded-md bg-muted/30">
                    <div className="space-y-3">
                      {Object.entries(parsedSchemaForPreview).map(([key, prop]) => (
                        <div key={key} className="p-2 border-b last:border-b-0">
                          <div className="text-sm font-medium">{prop.label || key}</div>
                           <div className="text-xs text-muted-foreground">
                            <span>Type: </span><Badge variant="secondary" className="text-xs">{prop.type}</Badge>
                          </div>
                          {prop.defaultValue !== undefined && (
                            <div className="text-xs text-muted-foreground">
                              <span>Default: </span><code className="bg-background/50 px-1 py-0.5 rounded text-foreground">{String(prop.defaultValue)}</code>
                            </div>
                          )}
                          {prop.helperText && <div className="text-xs text-muted-foreground mt-1"><em>{prop.helperText}</em></div>}
                          {prop.group && <div className="text-xs text-muted-foreground">Group: {prop.group}</div>}
                           {prop.options && Array.isArray(prop.options) && (
                              <div className="text-xs text-muted-foreground">
                                  Options: {prop.options.join(', ')}
                              </div>
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
              <div className="flex-1 flex flex-col min-h-[200px]">
                 <h3 className="text-md font-semibold mb-2 flex items-center">
                  <Wand2 className="mr-2 h-4 w-4 text-primary" />
                  Visual Template Preview
                </h3>
                <div className="p-4 border rounded-md bg-muted/30 flex-1 overflow-auto">
                  <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Basic HTML preview based on 'Render Template' and default property values. Styles are inherited. No scripts execute.
                </p>
              </div>
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
