
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface ShadcnPopoverRendererProps {
  instance: PlatformComponentInstance;
}

export default function ShadcnPopoverRenderer({ instance }: ShadcnPopoverRendererProps) {
  const { configuredValues } = instance;

  const triggerText = configuredValues?.triggerText || 'Open Popover';
  const content = configuredValues?.content || 'Popover content goes here.';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">{triggerText}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </PopoverContent>
    </Popover>
  );
}
