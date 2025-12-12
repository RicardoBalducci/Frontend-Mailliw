"use client";

import { IconButton, Badge, Menu, Typography, Box, CircularProgress, Chip } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import { useState, useContext } from "react";
import { NotificationsContext } from "./NotificationsContext";
import { motion } from "framer-motion";

type TipoNotificacion = "producto" | "material" | string;

export default function NotificationMenu() {
  const { notificaciones, loading, refrescarNotificaciones } = useContext(NotificationsContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    // No es obligatorio refrescar aquí si ya lo haces globalmente
     refrescarNotificaciones();
  };

  const handleClose = () => setAnchorEl(null);

  const getIcon = (tipo: TipoNotificacion) => {
    switch (tipo) {
      case "producto": return <Inventory2Icon fontSize="small" sx={{ color: "#7c3aed" }} />;
      case "material": return <PrecisionManufacturingIcon fontSize="small" sx={{ color: "#a855f7" }} />;
      default: return <NotificationsIcon fontSize="small" sx={{ color: "#a78bfa" }} />;
    }
  };

  const getChip = (tipo: TipoNotificacion) => {
    switch (tipo) {
      case "producto": return <Chip label="Producto" size="small" sx={{ bgcolor: "#ede9fe", color: "#5b21b6", fontWeight: 600, border: "1px solid #c4b5fd" }} />;
      case "material": return <Chip label="Material" size="small" sx={{ bgcolor: "#f5f3ff", color: "#7c3aed", fontWeight: 600, border: "1px solid #ddd6fe" }} />;
      default: return <Chip label="General" size="small" sx={{ bgcolor: "#f3f4f6", color: "#6b7280", fontWeight: 600, border: "1px solid #d1d5db" }} />;
    }
  };

  return (
    <>
      <motion.div whileTap={{ scale: 0.85 }}>
        <IconButton color="inherit" onClick={handleOpen}>
          <Badge badgeContent={notificaciones.length} sx={{ "& .MuiBadge-badge": { backgroundColor: "#ff0000", color: "white" } }}>
            <NotificationsIcon sx={{ color: "#7c3aed" }} />
          </Badge>
        </IconButton>
      </motion.div>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} PaperProps={{ sx: { width: 480, borderRadius: 4, boxShadow: "0px 10px 30px rgba(124, 58, 237, 0.25)", background: "linear-gradient(135deg, #faf5ff 0%, #ede9fe 100%)", p: 0, border: "1px solid #e9d5ff" } }}>
        <Box sx={{ px: 3, py: 2 }}>
          <Typography variant="h6" fontWeight={700} sx={{ background: "linear-gradient(to right, #7c3aed, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            🔔 Notificaciones
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5 }}>Alertas de stock en productos y materiales</Typography>
        </Box>

        {loading ? (
          <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
            <CircularProgress size={24} sx={{ color: "#7c3aed" }} />
          </Box>
        ) : notificaciones.length === 0 ? (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>No hay notificaciones pendientes</Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: 360, overflowY: "auto", px: 2 }}>
            {notificaciones.map((n) => (
              <motion.div key={`${n.tipo}-${n.id}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.02 }} transition={{ duration: 0.25 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, p: 2, mb: 1.4, backgroundColor: "rgba(255,255,255,0.6)", borderRadius: 3, border: "1px solid #e9d5ff", boxShadow: "0px 2px 8px rgba(124, 58, 237, 0.15)", backdropFilter: "blur(8px)" }}>
                  {getIcon(n.tipo)}
                  <Box sx={{ flexGrow: 1 }}>
                    {getChip(n.tipo)}
                    <Typography fontWeight={700} fontSize={15} sx={{ mt: 0.5, color: "#4c1d95" }}>{n.nombre}</Typography>
                    <Typography fontSize={13} sx={{ mt: 0.5, color: "#b91c1c" }}>{n.mensaje}</Typography>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>
        )}
      </Menu>
    </>
  );
}
