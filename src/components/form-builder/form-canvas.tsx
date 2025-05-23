
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import type { ReactNode } from "react";

interface FormCanvasProps {
  fields: ReactNode[]; 
  onSelectField: (fieldId: string | null) => void;
}

export function FormCanvas({ fields, onSelectField }: FormCanvasProps) {
  return (
    <Card 
      className="flex-1 min-h-0 shadow-md overflow-y-auto p-6 bg-muted/30 flex flex-col"
      onClick={() => onSelectField(null)} 
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
            <div key={index}>{field}</div> 
          ))}
        </div>
      )}
    </Card>
  );
}

