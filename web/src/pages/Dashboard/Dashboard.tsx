import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
} from "@mui/material";
import { ModernSidebar } from "./components/sidebar";
import { ModernAppBar } from "./components/appbar";
import { SidebarItem } from "./types";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
//import AnalyticsIcon from "@mui/icons-material/Analytics";
//import SettingsIcon from "@mui/icons-material/Settings";
import InventoryIcon from "@mui/icons-material/Inventory";
import { Client } from "../../layout/client/Client";
//import { Materiales } from "../../layout/Materials/Material";
import { Product } from "../../layout/Products/Products";

// Sample Client component - replace with your actual component

const sidebarItems: SidebarItem[] = [
  {
    id: "home",
    text: "Inicio",
    icon: <HomeIcon />,
    content: (
      <Box>
        <Typography variant="h5" gutterBottom>
          Tareas Pendientes
        </Typography>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            Completar informes mensuales
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Vence: 30 de Mayo
          </Typography>
        </Paper>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            Reunión con proveedores
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Mañana, 10:00 AM
          </Typography>
        </Paper>
      </Box>
    ),
  },
  {
    id: "clients",
    text: "Clientes",
    icon: <PeopleIcon />,
    content: <Client />,
  },
  {
    id: "products", // Nuevo campo para Productos
    text: "Productos",
    icon: <InventoryIcon />, // Icono de Productos
    content: <Product />,
  },
];
/*
{
    id: "inventory",
    text: "Inventario",
    icon: <InventoryIcon />,
     content: (
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" fontWeight="600">
            Inventario
          </Typography>
          <Tooltip title="Añadir producto">
            <Fab size="small" color="primary" aria-label="add">
              <AddIcon />
            </Fab>
          </Tooltip>
        </Box>

        <Grid container spacing={3}>
          {[
            {
              name: "Producto A",
              stock: 124,
              status: "In Stock",
              category: "Electrónica",
            },
            {
              name: "Producto B",
              stock: 8,
              status: "Low Stock",
              category: "Muebles",
            },
            {
              name: "Producto C",
              stock: 0,
              status: "Out of Stock",
              category: "Ropa",
            },
            {
              name: "Producto D",
              stock: 45,
              status: "In Stock",
              category: "Alimentos",
            },
          ].map((product, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <StyledCard>
                <CardContent>
                  <Box
                    sx={{
                      height: 120,
                      bgcolor: `hsl(${index * 60}, 70%, 90%)`,
                      borderRadius: 2,
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <InventoryIcon
                      sx={{
                        fontSize: 40,
                        color: `hsl(${index * 60}, 70%, 40%)`,
                      }}
                    />
                  </Box>
                  <Typography variant="h6" fontWeight="600">
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {product.category}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2">
                      Stock: <b>{product.stock}</b>
                    </Typography>
                    <StatusChip
                      label={product.status}
                      color={
                        product.status === "In Stock"
                          ? "success"
                          : product.status === "Low Stock"
                          ? "warning"
                          : "error"
                      }
                    />
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    ),
  },
  {
    id: "materials",
    text: "Materiales",
    icon: <InventoryIcon />,
    content: (
      <Box>
        <Typography variant="h5" gutterBottom>
          Análisis
        </Typography>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Typography>Estadísticas y reportes</Typography>
        </Paper>
      </Box>
    ), // Replace with your actual component
  },
  {
    id: "analytics",
    text: "Análisis",
    icon: <AnalyticsIcon />,
    content: (
      <Box>
        <Typography variant="h5" gutterBottom>
          Análisis
        </Typography>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Typography>Estadísticas y reportes</Typography>
        </Paper>
      </Box>
    ),
  },
  {
    id: "settings",
    text: "Configuración",
    icon: <SettingsIcon />,
    content: (
      <Box>
        <Typography variant="h5" gutterBottom>
          Configuración
        </Typography>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Typography>Ajustes del sistema</Typography>
        </Paper>
      </Box>
    ),
  },
*/
export const Dashboard: React.FC = () => {
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

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: theme.palette.background.default,
      }}
    >
      <CssBaseline />
      <ModernSidebar
        items={sidebarItems}
        onContentChange={handleContentChange}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(isSidebarOpen &&
            !isMobile && {
              width: `calc(100% - ${240}px)`, // Ancho cuando el sidebar está abierto (240px es el ancho del sidebar)
              marginLeft: `0px`, // Elimina el margen fijo, se ajustará automáticamente
              transition: theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              }),
            }),
          ...(!isSidebarOpen &&
            !isMobile && {
              width: "100%", // Cuando el sidebar está cerrado, el Box abarca todo el ancho
              marginLeft: "0px", // Asegura que no haya margen izquierdo
              transition: theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              }),
            }),
        }}
      >
        <ModernAppBar toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
        <Box
          component="main"
          sx={{
            p: 3,
            height: "calc(100vh - 64px)", // Asegúrate de que este valor sea correcto (altura del AppBar)
            overflow: "auto",
            bgcolor: theme.palette.grey[50],
          }}
        >
          {content}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
/*
"use client";

import type React from "react";
import { useState } from "react";
import {
  Box,
  CssBaseline,
  Typography,
  useTheme,
  useMediaQuery,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Avatar,
  IconButton,
  Fab,
  Tooltip,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ModernSidebar } from "./components/sidebar";
import { ModernAppBar } from "./components/appbar";
import type { SidebarItem } from "./types";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import SettingsIcon from "@mui/icons-material/Settings";
import InventoryIcon from "@mui/icons-material/Inventory";
import AddIcon from "@mui/icons-material/Add";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { alpha } from "@mui/material/styles";

// Styled components for modern UI elements
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  transition: "transform 0.3s, box-shadow 0.3s",
  overflow: "visible",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[10],
  },
}));

const GradientBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  borderRadius: 16,
  padding: theme.spacing(2),
  color: theme.palette.common.white,
  position: "relative",
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)",
  },
}));

const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(2),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
  },
}));

const ProgressWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginTop: theme.spacing(1),
  "& .MuiLinearProgress-root": {
    height: 8,
    borderRadius: 4,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    flexGrow: 1,
    marginRight: theme.spacing(1),
  },
  "& .MuiLinearProgress-bar": {
    borderRadius: 4,
  },
}));

const StatusChip = styled(Chip)(({ theme, color }) => ({
  borderRadius: 8,
  fontWeight: 600,
  fontSize: "0.75rem",
  height: 24,
  backgroundColor:
    color === "success"
      ? alpha(theme.palette.success.main, 0.1)
      : color === "warning"
      ? alpha(theme.palette.warning.main, 0.1)
      : color === "error"
      ? alpha(theme.palette.error.main, 0.1)
      : alpha(theme.palette.info.main, 0.1),
  color:
    color === "success"
      ? theme.palette.success.main
      : color === "warning"
      ? theme.palette.warning.main
      : color === "error"
      ? theme.palette.error.main
      : theme.palette.info.main,
  "& .MuiChip-label": {
    padding: "0 8px",
  },
}));

// Sample Client component with modern design
const Client = () => (
  <Box>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Typography variant="h5" fontWeight="600">
        Clientes
      </Typography>
      <Tooltip title="Añadir cliente">
        <Fab size="small" color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </Tooltip>
    </Box>

    <Grid container spacing={3}>
      {[
        {
          name: "Empresa ABC",
          status: "active",
          revenue: "€24,500",
          growth: 12,
        },
        {
          name: "Corporación XYZ",
          status: "pending",
          revenue: "€18,300",
          growth: -5,
        },
        {
          name: "Industrias 123",
          status: "active",
          revenue: "€32,800",
          growth: 8,
        },
        {
          name: "Servicios Técnicos",
          status: "inactive",
          revenue: "€8,200",
          growth: -2,
        },
      ].map((client, index) => (
        <Grid item xs={12} md={6} key={index}>
          <StyledCard>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: `hsl(${index * 60}, 70%, 60%)`,
                      width: 48,
                      height: 48,
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                    }}
                  >
                    {client.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="600">
                      {client.name}
                    </Typography>
                    <StatusChip
                      label={
                        client.status === "active"
                          ? "Activo"
                          : client.status === "pending"
                          ? "Pendiente"
                          : "Inactivo"
                      }
                      color={
                        client.status === "active"
                          ? "success"
                          : client.status === "pending"
                          ? "warning"
                          : "error"
                      }
                      size="small"
                    />
                  </Box>
                </Box>
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Ingresos
                  </Typography>
                  <Typography variant="h6" fontWeight="600">
                    {client.revenue}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="body2" color="text.secondary">
                    Crecimiento
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    {client.growth > 0 ? (
                      <ArrowUpwardIcon fontSize="small" color="success" />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" color="error" />
                    )}
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      color={client.growth > 0 ? "success.main" : "error.main"}
                    >
                      {Math.abs(client.growth)}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  </Box>
);

// Dashboard content items
const sidebarItems: SidebarItem[] = [
  {
    id: "home",
    text: "Inicio",
    icon: <HomeIcon />,
    content: (
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" fontWeight="600">
            Panel de Control
          </Typography>
          <Chip
            label="Hoy"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: "medium", borderRadius: 2 }}
          />
        </Box>

        <GradientBox sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight="600" sx={{ mb: 0.5 }}>
                Bienvenido de nuevo
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                Aquí tienes un resumen de tu actividad reciente
              </Typography>
              <Chip
                label="Ver detalles"
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: "medium",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                }}
              />
            </Box>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingUpIcon sx={{ fontSize: 30 }} />
            </Box>
          </Box>
        </GradientBox>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            {
              title: "Ventas Totales",
              value: "€12,628",
              change: "+8.2%",
              icon: <TrendingUpIcon color="success" />,
              progress: 78,
            },
            {
              title: "Clientes Nuevos",
              value: "54",
              change: "+12.5%",
              icon: <TrendingUpIcon color="success" />,
              progress: 65,
            },
            {
              title: "Pedidos Pendientes",
              value: "12",
              change: "-2.4%",
              icon: <TrendingDownIcon color="error" />,
              progress: 32,
            },
            {
              title: "Ingresos",
              value: "€9,254",
              change: "+5.7%",
              icon: <TrendingUpIcon color="success" />,
              progress: 82,
            },
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatCard>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" fontWeight="600" sx={{ my: 1 }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: alpha(
                        stat.change.startsWith("+") ? "#4caf50" : "#f44336",
                        0.1
                      ),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: stat.change.startsWith("+")
                        ? "success.main"
                        : "error.main",
                      fontWeight: "medium",
                      mr: 1,
                    }}
                  >
                    {stat.change}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    vs. mes anterior
                  </Typography>
                </Box>
                <ProgressWrapper>
                  <LinearProgress
                    variant="determinate"
                    value={stat.progress}
                    color={stat.change.startsWith("+") ? "success" : "error"}
                  />
                  <Typography variant="body2" fontWeight="medium">
                    {stat.progress}%
                  </Typography>
                </ProgressWrapper>
              </StatCard>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
          Tareas Pendientes
        </Typography>
        <Grid container spacing={2}>
          {[
            {
              title: "Completar informes mensuales",
              deadline: "30 de Mayo",
              priority: "alta",
              progress: 65,
            },
            {
              title: "Reunión con proveedores",
              deadline: "Mañana, 10:00 AM",
              priority: "media",
              progress: 30,
            },
            {
              title: "Actualizar inventario",
              deadline: "15 de Mayo",
              priority: "baja",
              progress: 90,
            },
          ].map((task, index) => (
            <Grid item xs={12} md={4} key={index}>
              <StyledCard>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="600">
                      {task.title}
                    </Typography>
                    <StatusChip
                      label={
                        task.priority === "alta"
                          ? "Alta"
                          : task.priority === "media"
                          ? "Media"
                          : "Baja"
                      }
                      color={
                        task.priority === "alta"
                          ? "error"
                          : task.priority === "media"
                          ? "warning"
                          : "success"
                      }
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Vence: {task.deadline}
                  </Typography>
                  <ProgressWrapper>
                    <LinearProgress
                      variant="determinate"
                      value={task.progress}
                      color={
                        task.priority === "alta"
                          ? "error"
                          : task.priority === "media"
                          ? "warning"
                          : "success"
                      }
                    />
                    <Typography variant="body2" fontWeight="medium">
                      {task.progress}%
                    </Typography>
                  </ProgressWrapper>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    ),
  },
  {
    id: "clients",
    text: "Clientes",
    icon: <PeopleIcon />,
    content: <Client />,
  },
  {
    id: "inventory",
    text: "Inventario",
    icon: <InventoryIcon />,
    content: (
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" fontWeight="600">
            Inventario
          </Typography>
          <Tooltip title="Añadir producto">
            <Fab size="small" color="primary" aria-label="add">
              <AddIcon />
            </Fab>
          </Tooltip>
        </Box>

        <Grid container spacing={3}>
          {[
            {
              name: "Producto A",
              stock: 124,
              status: "In Stock",
              category: "Electrónica",
            },
            {
              name: "Producto B",
              stock: 8,
              status: "Low Stock",
              category: "Muebles",
            },
            {
              name: "Producto C",
              stock: 0,
              status: "Out of Stock",
              category: "Ropa",
            },
            {
              name: "Producto D",
              stock: 45,
              status: "In Stock",
              category: "Alimentos",
            },
          ].map((product, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <StyledCard>
                <CardContent>
                  <Box
                    sx={{
                      height: 120,
                      bgcolor: `hsl(${index * 60}, 70%, 90%)`,
                      borderRadius: 2,
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <InventoryIcon
                      sx={{
                        fontSize: 40,
                        color: `hsl(${index * 60}, 70%, 40%)`,
                      }}
                    />
                  </Box>
                  <Typography variant="h6" fontWeight="600">
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {product.category}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2">
                      Stock: <b>{product.stock}</b>
                    </Typography>
                    <StatusChip
                      label={product.status}
                      color={
                        product.status === "In Stock"
                          ? "success"
                          : product.status === "Low Stock"
                          ? "warning"
                          : "error"
                      }
                    />
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    ),
  },
  {
    id: "analytics",
    text: "Análisis",
    icon: <AnalyticsIcon />,
    content: (
      <Box>
        <Typography variant="h5" fontWeight="600" sx={{ mb: 3 }}>
          Análisis
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <StyledCard sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                  Rendimiento de Ventas
                </Typography>
                <Box
                  sx={{
                    height: 300,
                    bgcolor: alpha("#f0f0f0", 0.5),
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Gráfico de ventas aquí
                  </Typography>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} lg={4}>
            <StyledCard sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                  Distribución
                </Typography>
                <Box
                  sx={{
                    height: 300,
                    bgcolor: alpha("#f0f0f0", 0.5),
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Gráfico circular aquí
                  </Typography>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </Box>
    ),
  },
  {
    id: "settings",
    text: "Configuración",
    icon: <SettingsIcon />,
    content: (
      <Box>
        <Typography variant="h5" fontWeight="600" sx={{ mb: 3 }}>
          Configuración
        </Typography>
        <Grid container spacing={3}>
          {[
            {
              title: "Perfil",
              description: "Actualiza tu información personal y preferencias",
            },
            {
              title: "Notificaciones",
              description: "Configura tus preferencias de notificaciones",
            },
            {
              title: "Seguridad",
              description: "Gestiona la seguridad de tu cuenta",
            },
            {
              title: "Apariencia",
              description: "Personaliza la apariencia de la aplicación",
            },
          ].map((setting, index) => (
            <Grid item xs={12} md={6} key={index}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" fontWeight="600">
                    {setting.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {setting.description}
                  </Typography>
                  <Chip
                    label="Configurar"
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: "medium", borderRadius: 2 }}
                  />
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    ),
  },
];

export const Dashboard: React.FC = () => {
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

  const drawerWidth = 240;

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: theme.palette.background.default,
        overflow: "hidden",
      }}
    >
      <CssBaseline />
      <ModernSidebar
        items={sidebarItems}
        onContentChange={handleContentChange}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(isSidebarOpen &&
            !isMobile && {
              width: `calc(100% - ${drawerWidth}px)`,
              marginLeft: `${drawerWidth}px`,
              transition: theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              }),
            }),
        }}
      >
        <ModernAppBar toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
        <Box
          component="main"
          sx={{
            p: { xs: 2, md: 3 },
            height: "calc(100vh - 64px)",
            overflow: "auto",
            bgcolor: alpha(theme.palette.background.default, 0.8),
          }}
        >
          {content}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;

*/
