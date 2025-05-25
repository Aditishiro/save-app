
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface ShadcnSheetRendererProps {
  instance: PlatformComponentInstance;
}

type SheetSide = "top" | "bottom" | "left" | "right" | undefined;

export default function ShadcnSheetRenderer({ instance }: ShadcnSheetRendererProps) {
  const { configuredValues } = instance;

  const triggerText = configuredValues?.triggerText || 'Open Sheet';
  const side = configuredValues?.side as SheetSide || 'right';
  const title = configuredValues?.title || 'Sheet Title';
  const description = configuredValues?.description || 'Sheet description.';
  const content = configuredValues?.content || '<p>Sheet content goes here.</p>';

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">{triggerText}</Button>
      </SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="py-4" dangerouslySetInnerHTML={{ __html: content }} />
        <SheetFooter>
            <SheetClose asChild>
                <Button type="button">Close</Button>
            </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
