import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  useTheme,
  useMediaQuery,
  Tooltip,
  Fab,
} from "@mui/material";
import { ModernSidebar } from "./components/sidebar";
import { ModernAppBar } from "./components/appbar";
import { SidebarItem } from "./types";
import { Client } from "../../layout/client/Client";
import { Product } from "../../layout/Products/Products";
import { Gastos } from "../../layout/Gastos/Gastos";
import { Tecnicos } from "../../layout/Technics/Tecnicos";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"; // Import Help icon
import MiniChat from "../../components/Mini-chat";
import { Materiales } from "../../layout/Materiales/Materiales";
import {
  Users,
  Package,
  Wrench,
  HardHat,
  Building,
  Anvil,
  ArrowDownUp,
  UserLock,
  LayoutDashboard,
  ShoppingCart,
  Percent,
  Clock,
  PlusCircle,

} from "lucide-react";

import { Proveedor } from "../../layout/Proveedor/Proveedor";


import { Servicios } from "../../layout/servicios/Servicios";
import Personal from "../../layout/Personal/Personal";
import HomeContent from "../../layout/home/home";
import Compra from "../../layout/Compras";
import Ventas from "../../layout/ventas";
import { HistorialVentas } from "../../layout/ventas/historial";
import HistorialCompras from "../../layout/Compras/historial";
const DRAWER_WIDTH = 230; // Changed from 0 to 240

const sidebarItems: SidebarItem[] = [
  {
    id: "home",
    text: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    content: <HomeContent />,
  },
  {
    id: "clients",
    text: "Clientes",
    icon: <Users size={20} />,
    content: <Client />,
  },
  {
    id: "products",
    text: "Productos",
    icon: <Package size={20} />,
    content: <Product />,
  },
  {
    id: "gastos",
    text: "Gastos",
    icon: <ArrowDownUp size={20} />,
    content: <Gastos />,
  },
  {
    id: "ventas",
    text: "Ventas",
    icon: <Percent size={20} />, // Icono principal de ventas
    subItems: [
      {
        id: "ventas-historial",
        text: "Historial",
        icon: <Clock size={20} />, // Icono subitem listado
        content: <HistorialVentas />, // Componente real de listado de ventas
      },
      {
        id: "ventas-crear",
        text: "Creación",
        icon: <PlusCircle size={20} />, // Icono subitem crear
        content: <Ventas />, // Componente real de creación de ventas
      },
    ],
  },
  {
    id: "compras",
    text: "Compras",
    icon: <ShoppingCart size={20} />, // Icono principal de ventas
    subItems: [
      {
        id: "compras-historial",
        text: "Historial",
        icon: <Clock size={20} />, // Icono subitem listado
        content: <HistorialCompras />, // Componente real de listado de ventas
      },
      {
        id: "compras-crear",
        text: "Creación",
        icon: <PlusCircle size={20} />, // Icono subitem crear
        content: <Compra />, // Componente real de creación de ventas
      },
    ],
  },
  {
    id: "tecnicos",
    text: "Tecnicos",
    icon: <Wrench size={20} />,
    content: <Tecnicos />,
  },
  {
    id: "servicios",
    text: "Servicios",
    icon: <Anvil size={20} />,
    content: <Servicios />,
  },
  
  {
    id: "materiales",
    text: "Materiales",
    icon: <HardHat size={20} />,
    content: <Materiales />,
  },
  {
    id: "proveedores",
    text: "Proveedores",
    icon: <Building size={20} />,
    content: <Proveedor />,
  },
  {
    id: "personal",
    text: "Personal",
    icon: <UserLock size={20} />,
    content: <Personal />,
  },

];


export const Dashboard: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false); // State for MiniChat visibility

  const [content, setContent] = useState<React.ReactNode>(
    sidebarItems[0].content
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleContentChange = (newContent: React.ReactNode) => {
    setContent(newContent);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: theme.palette.background.default,
        overflow: "hidden", // Prevents overall scrollbars
      }}
    >
      <CssBaseline />


      <Box
        sx={{
          flexGrow: 1, // Allows this Box to take up remaining horizontal space
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          // Adjust margin and width based on sidebar state and screen size
          marginLeft: !isMobile && isSidebarOpen ? `${DRAWER_WIDTH}px` : 0,
          width:
            !isMobile && isSidebarOpen
              ? `calc(100% - ${DRAWER_WIDTH}px)`
              : "100%",
          // Add transition for when the sidebar opens
          ...(!isMobile &&
            isSidebarOpen && {
              transition: theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              }),
            }),
          overflowY: "auto", // Allows scrolling within the main content area
          display: "flex", // Uses flex to stack AppBar and main content
          flexDirection: "column", // Stacks AppBar and main content vertically
        }}
      >
              <ModernSidebar
        items={sidebarItems}
        onContentChange={handleContentChange}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />
        <ModernAppBar toggleSidebar={toggleSidebar}/>
        <Box
          component="main"
          sx={{
            flexGrow: 1, // This Box takes all available vertical space below the AppBar
            p: 3,
            overflow: "auto", // Ensures content within 'main' scrolls independently
            bgcolor: theme.palette.grey[50],
          }}
        >
          {content}
        </Box>
      </Box>

      <Tooltip title="Abrir Asistente">
        <Fab
          color="primary"
          aria-label="help"
          onClick={toggleChat}
          sx={{
            position: "fixed",
            bottom: theme.spacing(4), // Adjust spacing from bottom
            right: theme.spacing(4), // Adjust spacing from right
            zIndex: 1400, // Ensure it's above most content but below the chat modal
            boxShadow: theme.shadows[6], // Add a more prominent shadow
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.1)", // Slightly enlarge on hover
            },
          }}
        >
          <HelpOutlineIcon />
        </Fab>
      </Tooltip>

      <MiniChat open={isChatOpen} onClose={toggleChat} />
    </Box>
  );
};

export default Dashboard;
