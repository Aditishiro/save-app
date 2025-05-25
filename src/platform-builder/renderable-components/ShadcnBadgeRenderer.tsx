
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import { Badge, type BadgeProps } from '@/components/ui/badge';

interface ShadcnBadgeRendererProps {
  instance: PlatformComponentInstance;
}

export default function ShadcnBadgeRenderer({ instance }: ShadcnBadgeRendererProps) {
  const { configuredValues } = instance;
  const text = configuredValues?.text || 'Badge';
  const variant = configuredValues?.variant as BadgeProps['variant'] || 'default';

  return (
    <Badge variant={variant}>
      {text}
    </Badge>
  );
}
