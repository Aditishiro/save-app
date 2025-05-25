
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from 'react';

interface ShadcnInputRendererProps {
  instance: PlatformComponentInstance;
}

export default function ShadcnInputRenderer({ instance }: ShadcnInputRendererProps) {
  const { configuredValues, id } = instance;

  const type = configuredValues?.type || 'text';
  const placeholder = configuredValues?.placeholder || 'Enter text...';
  const label = configuredValues?.label;
  const initialValue = configuredValues?.valuePath ? `(Bound to: ${configuredValues.valuePath})` : (configuredValues?.defaultValue || '');

  const [value, setValue] = useState(initialValue);

   useEffect(() => {
    const val = configuredValues?.valuePath ? `(Bound to: ${configuredValues.valuePath})` : (configuredValues?.defaultValue || '');
    setValue(val);
  }, [configuredValues?.defaultValue, configuredValues?.valuePath]);

  const inputId = `input-${id}`;

  return (
    <div className="space-y-1">
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <Input 
        id={inputId}
        type={type} 
        placeholder={placeholder} 
        value={value}
        onChange={(e) => setValue(e.target.value)} // Local state change for preview
        // valuePath is for future data binding, not directly used for value here
      />
    </div>
  );
}
