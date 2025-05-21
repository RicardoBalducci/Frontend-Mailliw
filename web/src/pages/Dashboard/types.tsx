import type { ReactNode } from "react";

export interface SidebarItem {
  id: string;
  text: string;
  icon: ReactNode;
  content: ReactNode;
}
