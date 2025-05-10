"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have Textarea
import { cn } from "@/lib/utils";
import { GripVertical, CheckCircle2, XCircle, EyeOff } from "lucide-react";

export interface FormFieldData {
  id: string;
  type: string; // 'text', 'number', 'dropdown', 'checkbox', 'file', 'date', 'header'
  label: string;
  placeholder?: string;
  options?: string[]; // For dropdown
  required?: boolean;
  validationState?: "default" | "validated" | "error";
  isHidden?: boolean; // For conditional logic
}

interface FormFieldDisplayProps {
  field: FormFieldData;
  isSelected: boolean;
  onClick: (id: string) => void;
}

export function FormFieldDisplay({ field, isSelected, onClick }: FormFieldDisplayProps) {
  const baseClasses = "mb-4 cursor-pointer transition-all duration-150 ease-in-out";
  const selectedClasses = "ring-2 ring-primary ring-offset-2 shadow-lg";
  const hiddenClasses = "opacity-50 border-dashed";

  let stateBorderColor = "border-border";
  if (field.validationState === "validated") stateBorderColor = "border-success";
  if (field.validationState === "error") stateBorderColor = "border-destructive";

  const renderFieldInput = () => {
    switch (field.type) {
      case "text":
      case "number":
      case "date":
        return <Input type={field.type === "date" ? "date" : field.type} placeholder={field.placeholder} disabled className="bg-muted/50" />;
      case "textarea":
        return <Textarea placeholder={field.placeholder} disabled className="bg-muted/50" />;
      case "dropdown":
        return (
          <Select disabled>
            <SelectTrigger className="w-full bg-muted/50">
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox id={`${field.id}-preview`} disabled />
            <Label htmlFor={`${field.id}-preview`} className="text-sm font-normal">
              {field.placeholder || "Checkbox option"}
            </Label>
          </div>
        );
      case "file":
        return <Input type="file" disabled className="bg-muted/50"/>;
      case "header":
        return <h2 className="text-xl font-semibold text-foreground">{field.label}</h2>;
      default:
        return <p className="text-sm text-muted-foreground">Unsupported field type</p>;
    }
  };

  if (field.isHidden) {
    return (
      <Card
        className={cn(baseClasses, hiddenClasses, stateBorderColor, isSelected && selectedClasses, "bg-slate-100 dark:bg-slate-800 border-2")}
        onClick={() => onClick(field.id)}
      >
        <CardContent className="p-3 flex items-center justify-between text-muted-foreground">
          <div className="flex items-center">
            <EyeOff className="h-4 w-4 mr-2" />
            <span>{field.label} (Hidden)</span>
          </div>
          <GripVertical className="h-5 w-5 text-muted-foreground/50" />
        </CardContent>
      </Card>
    );
  }

  if (field.type === 'header') {
     return (
        <Card 
            className={cn(baseClasses, stateBorderColor, isSelected && selectedClasses, "bg-transparent shadow-none border-none")}
            onClick={() => onClick(field.id)}
        >
            <CardContent className="p-3 flex items-center justify-between">
                {renderFieldInput()}
                <GripVertical className="h-5 w-5 text-muted-foreground/50 cursor-grab" />
            </CardContent>
        </Card>
     )
  }


  return (
    <Card
      className={cn(baseClasses, stateBorderColor, isSelected && selectedClasses, "hover:shadow-md border-2")}
      onClick={() => onClick(field.id)}
    >
      <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          {field.validationState === "validated" && <CheckCircle2 className="h-4 w-4 text-success" />}
          {field.validationState === "error" && <XCircle className="h-4 w-4 text-destructive" />}
          <CardTitle className="text-sm font-medium">{field.label}{field.required && <span className="text-destructive ml-1">*</span>}</CardTitle>
        </div>
        <GripVertical className="h-5 w-5 text-muted-foreground/50 cursor-grab" />
      </CardHeader>
      <CardContent className="p-3 pt-0">
        {renderFieldInput()}
        {field.placeholder && field.type !== 'checkbox' && field.type !== 'header' && <CardDescription className="text-xs mt-1">{field.placeholder}</CardDescription> }
      </CardContent>
    </Card>
  );
}
