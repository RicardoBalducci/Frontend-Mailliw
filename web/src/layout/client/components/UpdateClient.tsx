"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Fade,
  IconButton,
  Chip,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import HomeIcon from "@mui/icons-material/Home";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email"; // Added Email Icon
import ClientServices from "../../../api/ClientServices";
import { styled, useTheme, alpha } from "@mui/material/styles";

// Styled components (reusing from your ClientModal for consistency)
const StyledModal = styled(Modal)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const ModalContent = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "600px",
  maxWidth: "95vw",
  maxHeight: "90vh",
  overflowY: "auto",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0 8px 40px rgba(0, 0, 0, 0.12)",
  padding: 0,
  "&:focus": {
    outline: "none",
  },
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  borderTopLeftRadius: theme.shape.borderRadius * 2,
  borderTopRightRadius: theme.shape.borderRadius * 2,
  position: "relative",
}));

const ModalBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const ModalFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 3,
  padding: "10px 24px",
  fontWeight: 600,
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.12)",
  transition: "all 0.3s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius,
    transition: "all 0.3s",
    "&:hover": {
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    },
    "&.Mui-focused": {
      boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.25)}`,
    },
  },
}));

// Reusing your ClientData interface
export interface ClientData {
  id: number;
  rif: string;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  email: string;
}

interface UpdateClientModalProps {
  open: boolean;
  onClose: () => void;
  client: ClientData | null; // This will be the client data to edit
  onRefresh: () => void; // To refresh the client list after update
}

const UpdateClientModal: React.FC<UpdateClientModalProps> = ({
  open,
  onClose,
  client,
  onRefresh,
}) => {
  const theme = useTheme();

  const [formData, setFormData] = useState<ClientData>({
    id: 0,
    rif: "",
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    email: "",
  });
  const [rifType, setRifType] = useState("V");
  const [rifNumber, setRifNumber] = useState(""); // Separated RIF number
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );
  const [showErrors, setShowErrors] = useState(false); // For form validation

  useEffect(() => {
    if (client) {
      setFormData(client);
      const rifParts = client.rif.split("-");
      setRifType(rifParts[0] || "V");
      setRifNumber(rifParts[1] || "");
    } else {
      // Reset form if no client provided (though this modal is for updating)
      setFormData({
        id: 0,
        rif: "",
        nombre: "",
        apellido: "",
        direccion: "",
        telefono: "",
        email: "",
      });
      setRifType("V");
      setRifNumber("");
    }
    // Reset validation and alerts when modal opens/closes
    setShowErrors(false);
    setAlertOpen(false);
  }, [client, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRifTypeChange = (e: any) => {
    // Use 'any' or more specific type if known for Select
    setRifType(e.target.value);
  };

  const handleRifNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRifNumber(e.target.value.replace(/\D/g, "")); // Allow only digits
  };

  const validateForm = () => {
    let isValid = true;
    setShowErrors(true); // Show errors for all fields on submit attempt

    if (
      !rifNumber ||
      !formData.nombre ||
      !formData.direccion ||
      !formData.telefono
    ) {
      isValid = false;
    }
    if (rifType === "R" && !formData.apellido) {
      isValid = false;
    }
    // You can add more complex email validation if needed
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setAlertMessage("Por favor, complete todos los campos requeridos.");
      setAlertSeverity("error");
      setAlertOpen(true);
      return;
    }

    setLoading(true);
    try {
      const updatedClientData = {
        ...formData,
        rif: `${rifType}-${rifNumber}`, // Combine type and number
      };

      const response = await ClientServices.updateCliente(
        updatedClientData.id,
        updatedClientData
      );

      if (response.success) {
        setAlertMessage("Cliente actualizado correctamente.");
        setAlertSeverity("success");
        setAlertOpen(true);
        onRefresh(); // Refresh the parent table data
        setTimeout(() => onClose(), 1500); // Close modal after a short delay
      } else {
        setAlertMessage(response.message || "Error al actualizar el cliente.");
        setAlertSeverity("error");
        setAlertOpen(true);
      }
    } catch (error) {
      console.error("Error updating client:", error);
      setAlertMessage("Ocurrió un error inesperado al actualizar el cliente.");
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  if (!client) {
    return null; // Don't render the modal if no client data is provided
  }

  const isCompany = rifType === "E" || rifType === "R";

  return (
    <>
      <StyledModal
        open={open}
        onClose={onClose}
        closeAfterTransition
        aria-labelledby="update-modal-title"
        aria-describedby="update-modal-description"
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
                  {isCompany ? <BusinessIcon /> : <PersonIcon />}
                </Box>
                <Typography variant="h5" component="h2" fontWeight={600}>
                  Modificar Cliente
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
                label={isCompany ? "Empresa" : "Personal"}
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
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {/* RIF Type (Select) */}
                    <TextField
                      select
                      label="Tipo de RIF"
                      value={rifType}
                      onChange={handleRifTypeChange}
                      variant="outlined"
                      sx={{
                        minWidth: 100, // Adjusted minWidth
                        bgcolor: "background.paper",
                        borderRadius: 1,
                        boxShadow: 1,
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    >
                      <option value="V">V - Personal</option>
                      <option value="E">E - Empresa</option>
                      <option value="R">R - Empresa</option>
                    </TextField>

                    {/* RIF Number */}
                    <StyledTextField
                      label="Número de RIF"
                      variant="outlined"
                      fullWidth
                      value={rifNumber}
                      onChange={handleRifNumberChange}
                      error={showErrors && !rifNumber}
                      helperText={
                        showErrors && !rifNumber ? "Campo requerido" : ""
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography fontWeight={600} color="primary">
                              {rifType}-
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        bgcolor: "background.paper",
                        borderRadius: 1,
                        boxShadow: 1,
                      }}
                    />
                  </Box>
                  <StyledTextField
                    label="Nombre"
                    name="nombre"
                    variant="outlined"
                    fullWidth
                    value={formData.nombre}
                    onChange={handleChange}
                    error={showErrors && !formData.nombre}
                    helperText={
                      showErrors && !formData.nombre ? "Campo requerido" : ""
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <StyledTextField
                    label={isCompany ? "Razón Social" : "Apellido"}
                    name="apellido"
                    variant="outlined"
                    fullWidth
                    value={formData.apellido}
                    onChange={handleChange}
                    error={showErrors && rifType === "R" && !formData.apellido}
                    helperText={
                      showErrors && rifType === "R" && !formData.apellido
                        ? "Campo requerido"
                        : isCompany && rifType !== "R"
                        ? "Opcional para empresas tipo E"
                        : ""
                    }
                  />
                  <StyledTextField
                    label="Dirección"
                    name="direccion"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={2}
                    value={formData.direccion}
                    onChange={handleChange}
                    error={showErrors && !formData.direccion}
                    helperText={
                      showErrors && !formData.direccion ? "Campo requerido" : ""
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <StyledTextField
                    label="Teléfono"
                    name="telefono"
                    variant="outlined"
                    fullWidth
                    value={formData.telefono}
                    onChange={handleChange}
                    error={showErrors && !formData.telefono}
                    helperText={
                      showErrors && !formData.telefono ? "Campo requerido" : ""
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <StyledTextField
                    label="Email (Opcional)"
                    name="email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <ModalFooter sx={{ justifyContent: "space-between" }}>
                  <StyledButton
                    onClick={onClose}
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    disabled={loading}
                    sx={{ flexGrow: 1, marginRight: 1 }}
                  >
                    Cancelar
                  </StyledButton>
                  <StyledButton
                    type="submit" // Make it a submit button for the form
                    variant="contained"
                    color="primary"
                    startIcon={
                      loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <SaveIcon />
                      )
                    }
                    disabled={loading}
                    sx={{ flexGrow: 1 }}
                  >
                    {loading ? "Guardando..." : "Actualizar"}
                  </StyledButton>
                </ModalFooter>
              </form>
            </ModalBody>
            {alertOpen && (
              <Alert
                severity={alertSeverity}
                onClose={() => setAlertOpen(false)}
                style={{
                  position: "absolute",
                  bottom: 20,
                  left: 20,
                  right: 20,
                }}
              >
                {alertMessage}
              </Alert>
            )}
          </ModalContent>
        </Fade>
      </StyledModal>
    </>
  );
};

export default UpdateClientModal;
