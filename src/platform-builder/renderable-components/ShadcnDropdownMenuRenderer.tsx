
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ShadcnDropdownMenuRendererProps {
  instance: PlatformComponentInstance;
}

interface MenuItem {
  label: string;
  action?: string; // For potential future event handling
  isSeparator?: boolean;
}

export default function ShadcnDropdownMenuRenderer({ instance }: ShadcnDropdownMenuRendererProps) {
  const { configuredValues } = instance;

  const triggerText = configuredValues?.triggerText || 'Open Menu';
  let items: MenuItem[] = [];

  if (typeof configuredValues?.itemsJson === 'string') {
    try {
      items = JSON.parse(configuredValues.itemsJson);
      if (!Array.isArray(items)) items = [];
    } catch (e) {
      console.error("DropdownMenu: Error parsing itemsJson", e);
      items = [{ label: "Error: Invalid JSON for items", isSeparator: false }];
    }
  } else if (Array.isArray(configuredValues?.itemsJson)) {
    items = configuredValues.itemsJson; // If it's already an array
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{triggerText}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {items.length === 0 && <DropdownMenuLabel>No items configured</DropdownMenuLabel>}
        {items.map((item, index) => {
          if (item.isSeparator) {
            return <DropdownMenuSeparator key={`sep-${index}`} />;
          }
          return (
            <DropdownMenuItem 
              key={item.label + index} 
              onClick={() => item.action && alert(`Action: ${item.action}`)}
            >
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
