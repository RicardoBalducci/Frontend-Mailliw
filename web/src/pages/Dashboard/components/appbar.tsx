"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  Divider,
  Chip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface AppBarProps {
  toggleSidebar: () => void;
  isOpen?: boolean;
}

export const ModernAppBar: React.FC<AppBarProps> = ({ toggleSidebar }) => {
  const [nombre, setNombre] = useState("");
  const [role, setRole] = useState("");
  const [dollarOficial, setDollarOficial] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();

  useEffect(() => {
    const storedNombre = localStorage.getItem("nombre");
    const storedRole = localStorage.getItem("role");
    const storedDollar = localStorage.getItem("dollar_oficial");

    if (storedNombre) setNombre(storedNombre);
    if (storedRole) setRole(storedRole);
    if (storedDollar) setDollarOficial(Number(storedDollar));
  }, []);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isMenuOpen = Boolean(anchorEl);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: "56px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleSidebar}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                display: { xs: "none", sm: "block" },
                fontWeight: 600,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Cerrajeria W
            </Typography>

            {/* Chip con el dólar oficial */}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {dollarOficial && (
              <Chip
                label={`Tasa BCV del día ${dollarOficial.toFixed(2)}`}
                color="success"
                size="small"
              />
            )}
            <Tooltip title={`${nombre} - ${role}`}>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{ ml: 0.5 }}
              >
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: theme.palette.primary.main,
                    fontSize: "0.875rem",
                  }}
                >
                  {nombre ? nombre.charAt(0).toUpperCase() : "U"}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {nombre}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {role}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleMenuClose}>Mi perfil</MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>Cerrar sesión</MenuItem>
      </Menu>
    </>
  );
};
