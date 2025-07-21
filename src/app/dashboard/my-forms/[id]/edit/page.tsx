
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FieldPalette } from '@/components/form-builder/field-palette';
import { FormCanvas } from '@/components/form-builder/form-canvas';
import { PropertiesPanel } from '@/components/form-builder/properties-panel';
import { FormFieldData, FormFieldDisplay } from '@/components/form-builder/form-field-display';
import { PageHeader } from '@/components/common/page-header';
import { Save, Send, Eye, History as HistoryIcon, Loader2, Settings, Tags, Globe } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase/firebase';
import { doc, getDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { FormDocument } from '../page';

type FieldConfig = FormFieldData;

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";


export default function EditFormPage() {
  const params = useParams();
  const formId = params.id as string;
  const { currentUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [formFields, setFormFields] = useState<FieldConfig[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");
  const [intendedUseCase, setIntendedUseCase] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState<'Draft' | 'Published' | 'Archived'>('Draft');
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);

  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const [tempDescription, setTempDescription] = useState("");
  const [tempIntendedUseCase, setTempIntendedUseCase] = useState("");
  const [tempIsPublic, setTempIsPublic] = useState<boolean>(false);
  const [tempTagsString, setTempTagsString] = useState<string>("");


  useEffect(() => {
    if (!formId) {
        if (!formId) router.push('/dashboard/my-forms');
        return;
    };

    setIsLoading(true);
    setError(null);
    const formDocRef = doc(db, 'forms', formId);

    getDoc(formDocRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const formData = docSnap.data() as FormDocument;
          // In public mode, we remove the owner check
          // if (formData.ownerId !== currentUser.uid) { ... }

          setFormTitle(formData.title);
          setFormDescription(formData.description || "");
          setIntendedUseCase(formData.intendedUseCase || "");
          setCurrentStatus(formData.status);
          setIsPublic(formData.isPublic || false);
          setTags(formData.tags || []);

          setTempTitle(formData.title);
          setTempDescription(formData.description || "");
          setTempIntendedUseCase(formData.intendedUseCase || "");
          setTempIsPublic(formData.isPublic || false);
          setTempTagsString((formData.tags || []).join(', '));


          try {
            const parsedConfig = JSON.parse(formData.formConfiguration);
            setFormFields(parsedConfig.fields || []);
          } catch (e) {
            console.error("Error parsing form configuration:", e);
            setError("Failed to load form structure. The configuration might be corrupt.");
            setFormFields([]);
          }
        } else {
          setError(`Form with ID "${formId}" could not be found.`);
          toast({ title: "Form Not Found", description: `Form ID "${formId}" does not exist.`, variant: "destructive"});
          router.push('/dashboard/my-forms');
        }
      })
      .catch((err) => {
        console.error("Error fetching form: ", err);
        setError("Failed to load form data. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [formId, router, toast]);


  const handleAddField = useCallback((fieldType: string) => {
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
  }, []);

  const handleSelectField = useCallback((fieldId: string | null) => {
    setSelectedFieldId(fieldId);
  }, []);

  const handleUpdateField = useCallback((fieldId: string, updates: Partial<FieldConfig>) => {
    setFormFields((prevFields) =>
      prevFields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    );
  }, []);

  const handleDeleteField = useCallback((fieldId: string) => {
    setFormFields((prevFields) => prevFields.filter(field => field.id !== fieldId));
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  }, [selectedFieldId]);

  const selectedFieldConfig = formFields.find(f => f.id === selectedFieldId) || null;

  const renderedFields = formFields.map(field => (
    <FormFieldDisplay
      key={field.id}
      field={isPreviewMode ? {...field, validationState: 'default'} : field}
      isSelected={!isPreviewMode && selectedFieldId === field.id}
      onClick={(id) => !isPreviewMode && handleSelectField(id)}
    />
  ));

  const handleSaveChanges = async (newStatus?: 'Draft' | 'Published' | 'Archived') => {
    // No currentUser check in public mode
    if (!formTitle.trim()) {
      toast({ title: "Validation Error", description: "Form title cannot be empty.", variant: "destructive" });
      return;
    }
     if (!intendedUseCase.trim()) {
      toast({ title: "Validation Error", description: "Intended use case cannot be empty.", variant = "destructive" });
      return;
    }

    setIsSaving(true);
    const formConfiguration = JSON.stringify({ fields: formFields });
    const formDocRef = doc(db, 'forms', formId);

    const currentTags = tempTagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    const updateData: Partial<FormDocument> = {
      title: formTitle,
      description: formDescription,
      intendedUseCase: intendedUseCase,
      formConfiguration: formConfiguration,
      lastModified: serverTimestamp() as Timestamp,
      isPublic: isPublic,
      tags: tags,
    };

    if (newStatus) {
      updateData.status = newStatus;
    }

    try {
      await updateDoc(formDocRef, updateData);
      if (newStatus) setCurrentStatus(newStatus);

      setTags(currentTags);
      setIsPublic(tempIsPublic);

      toast({
        title: "Changes Saved",
        description: `Form "${formTitle}" has been updated. ${newStatus ? `Status set to ${newStatus}.` : ''}`,
      });
    } catch (error) {
      console.error("Error updating form: ", error);
      toast({
        title: "Error Saving Changes",
        description: "Could not save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormSettingsSave = () => {
    if (!tempTitle.trim()) {
      toast({ title: "Validation Error", description: "Form title cannot be empty.", variant: "destructive" });
      return;
    }
    if (!tempIntendedUseCase.trim()) {
      toast({ title: "Validation Error", description: "Intended use case cannot be empty.", variant: "destructive" });
      return;
    }
    setFormTitle(tempTitle);
    setFormDescription(tempDescription);
    setIntendedUseCase(tempIntendedUseCase);
    setIsPublic(tempIsPublic);
    setTags(tempTagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== ''));

    setIsSettingsDialogOpen(false);
    handleSaveChanges();
  };


  if (isLoading) {
     return (
      <div className="flex flex-col h-screen">
        <PageHeader title="Loading Form..." description="Please wait while we fetch your form details." />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
         <PageHeader title="Error Loading Form" description={error} />
          <Button variant="outline" asChild>
            <Link href="/dashboard/my-forms">Back to My Forms</Link>
          </Button>
      </div>
    );
  }

  const pageTitle = formTitle || "Untitled Form";

  return (
    <div className="flex flex-col h-screen"> {/* Use h-screen for full viewport height */}
      <PageHeader
        title={`Edit: ${pageTitle}`}
        description={`Form ID: ${formId}. Current Status: ${currentStatus}${isPublic ? ' (Public)' : ''}`}
        actions={
          <div className="flex items-center gap-2">
            <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="edit-form-settings-button" variant="outline" size="sm" disabled={isSaving}>
                  <Settings className="mr-2 h-4 w-4" /> Form Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Form Settings</DialogTitle>
                  <DialogDescription>
                    Update title, description, use case, visibility, and tags for your form.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-1">
                    <Label htmlFor="settingsFormTitle">Title</Label>
                    <Input id="settingsFormTitle" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="settingsFormDescription">Description</Label>
                    <Textarea id="settingsFormDescription" value={tempDescription} onChange={(e) => setTempDescription(e.target.value)} rows={2} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="settingsIntendedUseCase">Use Case</Label>
                    <Input id="settingsIntendedUseCase" value={tempIntendedUseCase} onChange={(e) => setTempIntendedUseCase(e.target.value)} />
                  </div>
                   <div className="flex items-center space-x-2 pt-2">
                    <Switch id="settingsIsPublic" checked={tempIsPublic} onCheckedChange={setTempIsPublic} />
                    <Label htmlFor="settingsIsPublic" className="flex items-center gap-1">
                      <Globe className="h-4 w-4" /> Public Form
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground -mt-1">If checked, anyone with the link can view and submit this form (if Published).</p>
                  <div className="space-y-1">
                    <Label htmlFor="settingsTags" className="flex items-center gap-1">
                        <Tags className="h-4 w-4" /> Tags
                    </Label>
                    <Input id="settingsTags" value={tempTagsString} onChange={(e) => setTempTagsString(e.target.value)} placeholder="e.g., finance, onboarding, kyc" />
                    <p className="text-xs text-muted-foreground">Comma-separated list of tags.</p>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                  <Button onClick={handleFormSettingsSave}>Save Settings</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="flex items-center space-x-2">
              <Switch id="preview-mode" checked={isPreviewMode} onCheckedChange={setIsPreviewMode} disabled={isSaving} />
              <Label htmlFor="preview-mode">Preview</Label>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <Button data-testid="edit-form-save-button" variant="secondary" size="sm" onClick={() => handleSaveChanges()} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save
            </Button>
            {currentStatus !== 'Published' && (
                 <Button id="publishFormButton" data-testid="edit-form-publish-button" size="sm" onClick={() => handleSaveChanges('Published')} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Publish
                </Button>
            )}
            {currentStatus === 'Published' && (
                 <Button id="revertToDraftFormButton" data-testid="edit-form-revert-draft-button" variant="outline" size="sm" onClick={() => handleSaveChanges('Draft')} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <HistoryIcon className="mr-2 h-4 w-4" />} Revert to Draft
                </Button>
            )}
             <Button data-testid="edit-form-live-preview-button" variant="ghost" size="sm" asChild>
                <Link href={`/dashboard/my-forms/${formId}/preview`} target="_blank">
                  <Eye className="mr-2 h-4 w-4" /> Live Preview
                </Link>
             </Button>
          </div>
        }
      />

      {/* This container now flexes to fill remaining height */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 p-6 min-h-0">
        {!isPreviewMode && (
          <div className="md:col-span-3 flex flex-col min-h-0">
            <FieldPalette onAddField={handleAddField} isSaving={isSaving}/>
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
  );
}
