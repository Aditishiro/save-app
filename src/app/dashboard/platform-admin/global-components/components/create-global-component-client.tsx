
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
import { Loader2, PackagePlus } from 'lucide-react';
import { db } from '@/lib/firebase/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { GlobalComponentDefinition, ConfigurablePropertySchema } from '@/platform-builder/data-models';
import { componentTemplates, type ComponentTemplate } from './component-templates';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

const initialConfigurablePropertiesJson = `{
  "text": { "type": "string", "label": "Button Text", "defaultValue": "Click Me", "group": "Content" }
}`;
const initialTemplateString = `<button>{{props.text}}</button>`;

interface CreateGlobalComponentFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  
  componentId: string;
  setComponentId: (value: string) => void;
  displayName: string;
  setDisplayName: (value: string) => void;
  componentType: string;
  setComponentType: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  iconUrl: string;
  setIconUrl: (value: string) => void;
  tagsString: string;
  setTagsString: (value: string) => void;
  configurablePropertiesJson: string;
  setConfigurablePropertiesJson: (value: string) => void;
  template: string;
  setTemplate: (value: string) => void;
  
  isSaving: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const CreateGlobalComponentForm: React.FC<CreateGlobalComponentFormProps> = ({
  isOpen,
  onOpenChange,
  componentId, setComponentId,
  displayName, setDisplayName,
  componentType, setComponentType,
  description, setDescription,
  iconUrl, setIconUrl,
  tagsString, setTagsString,
  configurablePropertiesJson, setConfigurablePropertiesJson,
  template, setTemplate,
  isSaving,
  handleSubmit,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('custom');

  useEffect(() => {
    if (!isOpen) {
        setSelectedTemplateId('custom'); 
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedTemplateId === 'custom') {
       // This part specifically ensures textareas are reset if 'custom' is re-selected,
       // relying on parent's resetForm for initial blank state when dialog opens.
       setConfigurablePropertiesJson(initialConfigurablePropertiesJson);
       setTemplate(initialTemplateString);
    } else {
      const selected = componentTemplates.find(t => t.templateId === selectedTemplateId);
      if (selected) {
        setComponentId(selected.suggestedId || '');
        setDisplayName(selected.displayName || '');
        setComponentType(selected.type || '');
        setDescription(selected.description || '');
        setIconUrl(selected.iconUrl || '');
        setTagsString((selected.tags || []).join(', '));
        try {
          setConfigurablePropertiesJson(JSON.stringify(selected.configurablePropertiesSchema, null, 2) || initialConfigurablePropertiesJson);
        } catch (e) {
          console.error("Error stringifying schema from template:", e);
          setConfigurablePropertiesJson(initialConfigurablePropertiesJson);
        }
        setTemplate(selected.templateString || initialTemplateString);
      }
    }
  }, [selectedTemplateId, setComponentId, setDisplayName, setComponentType, setDescription, setIconUrl, setTagsString, setConfigurablePropertiesJson, setTemplate]);
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] grid grid-rows-[auto_1fr_auto] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>Create Global Component</DialogTitle>
          <DialogDescription>
            Define a new reusable UI component. Select a template or start from scratch.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="overflow-y-auto"> {/* No flex-1 needed, grid row 1fr handles expansion */}
          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <div>
              <Label htmlFor="templateSelect">Load Template</Label>
              <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId} disabled={isSaving}>
                <SelectTrigger id="templateSelect" className="mt-1">
                  <SelectValue placeholder="Select a template..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom (Blank)</SelectItem>
                  {componentTemplates.map(tmpl => (
                    <SelectItem key={tmpl.templateId} value={tmpl.templateId}>
                      {tmpl.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="componentId">Component ID (Unique)</Label>
                <Input id="componentId" value={componentId} onChange={(e) => setComponentId(e.target.value)} placeholder="e.g., custom-button-v1" required disabled={isSaving} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g., Custom Button" required disabled={isSaving} className="mt-1" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="componentType">Component Type (Renderer Key)</Label>
              <Input id="componentType" value={componentType} onChange={(e) => setComponentType(e.target.value)} placeholder="e.g., Button, DataTable" required disabled={isSaving} className="mt-1" />
              <p className="text-xs text-muted-foreground mt-1">This key links to the actual rendering React component in the system.</p>
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Briefly describe what this component does." rows={2} disabled={isSaving} className="mt-1" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="iconUrl">Icon URL (Optional)</Label>
                <Input id="iconUrl" value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} placeholder="https://example.com/icon.png" disabled={isSaving} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="tags">Tags (Optional, Comma-separated)</Label>
                <Input 
                  id="tags"
                  value={tagsString} 
                  onChange={(e) => setTagsString(e.target.value)} 
                  placeholder="e.g., input, display, material" 
                  disabled={isSaving} 
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="configurablePropertiesJson">Configurable Properties Schema (JSON)</Label>
              <Textarea
                id="configurablePropertiesJson"
                value={configurablePropertiesJson}
                onChange={(e) => setConfigurablePropertiesJson(e.target.value)}
                rows={8}
                className="font-mono text-xs mt-1"
                placeholder={initialConfigurablePropertiesJson}
                disabled={isSaving}
              />
              <p className="text-xs text-muted-foreground mt-1">Define the schema for properties users can configure.</p>
            </div>

            <div>
              <Label htmlFor="template">Render Template (Optional, e.g., Handlebars)</Label>
              <Textarea
                id="template"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                rows={5}
                className="font-mono text-xs mt-1"
                placeholder={initialTemplateString}
                disabled={isSaving}
              />
              <p className="text-xs text-muted-foreground mt-1">Define the component's HTML structure if applicable.</p>
            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="p-6 pt-4 border-t bg-background"> {/* Removed sticky, z-index. Grid handles positioning. */}
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isSaving}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Component
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


export default function CreateGlobalComponentClient() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Form state is lifted here
  const [componentId, setComponentId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [componentType, setComponentType] = useState('');
  const [description, setDescription] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [tagsString, setTagsString] = useState(''); 
  const [configurablePropertiesJson, setConfigurablePropertiesJson] = useState(initialConfigurablePropertiesJson);
  const [template, setTemplate] = useState(initialTemplateString);

  const resetForm = (isOpening = false) => {
    setComponentId('');
    setDisplayName('');
    setComponentType('');
    setDescription('');
    setIconUrl('');
    setTagsString('');
    // Only reset textareas if explicitly opening, to preserve user input if they just re-select "custom" template
    if(isOpening) { 
      setConfigurablePropertiesJson(initialConfigurablePropertiesJson);
      setTemplate(initialTemplateString);
    }
  };

  const handleOpenChangeWrapper = (open: boolean) => {
    if (open) {
      resetForm(true); // Reset form when dialog is opened
    }
    setIsOpen(open);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!componentId.trim() || !displayName.trim() || !componentType.trim()) {
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
      } else {
        parsedConfigurableProperties = {};
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

    const newComponentDef: GlobalComponentDefinition = { 
      id: componentId.trim(),
      displayName: displayName.trim(),
      type: componentType.trim(),
      description: description.trim() || undefined,
      iconUrl: iconUrl.trim() || undefined,
      configurablePropertiesSchema: parsedConfigurableProperties, 
      template: template.trim() || undefined,
      tags: currentTags.length > 0 ? currentTags : undefined,
      // createdAt and lastModified will be set by serverTimestamp
    };

    try {
      const componentDocRef = doc(db, 'components', newComponentDef.id!); // Use the user-provided ID
      await setDoc(componentDocRef, {
        ...newComponentDef,
        createdAt: serverTimestamp(),
        lastModified: serverTimestamp(),
      });

      toast({
        title: 'Global Component Created',
        description: `Component "${newComponentDef.displayName}" has been saved.`,
      });
      handleOpenChangeWrapper(false); // Close dialog on success
    } catch (error) {
      console.error('Error creating global component:', error);
      let errorMessage = 'Could not create global component. Check console for details.';
      if (error instanceof Error && error.message.includes("Missing or insufficient permissions")) {
          errorMessage = "Permission denied. Ensure you have rights to write to the 'components' collection.";
      } else if (error instanceof Error && error.message.toLowerCase().includes("document already exists")) {
          errorMessage = `A component with ID "${newComponentDef.id}" already exists. Please use a unique ID.`;
      }
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <>
      <Button size="sm" onClick={() => handleOpenChangeWrapper(true)} disabled={isSaving}>
        <PackagePlus className="mr-2 h-4 w-4" /> Create New Global Component
      </Button>
      
      <CreateGlobalComponentForm
        isOpen={isOpen}
        onOpenChange={handleOpenChangeWrapper}
        isSaving={isSaving}
        handleSubmit={handleSubmit}
        componentId={componentId} setComponentId={setComponentId}
        displayName={displayName} setDisplayName={setDisplayName}
        componentType={componentType} setComponentType={setComponentType}
        description={description} setDescription={setDescription}
        iconUrl={iconUrl} setIconUrl={setIconUrl}
        tagsString={tagsString} setTagsString={setTagsString}
        configurablePropertiesJson={configurablePropertiesJson} setConfigurablePropertiesJson={setConfigurablePropertiesJson}
        template={template} setTemplate={setTemplate}
      />
    </>
  );
}

