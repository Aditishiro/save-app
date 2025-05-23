
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Type, Sigma, List, CheckSquare, FileUp, CalendarDays, Heading1, Palette } from "lucide-react";

const fieldTypes = [
  { name: "Text", icon: Type, type: "text" },
  { name: "Number", icon: Sigma, type: "number" },
  { name: "Dropdown", icon: List, type: "dropdown" },
  { name: "Checkbox", icon: CheckSquare, type: "checkbox" },
  { name: "File Upload", icon: FileUp, type: "file" },
  { name: "Date Picker", icon: CalendarDays, type: "date" },
  { name: "Section Header", icon: Heading1, type: "header" },
];

export function FieldPalette({ onAddField }: { onAddField: (fieldType: string) => void }) {
  return (
    <Card className="flex-1 min-h-0 shadow-md overflow-y-auto flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          Field Palette
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 flex-1"> {/* Ensure CardContent can grow if Card is flex flex-col */}
        {fieldTypes.map((field) => (
          <Button
            key={field.name}
            variant="outline"
            className="w-full justify-start"
            onClick={() => onAddField(field.type)}
          >
            <field.icon className="mr-2 h-4 w-4" />
            {field.name}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

