
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PackagePlus } from 'lucide-react';
import { db } from '@/lib/firebase/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { GlobalComponentDefinition } from '@/platform-builder/data-models';

export default function CreateGlobalComponentClient() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [componentId, setComponentId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [componentType, setComponentType] = useState('');
  const [description, setDescription] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [configurablePropertiesJson, setConfigurablePropertiesJson] = useState('');
  const [template, setTemplate] = useState('');

  const resetForm = () => {
    setComponentId('');
    setDisplayName('');
    setComponentType('');
    setDescription('');
    setIconUrl('');
    setConfigurablePropertiesJson('{\n  "text": {\n    "type": "string",\n    "label": "Button Text",\n    "defaultValue": "Click Me"\n  },\n  "color": {\n    "type": "enum",\n    "label": "Button Color",\n    "options": ["primary", "secondary", "destructive"],\n    "defaultValue": "primary"\n  }\n}');
    setTemplate('<button class="bg-blue-500 text-white p-2 rounded">{{text}}</button>');
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

    let parsedConfigurableProperties;
    try {
      if (configurablePropertiesJson.trim()) {
        parsedConfigurableProperties = JSON.parse(configurablePropertiesJson);
      }
    } catch (error) {
      toast({
        title: 'Invalid JSON',
        description: 'Configurable Properties JSON is not valid.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    const newComponentDef: GlobalComponentDefinition = {
      id: componentId.trim(),
      displayName: displayName.trim(),
      type: componentType.trim(),
      description: description.trim() || undefined,
      iconUrl: iconUrl.trim() || undefined,
      configurablePropertiesJson: configurablePropertiesJson.trim() || undefined,
      template: template.trim() || undefined,
      // createdAt and lastModified will be set by serverTimestamp
    };

    try {
      const componentDocRef = doc(db, 'components', newComponentDef.id);
      await setDoc(componentDocRef, {
        ...newComponentDef,
        createdAt: serverTimestamp(),
        lastModified: serverTimestamp(),
      });

      toast({
        title: 'Global Component Created',
        description: `Component "${newComponentDef.displayName}" has been saved.`,
      });
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating global component:', error);
      toast({
        title: 'Error',
        description: 'Could not create global component. Check console for details.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    if (open && !configurablePropertiesJson && !template) {
        setConfigurablePropertiesJson('{\n  "text": {\n    "type": "string",\n    "label": "Button Text",\n    "defaultValue": "Click Me"\n  },\n  "color": {\n    "type": "enum",\n    "label": "Button Color",\n    "options": ["primary", "secondary", "destructive"],\n    "defaultValue": "primary"\n  }\n}');
        setTemplate('<button class="bg-blue-500 text-white p-2 rounded">{{text}}</button>');
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PackagePlus className="mr-2 h-4 w-4" /> Create New Global Component
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>New Global UI Component Definition</DialogTitle>
          <DialogDescription>
            Define a reusable component that can be added to platforms.
            Component ID must be unique.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-2 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="componentId">Component ID (Unique)</Label>
              <Input
                id="componentId"
                value={componentId}
                onChange={(e) => setComponentId(e.target.value.replace(/\s+/g, '_').toLowerCase())}
                placeholder="e.g., custom_button"
                required
              />
            </div>
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g., Custom Button"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="componentType">Component Type</Label>
            <Input
              id="componentType"
              value={componentType}
              onChange={(e) => setComponentType(e.target.value)}
              placeholder="e.g., Button, Card, HeroSection"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe what this component does."
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="iconUrl">Icon URL (Optional)</Label>
            <Input
              id="iconUrl"
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
              placeholder="https://example.com/icon.svg (for component palette)"
            />
          </div>
          <div>
            <Label htmlFor="configurablePropertiesJson">Configurable Properties (JSON)</Label>
            <Textarea
              id="configurablePropertiesJson"
              value={configurablePropertiesJson}
              onChange={(e) => setConfigurablePropertiesJson(e.target.value)}
              placeholder='Example: { "text": { "type": "string", "label": "Button Text", "defaultValue": "Click Me" } }'
              rows={8}
              className="font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Define properties as a JSON object. See data model for structure.
            </p>
          </div>
          <div>
            <Label htmlFor="template">HTML/JSX Template (Optional)</Label>
            <Textarea
              id="template"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              placeholder="e.g., <button class='p-2'>{{text}}</button>"
              rows={5}
              className="font-mono text-xs"
            />
             <p className="text-xs text-muted-foreground mt-1">
              A basic HTML/JSX-like template structure. Use Handlebars-style {{ '{'{'{propertyName}'}'}' }} for dynamic values.
            </p>
          </div>
           <DialogFooter className="sticky bottom-0 bg-background py-4 mt-auto">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSaving}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Component
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
