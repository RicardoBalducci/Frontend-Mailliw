import { useEffect, useState } from "react";
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
import DescriptionIcon from "@mui/icons-material/Description";
import InventoryIcon from "@mui/icons-material/Inventory";
import DollarIcon from "@mui/icons-material/AttachMoney";
import { CreateMaterialesDto } from "../../../Dto/Materiales.dto";
import MaterialesServices from "../../../api/MaterialesServices";

interface MaterialAddProps {
  open: boolean;
  onClose: () => void;
  onMaterialAdded?: () => void;
}

export function MaterialAdd({
  open,
  onClose,
  onMaterialAdded,
}: MaterialAddProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [stock, setStock] = useState<number | string>("");
  const [precioUnitarioDolar, setPrecioUnitarioDolar] = useState<
    number | string
  >("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      setSuccess(null);
      setNombre("");
      setDescripcion("");
      setStock("");
      setPrecioUnitarioDolar("");
    }
  }, [open]);

  const handleAddMaterial = async () => {
    if (!nombre || !descripcion || stock === "" || precioUnitarioDolar === "") {
      setError("Por favor, completa todos los campos requeridos.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const newMaterialData: CreateMaterialesDto = {
      nombre,
      descripcion,
      stock: Number(stock),
      precio_unitario_usd: Number(precioUnitarioDolar),
    };

    try {
      const response = await MaterialesServices.create(newMaterialData);

      if (response) {
        setSuccess("Material añadido exitosamente!");
        setNombre("");
        setDescripcion("");
        setStock("");
        setPrecioUnitarioDolar("");
        if (onMaterialAdded) {
          onMaterialAdded();
        }
        setTimeout(() => {
          onClose();
        }, 150);
      } else {
        setError("Error al añadir el material.");
      }
    } catch (err) {
      setError("Ocurrió un error inesperado al añadir el material.");
      console.error("Error adding material:", err);
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
                <InventoryIcon />
              </Box>
              <Typography variant="h5" component="h2" fontWeight={600}>
                Añadir Material
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
              label="Nuevo Material"
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
            <Stack spacing={3}>
              <StyledTextField
                label="Nombre del Material"
                variant="outlined"
                fullWidth
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
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
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
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
                onChange={(e) => setStock(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InventoryIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                label="Precio en $"
                variant="outlined"
                fullWidth
                type="number"
                value={precioUnitarioDolar}
                onChange={(e) => setPrecioUnitarioDolar(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DollarIcon color="action" />
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
                onClick={handleAddMaterial}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Añadir Material"
                )}
              </StyledButton>
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      </Fade>
    </StyledModal>
  );
}
