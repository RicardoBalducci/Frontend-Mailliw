"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Box,
  useTheme,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  color?: "error" | "warning" | "info" | "success" | "primary";
  icon?: React.ReactNode;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  description = "¿Estás seguro de que deseas continuar? Esta acción no se puede deshacer.",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  color = "error",
  icon,
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onClose(); // Cierra automáticamente
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !loading && onClose()}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">
        <Box display="flex" alignItems="center">
          {icon || (
            <WarningIcon sx={{ mr: 1, color: theme.palette[color].main }} />
          )}
          {title}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" id="confirm-dialog-description">
          {description}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          {cancelText}
        </Button>

        <Button
          onClick={handleConfirm}
          color={color}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? `${confirmText}...` : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
