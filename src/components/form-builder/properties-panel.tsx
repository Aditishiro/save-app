
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Settings2, GitMerge, Trash2 } from "lucide-react";
import type { FormFieldData } from './form-field-display'; // Import FormFieldData

interface PropertiesPanelProps {
  selectedField: FormFieldData | null; // Use FormFieldData type
  onUpdateField: (fieldId: string, updates: Partial<FormFieldData>) => void; // Use FormFieldData type
  onDeleteField: (fieldId: string) => void;
  isSaving?: boolean; // Add isSaving prop
}

export function PropertiesPanel({ selectedField, onUpdateField, onDeleteField, isSaving }: PropertiesPanelProps) {
  if (!selectedField) {
    return (
      <Card className="flex-1 min-h-0 shadow-md flex flex-col overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            Properties
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1"> 
          <p className="text-muted-foreground">Select a field to see its properties.</p>
        </CardContent>
      </Card>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSaving) return;
    const { name, value, type, checked } = e.target;
    onUpdateField(selectedField.id, { [name]: type === 'checkbox' ? checked : value } as Partial<FormFieldData>);
  };
  
  const handleLabelChange = (value: string) => {
    if (isSaving) return;
    onUpdateField(selectedField.id, { label: value });
  };

  const handlePlaceholderChange = (value: string) => {
    if (isSaving) return;
    onUpdateField(selectedField.id, { placeholder: value });
  };

  const handleRequiredChange = (checked: boolean) => {
    if (isSaving) return;
    onUpdateField(selectedField.id, { required: checked });
  };

  const handleDelete = () => {
    if (isSaving) return;
    onDeleteField(selectedField.id);
  };

  return (
    <Card className="flex-1 min-h-0 shadow-md overflow-y-auto flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-primary" />
          Properties: <span className="font-normal truncate max-w-[150px] inline-block">{selectedField.label || selectedField.type}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1"> 
        <Tabs defaultValue="properties" className="w-full flex flex-col h-full">
          <TabsList className="grid w-full grid-cols-2 shrink-0">
            <TabsTrigger value="properties" disabled={isSaving}>Field Properties</TabsTrigger>
            <TabsTrigger value="logic" disabled={isSaving}>Conditional Logic</TabsTrigger>
          </TabsList>
          <TabsContent value="properties" className="mt-4 space-y-4 flex-1 overflow-y-auto">
            <div>
              <Label htmlFor="fieldLabel">Field Label</Label>
              <Input 
                id="fieldLabel" 
                name="label" // This name attribute is not directly used by handleInputChange for this specific input, but good for consistency
                value={selectedField.label || ''} 
                onChange={(e) => handleLabelChange(e.target.value)}
                className="mt-1"
                disabled={isSaving}
              />
            </div>
            {selectedField.type !== 'header' && selectedField.type !== 'checkbox' && ( // Headers and Checkboxes don't usually have placeholders
              <div>
                <Label htmlFor="placeholder">Placeholder Text</Label>
                <Input 
                  id="placeholder" 
                  name="placeholder"
                  value={selectedField.placeholder || ''} 
                  onChange={(e) => handlePlaceholderChange(e.target.value)}
                  className="mt-1"
                  disabled={isSaving}
                />
              </div>
            )}
             {selectedField.type !== 'header' && ( // Headers cannot be required
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="required" 
                  name="required" // This name attribute is not directly used by handleInputChange here
                  checked={selectedField.required || false} 
                  onCheckedChange={(checked) => handleRequiredChange(Boolean(checked))}
                  disabled={isSaving}
                />
                <Label htmlFor="required" className="font-normal">
                  Required
                </Label>
              </div>
             )}
            <div className="pt-4">
               <Button 
                variant="destructive" 
                onClick={handleDelete}
                className="w-full"
                disabled={isSaving}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Field
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="logic" className="mt-4 flex-1 overflow-y-auto"> 
            <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-border rounded-lg p-4">
              <GitMerge className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-center text-sm">
                Conditional logic settings will appear here.
              </p>
              <Button variant="outline" size="sm" className="mt-3" disabled={isSaving}>Add New Rule</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
