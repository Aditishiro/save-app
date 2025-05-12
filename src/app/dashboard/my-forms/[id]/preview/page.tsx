'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/common/page-header';
import { FormFieldData } from '@/components/form-builder/form-field-display'; // Re-use interface
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface MockFormPreview {
  id: string;
  title: string;
  description?: string;
  fields: FormFieldData[];
}

// Mock form data store for preview - should match the edit store structure ideally
const MOCK_FORM_PREVIEW_STORE: Record<string, MockFormPreview> = {
  '1': {
    id: '1',
    title: 'Client Onboarding Form (Preview)',
    description: 'Please fill out this form to begin the onboarding process.',
    fields: [
      { id: 'field_1', type: 'text', label: 'Full Name', placeholder: 'e.g., Jane Doe', required: true },
      { id: 'field_2', type: 'number', label: 'Age', placeholder: 'e.g., 35', required: false },
      { id: 'field_3', type: 'header', label: 'Contact Information' },
      { id: 'field_4', type: 'dropdown', label: 'Country', options: ['USA', 'Canada', 'UK'], required: true, placeholder: 'Select Country' },
      { id: 'field_prev_5', type: 'checkbox', label: 'Agree to terms', required: true }, // Using preview ID from original
      { id: 'field_prev_6', type: 'date', label: 'Preferred Start Date', required: false },
      { id: 'field_prev_7', type: 'file', label: 'Upload ID', required: true },
      { id: 'field_prev_8', type: 'textarea', label: 'Additional Notes', placeholder: 'Optional comments...', required: false },
    ],
  },
  '2': {
     id: '2',
     title: 'Loan Application - V3 (Preview)',
     description: 'Complete the following sections to apply for a loan.',
     fields: [
       { id: 'field_loan_1', type: 'header', label: 'Personal Information' },
       { id: 'field_loan_2', type: 'text', label: 'Applicant Name', required: true },
       { id: 'field_loan_3', type: 'date', label: 'Date of Birth', required: true },
       { id: 'field_loan_4', type: 'header', label: 'Loan Details' },
       { id: 'field_loan_5', type: 'number', label: 'Loan Amount Requested', placeholder: '$', required: true },
       { id: 'field_loan_6', type: 'textarea', label: 'Purpose of Loan', required: true },
     ],
  },
   '3': {
    id: '3',
    title: 'Customer Feedback Survey Q3 (Preview)',
    description: 'We value your feedback!',
    fields: [
       { id: 'field_fb_1', type: 'header', label: 'Your Experience' },
       { id: 'field_fb_2', type: 'dropdown', label: 'Overall Satisfaction', options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'], required: true, placeholder: 'Select rating' },
       { id: 'field_fb_3', type: 'textarea', label: 'Comments/Suggestions', placeholder: 'Tell us more...' },
    ],
  },
  // Form '4' is intentionally left out
};


export default function FormPreviewPage({ params }: { params: { id: string } }) {
  const [formConfig, setFormConfig] = useState<MockFormPreview | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    setIsLoading(true);
    setError(null);
    // Simulate fetching form configuration
    const fetchedForm = MOCK_FORM_PREVIEW_STORE[params.id];
    
    const timer = setTimeout(() => {
      if (fetchedForm) {
        setFormConfig(fetchedForm);
        // Initialize formValues
        const initialValues: Record<string, any> = {};
        fetchedForm.fields.forEach(field => {
          // Skip headers for form values
          if (field.type === 'header') return;
          
          if (field.type === 'checkbox') {
            initialValues[field.id] = false;
          } else {
            initialValues[field.id] = '';
          }
        });
        setFormValues(initialValues);
      } else {
        setError(`Form preview for ID "${params.id}" could not be found.`);
      }
      setIsLoading(false);
    }, 500); // Simulate delay

    return () => clearTimeout(timer);

  }, [params.id]);

  const handleChange = (fieldId: string, value: any, type?: string) => {
    setFormValues(prev => ({ ...prev, [fieldId]: type === 'checkbox' ? (value as boolean) : value }));
    // Basic real-time validation (example)
    if (validationErrors[fieldId]) {
      const currentField = formConfig?.fields.find(f => f.id === fieldId);
      if (currentField?.required && !value && !(type === 'checkbox' && value === false)) { // Keep error if still invalid
         // Need to handle checkbox specifically, false is a valid value but empty string isn't
      } else {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldId];
          return newErrors;
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    formConfig?.fields.forEach(field => {
       if (field.type === 'header') return; // Skip validation for headers

      if (field.required) {
         if (field.type === 'checkbox') {
            if (!formValues[field.id]) { // Checkbox must be true if required
              errors[field.id] = `${field.label} is required.`;
            }
         } else if (!formValues[field.id]) { // Other fields just need a value
            errors[field.id] = `${field.label} is required.`;
         }
      }
      // Add more complex validation logic here (e.g., email format, number range)
    });
    setValidationErrors(errors);
    if (Object.keys(errors).length === 0) {
      alert('Form submitted successfully (mock)! Data: ' + JSON.stringify(formValues, null, 2));
      // Reset form or redirect here in a real app
    } else {
      // Find the first field with an error and focus it
      const firstErrorFieldId = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorFieldId);
      element?.focus();
      alert('Please correct the errors in the form.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-theme(spacing.28))]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading form preview...</span>
      </div>
    );
  }

  if (error || !formConfig) {
     return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-theme(spacing.28))]">
         <PageHeader title="Error Loading Preview" description={error || "Form configuration is missing."} />
          <Button variant="outline" asChild>
            <Link href="/dashboard/my-forms">Back to My Forms</Link>
          </Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={formConfig.title}
        description="This is how your form will appear to end-users."
        actions={
          <Button variant="outline" asChild>
            <Link href={`/dashboard/my-forms/${params.id}/edit`}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Editor
            </Link>
          </Button>
        }
      />
      <Card className="max-w-3xl mx-auto shadow-lg border border-border">
        <CardHeader>
          <CardTitle className="text-2xl">{formConfig.title}</CardTitle>
          {formConfig.description && <CardDescription>{formConfig.description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {formConfig.fields.map(field => {
              if (field.type === 'header') {
                // Render headers differently, maybe with margin/padding
                return <h2 key={field.id} className="text-xl font-semibold pt-6 pb-2 border-b border-border first:pt-0">{field.label}</h2>;
              }
              return (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {field.type === 'text' || field.type === 'number' || field.type === 'date' ? (
                    <Input
                      id={field.id}
                      type={field.type === 'date' ? 'date' : field.type}
                      placeholder={field.placeholder}
                      value={formValues[field.id] || ''}
                      onChange={e => handleChange(field.id, e.target.value)}
                      className={validationErrors[field.id] ? 'border-destructive ring-1 ring-destructive focus-visible:ring-destructive' : ''}
                      aria-invalid={!!validationErrors[field.id]}
                      aria-describedby={validationErrors[field.id] ? `${field.id}-error` : undefined}
                    />
                  ) : field.type === 'textarea' ? (
                     <Textarea
                      id={field.id}
                      placeholder={field.placeholder}
                      value={formValues[field.id] || ''}
                      onChange={e => handleChange(field.id, e.target.value)}
                      className={validationErrors[field.id] ? 'border-destructive ring-1 ring-destructive focus-visible:ring-destructive' : ''}
                      aria-invalid={!!validationErrors[field.id]}
                      aria-describedby={validationErrors[field.id] ? `${field.id}-error` : undefined}
                      rows={3}
                    />
                  ) : field.type === 'dropdown' && field.options ? (
                    <Select
                      value={formValues[field.id] || ''}
                      onValueChange={value => handleChange(field.id, value)}
                      required={field.required}
                    >
                      <SelectTrigger id={field.id} className={validationErrors[field.id] ? 'border-destructive ring-1 ring-destructive focus-visible:ring-destructive' : ''} aria-invalid={!!validationErrors[field.id]} aria-describedby={validationErrors[field.id] ? `${field.id}-error` : undefined}>
                        <SelectValue placeholder={field.placeholder || "Select an option"} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : field.type === 'checkbox' ? (
                    <div className="flex items-start space-x-2 pt-1">
                      <Checkbox
                        id={field.id}
                        checked={formValues[field.id] || false}
                        onCheckedChange={checked => handleChange(field.id, checked, 'checkbox')}
                        className={validationErrors[field.id] ? 'border-destructive ring-1 ring-destructive focus-visible:ring-destructive [&[data-state=checked]]:bg-destructive [&[data-state=checked]]:border-destructive' : ''}
                        aria-invalid={!!validationErrors[field.id]}
                        aria-describedby={validationErrors[field.id] ? `${field.id}-error` : undefined}
                      />
                       {/* Put label text in its own div for better alignment */}
                       <div className="grid gap-1.5 leading-none">
                        <Label htmlFor={field.id} className="font-normal cursor-pointer">
                            {field.label.replace(/ is required.$/, '')} {/* Minor clean up */}
                        </Label>
                         {/* You could add a description here if needed */}
                        </div>
                    </div>
                  ) : field.type === 'file' ? (
                    <Input
                      id={field.id}
                      type="file"
                      onChange={e => handleChange(field.id, e.target.files ? e.target.files[0] : null)}
                      className={validationErrors[field.id] ? 'border-destructive ring-1 ring-destructive focus-visible:ring-destructive' : ''}
                      aria-invalid={!!validationErrors[field.id]}
                      aria-describedby={validationErrors[field.id] ? `${field.id}-error` : undefined}
                    />
                  ) : null}
                  {validationErrors[field.id] && <p id={`${field.id}-error`} className="text-sm text-destructive mt-1">{validationErrors[field.id]}</p>}
                </div>
              );
            })}
            <Button type="submit" className="w-full sm:w-auto" size="lg">Submit Form</Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
