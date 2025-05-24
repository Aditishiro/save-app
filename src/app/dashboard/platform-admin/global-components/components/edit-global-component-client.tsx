
'use client';

import React, { useState, useEffect } from 'react';
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
import { Loader2, Save } from 'lucide-react';
import { db } from '@/lib/firebase/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import type { GlobalComponentDefinition, ConfigurablePropertySchema } from '@/platform-builder/data-models';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  useEffect(() => {
    if (componentToEdit) {
      setComponentId(componentToEdit.id);
      setDisplayName(componentToEdit.displayName);
      setComponentType(componentToEdit.type);
      setDescription(componentToEdit.description || '');
      setIconUrl(componentToEdit.iconUrl || '');
      setTagsString((componentToEdit.tags || []).join(', '));
      
      // Handle schema: it might be an object or already a string from fetch
      if (typeof componentToEdit.configurablePropertiesSchema === 'object') {
        setConfigurablePropertiesJson(JSON.stringify(componentToEdit.configurablePropertiesSchema, null, 2));
      } else {
        setConfigurablePropertiesJson(componentToEdit.configurablePropertiesSchema || '');
      }
      setTemplate(componentToEdit.template || '');
    }
  }, [componentToEdit]);

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

    let parsedConfigurableProperties: Record<string, ConfigurablePropertySchema> | string;
    try {
      if (configurablePropertiesJson.trim()) {
        // Attempt to parse. If it's already an object (e.g. from some direct state manipulation not via textarea), use as is.
        // If parsing fails, it means it's an invalid JSON string, we should error.
        // For now, if it's an object, stringify it, then parse. This ensures it's treated as JSON string from form.
        // More robust: try to parse only if it's a string.
        const tempSchema = typeof configurablePropertiesJson === 'string' ? configurablePropertiesJson : JSON.stringify(configurablePropertiesJson);
        parsedConfigurableProperties = JSON.parse(tempSchema);
      } else {
        parsedConfigurableProperties = {}; // Empty object if JSON string is empty
      }
    } catch (error) {
      toast({
        title: 'Invalid JSON',
        description: 'Configurable Properties Schema JSON is not valid.',
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
      configurablePropertiesSchema: parsedConfigurableProperties, // Store as object
      template: template.trim() || undefined,
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
      onClose(); // Close dialog and trigger refetch in parent
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

  if (!componentToEdit) {
    return null; // Or some placeholder if the dialog is open without a component
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] grid grid-rows-[auto_1fr_auto] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>View/Edit Global Component: {componentToEdit.displayName}</DialogTitle>
          <DialogDescription>
            Modify the details of this reusable UI component. Component ID cannot be changed.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="overflow-y-auto">
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
                className="font-mono text-xs mt-1"
                placeholder={`{ "text": { "type": "string", "label": "Button Text" } }`}
                disabled={isSaving}
              />
              <p className="text-xs text-muted-foreground mt-1">Define the schema for properties users can configure.</p>
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
        </ScrollArea>

        <DialogFooter className="p-6 pt-4 border-t bg-background">
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
