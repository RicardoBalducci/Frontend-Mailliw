// src/pages/Materiales/widget/Materiales-update.tsx
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Fade,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";

// Import your custom styled components for the modal and text fields
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  StyledButton,
  StyledModal,
  StyledTextField,
} from "../../../theme/StyledModalComponents"; // Adjust path as needed

// Import icons for consistency
import EditIcon from "@mui/icons-material/Edit"; // Icon for the header chip
import CloseIcon from "@mui/icons-material/Close"; // Close icon for the modal header
import DescriptionIcon from "@mui/icons-material/Description"; // Icon for description and name
import InventoryIcon from "@mui/icons-material/Inventory"; // Icon for stock
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; // Icon for price

import { MaterialesDto } from "../../../Dto/Materiales.dto";
import MaterialesServices from "../../../api/MaterialesServices";
import axios from "axios";

interface MaterialUpdateProps {
  open: boolean;
  onClose: () => void;
  materialToEdit: MaterialesDto | null; // This will hold the material's current data
  onUpdateSuccess: (message: string) => void; // Parent handles toast
  onUpdateError: (message: string) => void; // Parent handles toast
}

export function MaterialUpdate({
  open,
  onClose,
  materialToEdit,
  onUpdateSuccess,
  onUpdateError,
}: MaterialUpdateProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [stock, setStock] = useState<number | string>("");
  const [precioUnitario, setPrecioUnitario] = useState<number | string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // State to manage individual field errors for display
  const [nombreError, setNombreError] = useState<string | null>(null);
  const [descripcionError, setDescripcionError] = useState<string | null>(null);
  const [stockError, setStockError] = useState<string | null>(null);
  const [precioUnitarioError, setPrecioUnitarioError] = useState<string | null>(
    null
  );

  // Populate form fields when materialToEdit changes or modal opens
  useEffect(() => {
    if (open && materialToEdit) {
      setNombre(materialToEdit.nombre);
      setDescripcion(materialToEdit.descripcion);
      setStock(materialToEdit.stock);
      setPrecioUnitario(materialToEdit.precio_unitario);
      // Clear any previous errors or success messages when opening
      setError(null);
      setSuccess(null);
      clearFieldErrors();
    } else if (!open) {
      // Reset form fields and errors when modal closes
      setNombre("");
      setDescripcion("");
      setStock("");
      setPrecioUnitario("");
      setError(null);
      setSuccess(null);
      clearFieldErrors();
    }
  }, [open, materialToEdit]);

  // Helper function to clear all field-specific errors
  const clearFieldErrors = () => {
    setNombreError(null);
    setDescripcionError(null);
    setStockError(null);
    setPrecioUnitarioError(null);
  };

  const handleUpdateMaterial = async () => {
    clearFieldErrors(); // Clear errors on each submission attempt
    let isValid = true;

    if (!nombre) {
      setNombreError("El nombre es obligatorio.");
      isValid = false;
    } else if (nombre.length > 100) {
      setNombreError("El nombre no debe exceder 100 caracteres.");
      isValid = false;
    }

    if (descripcion && descripcion.length > 500) {
      setDescripcionError("La descripción no debe exceder 500 caracteres.");
      isValid = false;
    }

    if (stock === "" || isNaN(Number(stock)) || Number(stock) < 0) {
      setStockError(
        "El stock es obligatorio y debe ser un número entero no negativo."
      );
      isValid = false;
    } else if (!Number.isInteger(Number(stock))) {
      setStockError("El stock debe ser un número entero.");
      isValid = false;
    }

    if (
      precioUnitario === "" ||
      isNaN(Number(precioUnitario)) ||
      Number(precioUnitario) < 0
    ) {
      setPrecioUnitarioError(
        "El precio unitario es obligatorio y debe ser un número no negativo."
      );
      isValid = false;
    }

    if (!isValid) {
      setError("Por favor, corrige los errores en el formulario.");
      return;
    }

    if (!materialToEdit?.id) {
      onUpdateError("No se encontró el ID del material para actualizar.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const updatedMaterialData: MaterialesDto = {
      id: materialToEdit.id, // Ensure ID is passed for update
      nombre,
      descripcion,
      stock: Number(stock),
      precio_unitario: Number(precioUnitario),
    };

    try {
      await MaterialesServices.update(materialToEdit.id, updatedMaterialData);
      setSuccess("Material actualizado exitosamente!");
      onUpdateSuccess(`Material "${nombre}" actualizado con éxito.`); // Notify parent for toast
      setTimeout(() => {
        onClose(); // Close modal via parent's onClose
      }, 150);
    } catch (err: unknown) {
      // Change err type from 'any' to 'unknown'
      let errorMessage =
        "Ocurrió un error inesperado al actualizar el material.";

      // Check if the error is an AxiosError
      if (axios.isAxiosError(err)) {
        // Check if there's a response and data in the error
        if (
          err.response &&
          err.response.data &&
          typeof err.response.data.message === "string"
        ) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        // For other standard JavaScript errors
        errorMessage = err.message;
      }

      setError(errorMessage);
      onUpdateError(errorMessage); // Notify parent for toast
      console.error("Error updating material:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose(); // Call the parent's onClose which also handles state reset
  };

  return (
    <StyledModal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Fade in={open}>
        <ModalContent>
          <ModalHeader>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  mr: 2,
                  p: 1,
                  bgcolor: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                }}
              >
                <EditIcon />
              </Box>
              <Typography variant="h5" component="h2" fontWeight={600}>
                {"Modificar Material"}
              </Typography>
            </Box>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "white",
              }}
            >
              <CloseIcon />
            </IconButton>
            <Chip
              label={"Editar Material"}
              icon={<EditIcon />}
              size="small"
              sx={{
                position: "absolute",
                right: 48,
                top: 12,
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 500,
              }}
            />
          </ModalHeader>

          {/* BODY */}
          <ModalBody>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Modificando el material: <strong>{materialToEdit?.nombre}</strong>
            </Typography>
            <Stack spacing={3}>
              <StyledTextField
                label="Nombre del Material"
                variant="outlined"
                fullWidth
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  setNombreError(null); // Clear error on change
                }}
                error={!!nombreError}
                helperText={nombreError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                label="Descripción del Material"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={descripcion}
                onChange={(e) => {
                  setDescripcion(e.target.value);
                  setDescripcionError(null); // Clear error on change
                }}
                error={!!descripcionError}
                helperText={descripcionError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                label="Stock"
                variant="outlined"
                fullWidth
                type="number"
                value={stock}
                onChange={(e) => {
                  setStock(e.target.value);
                  setStockError(null); // Clear error on change
                }}
                error={!!stockError}
                helperText={stockError}
                InputProps={{
                  inputProps: { min: 0 },
                  startAdornment: (
                    <InputAdornment position="start">
                      <InventoryIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                label="Precio Unitario"
                variant="outlined"
                fullWidth
                type="number"
                value={precioUnitario}
                onChange={(e) => {
                  setPrecioUnitario(e.target.value);
                  setPrecioUnitarioError(null); // Clear error on change
                }}
                error={!!precioUnitarioError}
                helperText={precioUnitarioError}
                InputProps={{
                  inputProps: { min: 0, step: "0.01" },
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </ModalBody>

          <ModalFooter>
            <StyledButton
              variant="outlined"
              color="primary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </StyledButton>
            <StyledButton
              variant="contained"
              color="primary"
              onClick={handleUpdateMaterial}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Guardar Cambios"
              )}
            </StyledButton>
          </ModalFooter>
        </ModalContent>
      </Fade>
    </StyledModal>
  );
}
