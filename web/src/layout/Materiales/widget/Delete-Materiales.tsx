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
import MaterialesServices from "../../../api/MaterialesServices";
import { useSnackbar } from "../../../components/context/SnackbarContext";

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

  const { showSnackbar } = useSnackbar(); // ✅ obtener showSnackbar

  const handleDeleteConfirm = async () => {
    if (materialId === null) return;

    setLoading(true);
    try {
      await MaterialesServices.delete(materialId);

      // Mostrar snackbar al eliminar
      showSnackbar("Material eliminado exitosamente", "success");

      onDeleteSuccess("Material eliminado con éxito.");
      onClose(); // Cerrar modal
    } catch (error) {
      console.error("Error deleting material:", error);
      onDeleteError("Ocurrió un error al eliminar el material.");
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
