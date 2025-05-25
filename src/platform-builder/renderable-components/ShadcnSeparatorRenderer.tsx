
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import { Separator } from "@/components/ui/separator";

interface ShadcnSeparatorRendererProps {
  instance: PlatformComponentInstance;
}

export default function ShadcnSeparatorRenderer({ instance }: ShadcnSeparatorRendererProps) {
  const { configuredValues } = instance;

  const orientation = configuredValues?.orientation as "horizontal" | "vertical" || 'horizontal';

  return (
    <div className={orientation === 'horizontal' ? 'my-4' : 'mx-4 h-auto'}> {/* Add some margin for visibility */}
      <Separator orientation={orientation} />
    </div>
  );
}
