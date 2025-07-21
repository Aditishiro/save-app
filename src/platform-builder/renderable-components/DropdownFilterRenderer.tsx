
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

interface DropdownFilterRendererProps {
  instance: PlatformComponentInstance;
}

export default function DropdownFilterRenderer({ instance }: DropdownFilterRendererProps) {
  const { configuredValues, id } = instance;

  const label = configuredValues?.label || 'Filter';
  let options: string[] = [];

  if (typeof configuredValues?.options === 'string') {
    try {
      const parsedOptions = JSON.parse(configuredValues.options);
      if (Array.isArray(parsedOptions)) {
        options = parsedOptions;
      }
    } catch (e) {
      console.error("DropdownFilter: Error parsing options JSON", e);
      options = ["Error: Invalid Options"];
    }
  } else if (Array.isArray(configuredValues?.options)) {
    options = configuredValues.options;
  }

  const selectId = `dropdown-filter-${id}`;

  return (
    <div className="space-y-2">
      <Label htmlFor={selectId}>{label}</Label>
      <Select>
        <SelectTrigger id={selectId} className="w-[240px]">
          <SelectValue placeholder={`Select ${label}...`} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option, index) => (
              <SelectItem key={index} value={option.toLowerCase().replace(/\s+/g, '-')}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
