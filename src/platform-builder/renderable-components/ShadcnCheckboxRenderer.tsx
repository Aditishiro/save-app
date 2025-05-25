
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from 'react';

interface ShadcnCheckboxRendererProps {
  instance: PlatformComponentInstance;
}

export default function ShadcnCheckboxRenderer({ instance }: ShadcnCheckboxRendererProps) {
  const { configuredValues, id } = instance;

  const label = configuredValues?.label || 'Accept terms';
  const initialChecked = typeof configuredValues?.checked === 'boolean' ? configuredValues.checked : false;
  
  const [isChecked, setIsChecked] = useState(initialChecked);

  useEffect(() => {
    setIsChecked(typeof configuredValues?.checked === 'boolean' ? configuredValues.checked : false);
  }, [configuredValues?.checked]);

  const checkboxId = `checkbox-${id}`;

  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id={checkboxId} 
        checked={isChecked} 
        onCheckedChange={(checkedState) => setIsChecked(Boolean(checkedState))} 
      />
      <Label htmlFor={checkboxId} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </Label>
    </div>
  );
}
