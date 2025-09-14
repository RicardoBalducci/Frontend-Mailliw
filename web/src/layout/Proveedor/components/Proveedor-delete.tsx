// src/pages/Proveedor/widget/Delete-Proveedor.tsx
import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";

import ProveedorServices from "../../../api/ProveedorServices";

// Styled components (reused from Materiales-add for consistency)
const StyledModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[24],
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  outline: "none",
}));

const ModalHeader = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const ButtonGroup = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  gap: "8px",
  marginTop: "16px",
});

interface ProveedorDeleteProps {
  open: boolean;
  onClose: () => void;
  proveedorId: number | null;
  proveedorName: string;
  onDeleteSuccess: (message: string) => void;
  onDeleteError: (message: string) => void;
}

export const ProveedorDelete: React.FC<ProveedorDeleteProps> = ({
  open,
  onClose,
  proveedorId,
  proveedorName,
  onDeleteSuccess,
  onDeleteError,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!proveedorId) return;

    setLoading(true);
    setError(null);

    try {
      await ProveedorServices.remove(proveedorId);
      onDeleteSuccess(`Proveedor "${proveedorName}" eliminado exitosamente.`);
      onClose(); // Close modal
    } catch (err: unknown) {
      const errorMessage =
        "Ocurrió un error inesperado al eliminar el proveedor.";
      setError(errorMessage);
      onDeleteError(errorMessage);
      console.error("Error deleting proveedor:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="delete-proveedor-modal"
    >
      <StyledModalBox>
        <ModalHeader>
          <Typography variant="h6" component="h2">
            Confirmar Eliminación
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </ModalHeader>
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Typography variant="body1">
          ¿Estás seguro de que quieres eliminar al proveedor{" "}
          <Typography component="span" fontWeight="bold">
            "{proveedorName}"
          </Typography>
          ? Esta acción no se puede deshacer.
        </Typography>
        <ButtonGroup>
          <Button
            variant="outlined"
            color="inherit"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </Button>
        </ButtonGroup>
      </StyledModalBox>
    </Modal>
  );
};
