"use client";

import { styled } from "@mui/material/styles";
import { Modal, Box, Paper, IconButton } from "@mui/material";
import { alpha } from "@mui/material/styles";

// Modal principal con backdrop mejorado
export const StyledModal = styled(Modal)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  "& .MuiBackdrop-root": {
    backgroundColor: alpha(theme.palette.common.black, 0.7),
    backdropFilter: "blur(8px)",
    transition: "all 0.3s ease-in-out",
  },
}));

// Contenedor principal del modal
export const ModalContent = styled(Paper)(({ theme }) => ({
  position: "relative",
  width: "100%",
  maxWidth: 600,
  maxHeight: "90vh",
  borderRadius: 20,
  overflow: "hidden",
  boxShadow: "0 24px 48px rgba(0, 0, 0, 0.2)",
  background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  outline: "none",
  transform: "scale(0.9)",
  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
  "&.MuiModal-root": {
    transform: "scale(1)",
  },
}));

// Header del modal con gradiente
export const ModalHeader = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(3, 4),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  borderBottom: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
  "& .MuiTypography-root": {
    fontWeight: 700,
    letterSpacing: "0.02em",
  },
}));

// Cuerpo del modal con scroll personalizado
export const ModalBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  maxHeight: "60vh",
  overflowY: "auto",
  background: "#ffffff",
  "&::-webkit-scrollbar": {
    width: 8,
  },
  "&::-webkit-scrollbar-track": {
    background: alpha(theme.palette.grey[300], 0.3),
    borderRadius: 4,
  },
  "&::-webkit-scrollbar-thumb": {
    background: alpha(theme.palette.primary.main, 0.4),
    borderRadius: 4,
    "&:hover": {
      background: alpha(theme.palette.primary.main, 0.6),
    },
  },
}));

// Footer del modal
export const ModalFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 4),
  background: alpha(theme.palette.grey[50], 0.8),
  borderTop: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`,
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(2),
  backdropFilter: "blur(10px)",
}));

// Botón de cerrar personalizado
export const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(2),
  top: theme.spacing(2),
  color: theme.palette.primary.contrastText,
  backgroundColor: alpha(theme.palette.common.white, 0.1),
  backdropFilter: "blur(10px)",
  border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
  width: 40,
  height: 40,
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.2),
    transform: "scale(1.1)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  "& .MuiSvgIcon-root": {
    fontSize: "1.2rem",
  },
}));

// Chip de estado personalizado
export const StatusChip = styled(Box)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(8),
  top: theme.spacing(2.5),
  padding: theme.spacing(0.5, 1.5),
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  backdropFilter: "blur(10px)",
  border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
  borderRadius: 20,
  color: theme.palette.primary.contrastText,
  fontSize: "0.75rem",
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  textTransform: "uppercase",
  letterSpacing: "0.05em",
}));

// Botones personalizados
export const StyledButton = styled("button")<{
  variant?: "outlined" | "contained";
  color?: "primary" | "error" | "success";
}>(({ theme, variant = "contained", color = "primary" }) => ({
  padding: theme.spacing(1.5, 3),
  borderRadius: 12,
  border: "none",
  fontSize: "0.875rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(1),
  minWidth: 120,
  height: 44,
  textTransform: "none",
  letterSpacing: "0.02em",
  position: "relative",
  overflow: "hidden",

  ...(variant === "contained" && {
    backgroundColor: theme.palette[color].main,
    color: theme.palette[color].contrastText,
    boxShadow: `0 4px 12px ${alpha(theme.palette[color].main, 0.3)}`,
    "&:hover": {
      backgroundColor: theme.palette[color].dark,
      transform: "translateY(-2px)",
      boxShadow: `0 6px 20px ${alpha(theme.palette[color].main, 0.4)}`,
    },
    "&:active": {
      transform: "translateY(0)",
    },
    "&:disabled": {
      backgroundColor: theme.palette.grey[300],
      color: theme.palette.grey[500],
      cursor: "not-allowed",
      transform: "none",
      boxShadow: "none",
    },
  }),

  ...(variant === "outlined" && {
    backgroundColor: "transparent",
    color: theme.palette[color].main,
    border: `2px solid ${theme.palette[color].main}`,
    "&:hover": {
      backgroundColor: alpha(theme.palette[color].main, 0.1),
      transform: "translateY(-1px)",
      boxShadow: `0 4px 12px ${alpha(theme.palette[color].main, 0.2)}`,
    },
    "&:disabled": {
      borderColor: theme.palette.grey[300],
      color: theme.palette.grey[500],
      cursor: "not-allowed",
      transform: "none",
      boxShadow: "none",
    },
  }),

  // Efecto de ondas
  "&::before": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 0,
    height: 0,
    borderRadius: "50%",
    background: alpha(theme.palette.common.white, 0.3),
    transform: "translate(-50%, -50%)",
    transition: "width 0.3s ease, height 0.3s ease",
  },
  "&:active::before": {
    width: "100%",
    height: "100%",
  },
}));
