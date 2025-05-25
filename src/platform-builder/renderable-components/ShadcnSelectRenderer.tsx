
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from 'react';

interface ShadcnSelectRendererProps {
  instance: PlatformComponentInstance;
}

interface SelectItemData {
  value: string;
  label: string;
  isLabel?: boolean; // For group labels
}

export default function ShadcnSelectRenderer({ instance }: ShadcnSelectRendererProps) {
  const { configuredValues } = instance;

  const placeholder = configuredValues?.placeholder || 'Select an option';
  const initialValue = configuredValues?.valuePath ? `(Bound: ${configuredValues.valuePath})` : (configuredValues?.defaultValue || '');
  const [selectedValue, setSelectedValue] = useState(initialValue);

  let items: SelectItemData[] = [];
  if (typeof configuredValues?.itemsJson === 'string') {
    try {
      items = JSON.parse(configuredValues.itemsJson);
      if (!Array.isArray(items)) items = [];
    } catch (e) {
      console.error("Select: Error parsing itemsJson", e);
      items = [{ value: "error", label: "Error: Invalid JSON" }];
    }
  } else if (Array.isArray(configuredValues?.itemsJson)) {
    items = configuredValues.itemsJson;
  }
  
  useEffect(() => {
     const val = configuredValues?.valuePath ? `(Bound: ${configuredValues.valuePath})` : (configuredValues?.defaultValue || '');
     setSelectedValue(val);
  }, [configuredValues?.defaultValue, configuredValues?.valuePath]);

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Select: No items configured.</p>;
  }

  return (
    <Select value={selectedValue} onValueChange={setSelectedValue}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item, index) => 
            item.isLabel ? (
              <SelectLabel key={`label-${index}`}>{item.label}</SelectLabel>
            ) : (
              <SelectItem key={item.value + index} value={item.value}>
                {item.label}
              </SelectItem>
            )
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
