
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Settings2, GitMerge, Trash2 } from "lucide-react";

interface FieldConfig {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  // Add other common properties
}

interface PropertiesPanelProps {
  selectedField: FieldConfig | null;
  onUpdateField: (fieldId: string, updates: Partial<FieldConfig>) => void;
  onDeleteField: (fieldId: string) => void;
}

export function PropertiesPanel({ selectedField, onUpdateField, onDeleteField }: PropertiesPanelProps) {
  if (!selectedField) {
    return (
      <Card className="h-full shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Select a field to see its properties.</p>
        </CardContent>
      </Card>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    onUpdateField(selectedField.id, { [name]: type === 'checkbox' ? checked : value });
  };
  
  const handleLabelChange = (value: string) => {
    onUpdateField(selectedField.id, { label: value });
  };

  const handlePlaceholderChange = (value: string) => {
    onUpdateField(selectedField.id, { placeholder: value });
  };

  const handleRequiredChange = (checked: boolean) => {
    onUpdateField(selectedField.id, { required: checked });
  };


  return (
    <Card className="h-full shadow-md overflow-y-auto"> {/* Added overflow-y-auto */}
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-primary" />
          Properties: <span className="font-normal">{selectedField.label || selectedField.type}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="properties" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="properties">Field Properties</TabsTrigger>
            <TabsTrigger value="logic">Conditional Logic</TabsTrigger>
          </TabsList>
          <TabsContent value="properties" className="mt-4 space-y-4">
            <div>
              <Label htmlFor="fieldLabel">Field Label</Label>
              <Input 
                id="fieldLabel" 
                name="label"
                value={selectedField.label || ''} 
                onChange={(e) => handleLabelChange(e.target.value)}
                className="mt-1"
              />
            </div>
            {['text', 'number', 'textarea'].includes(selectedField.type) && (
              <div>
                <Label htmlFor="placeholder">Placeholder Text</Label>
                <Input 
                  id="placeholder" 
                  name="placeholder"
                  value={selectedField.placeholder || ''} 
                  onChange={(e) => handlePlaceholderChange(e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="required" 
                name="required"
                checked={selectedField.required || false} 
                onCheckedChange={(checked) => handleRequiredChange(Boolean(checked))}
              />
              <Label htmlFor="required" className="font-normal">
                Required
              </Label>
            </div>
            <div className="pt-4">
               <Button 
                variant="destructive" 
                onClick={() => onDeleteField(selectedField.id)}
                className="w-full"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Field
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="logic" className="mt-4">
            <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-border rounded-lg p-4">
              <GitMerge className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-center text-sm">
                Conditional logic settings will appear here.
              </p>
              <Button variant="outline" size="sm" className="mt-3">Add New Rule</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
