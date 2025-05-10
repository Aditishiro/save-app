'use client';

// This page would fetch form data based on [id] and populate the form builder.
// For now, it's largely a copy of the create page for demonstration.

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FieldPalette } from '@/components/form-builder/field-palette';
import { FormCanvas } from '@/components/form-builder/form-canvas';
import { PropertiesPanel } from '@/components/form-builder/properties-panel';
import { FormFieldData, FormFieldDisplay } from '@/components/form-builder/form-field-display';
import { PageHeader } from '@/components/common/page-header';
import { Save, Send, Eye, History as HistoryIcon } from 'lucide-react';
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

// Mock form data for editing
const MOCK_FORM_DATA: { id: string, title: string, fields: FieldConfig[] } = {
  id: '1',
  title: 'Client Onboarding Form (Editing)',
  fields: [
    { id: 'field_1', type: 'text', label: 'Full Name', placeholder: 'Enter full name', required: true, validationState: 'default' },
    { id: 'field_2', type: 'number', label: 'Age', placeholder: 'Enter age', required: false, validationState: 'validated' },
    { id: 'field_3', type: 'header', label: 'Contact Information', validationState: 'default' },
    { id: 'field_4', type: 'dropdown', label: 'Country', options: ['USA', 'Canada', 'UK'], required: true, validationState: 'default' },
  ],
};


export default function EditFormPage({ params }: { params: { id: string } }) {
  const [formFields, setFormFields] = useState<FieldConfig[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState<string>("Loading form...");
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  useEffect(() => {
    // Simulate fetching form data
    if (params.id === MOCK_FORM_DATA.id) {
      setFormTitle(MOCK_FORM_DATA.title);
      setFormFields(MOCK_FORM_DATA.fields);
    } else {
      setFormTitle("Form Not Found");
      setFormFields([]);
    }
  }, [params.id]);


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

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.28))]"> {/* Adjust height based on header/footer */}
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
            <Button variant="outline" size="sm">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
            <Button size="sm">
              <Send className="mr-2 h-4 w-4" /> Publish
            </Button>
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <HistoryIcon className="mr-2 h-4 w-4" /> Version History
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Version 1.1 (Current Draft)</DropdownMenuItem>
                <DropdownMenuItem>Version 1.0 (Published - 2023-10-26)</DropdownMenuItem>
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
