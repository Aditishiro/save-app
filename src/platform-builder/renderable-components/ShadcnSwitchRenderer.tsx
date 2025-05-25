
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from 'react';

interface ShadcnSwitchRendererProps {
  instance: PlatformComponentInstance;
}

export default function ShadcnSwitchRenderer({ instance }: ShadcnSwitchRendererProps) {
  const { configuredValues, id } = instance;

  const label = configuredValues?.label || 'Toggle me';
  const initialChecked = typeof configuredValues?.checked === 'boolean' ? configuredValues.checked : false;

  const [isChecked, setIsChecked] = useState(initialChecked);

  useEffect(() => {
    setIsChecked(typeof configuredValues?.checked === 'boolean' ? configuredValues.checked : false);
  },[configuredValues?.checked]);

  const switchId = `switch-${id}`;

  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id={switchId} 
        checked={isChecked} 
        onCheckedChange={setIsChecked}
      />
      <Label htmlFor={switchId}>{label}</Label>
    </div>
  );
}
