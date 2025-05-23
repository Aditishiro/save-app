
'use client'; // Ensure this is the very first line

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  // DialogTrigger, // No longer used directly in CreateGlobalComponentForm for this test
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

const initialConfigurablePropertiesJson = `{
  "text": { "type": "string", "label": "Button Text", "defaultValue": "Click Me" }
}`;
const initialTemplate = `<button>{{text}}</button>`;

interface CreateGlobalComponentFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isSaving: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
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
  configurablePropertiesJson: string;
  setConfigurablePropertiesJson: (value: string) => void;
  template: string;
  setTemplate: (value: string) => void;
}

// Simplified version of the form for parsing test
const CreateGlobalComponentForm: React.FC<CreateGlobalComponentFormProps> = ({
  isOpen,
  onOpenChange,
  isSaving, // Keep for potential future re-integration of form
  handleSubmit, // Keep for potential future re-integration
  // Other props temporarily unused in this simplified version
}) => {
  if (!isOpen) {
    return null; // Don't render the dialog if it's not open
  }

  // This is line 83 in the context of the error referring to the previous structure
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create Global Component (Simplified Test)</DialogTitle>
          <DialogDescription>
            Testing if the Dialog component parses correctly.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 py-2">
          <p>Simplified dialog content.</p>
          {/* Original form fields would go here. Removed for parsing test. */}
        </div>
        <DialogFooter className="sticky bottom-0 bg-background py-4 mt-auto">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isSaving}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={(e) => handleSubmit(e as any)} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save (Test)
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

  const [componentId, setComponentId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [componentType, setComponentType] = useState('');
  const [description, setDescription] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [configurablePropertiesJson, setConfigurablePropertiesJson] = useState(
    initialConfigurablePropertiesJson
  );
  const [template, setTemplate] = useState(initialTemplate);

  const resetForm = () => {
    setComponentId('');
    setDisplayName('');
    setComponentType('');
    setDescription('');
    setIconUrl('');
    setConfigurablePropertiesJson(initialConfigurablePropertiesJson);
    setTemplate(initialTemplate);
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
      } else {
        parsedConfigurableProperties = {};
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
        description: 'Could not create global component. Check console.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleOpenChangeWrapper = (open: boolean) => {
    // This wrapper ensures that if the dialog is opened AND
    // the potentially complex JSON/template fields are still empty,
    // they get initialized. This is mostly relevant if the user
    // clears them and re-opens.
    if (open && !configurablePropertiesJson.trim() && !template.trim()) {
        setConfigurablePropertiesJson(initialConfigurablePropertiesJson);
        setTemplate(initialTemplate);
    }
    setIsOpen(open);
  };

  return (
    <>
      <Button size="sm" onClick={() => handleOpenChangeWrapper(true)} disabled={isSaving}>
        <PackagePlus className="mr-2 h-4 w-4" /> Create New Global Component
      </Button>
      
      {/* CreateGlobalComponentForm is now directly controlled by isOpen state from parent */}
      <CreateGlobalComponentForm
        isOpen={isOpen}
        onOpenChange={handleOpenChangeWrapper}
        isSaving={isSaving}
        handleSubmit={handleSubmit}
        componentId={componentId}
        setComponentId={setComponentId}
        displayName={displayName}
        setDisplayName={setDisplayName}
        componentType={componentType}
        setComponentType={setComponentType}
        description={description}
        setDescription={setDescription}
        iconUrl={iconUrl}
        setIconUrl={setIconUrl}
        configurablePropertiesJson={configurablePropertiesJson}
        setConfigurablePropertiesJson={setConfigurablePropertiesJson}
        template={template}
        setTemplate={setTemplate}
      />
    </>
  );
}
