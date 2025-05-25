
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ShadcnAccordionRendererProps {
  instance: PlatformComponentInstance;
}

interface AccordionItemData {
  value: string;
  title: string;
  content: string;
}

export default function ShadcnAccordionRenderer({ instance }: ShadcnAccordionRendererProps) {
  const { configuredValues } = instance;

  const behaviorType = configuredValues?.behaviorType as "single" | "multiple" || "single";
  const collapsible = typeof configuredValues?.collapsible === 'boolean' ? configuredValues.collapsible : false;
  
  let items: AccordionItemData[] = [];
  if (typeof configuredValues?.items === 'string') {
    try {
      items = JSON.parse(configuredValues.items);
      if (!Array.isArray(items)) {
        console.warn("Accordion items configured is not a valid JSON array. Defaulting to empty.", configuredValues.items);
        items = [];
      }
    } catch (e) {
      console.error("Error parsing accordion items JSON:", e, configuredValues.items);
      items = []; // Fallback to empty array on parse error
    }
  } else if (Array.isArray(configuredValues?.items)) {
    // If it's already an array (e.g. from direct config or future improvement)
    items = configuredValues.items;
  }


  if (!items || items.length === 0) {
    return <p className="text-sm text-muted-foreground">Accordion: No items configured or items are invalid.</p>;
  }

  return (
    <Accordion type={behaviorType} collapsible={collapsible} className="w-full">
      {items.map((item, index) => {
        // Ensure item.value is unique if not provided or duplicated
        const itemValue = item.value || `item-${index}-${instance.id}`;
        if (!item.title || !item.content) {
            console.warn("Accordion item missing title or content", item);
            return (
                <AccordionItem key={itemValue} value={itemValue} disabled>
                    <AccordionTrigger className="text-destructive">Invalid Item (Missing Title/Content)</AccordionTrigger>
                </AccordionItem>
            )
        }
        return (
            <AccordionItem key={itemValue} value={itemValue}>
                <AccordionTrigger>{item.title}</AccordionTrigger>
                <AccordionContent>
                {/* Basic HTML rendering; for complex HTML, a more robust solution might be needed */}
                <div dangerouslySetInnerHTML={{ __html: item.content }} />
                </AccordionContent>
            </AccordionItem>
        );
      })}
    </Accordion>
  );
}
