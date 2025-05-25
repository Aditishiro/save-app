
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import { Alert, AlertDescription, AlertTitle, type VariantProps } from "@/components/ui/alert";
import { Terminal } from "lucide-react"; // Example icon

interface ShadcnAlertRendererProps {
  instance: PlatformComponentInstance;
}

type AlertVariants = VariantProps<typeof Alert>['variant'];

export default function ShadcnAlertRenderer({ instance }: ShadcnAlertRendererProps) {
  const { configuredValues } = instance;

  const variant = configuredValues?.variant as AlertVariants || 'default';
  const title = configuredValues?.title || 'Alert Title';
  const description = configuredValues?.description || 'This is an alert description.';
  const showIcon = configuredValues?.showIcon !== undefined ? configuredValues.showIcon : true;

  // Icon logic could be more sophisticated, e.g., based on variant
  const IconComponent = Terminal; 

  return (
    <Alert variant={variant}>
      {showIcon && <IconComponent className="h-4 w-4" />}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
