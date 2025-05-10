'use client';

import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import type { ReactNode } from "react";

interface FormCanvasProps {
  fields: ReactNode[]; // Array of field components
  onSelectField: (fieldId: string | null) => void;
}

export function FormCanvas({ fields, onSelectField }: FormCanvasProps) {
  // In a real implementation, fields would be rendered here
  // and would be interactive (selectable, draggable)
  return (
    <Card 
      className="h-full shadow-md overflow-y-auto p-6 bg-muted/30"
      onClick={() => onSelectField(null)} // Deselect when clicking canvas background
    >
      {fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-border rounded-lg">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg font-medium">Your form is empty.</p>
          <p className="text-muted-foreground">Add fields from the palette on the left.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            // Each field component would handle its own selection via onClick e.g. onClick={(e) => { e.stopPropagation(); onSelectField(field.id); }}
            <div key={index}>{field}</div> 
          ))}
        </div>
      )}
    </Card>
  );
}
