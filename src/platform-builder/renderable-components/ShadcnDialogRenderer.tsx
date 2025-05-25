
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ShadcnDialogRendererProps {
  instance: PlatformComponentInstance;
}

export default function ShadcnDialogRenderer({ instance }: ShadcnDialogRendererProps) {
  const { configuredValues } = instance;

  const triggerText = configuredValues?.triggerText || 'Open Dialog';
  const title = configuredValues?.title || 'Dialog Title';
  const description = configuredValues?.description || 'Dialog description text.';
  const content = configuredValues?.content || '<p>Make changes to your profile here. Click save when you\'re done.</p>';
  const saveText = configuredValues?.saveText || 'Save changes';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerText}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="py-4" dangerouslySetInnerHTML={{ __html: content }} />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={() => alert(`'${saveText}' clicked!`)}>{saveText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
