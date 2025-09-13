import type React from "react";
export interface SidebarItem {
  id: string;
  text: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}
