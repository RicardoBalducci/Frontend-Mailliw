import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Select,
  MenuItem,
  alpha,
  Fade,
  IconButton,
  Chip,
  InputAdornment,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import HomeIcon from "@mui/icons-material/Home";
import PhoneIcon from "@mui/icons-material/Phone";
import ClientServices from "../../../api/ClientServices";
import { styled, useTheme } from "@mui/material/styles";

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

interface Client {
  rif: string;
  nombre: string;
  apellido?: string;
  direccion: string;
  telefono: string;
  email: string;
}

interface ClientModalProps {
  open: boolean;
  onClose: () => void;
  currentClient?: Client | null;
  onRefresh: () => void;
}

const ClientModal: React.FC<ClientModalProps> = ({
  open,
  onClose,
  currentClient,
  onRefresh,
}) => {
  const theme = useTheme();
  const [rifType, setRifType] = useState("V");
  const [rif, setRif] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState(""); // Estado para el mensaje de alerta
  const [alertOpen, setAlertOpen] = useState(false);
  // Removed unused alertMessage state

  const [showErrors, setShowErrors] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentClient) {
      const rifParts = currentClient.rif.split("-");
      setRifType(rifParts[0]);
      setRif(rifParts[1] || "");
      setNombre(currentClient.nombre);
      setApellido(currentClient.apellido || "");
      setDireccion(currentClient.direccion);
      setTelefono(currentClient.telefono);
    } else {
      // Reset fields if no client is selected
      setRifType("V");
      setRif("");
      setNombre("");
      setApellido("");
      setDireccion("");
      setTelefono("");
    }
    // Reset errors and alerts when modal opens/closes
    setShowErrors(false);
    setAlertVisible(false);
  }, [currentClient, open]);

  const isCompany = rifType === "E" || rifType === "R";

  const handleSave = async () => {
    setShowErrors(true);
    setSaving(true);
    if (
      !rif ||
      !nombre ||
      !direccion ||
      !telefono ||
      (rifType === "R" && !apellido)
    ) {
      setSaving(false);
      return;
    }

    const cliente = {
      rif: `${rifType}-${rif}`,
      nombre,
      apellido: apellido || "",
      direccion,
      telefono,
    };

    try {
      if (currentClient) {
        const response = await ClientServices.updateCliente(
          currentClient.id,
          cliente
        );
        if (response.success) {
          onRefresh();
          onClose();
          setAlertMessage("Cliente eliminado correctamente."); // Mensaje de éxito
          setAlertOpen(true);
          setSaving(false);
        }
      } else {
        const response = await ClientServices.createCliente(cliente);
        if (response.success) {
          onRefresh();
          onClose();
          setAlertMessage("Cliente eliminado correctamente."); // Mensaje de éxito
          setAlertOpen(true);
          setSaving(false);
        }
      }
    } catch (error) {
      console.error("Error al guardar el cliente:", error);
    }
  };

  return (
    <>
      <StyledModal
        open={open}
        onClose={onClose}
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
                  {isCompany ? <BusinessIcon /> : <PersonIcon />}
                </Box>
                <Typography variant="h5" component="h2" fontWeight={600}>
                  {currentClient ? "Modificar Cliente" : "Añadir Cliente"}
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
              {alertVisible && (
                <Alert
                  severity={alertSeverity}
                  onClose={() => setAlertVisible(false)}
                  sx={{ mb: 3 }}
                >
                  {/* Removed unused alertMessage */}
                </Alert>
              )}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Select
                    labelId="rif-type-label"
                    value={rifType}
                    onChange={(e) => {
                      setRifType(e.target.value);
                    }}
                    label="Tipo de RIF"
                    startAdornment={
                      <InputAdornment position="start">
                        <BadgeIcon fontSize="small" />
                      </InputAdornment>
                    }
                    sx={{
                      minWidth: 250,
                      bgcolor: "background.paper",
                      borderRadius: 1,
                      boxShadow: 1,
                    }}
                  >
                    <MenuItem value="V">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <PersonIcon
                          fontSize="small"
                          sx={{ mr: 1, color: theme.palette.info.main }}
                        />
                        <Typography>V - Personal</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="E">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <BusinessIcon
                          fontSize="small"
                          sx={{ mr: 1, color: theme.palette.success.main }}
                        />
                        <Typography>E - Empresa</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="R">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <BusinessIcon
                          fontSize="small"
                          sx={{ mr: 1, color: theme.palette.success.main }}
                        />
                        <Typography>R - Empresa</Typography>
                      </Box>
                    </MenuItem>
                  </Select>
                  <StyledTextField
                    label="Número de RIF"
                    variant="outlined"
                    fullWidth
                    value={rif}
                    onChange={(e) => setRif(e.target.value.replace(/\D/g, ""))}
                    error={showErrors && !rif}
                    helperText={showErrors && !rif ? "Campo requerido" : ""}
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
                  variant="outlined"
                  fullWidth
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  error={showErrors && !nombre}
                  helperText={showErrors && !nombre ? "Campo requerido" : ""}
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
                  variant="outlined"
                  fullWidth
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  error={showErrors && rifType === "R" && !apellido}
                  helperText={
                    showErrors && rifType === "R" && !apellido
                      ? "Campo requerido"
                      : isCompany && rifType !== "R"
                      ? "Opcional para empresas tipo E"
                      : ""
                  }
                />
                <StyledTextField
                  label="Dirección"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={2}
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  error={showErrors && !direccion}
                  helperText={showErrors && !direccion ? "Campo requerido" : ""}
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
                  variant="outlined"
                  fullWidth
                  value={telefono}
                  onChange={(e) =>
                    setTelefono(e.target.value.replace(/[^\d+\-\s()]/g, ""))
                  }
                  error={showErrors && !telefono}
                  helperText={showErrors && !telefono ? "Campo requerido" : ""}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </ModalBody>
            <ModalFooter sx={{ justifyContent: "space-between" }}>
              <StyledButton
                onClick={onClose}
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                disabled={saving}
                sx={{ flexGrow: 1, marginRight: 1 }} // Espacio flexible
              >
                Cancelar
              </StyledButton>
              <StyledButton
                onClick={handleSave}
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                disabled={saving}
                sx={{ flexGrow: 1 }} // Espacio flexible
              >
                {saving
                  ? "Guardando..."
                  : currentClient
                  ? "Actualizar"
                  : "Guardar"}
              </StyledButton>
            </ModalFooter>
            {alertOpen && (
              <Alert
                severity={alertMessage.includes("Error") ? "error" : "success"}
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

export default ClientModal;
