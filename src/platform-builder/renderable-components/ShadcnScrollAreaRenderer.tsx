
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import { ScrollArea } from "@/components/ui/scroll-area";

interface ShadcnScrollAreaRendererProps {
  instance: PlatformComponentInstance;
}

export default function ShadcnScrollAreaRenderer({ instance }: ShadcnScrollAreaRendererProps) {
  const { configuredValues } = instance;

  const height = configuredValues?.height || '200px';
  const contentPlaceholder = configuredValues?.contentPlaceholder || 'Scrollable content here...';

  return (
    <ScrollArea className="rounded-md border" style={{ height: height }}>
      <div className="p-4" dangerouslySetInnerHTML={{ __html: contentPlaceholder }}/>
    </ScrollArea>
  );
}
