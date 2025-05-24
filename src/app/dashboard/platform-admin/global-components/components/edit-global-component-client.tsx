
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
import { Loader2, Save, Eye, Wand2, AlertTriangle, Info } from 'lucide-react';
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
  const [templateString, setTemplateString] = useState(''); // Renamed from 'template'

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
      // Ensure schema is treated as an object before stringifying if it's coming from Firestore as such
      // Or use it as a string if it's already stored that way (though object is preferred in Firestore model)
      if (componentToEdit.configurablePropertiesSchema) {
        if (typeof componentToEdit.configurablePropertiesSchema === 'object') {
          try {
            initialJsonString = JSON.stringify(componentToEdit.configurablePropertiesSchema, null, 2);
          } catch (e) {
            console.error("Error stringifying schema for editing:", e);
            initialJsonString = '{}'; // Fallback
          }
        } else if (typeof componentToEdit.configurablePropertiesSchema === 'string') {
          // If it's already a string, try to parse and re-stringify for consistent formatting
          try {
            const parsed = JSON.parse(componentToEdit.configurablePropertiesSchema);
            initialJsonString = JSON.stringify(parsed, null, 2);
          } catch (e) {
            // If parsing fails, use the string as is (it might be malformed)
            initialJsonString = componentToEdit.configurablePropertiesSchema;
            console.warn("Schema is a string but not valid JSON, using as is for textarea:", e);
          }
        }
      }
      setConfigurablePropertiesJson(initialJsonString);
      setTemplateString(componentToEdit.template || '');
      
      // Reset previews when component changes
      setParsedSchemaForPreview(null); 
      setJsonError(null);
      setPreviewHtml('');

    } else {
      // Reset all form fields if componentToEdit is null (dialog is closed or no component)
      setComponentId('');
      setDisplayName('');
      setComponentType('');
      setDescription('');
      setIconUrl('');
      setTagsString('');
      setConfigurablePropertiesJson('{}');
      setTemplateString('');
      setParsedSchemaForPreview(null);
      setJsonError(null);
      setPreviewHtml('');
    }
  }, [componentToEdit]);

  // Effect for parsing Configurable Properties JSON for preview
  useEffect(() => {
    const handler = setTimeout(() => {
      if (configurablePropertiesJson.trim() === '') {
        setParsedSchemaForPreview({});
        setJsonError(null);
        return;
      }
      try {
        const parsed = JSON.parse(configurablePropertiesJson);
        if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
          setParsedSchemaForPreview(parsed);
          setJsonError(null);
        } else {
          setJsonError("Invalid JSON: Schema must be a valid JSON object (not an array or other type).");
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
    }, 500); 

    return () => {
      clearTimeout(handler);
    };
  }, [configurablePropertiesJson]);

  // Effect for generating Visual Template Preview HTML
  useEffect(() => {
    const handler = setTimeout(() => {
        if (jsonError || !parsedSchemaForPreview || !templateString.trim()) {
          setPreviewHtml('<p class="text-muted-foreground text-center text-xs py-4">Enter valid schema and template for visual preview.</p>');
          return;
        }

        let html = templateString;
        try {
          Object.entries(parsedSchemaForPreview).forEach(([key, schemaProp]) => {
            const defaultValue = schemaProp.defaultValue !== undefined ? String(schemaProp.defaultValue) : '';
            // Regex to match {{props.key}}, {{ props.key }}, {{props. key }}, etc.
            // Also matches {{ props.key }} - ensuring robustness with spaces
            const regex = new RegExp(`\\{\\{\\s*props\\s*\\.\\s*${key}\\s*\\}\\}`, 'g');
            html = html.replace(regex, defaultValue);
          });
          setPreviewHtml(html);
        } catch (e) {
          console.error("Error generating preview HTML:", e);
          setPreviewHtml('<p class="text-red-500 text-xs text-center py-4">Error generating visual preview from template.</p>');
        }
    }, 700);

    return () => {
      clearTimeout(handler);
    };
  }, [templateString, parsedSchemaForPreview, jsonError]);


  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
      // Ensure we use the latest parsed schema, or parse again if not available
      if (parsedSchemaForPreview && !jsonError) {
        parsedConfigurableProperties = parsedSchemaForPreview;
      } else if (configurablePropertiesJson.trim() === ''){
        parsedConfigurableProperties = {};
      } else {
        parsedConfigurableProperties = JSON.parse(configurablePropertiesJson);
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

    // Only include fields that are meant to be updated. ID should not change.
    const updatedComponentDef: Partial<Omit<GlobalComponentDefinition, 'id' | 'createdAt'>> = {
      displayName: displayName.trim(),
      type: componentType.trim(),
      description: description.trim() || undefined,
      iconUrl: iconUrl.trim() || undefined,
      configurablePropertiesSchema: parsedConfigurableProperties,
      template: templateString.trim() || undefined,
      tags: currentTags.length > 0 ? currentTags : undefined,
      lastModified: serverTimestamp() as any, // Firestore will convert this
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 p-6">
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="editComponentId">Component ID (Read-only)</Label>
                <Input id="editComponentId" value={componentId} readOnly disabled className="mt-1 bg-muted/50" />
              </div>
              <div>
                <Label htmlFor="editDisplayName">Display Name</Label>
                <Input id="editDisplayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required disabled={isSaving} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="editComponentType">Component Type (Renderer Key)</Label>
                <Input id="editComponentType" value={componentType} onChange={(e) => setComponentType(e.target.value)} required disabled={isSaving} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="editDescription">Description</Label>
                <Textarea id="editDescription" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} disabled={isSaving} className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editIconUrl">Icon URL</Label>
                  <Input id="editIconUrl" value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} disabled={isSaving} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="editTags">Tags (Comma-separated)</Label>
                  <Input id="editTags" value={tagsString} onChange={(e) => setTagsString(e.target.value)} disabled={isSaving} className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="editConfigurablePropertiesJson">Configurable Properties Schema (JSON)</Label>
                <Textarea
                  id="editConfigurablePropertiesJson"
                  value={configurablePropertiesJson}
                  onChange={(e) => setConfigurablePropertiesJson(e.target.value)}
                  rows={8}
                  className="font-mono text-xs mt-1"
                  disabled={isSaving}
                />
                {jsonError && <p className="text-xs text-destructive mt-1">{jsonError}</p>}
              </div>
              <div>
                <Label htmlFor="editTemplateString">Render Template (Optional, e.g., Handlebars)</Label>
                <Textarea
                  id="editTemplateString"
                  value={templateString}
                  onChange={(e) => setTemplateString(e.target.value)}
                  rows={5}
                  className="font-mono text-xs mt-1"
                  disabled={isSaving}
                />
              </div>
            </form>

            {/* Preview Section */}
            <div className="space-y-6 pt-4 lg:pt-0 lg:border-l lg:pl-6">
              {/* Configurable Properties Preview */}
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center gap-1">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  Configurable Properties Preview (Defaults)
                </h3>
                {jsonError && (
                  <Alert variant="destructive" className="mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Schema Error</AlertTitle>
                    <AlertDescription>{jsonError}</AlertDescription>
                  </Alert>
                )}
                <ScrollArea className="h-[200px] p-3 border rounded-md bg-muted/30">
                  {parsedSchemaForPreview && Object.keys(parsedSchemaForPreview).length > 0 ? (
                    <div className="space-y-3 text-xs">
                      {Object.entries(parsedSchemaForPreview).map(([key, prop]) => (
                        <div key={key} className="p-2 border-b last:border-b-0">
                          <div className="font-medium text-foreground">{prop.label || key}</div>
                          <div><Badge variant="secondary" className="text-xs">{prop.type}</Badge></div>
                          {prop.defaultValue !== undefined && <div>Default: <span className="text-muted-foreground">{String(prop.defaultValue)}</span></div>}
                          {prop.helperText && <div className="italic text-muted-foreground/80 text-xs">{prop.helperText}</div>}
                          {prop.group && <div>Group: <span className="text-muted-foreground">{prop.group}</span></div>}
                           {prop.options && prop.options.length > 0 && <div>Options: <span className="text-muted-foreground">{prop.options.join(', ')}</span></div>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4 text-xs">
                      {jsonError ? 'Schema is invalid.' : 'No properties defined or schema is empty.'}
                    </p>
                  )}
                </ScrollArea>
              </div>

              {/* Visual Template Preview */}
              <div>
                <h3 className="text-md font-semibold mb-2 flex items-center gap-1">
                   <Wand2 className="h-4 w-4 text-muted-foreground" />
                  Visual Template Preview (Basic)
                </h3>
                <ScrollArea className="h-[200px] p-3 border rounded-md bg-muted/30">
                  <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: previewHtml }} />
                </ScrollArea>
                 <p className="text-xs text-muted-foreground mt-1 italic">
                  Note: This is a basic HTML preview based on default values. It does not execute JavaScript or complex template logic.
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-4 border-t bg-background">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isSaving}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={() => handleSubmit()} disabled={isSaving || !!jsonError}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
