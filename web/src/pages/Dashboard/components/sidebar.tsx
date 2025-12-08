"use client";

import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Typography,
  Box,
  IconButton,
  useTheme,
  ListItemButton,
  Collapse,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { SidebarItem } from "../types";
import { alpha } from "@mui/material/styles";

interface SidebarProps {
  items: SidebarItem[];
  onContentChange: (content: React.ReactNode) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

export const ModernSidebar: React.FC<SidebarProps> = ({
  items,
  onContentChange,
  isOpen,
  toggleSidebar,
  isMobile,
}) => {
  const [selectedId, setSelectedId] = useState<string>(items[0].id);
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});
  const [nombre, setNombre] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const theme = useTheme();

  useEffect(() => {
    const storedNombre = localStorage.getItem("nombre");
    if (storedNombre) setNombre(storedNombre);
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);
  }, []);

  const handleNavigation = (item: SidebarItem) => {
    if (item.subItems) {
      setOpenSubmenus((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
    } else {
      setSelectedId(item.id);
      onContentChange(item.content);
      if (isMobile) toggleSidebar();
    }
  };

  const handleSubItemClick = (subItem: SidebarItem) => {
    setSelectedId(subItem.id);
    onContentChange(subItem.content);
    if (isMobile) toggleSidebar();
  };

  const handleLogout = (): void => {
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  const drawerWidth = 240;

  // 🔹 Filtrar items según el rol
  const filteredItems = items.filter((item) => {
    if (role === "administrador") {
      return true; // administrador ve todo
    }
    if (role === "gerente") {
      // gerente solo ve algunos módulos
      return ["home", "clients", "products", "ventas", "gastos"].includes(item.id);
    }
    return false; // si no hay rol válido, no muestra nada
  });

  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"}
      anchor="left"
      open={isOpen}
      onClose={toggleSidebar}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.background.default, 0.6)
              : "#fdfdfd",
          backdropFilter: "blur(14px)",
          borderRight: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Header con avatar y nombre */}
      <Box
        sx={{
          p: 3,
          pb: 2,
          position: "relative",
          textAlign: "center",
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        }}
      >
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: "absolute",
            right: 14,
            top: 14,
            color: theme.palette.text.secondary,
            "&:hover": { color: theme.palette.primary.main },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        <Avatar
          src="/Logo5.png?height=56&width=56"
          sx={{
            width: 88,
            height: 88,
            mx: "auto",
            borderRadius: "24%",
            border: `3px solid ${alpha(theme.palette.primary.main, 0.6)}`,
            boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
            transition: "0.3s ease",
            "&:hover": {
              transform: "scale(1.07)",
              boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.55)}`,
            },
          }}
        />

        <Typography variant="h6" sx={{ mt: 1.5, fontWeight: 700 }}>
          BlueLock
        </Typography>

        <Box
          sx={{
            mt: 1,
            py: 1.2,
            borderRadius: 2.5,
            px: 2,
            background: alpha(theme.palette.primary.main, 0.07),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: "1rem" }}>
            {nombre || "Usuario"}
          </Typography>
          <Typography
            sx={{
              mt: 0.3,
              fontSize: "0.78rem",
              color: theme.palette.text.secondary,
              textTransform: "capitalize",
            }}
          >
            {role || "usuario"}
          </Typography>
        </Box>
      </Box>

      {/* --- MENU ITEMS --- */}
      <List sx={{ mt: 1, px: 1.2 }}>
        {filteredItems.map((item) => (
          <React.Fragment key={item.id}>
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedId === item.id}
                onClick={() => handleNavigation(item)}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  mb: 0.6,
                  transition: "0.25s ease",
                  background:
                    selectedId === item.id
                      ? alpha(theme.palette.primary.main, 0.12)
                      : "transparent",
                  "&:hover": { background: alpha(theme.palette.primary.main, 0.08) },
                }}
              >
                <ListItemIcon
                  sx={{
                    color:
                      selectedId === item.id
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                    minWidth: 42,
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: selectedId === item.id ? 600 : 400,
                    fontSize: "0.95rem",
                  }}
                />

                {item.subItems &&
                  (openSubmenus[item.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
              </ListItemButton>
            </ListItem>

            {/* SUBITEMS */}
            {item.subItems && (
              <Collapse in={openSubmenus[item.id]} timeout="auto" unmountOnExit>
                <List disablePadding sx={{ pl: 5, pr: 2, py: 0.6 }}>
                  {item.subItems.map((sub) => (
                    <ListItemButton
                      key={sub.id}
                      selected={selectedId === sub.id}
                      onClick={() => handleSubItemClick(sub)}
                      sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        py: 1,
                        display: "flex",
                        alignItems: "center",
                        background:
                          selectedId === sub.id
                            ? alpha(theme.palette.primary.main, 0.1)
                            : "transparent",
                        "&:hover": { background: alpha(theme.palette.primary.main, 0.07) },
                      }}
                    >
                      {sub.icon && (
                        <ListItemIcon
                          sx={{
                            minWidth: 36,
                            color:
                              selectedId === sub.id
                                ? theme.palette.primary.main
                                : theme.palette.text.secondary,
                          }}
                        >
                          {sub.icon}
                        </ListItemIcon>
                      )}
                      <ListItemText
                        primary={sub.text}
                        primaryTypographyProps={{
                          fontSize: "0.87rem",
                          fontWeight: selectedId === sub.id ? 600 : 400,
                          color:
                            selectedId === sub.id
                              ? theme.palette.primary.main
                              : theme.palette.text.primary,
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ p: 2 }}>
    <ListItemButton
      onClick={handleLogout}
      sx={{
        borderRadius: 2,
        py: 1.2,
        color: theme.palette.error.main,
        border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
        background: alpha(theme.palette.error.main, 0.06),
        "&:hover": {
          background: alpha(theme.palette.error.main, 0.12),
        },
      }}
    >
      <ListItemIcon sx={{ color: theme.palette.error.main }}>
        <ChevronLeftIcon />
      </ListItemIcon>
      <ListItemText primary="Cerrar sesión" />
    </ListItemButton>
  </Box>
  

  </Drawer>

  );
};
