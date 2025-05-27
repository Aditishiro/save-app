
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FieldPalette } from '@/components/form-builder/field-palette';
import { FormCanvas } from '@/components/form-builder/form-canvas';
import { PropertiesPanel } from '@/components/form-builder/properties-panel';
import { FormFieldData, FormFieldDisplay } from '@/components/form-builder/form-field-display';
import { PageHeader } from '@/components/common/page-header';
import { Save, Send, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase/firebase';
import { collection, addDoc, serverTimestamp, type Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

type FieldConfig = FormFieldData;

export default function CreateFormPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [formFields, setFormFields] = useState<FieldConfig[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState<string>("Untitled Form");
  const [formDescription, setFormDescription] = useState<string>("");
  const [intendedUseCase, setIntendedUseCase] = useState<string>("");
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);


  const handleAddField = useCallback((fieldType: string) => {
    if (isSaving) return;
    const newField: FieldConfig = {
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: fieldType,
      label: `New ${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
      placeholder: fieldType === 'header' ? '' : `Enter ${fieldType}...`,
      required: false,
      validationState: "default",
      options: fieldType === 'dropdown' ? ['Option 1', 'Option 2'] : undefined,
    };
    setFormFields((prevFields) => [...prevFields, newField]);
    setSelectedFieldId(newField.id);
  }, [isSaving]);

  const handleSelectField = useCallback((fieldId: string | null) => {
    if (isSaving) return;
    setSelectedFieldId(fieldId);
  }, [isSaving]);

  const handleUpdateField = useCallback((fieldId: string, updates: Partial<FieldConfig>) => {
    if (isSaving) return;
    setFormFields((prevFields) =>
      prevFields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    );
  }, [isSaving]);

  const handleDeleteField = useCallback((fieldId: string) => {
    if (isSaving) return;
    setFormFields((prevFields) => prevFields.filter(field => field.id !== fieldId));
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  }, [selectedFieldId, isSaving]);

  const selectedFieldConfig = formFields.find(f => f.id === selectedFieldId) || null;

  const renderedFields = formFields.map(field => (
    <FormFieldDisplay
      key={field.id}
      field={isPreviewMode ? {...field, validationState: 'default'} : field}
      isSelected={!isPreviewMode && selectedFieldId === field.id}
      onClick={(id) => !isPreviewMode && handleSelectField(id)}
    />
  ));

  const handleSaveForm = async (status: 'Draft' | 'Published') => {
    if (!currentUser) {
      toast({ title: "Authentication Error", description: "You must be logged in to save a form.", variant: "destructive" });
      return;
    }
    if (!formTitle.trim()) {
      toast({ title: "Validation Error", description: "Form title cannot be empty.", variant: "destructive" });
      return;
    }
    if (!intendedUseCase.trim()) {
      toast({ title: "Validation Error", description: "Intended use case cannot be empty.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    const formConfiguration = JSON.stringify({ fields: formFields });

    try {
      const docRef = await addDoc(collection(db, "forms"), {
        ownerId: currentUser.uid,
        title: formTitle,
        description: formDescription,
        intendedUseCase: intendedUseCase,
        formConfiguration: formConfiguration,
        status: status,
        submissionsCount: 0,
        createdAt: serverTimestamp() as Timestamp,
        lastModified: serverTimestamp() as Timestamp,
        isPublic: false,
        tags: [],
      });
      toast({
        title: `Form ${status === 'Draft' ? 'Saved as Draft' : 'Published'}`,
        description: `Your form "${formTitle}" has been successfully ${status === 'Draft' ? 'saved' : 'published'}.`,
      });
      router.push(`/dashboard/my-forms/${docRef.id}/edit`);
    } catch (error) {
      console.error("Error saving form: ", error);
      toast({
        title: "Error Saving Form",
        description: "Could not save the form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-screen"> {/* Use h-screen for full viewport height */}
      <PageHeader
        title="Create New Form"
        description="Design and configure your new form."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Switch id="preview-mode" checked={isPreviewMode} onCheckedChange={setIsPreviewMode} disabled={isSaving} />
              <Label htmlFor="preview-mode">Preview Mode</Label>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <Button
              data-testid="create-form-save-draft-button"
              variant="secondary"
              size="sm"
              onClick={() => handleSaveForm('Draft')}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Draft
            </Button>
            <Button
              data-testid="create-form-publish-button"
              size="sm"
              onClick={() => handleSaveForm('Published')}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Publish
            </Button>
          </div>
        }
      />

      {/* This container now flexes to fill remaining height and manages its own overflow if needed */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto"> {/* Added overflow-y-auto here */}
        {/* Form inputs section */}
        <div className="p-6 space-y-4 border-b shrink-0">
          <div>
            <Label htmlFor="formTitle">Form Title</Label>
            <Input
              id="formTitle"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g., Client Onboarding"
              className="mt-1 text-lg font-semibold"
              disabled={isSaving}
            />
          </div>
          <div>
            <Label htmlFor="formDescription">Form Description (Optional)</Label>
            <Textarea
              id="formDescription"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="A brief description of what this form is for."
              rows={2}
              className="mt-1"
              disabled={isSaving}
            />
          </div>
          <div>
            <Label htmlFor="intendedUseCase">Intended Use Case</Label>
            <Textarea
              id="intendedUseCase"
              value={intendedUseCase}
              onChange={(e) => setIntendedUseCase(e.target.value)}
              placeholder="e.g., New client data collection for KYC, internal feedback survey, loan pre-qualification..."
              rows={3}
              className="mt-1"
              disabled={isSaving}
            />
          </div>
        </div>

        {/* Builder section - this will take the remaining vertical space */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 p-6 min-h-0">
          {!isPreviewMode && (
            <div className="md:col-span-3 flex flex-col min-h-0">
              <FieldPalette onAddField={handleAddField} isSaving={isSaving} />
            </div>
          )}

          <div className={isPreviewMode ? "md:col-span-12 flex flex-col min-h-0" : "md:col-span-6 flex flex-col min-h-0"}>
            <FormCanvas fields={renderedFields} onSelectField={handleSelectField} />
          </div>

          {!isPreviewMode && (
            <div className="md:col-span-3 flex flex-col min-h-0">
              <PropertiesPanel
                selectedField={selectedFieldConfig}
                onUpdateField={handleUpdateField}
                onDeleteField={handleDeleteField}
                isSaving={isSaving}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
