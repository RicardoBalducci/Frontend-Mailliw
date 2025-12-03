export interface SidebarItem {
  id: string;
  text: string;
  icon: React.ReactNode;
  content?: React.ReactNode;      // Para items simples
  subItems?: SidebarItem[];       // Para items con subramas
}