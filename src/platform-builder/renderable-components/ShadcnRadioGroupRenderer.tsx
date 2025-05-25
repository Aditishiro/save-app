
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from 'react';

interface ShadcnRadioGroupRendererProps {
  instance: PlatformComponentInstance;
}

interface RadioItem {
  value: string;
  label: string;
}

export default function ShadcnRadioGroupRenderer({ instance }: ShadcnRadioGroupRendererProps) {
  const { configuredValues, id: instanceId } = instance;

  const initialDefaultValue = configuredValues?.defaultValue || '';
  const [selectedValue, setSelectedValue] = useState(initialDefaultValue);

  let items: RadioItem[] = [];
  if (typeof configuredValues?.itemsJson === 'string') {
    try {
      items = JSON.parse(configuredValues.itemsJson);
      if (!Array.isArray(items)) items = [];
    } catch (e) {
      console.error("RadioGroup: Error parsing itemsJson", e);
      items = [{ value: "error", label: "Error: Invalid JSON" }];
    }
  } else if (Array.isArray(configuredValues?.itemsJson)) {
    items = configuredValues.itemsJson;
  }

  useEffect(() => {
    setSelectedValue(configuredValues?.defaultValue || (items.length > 0 ? items[0].value : ''));
  }, [configuredValues?.defaultValue, items]);

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Radio Group: No items configured.</p>;
  }

  return (
    <RadioGroup defaultValue={selectedValue} onValueChange={setSelectedValue}>
      {items.map((item, index) => {
        const itemId = `radio-${instanceId}-${item.value}-${index}`;
        return (
          <div key={itemId} className="flex items-center space-x-2">
            <RadioGroupItem value={item.value} id={itemId} />
            <Label htmlFor={itemId}>{item.label}</Label>
          </div>
        );
      })}
    </RadioGroup>
  );
}
