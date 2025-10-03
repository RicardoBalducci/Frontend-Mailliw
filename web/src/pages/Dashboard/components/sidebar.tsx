"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  Typography,
  Box,
  IconButton,
  useTheme,
  ListItemButton,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
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
  const [nombre, setNombre] = useState<string>("");
  const theme = useTheme();

  useEffect(() => {
    const storedNombre = localStorage.getItem("nombre");
    if (storedNombre) {
      setNombre(storedNombre);
    }
  }, []);

  const handleNavigation = (item: SidebarItem) => {
    setSelectedId(item.id);
    onContentChange(item.content);
    if (isMobile) {
      toggleSidebar();
    }
  };

  const handleLogout = (): void => {
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  const drawerWidth = 240; // This value must match DRAWER_WIDTH in Dashboard

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
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          overflowX: "hidden",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 2,
          position: "relative",
        }}
      >
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.primary.main,
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
        <Avatar
          alt="Logo"
          src="/Logo3.png?height=56&width=56"
          sx={{
            width: 65,
            height: 65,
            mt: 2,
            mb: 1,
            backgroundColor: theme.palette.primary.main,
            boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.2)}`,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: `0 0 0 6px ${alpha(theme.palette.primary.main, 0.3)}`,
            },
          }}
        />
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          Cerrajeria W
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            mb: 1,
          }}
        >
          {nombre || "Usuario"}
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1, py: 1 }}>
        {items.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={selectedId === item.id}
              onClick={() => handleNavigation(item)}
              sx={{
                borderRadius: 2,
                py: 1,
                transition: "all 0.2s ease",
                backgroundColor:
                  selectedId === item.id
                    ? alpha(theme.palette.primary.main, 0.1)
                    : "transparent",
                color:
                  selectedId === item.id
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
                "&.Mui-selected": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color:
                    selectedId === item.id
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: selectedId === item.id ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <List sx={{ px: 1, py: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              py: 1,
              color: theme.palette.error.main,
              "&:hover": {
                backgroundColor: alpha(theme.palette.error.main, 0.08),
              },
            }}
          >
            <ListItemIcon
              sx={{ color: theme.palette.error.main, minWidth: 40 }}
            >
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Cerrar sesión" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};
