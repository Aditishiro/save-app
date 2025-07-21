
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MaterialTextFieldRendererProps {
  instance: PlatformComponentInstance;
}

export default function MaterialTextFieldRenderer({ instance }: MaterialTextFieldRendererProps) {
  const { configuredValues, id } = instance;

  const label = configuredValues?.label || 'Label';
  const placeholder = configuredValues?.placeholder || '';
  const helperText = configuredValues?.helperText;
  const isDisabled = configuredValues?.disabled === true;
  const isRequired = configuredValues?.required === true;

  // The 'variant' from Material (filled, outlined, standard) can be mapped to our input styles.
  // For this renderer, we'll use the default Shadcn Input style.

  const inputId = `material-input-${id}`;

  return (
    <div className="space-y-1">
      <Label htmlFor={inputId}>
        {label}
        {isRequired && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={inputId}
        placeholder={placeholder}
        disabled={isDisabled}
        required={isRequired}
      />
      {helperText && <p className="text-xs text-muted-foreground mt-1">{helperText}</p>}
    </div>
  );
}
