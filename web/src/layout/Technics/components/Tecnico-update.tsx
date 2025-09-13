import {
  Alert,
  Box,
  Chip,
  Fade,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
  Button, // Import Button for actions
} from "@mui/material";
import { UserDto } from "../interface/user.dto"; // Ensure UserDto contains 'phone'
import { StyledModal } from "../theme/StyleModalDelete";
import {
  ModalBody,
  ModalContent,
  ModalHeader,
  StyledTextField,
} from "../../../theme/StyledModalComponents";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import { useEffect, useState } from "react";
import UserServices from "../../../api/UserSevices";

interface TecnicoUpdateProps {
  open: boolean;
  onClose: () => void;
  selectedTecnico?: UserDto; // This will contain the technician data to edit
  onTecnicoUpdated?: () => void; // Callback for successful update
  onTecnicoUpdateError?: (message: string) => void; // Callback for update error
}

export function TecnicoUpdate({
  open,
  onClose,
  selectedTecnico,
  onTecnicoUpdated,
  onTecnicoUpdateError,
}: TecnicoUpdateProps) {
  const [formData, setFormData] = useState<UserDto>({
    id: undefined,
    nombre: "",
    apellido: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (open && selectedTecnico) {
      setError(null);
      setSuccess(null);
      setFormData({
        id: selectedTecnico.id,
        nombre: selectedTecnico.nombre || "",
        apellido: selectedTecnico.apellido || "",
        username: selectedTecnico.username || "",
        email: selectedTecnico.email || "",
        phone: selectedTecnico.phone || "", // Changed from selectedTecnico.phone
      });
    } else if (!open) {
      // Reset form data when the modal closes
      setFormData({
        id: undefined,
        nombre: "",
        apellido: "",
        username: "",
        email: "",
        phone: "",
      });
    }
  }, [open, selectedTecnico]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.id) {
      setError("No se pudo obtener el ID del técnico para actualizar.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await UserServices.updateTechnician(formData.id, formData);
      setSuccess("Técnico actualizado exitosamente!");
      onTecnicoUpdated?.(); // Trigger refresh in parent
      setTimeout(() => {
        onClose(); // Close the modal after success message is shown
      }, 1500);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error desconocido al actualizar el técnico.";
      setError(errorMessage);
      onTecnicoUpdateError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
                <EditIcon />
              </Box>
              <Typography variant="h5" component="h2" fontWeight={600}>
                {"Modificar Técnico"}
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
              label={"Modificar Técnico"}
              icon={<EditIcon />}
              size="small"
              color="primary"
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
                label="Nombre del Técnico"
                variant="outlined"
                fullWidth
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                label="Apellido del Técnico"
                variant="outlined"
                fullWidth
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                label="Email"
                variant="outlined"
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                label="Teléfono" // Label in Spanish
                variant="outlined"
                fullWidth
                name="phone"
                value={formData.phone}
                onChange={(e) => {
                  // Regular expression to allow only numbers, +, spaces, and parentheses
                  const validValue = e.target.value.replace(
                    /[^0-9+()-\s]/g,
                    ""
                  );
                  setFormData((prevData) => ({
                    ...prevData,
                    phone: validValue,
                  }));
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Fade>
    </StyledModal>
  );
}
export default TecnicoUpdate;
