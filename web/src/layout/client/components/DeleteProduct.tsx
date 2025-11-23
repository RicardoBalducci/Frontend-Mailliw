// src/app/products/components/DeleteProduct.tsx
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
import ProductServices from "../../../api/ProductServices";
import { useSnackbar } from "../../../components/context/SnackbarContext"; // ✅ Import

interface DeleteProductProps {
  open: boolean;
  onClose: () => void;
  productId: number | null;
  productName: string;
  onDeleteSuccess: (message: string) => void;
  onDeleteError: (message: string) => void;
}

export const DeleteProduct: React.FC<DeleteProductProps> = ({
  open,
  onClose,
  productId,
  productName,
  onDeleteSuccess,
  onDeleteError,
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar(); // ✅ Accede al método

  const handleDeleteConfirm = async () => {
    if (productId === null) return;

    setLoading(true);
    try {
      const response = await ProductServices.deleteProduct(productId);
      if (response.success) {
        showSnackbar("Producto eliminado exitosamente", "success"); // ✅ Snackbar
        onDeleteSuccess(
          response.message || "Producto eliminado correctamente."
        );
        onClose(); // Cierra el modal
      } else {
        onDeleteError(response.message || "Error al eliminar el producto.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      onDeleteError("Error de conexión al eliminar el producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-product-dialog-title"
      aria-describedby="delete-product-dialog-description"
    >
      <DialogTitle id="delete-product-dialog-title">
        <Box display="flex" alignItems="center">
          <WarningIcon sx={{ mr: 1, color: theme.palette.error.main }} />
          Confirmar Eliminación
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" id="delete-product-dialog-description">
          ¿Estás seguro de que deseas eliminar el producto "
          <strong>{productName}</strong>"? Esta acción no se puede deshacer.
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
