import { useEffect, useState } from "react";
import { UserDto } from "../interface/user.dto";
import UserServices from "../../../api/UserSevices";
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  StyledButton,
  StyledModal,
  StyledTextField,
} from "../../../theme/StyledModalComponents";
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
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EngineeringIcon from "@mui/icons-material/Engineering"; // More appropriate icon for technicians
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

interface TecnicoAddProps {
  open: boolean;
  onClose: () => void;
  onTecnicoAdded?: () => void;
}

export function TecnicoAdd({ open, onClose, onTecnicoAdded }: TecnicoAddProps) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddProduct = async () => {
    if (!nombre || !apellido || !email || !phone) {
      setError(
        "Por favor, completa todos los campos requeridos (Nombre, Descripción, Stock, Precio Unitario (Bs), Precio Unitario (USD))."
      );
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const newProductData: UserDto = {
      username: nombre,
      nombre,
      apellido,
      email,
      password: "12345678",
      phone,
      role: "tecnico",
    };

    try {
      const response = await UserServices.createTechnician(newProductData); // Use the service

      if (response.success) {
        setSuccess("Tecnico añadido exitosamente!");

        setNombre("");
        setApellido("");
        setEmail("");
        setPhone("");
        if (onTecnicoAdded) {
          onTecnicoAdded();
        }
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(response.message || "Error al añadir el tecnico.");
      }
    } catch (err) {
      setError("Ocurrió un error inesperado al añadir el tecnico.");
      console.error("Error adding product:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setError(null);
      setSuccess(null);
      setNombre("");
      setApellido("");
      setEmail("");
      setPhone("");
    }
  }, [open]);

  return (
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
                <EngineeringIcon />
              </Box>
              <Typography variant="h5" component="h2" fontWeight={600}>
                {"Añadir Tecnico"}
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
              label={"Nuevo Tecnico"}
              icon={<AddIcon />}
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

          {/*BODY */}
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
            <Stack spacing={3}>
              <StyledTextField
                label="Nombre del Tecnico"
                variant="outlined"
                fullWidth
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                label="Apellido del Tecnico"
                variant="outlined"
                fullWidth
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                label="Correo electrónico"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" /> {/* Email icon */}
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                label="Teléfono "
                variant="outlined"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" /> {/* Phone icon */}
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
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
                variant="contained"
                color="primary"
                onClick={handleAddProduct}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Añadir Producto"
                )}
              </StyledButton>
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      </Fade>
    </StyledModal>
  );
}
