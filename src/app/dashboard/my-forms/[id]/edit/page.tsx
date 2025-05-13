'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FieldPalette } from '@/components/form-builder/field-palette';
import { FormCanvas } from '@/components/form-builder/form-canvas';
import { PropertiesPanel } from '@/components/form-builder/properties-panel';
import { FormFieldData, FormFieldDisplay } from '@/components/form-builder/form-field-display';
import { PageHeader } from '@/components/common/page-header';
import { Save, Send, Eye, History as HistoryIcon, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';

type FieldConfig = FormFieldData;

// Updated Mock form data store
interface MockFormDetail {
  id: string;
  title: string;
  fields: FieldConfig[];
  formConfiguration: string; // JSON string of fields
  intendedUseCase: string; // Description of use case
  versions?: { version: string, date: string, status: string }[];
}

const clientOnboardingFields: FieldConfig[] = [
  { id: 'field_1', type: 'text', label: 'Full Name', placeholder: 'Enter full name', required: true, validationState: 'default' },
  { id: 'field_2', type: 'number', label: 'Age', placeholder: 'Enter age', required: false, validationState: 'validated' },
  { id: 'field_3', type: 'header', label: 'Contact Information', validationState: 'default' },
  { id: 'field_4', type: 'dropdown', label: 'Country', options: ['USA', 'Canada', 'UK'], required: true, validationState: 'default' },
];

const loanApplicationFields: FieldConfig[] = [
  { id: 'field_loan_1', type: 'header', label: 'Personal Information' },
  { id: 'field_loan_2', type: 'text', label: 'Applicant Name', required: true },
  { id: 'field_loan_3', type: 'date', label: 'Date of Birth', required: true },
  { id: 'field_loan_4', type: 'header', label: 'Loan Details' },
  { id: 'field_loan_5', type: 'number', label: 'Loan Amount Requested', placeholder: '$', required: true },
  { id: 'field_loan_6', type: 'textarea', label: 'Purpose of Loan', required: true },
];

const feedbackSurveyFields: FieldConfig[] = [
   { id: 'field_fb_1', type: 'header', label: 'Your Experience' },
   { id: 'field_fb_2', type: 'dropdown', label: 'Overall Satisfaction', options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'], required: true },
   { id: 'field_fb_3', type: 'textarea', label: 'Comments/Suggestions' },
];


const MOCK_FORM_STORE: Record<string, MockFormDetail> = {
  '1': {
    id: '1',
    title: 'Client Onboarding Form (Editing)',
    fields: clientOnboardingFields,
    formConfiguration: JSON.stringify({ fields: clientOnboardingFields }),
    intendedUseCase: 'Client Onboarding (Validation, multi-step)',
    versions: [
      { version: '1.1', date: 'Current Draft', status: 'Draft' },
      { version: '1.0', date: '2024-07-28', status: 'Published' },
    ]
  },
  '2': {
    id: '2',
    title: 'Loan Application - V3 (Editing)',
    fields: loanApplicationFields,
    formConfiguration: JSON.stringify({ fields: loanApplicationFields }),
    intendedUseCase: 'Financial Application (Security, compliance)',
    versions: [
      { version: '3.0', date: 'Current Draft', status: 'Draft' },
      { version: '2.1', date: '2024-07-20', status: 'Archived' },
      { version: '2.0', date: '2024-07-10', status: 'Archived' },
    ]
  },
  '3': {
    id: '3',
    title: 'Customer Feedback Survey Q3 (Editing)',
    fields: feedbackSurveyFields,
    formConfiguration: JSON.stringify({ fields: feedbackSurveyFields }),
    intendedUseCase: 'Standard Data Collection (e.g., Contact Form, Basic Survey)',
    versions: [
      { version: '1.0', date: '2024-07-15', status: 'Published' },
    ]
  },
};


export default function EditFormPage({ params }: { params: { id: string } }) {
  const [formFields, setFormFields] = useState<FieldConfig[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState<string>("Loading form...");
  const [formVersions, setFormVersions] = useState<{ version: string, date: string, status: string }[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Store current formConfiguration for saving
  const [currentFormConfiguration, setCurrentFormConfiguration] = useState<string>('');


  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const fetchedForm = MOCK_FORM_STORE[params.id];
    
    const timer = setTimeout(() => {
      if (fetchedForm) {
        setFormTitle(fetchedForm.title);
        setFormFields(fetchedForm.fields);
        setCurrentFormConfiguration(fetchedForm.formConfiguration);
        setFormVersions(fetchedForm.versions || []);
      } else {
        setFormTitle("Form Not Found");
        setFormFields([]);
        setFormVersions([]);
        setCurrentFormConfiguration('');
        setError(`Form with ID "${params.id}" could not be found.`);
      }
      setIsLoading(false);
    }, 500); 

    return () => clearTimeout(timer);

  }, [params.id]);

  // Update formConfiguration whenever formFields change
  useEffect(() => {
    setCurrentFormConfiguration(JSON.stringify({ fields: formFields }));
  }, [formFields]);


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

  const handleSaveChanges = () => {
    // In a real app, this would send `currentFormConfiguration` and other form details (title, etc.) to a backend.
    console.log("Saving form:", params.id, formTitle, currentFormConfiguration);
    // For mock purposes, update the MOCK_FORM_STORE if desired, or just log
    if (MOCK_FORM_STORE[params.id]) {
        MOCK_FORM_STORE[params.id].title = formTitle; // Assuming title could be editable, not shown in UI yet
        MOCK_FORM_STORE[params.id].fields = formFields;
        MOCK_FORM_STORE[params.id].formConfiguration = currentFormConfiguration;
        // Potentially update lastModified date etc.
    }
    alert("Changes saved (mock)!");
  };

  if (isLoading) {
     return (
      <div className="flex items-center justify-center h-[calc(100vh-theme(spacing.28))]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading form...</span>
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

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.28))]">
      <PageHeader
        title={formTitle}
        description={`Editing form ID: ${params.id}. Design and configure your form.`}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Switch id="preview-mode" checked={isPreviewMode} onCheckedChange={setIsPreviewMode} />
              <Label htmlFor="preview-mode">Preview Mode</Label>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="secondary" size="sm" onClick={handleSaveChanges}> 
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
            <Button size="sm">
              <Send className="mr-2 h-4 w-4" /> Publish
            </Button>
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <HistoryIcon className="mr-2 h-4 w-4" /> Version History ({formVersions.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {formVersions.length > 0 ? (
                   formVersions.map(v => (
                     <DropdownMenuItem key={v.version} disabled={v.status !== 'Published' && v.status !== 'Archived'}>
                      Version {v.version} ({v.date}) {v.status !== 'Draft' && `(${v.status})`}
                     </DropdownMenuItem>
                   ))
                ) : (
                   <DropdownMenuItem disabled>No previous versions</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />
      
      <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-6 min-h-0">
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
