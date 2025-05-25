
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from 'react';

interface ShadcnTextareaRendererProps {
  instance: PlatformComponentInstance;
}

export default function ShadcnTextareaRenderer({ instance }: ShadcnTextareaRendererProps) {
  const { configuredValues, id } = instance;

  const placeholder = configuredValues?.placeholder || 'Enter more text...';
  const label = configuredValues?.label;
  const rows = typeof configuredValues?.rows === 'number' ? configuredValues.rows : 3;
  const initialValue = configuredValues?.valuePath ? `(Bound to: ${configuredValues.valuePath})` : (configuredValues?.defaultValue || '');

  const [value, setValue] = useState(initialValue);
  
  useEffect(() => {
    const val = configuredValues?.valuePath ? `(Bound to: ${configuredValues.valuePath})` : (configuredValues?.defaultValue || '');
    setValue(val);
  }, [configuredValues?.defaultValue, configuredValues?.valuePath]);

  const textareaId = `textarea-${id}`;

  return (
    <div className="space-y-1">
      {label && <Label htmlFor={textareaId}>{label}</Label>}
      <Textarea
        id={textareaId}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={(e) => setValue(e.target.value)} // Local state change for preview
        // valuePath is for future data binding, not directly used for value here
      />
    </div>
  );
}
