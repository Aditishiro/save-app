
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';

interface ShadcnSliderRendererProps {
  instance: PlatformComponentInstance;
}

export default function ShadcnSliderRenderer({ instance }: ShadcnSliderRendererProps) {
  const { configuredValues } = instance;

  const initialValue = typeof configuredValues?.defaultValue === 'number' ? [configuredValues.defaultValue] : [50];
  const min = typeof configuredValues?.min === 'number' ? configuredValues.min : 0;
  const max = typeof configuredValues?.max === 'number' ? configuredValues.max : 100;
  const step = typeof configuredValues?.step === 'number' ? configuredValues.step : 1;

  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(typeof configuredValues?.defaultValue === 'number' ? [configuredValues.defaultValue] : [50]);
  }, [configuredValues?.defaultValue]);

  return (
    <div className="w-[80%] space-y-2">
      <Slider
        defaultValue={value}
        min={min}
        max={max}
        step={step}
        onValueChange={(newValue) => setValue(newValue)}
        className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5" // Make thumb slightly larger for visibility
      />
      <Label className="text-xs text-muted-foreground">Value: {value[0]}</Label>
    </div>
  );
}
