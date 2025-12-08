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
  Divider,
  Chip,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationMenu from "./NotificationMenu";
import { motion } from "framer-motion";

interface AppBarProps {
  toggleSidebar: () => void;
}

export const ModernAppBar: React.FC<AppBarProps> = ({ toggleSidebar }) => {
  const [nombre, setNombre] = useState("");
  const [role, setRole] = useState("");
  const [dollarOficial, setDollarOficial] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const theme = useTheme();

  useEffect(() => {
    setNombre(localStorage.getItem("nombre") || "");
    setRole(localStorage.getItem("role") || "");
    const dollar = localStorage.getItem("dollar_oficial");
    if (dollar) setDollarOficial(Number(dollar));
  }, []);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  return (
    <>
      {/* =====================================================
          🔮 MODERN APP BAR (GLASS + MORADO + SOMBRAS SUAVES)
      ====================================================== */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backdropFilter: "blur(10px)",
          background: "rgba(255,255,255,0.65)",
          borderBottom: "1px solid rgba(124,58,237,0.15)",
          boxShadow: "0px 4px 20px rgba(124, 58, 237, 0.15)",
          color: theme.palette.text.primary,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: { xs: 1, md: 2 },
          }}
        >
          {/* ---------------- LEFT PART ---------------- */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <motion.div whileTap={{ scale: 0.85 }}>
              <IconButton
                color="primary"
                sx={{
                  bgcolor: "rgba(124,58,237,0.1)",
                  "&:hover": { bgcolor: "rgba(124,58,237,0.2)" },
                }}
                onClick={toggleSidebar}
              >
                <MenuIcon sx={{ color: "#7c3aed" }} />
              </IconButton>
            </motion.div>

            <Typography
              variant="h5"
              sx={{
                background: "#1a73e8 ",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: { xs: "none", sm: "block" },
              }}
            >
              BlueLock
            </Typography>
          </Box>

          {/* ---------------- RIGHT PART ---------------- */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* 💵 CHIP DEL DÓLAR */}
            {dollarOficial && (
              <Chip
                label={`BCV: ${dollarOficial.toFixed(2)}`}
                size="small"
                sx={{
                  fontWeight: 700,
                  color: "#4c1d95",
                  bgcolor: "#ede9fe",
                  border: "1px solid #c4b5fd",
                  boxShadow: "0 2px 6px rgba(124,58,237,0.2)",
                }}
              />
            )}

            {/* 🔔 COMPONENTE DE NOTIFICACIONES */}
            <NotificationMenu />

            {/* 👤 PERFIL */}
            <Tooltip title={`${nombre} • ${role}`} arrow>
              <motion.div whileTap={{ scale: 0.9 }}>
                <IconButton onClick={handleProfileMenuOpen}>
                  <Avatar
                    sx={{
                      bgcolor: "#7c3aed",
                      boxShadow: "0px 4px 12px rgba(124,58,237,0.4)",
                      border: "2px solid #c4b5fd",
                    }}
                  >
                    {nombre ? nombre[0].toUpperCase() : "U"}
                  </Avatar>
                </IconButton>
              </motion.div>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ---------------- PROFILE MENU ---------------- */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography fontWeight={700} color="primary">
            {nombre}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {role}
          </Typography>
        </Box>

        <Divider />

        <MenuItem onClick={handleMenuClose}>Mi perfil</MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
          Cerrar sesión
        </MenuItem>
      </Menu>
    </>
  );
};
