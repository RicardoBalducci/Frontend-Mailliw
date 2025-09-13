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
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import { useTheme } from "@mui/material/styles";
import MaterialesServices from "../../../api/MaterialesServices"; // Assuming this path is correct
import axios from "axios"; // Import axios to check for AxiosError

interface DeleteMaterialProps {
  open: boolean;
  onClose: () => void;
  materialId: number | null;
  materialName: string;
  onDeleteSuccess: (message: string) => void;
  onDeleteError: (message: string) => void;
}

export const DeleteMaterial: React.FC<DeleteMaterialProps> = ({
  open,
  onClose,
  materialId,
  materialName,
  onDeleteSuccess,
  onDeleteError,
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const handleDeleteConfirm = async () => {
    if (materialId === null) return;

    setLoading(true);
    try {
      await MaterialesServices.delete(materialId);

      onDeleteSuccess("Material eliminado con éxito.");
      onClose(); // Close modal on success
    } catch (error) {
      console.error("Error deleting material:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          onDeleteError(
            error.response.data?.message ||
              `Error: ${error.response.status} - ${error.response.statusText}`
          );
        } else if (error.request) {
          // The request was made but no response was received
          onDeleteError(
            "No se recibió respuesta del servidor. Intenta de nuevo."
          );
        } else {
          // Something happened in setting up the request that triggered an Error
          onDeleteError(
            "Error al configurar la solicitud para eliminar el material."
          );
        }
      } else if (error instanceof Error) {
        onDeleteError(error.message);
      } else {
        onDeleteError("Ocurrió un error desconocido al eliminar el material.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-material-dialog-title"
      aria-describedby="delete-material-dialog-description"
    >
      <DialogTitle id="delete-material-dialog-title">
        <Box display="flex" alignItems="center">
          <WarningIcon sx={{ mr: 1, color: theme.palette.error.main }} />
          Confirmar Eliminación
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" id="delete-material-dialog-description">
          ¿Estás seguro de que deseas eliminar el material "
          <strong>{materialName}</strong>"? Esta acción no se puede deshacer.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleDeleteConfirm}
          color="error"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Eliminando..." : "Eliminar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
