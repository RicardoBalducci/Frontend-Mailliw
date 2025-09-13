import React, { useEffect, useState } from "react";
import {
  Alert, // Add Alert for error/success messages
  Box,
  Chip, // Add Chip for the "Editar Proveedor" label
  CircularProgress,
  Fade, // For transition effect
  IconButton,
  InputAdornment, // For icons inside text fields
  Stack, // For consistent spacing
  Typography,
} from "@mui/material";
// Import common styled components from your theme file
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  StyledButton,
  StyledModal,
  StyledTextField,
} from "../../../theme/StyledModalComponents"; // Ensure correct path

import EditIcon from "@mui/icons-material/Edit"; // Icon for "Editar Proveedor" chip
import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business"; // Icon for "Proveedor"
import PhoneIcon from "@mui/icons-material/Phone"; // Icon for "Telefono"
import LocationOnIcon from "@mui/icons-material/LocationOn"; // Icon for "Direccion"
import DescriptionIcon from "@mui/icons-material/Description"; // Icon for "Catalogo"

import { ProveedorDto, ProveedorUpdateDto } from "../../../Dto/Proveedor.dto";
import ProveedorServices from "../../../api/ProveedorServices";

interface ProveedorUpdateProps {
  open: boolean;
  onClose: () => void;
  proveedorToEdit: ProveedorDto | null;
  onUpdateSuccess: (message: string) => void;
  onUpdateError: (message: string) => void;
}

export const ProveedorUpdate: React.FC<ProveedorUpdateProps> = ({
  open,
  onClose,
  proveedorToEdit,
  onUpdateSuccess,
  onUpdateError,
}) => {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [catalogo, setCatalogo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); // New state for success message

  useEffect(() => {
    if (open && proveedorToEdit) {
      // Only populate if modal is open and proveedorToEdit is available
      setNombre(proveedorToEdit.nombre || "");
      setTelefono(proveedorToEdit.telefono || "");
      setDireccion(proveedorToEdit.direccion || "");
      setCatalogo(proveedorToEdit.catalogo || "");
      setError(null); // Clear previous error
      setSuccess(null); // Clear previous success
    } else if (!open) {
      // Clear form when modal closes
      setNombre("");
      setTelefono("");
      setDireccion("");
      setCatalogo("");
      setError(null);
      setSuccess(null);
    }
  }, [proveedorToEdit, open]); // Re-run when `proveedorToEdit` or `open` changes

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!proveedorToEdit) return; // Should not happen if modal is opened correctly

    setError(null);
    setSuccess(null); // Clear previous messages

    if (!nombre) {
      // Nombre is required for update as well
      setError("Por favor, completa el campo de nombre.");
      return;
    }

    setLoading(true);

    const updatedProveedorData: ProveedorUpdateDto = {
      nombre,
      telefono: telefono || null,
      direccion: direccion || null,
      catalogo: catalogo || null,
    };

    try {
      await ProveedorServices.update(proveedorToEdit.id, updatedProveedorData);
      setSuccess(`Proveedor "${nombre}" actualizado exitosamente.`); // Set success message
      onUpdateSuccess(`Proveedor "${nombre}" actualizado exitosamente.`); // Call parent success handler

      // Close modal after a short delay to show success message
      setTimeout(() => {
        onClose();
      }, 500); // Adjust delay as needed
    } catch (err) {
      const errorMessage =
        "Ocurrió un error inesperado al actualizar el proveedor.";
      setError(errorMessage);
      onUpdateError(errorMessage); // Call parent error handler
      console.error("Error updating proveedor:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledModal
      open={open}
      onClose={onClose}
      closeAfterTransition // Enable fade transition
      aria-labelledby="update-proveedor-modal-title"
      aria-describedby="update-proveedor-modal-description"
    >
      <Fade in={open}>
        <ModalContent>
          {/* HEADER */}
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
                <BusinessIcon /> {/* Icon for suppliers */}
              </Box>
              <Typography variant="h5" component="h2" fontWeight={600}>
                {"Actualizar Proveedor"}
              </Typography>
            </Box>
            <IconButton
              aria-label="close"
              onClick={onClose}
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
              label={"Editar Proveedor"}
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
            <Stack spacing={3} component="form" onSubmit={handleSubmit}>
              {" "}
              {/* Use Stack for spacing and make it a form */}
              <StyledTextField
                label="Nombre del Proveedor"
                variant="outlined"
                fullWidth
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                label="Teléfono"
                variant="outlined"
                fullWidth
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                label="Dirección"
                variant="outlined"
                fullWidth
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                label="Catálogo (URL/PDF)"
                variant="outlined"
                fullWidth
                value={catalogo}
                onChange={(e) => setCatalogo(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </ModalBody>

          {/* FOOTER */}
          <ModalFooter>
            <StyledButton
              variant="outlined"
              color="primary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </StyledButton>
            <StyledButton
              type="submit" // Set type to submit for form submission
              variant="contained"
              color="primary"
              onClick={handleSubmit} // Call handleSubmit when button is clicked
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Actualizar Proveedor"
              )}
            </StyledButton>
          </ModalFooter>
        </ModalContent>
      </Fade>
    </StyledModal>
  );
};
