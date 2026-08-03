"use client";

import { menuConfig } from "./data/menu";

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarShortcut,
  MenubarSeparator,
} from "@/components/ui/menubar";

export default function Menu() {
  return (
    <Menubar className="h-auto gap-0.5 border-0 bg-transparent p-0 shadow-none">
      {menuConfig.map((menu) => (
        <MenubarMenu key={menu.id}>
          <MenubarTrigger className="rounded-md px-2.5 text-xs font-medium transition-colors">
            {menu.trigger}
          </MenubarTrigger>
          <MenubarContent className="min-w-56 rounded-lg border border-border p-1">
            {menu.items.map((subItem, index) => {
              if (subItem.type === "separator") {
                return <MenubarSeparator key={`separator-${index}`} />;
              }
              return (
                <MenubarItem
                  key={subItem.id}
                  className="cursor-pointer rounded-md px-2. py-1.5 text-xs"
                  onClick={subItem.action}
                >
                  {subItem.label}
                  {subItem.shortcut && (
                    <MenubarShortcut>{subItem.shortcut}</MenubarShortcut>
                  )}
                </MenubarItem>
              );
            })}
          </MenubarContent>
        </MenubarMenu>
      ))}
    </Menubar>
  );
}
