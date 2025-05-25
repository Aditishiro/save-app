
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import { Label } from "@/components/ui/label";

interface ShadcnLabelRendererProps {
  instance: PlatformComponentInstance;
}

export default function ShadcnLabelRenderer({ instance }: ShadcnLabelRendererProps) {
  const { configuredValues } = instance;

  const text = configuredValues?.text || 'Your Label';
  const htmlFor = configuredValues?.htmlFor;

  return (
    <Label htmlFor={htmlFor}>
      {text}
    </Label>
  );
}
