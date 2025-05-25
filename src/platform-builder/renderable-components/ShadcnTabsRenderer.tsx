
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ShadcnTabsRendererProps {
  instance: PlatformComponentInstance;
}

interface TabItem {
  value: string;
  trigger: string;
  content: string;
}

export default function ShadcnTabsRenderer({ instance }: ShadcnTabsRendererProps) {
  const { configuredValues } = instance;

  let items: TabItem[] = [];
  if (typeof configuredValues?.tabsJson === 'string') {
    try {
      items = JSON.parse(configuredValues.tabsJson);
      if (!Array.isArray(items)) items = [];
    } catch (e) {
      console.error("Tabs: Error parsing tabsJson", e);
      items = [{ value: "error", trigger: "Error", content: "Invalid JSON for tabs." }];
    }
  } else if (Array.isArray(configuredValues?.tabsJson)) {
    items = configuredValues.tabsJson;
  }

  const defaultValue = configuredValues?.defaultValue || (items.length > 0 ? items[0].value : '');

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Tabs: No items configured.</p>;
  }

  return (
    <Tabs defaultValue={defaultValue} className="w-[400px]">
      <TabsList>
        {items.map((item, index) => (
          <TabsTrigger key={item.value + index} value={item.value}>{item.trigger}</TabsTrigger>
        ))}
      </TabsList>
      {items.map((item, index) => (
        <TabsContent key={item.value + index} value={item.value}>
          <div dangerouslySetInnerHTML={{ __html: item.content }} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
