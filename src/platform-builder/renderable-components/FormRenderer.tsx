
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FormRendererProps {
  instance: PlatformComponentInstance;
}

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea';
  placeholder?: string;
}

export default function FormRenderer({ instance }: FormRendererProps) {
  const { configuredValues } = instance;

  const title = configuredValues?.title || 'Form';
  const submitButtonLabel = configuredValues?.submitButtonLabel || 'Submit';
  let fields: FormField[] = [];

  if (typeof configuredValues?.fields === 'string') {
    try {
      const parsedFields = JSON.parse(configuredValues.fields);
      if (Array.isArray(parsedFields)) {
        fields = parsedFields;
      }
    } catch (e) {
      console.error("Form: Error parsing fields JSON", e);
    }
  } else if (Array.isArray(configuredValues?.fields)) {
    fields = configuredValues.fields;
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    alert(`Form Submitted! Data: ${JSON.stringify(data, null, 2)}`);
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {fields.map((field) => {
            const fieldId = `${instance.id}-${field.name}`;
            return (
              <div key={field.name} className="space-y-1">
                <Label htmlFor={fieldId}>{field.label}</Label>
                {field.type === 'textarea' ? (
                   <Textarea id={fieldId} name={field.name} placeholder={field.placeholder || ''} />
                ) : (
                  <Input
                    id={fieldId}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder || ''}
                  />
                )}
              </div>
            );
          })}
        </CardContent>
        <CardFooter>
          <Button type="submit">{submitButtonLabel}</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
