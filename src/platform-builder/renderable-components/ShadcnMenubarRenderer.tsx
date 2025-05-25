
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarLabel,
} from "@/components/ui/menubar";

interface ShadcnMenubarRendererProps {
  instance: PlatformComponentInstance;
}

interface MenuItemData {
  label: string;
  shortcut?: string;
  disabled?: boolean;
  isSeparator?: boolean;
  isLabel?: boolean;
  items?: MenuItemData[]; // For submenus
}

export default function ShadcnMenubarRenderer({ instance }: ShadcnMenubarRendererProps) {
  const { configuredValues } = instance;
  let menus: MenuItemData[] = [];

  if (typeof configuredValues?.menusJson === 'string') {
    try {
      menus = JSON.parse(configuredValues.menusJson);
      if (!Array.isArray(menus)) menus = [];
    } catch (e) {
      console.error("Menubar: Error parsing menusJson", e);
      menus = [{ label: "Error: Invalid JSON", isLabel: true }];
    }
  } else if (Array.isArray(configuredValues?.menusJson)) {
    menus = configuredValues.menusJson;
  }

  const renderMenuItems = (items: MenuItemData[], isSubmenu = false) => {
    return items.map((item, index) => {
      if (item.isSeparator) return <MenubarSeparator key={`sep-${index}`} />;
      if (item.isLabel && !isSubmenu) return <MenubarLabel key={`label-${index}`}>{item.label}</MenubarLabel>; // Labels only at top level usually
      
      if (item.items && item.items.length > 0) {
        return (
          <MenubarSub key={item.label + index}>
            <MenubarSubTrigger disabled={item.disabled}>{item.label}</MenubarSubTrigger>
            <MenubarSubContent>
              {renderMenuItems(item.items, true)}
            </MenubarSubContent>
          </MenubarSub>
        );
      }
      return (
        <MenubarItem key={item.label + index} disabled={item.disabled} onClick={() => alert(`Clicked: ${item.label}`)}>
          {item.label}
          {item.shortcut && <MenubarShortcut>{item.shortcut}</MenubarShortcut>}
        </MenubarItem>
      );
    });
  };

  if (menus.length === 0) return <p className="text-sm text-muted-foreground">Menubar: No menus configured.</p>;

  return (
    <Menubar>
      {menus.map((menu, index) => (
        <MenubarMenu key={menu.label + index}>
          <MenubarTrigger>{menu.label}</MenubarTrigger>
          {menu.items && menu.items.length > 0 && (
            <MenubarContent>
              {renderMenuItems(menu.items)}
            </MenubarContent>
          )}
        </MenubarMenu>
      ))}
    </Menubar>
  );
}
