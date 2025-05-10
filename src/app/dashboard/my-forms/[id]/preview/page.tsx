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
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Mock form data for preview
const MOCK_FORM_PREVIEW_DATA: { id: string, title: string, description: string, fields: FormFieldData[] } = {
  id: '1',
  title: 'New Client Onboarding (Preview)',
  description: 'Please fill out the form below to begin the onboarding process.',
  fields: [
    { id: 'field_prev_1', type: 'text', label: 'Full Name', placeholder: 'e.g., John Doe', required: true },
    { id: 'field_prev_2', type: 'number', label: 'Your Age', placeholder: 'e.g., 30', required: false },
    { id: 'field_prev_3', type: 'header', label: 'Address Details' },
    { id: 'field_prev_4', type: 'dropdown', label: 'Country of Residence', options: ['USA', 'Canada', 'UK', 'Australia'], required: true, placeholder: 'Select your country' },
    { id: 'field_prev_5', type: 'checkbox', label: 'I agree to the terms and conditions', required: true },
    { id: 'field_prev_6', type: 'date', label: 'Preferred Start Date', required: false },
    { id: 'field_prev_7', type: 'file', label: 'Upload ID Document', required: true },
    { id: 'field_prev_8', type: 'textarea', label: 'Additional Comments', placeholder: 'Any other information...', required: false },
  ],
};

export default function FormPreviewPage({ params }: { params: { id: string } }) {
  const [formConfig, setFormConfig] = useState<typeof MOCK_FORM_PREVIEW_DATA | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Simulate fetching form configuration
    if (params.id === MOCK_FORM_PREVIEW_DATA.id) {
      setFormConfig(MOCK_FORM_PREVIEW_DATA);
      // Initialize formValues
      const initialValues: Record<string, any> = {};
      MOCK_FORM_PREVIEW_DATA.fields.forEach(field => {
        if (field.type === 'checkbox') {
          initialValues[field.id] = false;
        } else {
          initialValues[field.id] = '';
        }
      });
      setFormValues(initialValues);
    }
  }, [params.id]);

  const handleChange = (fieldId: string, value: any, type?: string) => {
    setFormValues(prev => ({ ...prev, [fieldId]: type === 'checkbox' ? (value as boolean) : value }));
    // Basic real-time validation (example)
    if (validationErrors[fieldId]) {
      const currentField = formConfig?.fields.find(f => f.id === fieldId);
      if (currentField?.required && !value) {
        // Keep error if still invalid
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
      if (field.required && !formValues[field.id]) {
        errors[field.id] = `${field.label} is required.`;
      }
      // Add more complex validation logic here
    });
    setValidationErrors(errors);
    if (Object.keys(errors).length === 0) {
      alert('Form submitted successfully (mock)! Data: ' + JSON.stringify(formValues, null, 2));
    } else {
      alert('Please correct the errors in the form.');
    }
  };

  if (!formConfig) {
    return (
      <PageHeader title="Loading Preview..." />
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
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">{formConfig.title}</CardTitle>
          {formConfig.description && <CardDescription>{formConfig.description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {formConfig.fields.map(field => {
              if (field.type === 'header') {
                return <h2 key={field.id} className="text-xl font-semibold pt-4 pb-2 border-b">{field.label}</h2>;
              }
              return (
                <div key={field.id} className="space-y-1">
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
                      className={validationErrors[field.id] ? 'border-destructive ring-destructive' : ''}
                    />
                  ) : field.type === 'textarea' ? (
                     <Textarea
                      id={field.id}
                      placeholder={field.placeholder}
                      value={formValues[field.id] || ''}
                      onChange={e => handleChange(field.id, e.target.value)}
                      className={validationErrors[field.id] ? 'border-destructive ring-destructive' : ''}
                    />
                  ) : field.type === 'dropdown' ? (
                    <Select
                      value={formValues[field.id] || ''}
                      onValueChange={value => handleChange(field.id, value)}
                    >
                      <SelectTrigger id={field.id} className={validationErrors[field.id] ? 'border-destructive ring-destructive' : ''}>
                        <SelectValue placeholder={field.placeholder || "Select an option"} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : field.type === 'checkbox' ? (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={field.id}
                        checked={formValues[field.id] || false}
                        onCheckedChange={checked => handleChange(field.id, checked, 'checkbox')}
                        className={validationErrors[field.id] ? 'border-destructive ring-destructive' : ''}
                      />
                       <Label htmlFor={field.id} className="font-normal">
                         {field.label.replace(/ is required.$/, '')} {/* Minor clean up for checkbox label */}
                       </Label>
                    </div>
                  ) : field.type === 'file' ? (
                    <Input
                      id={field.id}
                      type="file"
                      onChange={e => handleChange(field.id, e.target.files ? e.target.files[0] : null)}
                      className={validationErrors[field.id] ? 'border-destructive ring-destructive' : ''}
                    />
                  ) : null}
                  {validationErrors[field.id] && <p className="text-sm text-destructive">{validationErrors[field.id]}</p>}
                </div>
              );
            })}
            <Button type="submit" className="w-full">Submit Form</Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
