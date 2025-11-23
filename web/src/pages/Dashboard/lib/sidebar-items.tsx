import {
  Home,
  Users,
  Package,
  DollarSign,
  Wrench,
  HardHat,
  Building,
  //ShoppingCart,
} from "lucide-react";
import { SidebarItem } from "../types";
import { Client } from "../../../layout/client/Client";
import Product from "../../../layout/Products/Products";
import { Gastos } from "../../../layout/Gastos/Gastos";
import { Tecnicos } from "../../../layout/Technics/Tecnicos";
import { Materiales } from "../../../layout/Materiales/Materiales";
import { Proveedor } from "../../../layout/Proveedor/Proveedor";
/* import { Compra } from "../../../layout/Compra/Compra";
 */
export const sidebarItems: SidebarItem[] = [
  {
    id: "home",
    text: "Inicio",
    icon: <Home className="h-5 w-5" />,
    content: <Home />,
  },
  {
    id: "clients",
    text: "Clientes",
    icon: <Users className="h-5 w-5" />,
    content: <Client />,
  },
  {
    id: "products",
    text: "Productos",
    icon: <Package className="h-5 w-5" />,
    content: <Product />,
  },
  {
    id: "expenses",
    text: "Gastos",
    icon: <DollarSign className="h-5 w-5" />,
    content: <Gastos />,
  },
  {
    id: "technicians",
    text: "Técnicos",
    icon: <Wrench className="h-5 w-5" />,
    content: <Tecnicos />,
  },
  {
    id: "materials",
    text: "Materiales",
    icon: <HardHat className="h-5 w-5" />,
    content: <Materiales />,
  },
  {
    id: "suppliers",
    text: "Proveedores",
    icon: <Building className="h-5 w-5" />,
    content: <Proveedor />,
  },
/*   {
    id: "purchases",
    text: "Compras",
    icon: <ShoppingCart className="h-5 w-5" />,
    content: <Compra />,
  }, */
];
