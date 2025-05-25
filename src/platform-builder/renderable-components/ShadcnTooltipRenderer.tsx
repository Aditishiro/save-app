
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button"; // Default trigger is a button

interface ShadcnTooltipRendererProps {
  instance: PlatformComponentInstance;
}

type TooltipSide = "top" | "bottom" | "left" | "right" | undefined;

export default function ShadcnTooltipRenderer({ instance }: ShadcnTooltipRendererProps) {
  const { configuredValues } = instance;

  const triggerText = configuredValues?.triggerText || 'Hover Me';
  const tooltipText = configuredValues?.tooltipText || 'This is a tooltip!';
  const side = configuredValues?.side as TooltipSide || 'top';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* For a more generic trigger, one might allow HTML in triggerText
              but Button is a common and safe default for a simple preview. */}
          <Button variant="outline">{triggerText}</Button>
        </TooltipTrigger>
        <TooltipContent side={side}>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
