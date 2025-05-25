
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
  // Get the configured value for collapsible, defaulting to false if not a boolean or not set
  const isCollapsibleConfigured = typeof configuredValues?.collapsible === 'boolean' ? configuredValues.collapsible : false;
  
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
    items = configuredValues.items;
  }


  if (!items || items.length === 0) {
    return <p className="text-sm text-muted-foreground">Accordion: No items configured or items are invalid.</p>;
  }

  // Prepare props for the Accordion component
  const accordionProps: React.ComponentProps<typeof Accordion> = {
    type: behaviorType,
    className: "w-full"
  };

  // The 'collapsible' prop is only relevant if type is 'single'.
  // Only pass 'collapsible={true}' if it's explicitly configured as true.
  // If it's false or not configured, we omit the prop, and Radix's default (false) applies.
  if (behaviorType === "single" && isCollapsibleConfigured === true) {
    accordionProps.collapsible = true;
  }

  return (
    <Accordion {...accordionProps}>
      {items.map((item, index) => {
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
                <div dangerouslySetInnerHTML={{ __html: item.content }} />
                </AccordionContent>
            </AccordionItem>
        );
      })}
    </Accordion>
  );
}
