
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ShadcnAlertDialogRendererProps {
  instance: PlatformComponentInstance;
}

export default function ShadcnAlertDialogRenderer({ instance }: ShadcnAlertDialogRendererProps) {
  const { configuredValues } = instance;

  const triggerText = configuredValues?.triggerText || 'Open Alert Dialog';
  const title = configuredValues?.title || 'Are you absolutely sure?';
  const description = configuredValues?.description || 'This action cannot be undone.';
  const cancelText = configuredValues?.cancelText || 'Cancel';
  const actionText = configuredValues?.actionText || 'Continue';

  // In a live platform, the AlertDialog might be controlled by app state
  // For this renderer, we make it self-contained for preview purposes.
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">{triggerText}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={() => alert(`'${actionText}' clicked!`)}>{actionText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
