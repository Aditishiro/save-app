
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/common/page-header';
import { FormFieldData } from '@/components/form-builder/form-field-display';
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase/firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { FormDocument } from '../page'; // Import from parent if available or define locally

// If FormDocument is not available from parent, uncomment and use this:
/*
import { Timestamp } from 'firebase/firestore';
interface FormDocument {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  intendedUseCase: string;
  formConfiguration: string; // JSON string
  status: 'Draft' | 'Published' | 'Archived';
  submissionsCount: number;
  createdAt: Timestamp;
  lastModified: Timestamp;
}
*/

interface FormPreviewConfig {
  id: string;
  title: string;
  description?: string;
  fields: FormFieldData[];
}

export default function FormPreviewPage() {
  const params = useParams<{ id: string }>();
  const formId = params.id;
  const { currentUser } = useAuth(); // Can still be used to associate submission if user IS logged in
  const router = useRouter();
  const { toast } = useToast();

  const [formConfig, setFormConfig] = useState<FormPreviewConfig | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!formId) return;

    setIsLoading(true);
    setError(null);
    const formDocRef = doc(db, 'forms', formId);

    getDoc(formDocRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const formData = docSnap.data() as FormDocument;

          // In public mode, anyone can view any form, even drafts.
          // You might want to restrict this to only 'Published' forms
          // if (formData.status !== 'Published') { ... }
          
          try {
            const parsedConfig = JSON.parse(formData.formConfiguration);
            const previewData: FormPreviewConfig = {
              id: docSnap.id,
              title: formData.title,
              description: formData.description,
              fields: parsedConfig.fields || [],
            };
            setFormConfig(previewData);

            const initialValues: Record<string, any> = {};
            (parsedConfig.fields || []).forEach((field: FormFieldData) => {
              if (field.type === 'header') return;
              initialValues[field.id] = field.type === 'checkbox' ? false : '';
            });
            setFormValues(initialValues);

          } catch (e) {
            console.error("Error parsing form configuration for preview:", e);
            setError("Failed to load form structure for preview.");
          }
        } else {
          setError(`Form with ID "${formId}" could not be found.`);
        }
      })
      .catch((err) => {
        console.error("Error fetching form for preview: ", err);
        setError("Failed to load form data. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [formId, toast]);

  const handleChange = (fieldId: string, value: any, type?: string) => {
    setFormValues(prev => ({ ...prev, [fieldId]: type === 'checkbox' ? (value as boolean) : value }));
    if (validationErrors[fieldId]) {
      const currentField = formConfig?.fields.find(f => f.id === fieldId);
      if (currentField?.required && !value && !(type === 'checkbox' && value === false)) {
         // keep error
      } else {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldId];
          return newErrors;
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formConfig) return;

    const errors: Record<string, string> = {};
    formConfig.fields.forEach(field => {
      if (field.type === 'header') return;
      if (field.required) {
        if (field.type === 'checkbox') {
          if (!formValues[field.id]) errors[field.id] = `${field.label} is required.`;
        } else if (!formValues[field.id]) {
          errors[field.id] = `${field.label} is required.`;
        }
      }
    });
    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      try {
        await addDoc(collection(db, 'submissions'), {
            formId: formConfig.id,
            formTitle: formConfig.title,
            submitterId: currentUser?.uid || 'anonymous-public',
            submissionDate: serverTimestamp(),
            data: formValues,
        });
        
        toast({
          title: "Form Submitted Successfully!",
          description: "Your response has been recorded.",
        });
        // Optionally, reset form or redirect
        // setFormValues({}); // Reset form fields
      } catch (submitError) {
        console.error("Error submitting form:", submitError);
        toast({
          title: "Submission Error",
          description: "Could not submit your form. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      const firstErrorFieldId = Object.keys(errors)[0];
      document.getElementById(firstErrorFieldId)?.focus();
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-[calc(100vh-theme(spacing.28))]">
        <PageHeader title="Loading Form Preview..." />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
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
          <Button variant="outline" asChild data-perf-ignore="true">
            <Link href={`/dashboard/my-forms/${formConfig.id}/edit`}>
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
                    />
                  ) : field.type === 'dropdown' && field.options ? (
                    <Select
                      value={formValues[field.id] || ''}
                      onValueChange={value => handleChange(field.id, value)}
                      required={field.required}
                      disabled={isSubmitting}
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
                        disabled={isSubmitting}
                      />
                       <div className="grid gap-1.5 leading-none">
                        <Label htmlFor={field.id} className="font-normal cursor-pointer">
                            {field.label.replace(/ is required.$/, '')}
                        </Label>
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
                      disabled={isSubmitting}
                    />
                  ) : null}
                  {validationErrors[field.id] && <p id={`${field.id}-error`} className="text-sm text-destructive mt-1">{validationErrors[field.id]}</p>}
                </div>
              );
            })}
            <Button type="submit" className="w-full sm:w-auto" size="lg" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit Form
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
