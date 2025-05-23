
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FieldPalette } from '@/components/form-builder/field-palette';
import { FormCanvas } from '@/components/form-builder/form-canvas';
import { PropertiesPanel } from '@/components/form-builder/properties-panel';
import { FormFieldData, FormFieldDisplay } from '@/components/form-builder/form-field-display';
import { PageHeader } from '@/components/common/page-header';
import { Save, Send, Eye, History as HistoryIcon, Loader2, AlertTriangle, Settings } from 'lucide-react';
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
import { FormDocument } from '../page'; // Assuming FormDocument is exported from parent page

type FieldConfig = FormFieldData;

// For Form Settings Dialog
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export default function EditFormPage() {
  const params = useParams<{ id: string }>();
  const formId = params.id;
  const { currentUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [formFields, setFormFields] = useState<FieldConfig[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  
  const [formTitle, setFormTitle] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");
  const [intendedUseCase, setIntendedUseCase] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState<'Draft' | 'Published' | 'Archived'>('Draft');
  
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const [tempDescription, setTempDescription] = useState("");
  const [tempIntendedUseCase, setTempIntendedUseCase] = useState("");


  useEffect(() => {
    if (!formId || !currentUser) {
        if (!formId) router.push('/dashboard/my-forms'); // or show error
        return;
    };

    setIsLoading(true);
    setError(null);
    const formDocRef = doc(db, 'forms', formId);

    getDoc(formDocRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const formData = docSnap.data() as FormDocument;
          if (formData.ownerId !== currentUser.uid) {
             setError("You are not authorized to edit this form.");
             toast({ title: "Access Denied", description: "You do not have permission to edit this form.", variant: "destructive"});
             router.push('/dashboard/my-forms');
             return;
          }
          setFormTitle(formData.title);
          setFormDescription(formData.description || "");
          setIntendedUseCase(formData.intendedUseCase || "");
          setCurrentStatus(formData.status);

          setTempTitle(formData.title);
          setTempDescription(formData.description || "");
          setTempIntendedUseCase(formData.intendedUseCase || "");

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
  }, [formId, currentUser, router, toast]);


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
    if (!currentUser) {
      toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive"});
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
    const formDocRef = doc(db, 'forms', formId);

    const updateData: Partial<FormDocument> = {
      title: formTitle,
      description: formDescription,
      intendedUseCase: intendedUseCase,
      formConfiguration: formConfiguration,
      lastModified: serverTimestamp() as Timestamp,
    };

    if (newStatus) {
      updateData.status = newStatus;
    }

    try {
      await updateDoc(formDocRef, updateData);
      if (newStatus) setCurrentStatus(newStatus);
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
    setIsSettingsDialogOpen(false);
    // Immediately save these settings to Firestore
    handleSaveChanges(); 
  };


  if (isLoading) {
     return (
      <div className="flex flex-col h-[calc(100vh-theme(spacing.28))]">
        <PageHeader title="Loading Form..." description="Please wait while we fetch your form details." />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-theme(spacing.28))]">
         <PageHeader title="Error Loading Form" description={error} />
          <Button variant="outline" asChild>
            <Link href="/dashboard/my-forms">Back to My Forms</Link>
          </Button>
      </div>
    );
  }

  const pageTitle = formTitle || "Untitled Form";

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.28))]">
      <PageHeader
        title={`Edit: ${pageTitle}`}
        description={`Form ID: ${formId}. Current Status: ${currentStatus}`}
        actions={
          <div className="flex items-center gap-2">
            <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={isSaving}>
                  <Settings className="mr-2 h-4 w-4" /> Form Settings
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Form Settings</DialogTitle>
                  <DialogDescription>
                    Update the title, description, and intended use case for your form.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="settingsFormTitle" className="text-right">Title</Label>
                    <Input id="settingsFormTitle" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="settingsFormDescription" className="text-right">Description</Label>
                    <Textarea id="settingsFormDescription" value={tempDescription} onChange={(e) => setTempDescription(e.target.value)} className="col-span-3" rows={2} />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="settingsIntendedUseCase" className="text-right">Use Case</Label>
                    <Input id="settingsIntendedUseCase" value={tempIntendedUseCase} onChange={(e) => setTempIntendedUseCase(e.target.value)} className="col-span-3" />
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
            <Button variant="secondary" size="sm" onClick={() => handleSaveChanges()} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save
            </Button>
            {currentStatus !== 'Published' && (
                 <Button size="sm" onClick={() => handleSaveChanges('Published')} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Publish
                </Button>
            )}
            {currentStatus === 'Published' && (
                 <Button variant="outline" size="sm" onClick={() => handleSaveChanges('Draft')} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <HistoryIcon className="mr-2 h-4 w-4" />} Revert to Draft
                </Button>
            )}
             <Button variant="ghost" size="sm" asChild>
                <Link href={`/dashboard/my-forms/${formId}/preview`} target="_blank">
                  <Eye className="mr-2 h-4 w-4" /> Live Preview
                </Link>
             </Button>
          </div>
        }
      />

      <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-6 p-6 min-h-0">
        {!isPreviewMode && (
          <div className="md:col-span-3 min-h-0">
            <FieldPalette onAddField={handleAddField} />
          </div>
        )}

        <div className={isPreviewMode ? "md:col-span-12 min-h-0" : "md:col-span-6 min-h-0"}>
          <FormCanvas fields={renderedFields} onSelectField={handleSelectField} />
        </div>

        {!isPreviewMode && (
          <div className="md:col-span-3 min-h-0">
            <PropertiesPanel
              selectedField={selectedFieldConfig}
              onUpdateField={handleUpdateField}
              onDeleteField={handleDeleteField}
            />
          </div>
        )}
      </div>
    </div>
  );
}
