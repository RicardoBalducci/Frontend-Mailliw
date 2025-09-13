import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  alpha,
  Fade,
  IconButton,
  Chip,
  InputAdornment,
  Stack,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

// Icons
import CloseIcon from "@mui/icons-material/Close";
// Changed import for the Edit icon
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline"; // Or EditOutlinedIcon
import DescriptionIcon from "@mui/icons-material/Description";
import CategoryIcon from "@mui/icons-material/Category";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// Date and Time utilities
import { format, setHours, setMinutes, setSeconds, parseISO } from "date-fns";
import { es } from "date-fns/locale"; // For Spanish locale

// Date Picker
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// Service and DTO
import {
  Gasto,
  gastosService,
  UpdateGastoDto,
} from "../../../api/GastosServices";

interface UpdateGastoDialogProps {
  open: boolean;
  onClose: () => void;
  gastoToEdit: Gasto | null;
  onGastoUpdated: () => void;
}

// --- Styled Components (Copied from NewGastoDialog for consistency) ---

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

// --- UpdateGastoDialog Component ---

export const UpdateGastoDialog: React.FC<UpdateGastoDialogProps> = ({
  open,
  onClose,
  gastoToEdit,
  onGastoUpdated,
}) => {
  const theme = useTheme();
  const [concepto, setConcepto] = useState<string>("");
  const [montoGastado, setMontoGastado] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Use Date object for date picker
  const [tipoGasto, setTipoGasto] = useState<"fijo" | "variable" | "">(""); // Default
  const [hour, setHour] = useState<string>("");
  const [minute, setMinute] = useState<string>("");
  const [second, setSecond] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (gastoToEdit) {
      setConcepto(gastoToEdit.concepto || "");
      setMontoGastado(String(gastoToEdit.monto_gastado));

      // Parse the date string from gastoToEdit into a Date object
      const dateObject = gastoToEdit.fecha ? parseISO(gastoToEdit.fecha) : null;
      setSelectedDate(dateObject);

      // Extract hour, minute, second from the dateObject
      if (dateObject) {
        setHour(format(dateObject, "HH"));
        setMinute(format(dateObject, "mm"));
        setSecond(format(dateObject, "ss"));
      } else {
        setHour("");
        setMinute("");
        setSecond("");
      }

      setTipoGasto(gastoToEdit.tipo_gasto || "variable");
    } else {
      // Reset state if no gastoToEdit is provided (e.g., when dialog closes)
      setConcepto("");
      setMontoGastado("");
      setSelectedDate(null);
      setTipoGasto("variable");
      setHour("");
      setMinute("");
      setSecond("");
    }
    setError(null); // Clear error on opening or gastoToEdit change
  }, [gastoToEdit, open]); // Depend on 'open' to reset when dialog opens/closes

  const handleUpdateGasto = async () => {
    if (!gastoToEdit || !gastoToEdit.id) {
      setError("No hay gasto seleccionado para editar.");
      return;
    }

    if (!concepto.trim()) {
      setError("El concepto es obligatorio.");
      return;
    }
    if (!tipoGasto) {
      setError("El tipo de gasto es obligatorio.");
      return;
    }
    if (!selectedDate) {
      setError("La fecha es obligatoria.");
      return;
    }

    const parsedMonto = parseFloat(montoGastado);
    if (isNaN(parsedMonto) || parsedMonto <= 0) {
      setError("El monto gastado debe ser un número positivo.");
      return;
    }

    const parsedHour = parseInt(hour, 10);
    const parsedMinute = parseInt(minute, 10);
    const parsedSecond = parseInt(second, 10);

    if (
      isNaN(parsedHour) ||
      parsedHour < 0 ||
      parsedHour > 23 ||
      isNaN(parsedMinute) ||
      parsedMinute < 0 ||
      parsedMinute > 59 ||
      isNaN(parsedSecond) ||
      parsedSecond < 0 ||
      parsedSecond > 59
    ) {
      setError("La hora, minuto y segundo deben ser valores válidos.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let preciseDate = selectedDate;
      preciseDate = setHours(preciseDate, parsedHour);
      preciseDate = setMinutes(preciseDate, parsedMinute);
      preciseDate = setSeconds(preciseDate, parsedSecond);

      const dateInIsoFormat = preciseDate.toISOString(); // Use ISO format for API

      // Construct the UpdateGastoDto object
      const updatedGastoData: UpdateGastoDto = {
        concepto: concepto.trim(),
        monto_gastado: parsedMonto, // Send as a number
        fecha: dateInIsoFormat,
        tipo_gasto: tipoGasto as "fijo" | "variable",
      };

      await gastosService.updateGasto(gastoToEdit.id, updatedGastoData);
      onGastoUpdated(); // Notify parent to refresh data
      onClose(); // Close the dialog
    } catch (err) {
      console.error("Error updating gasto:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Hubo un error al actualizar el gasto.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <StyledModal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      aria-labelledby="update-gasto-modal-title"
      aria-describedby="update-gasto-modal-description"
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
                {/* Updated icon for the title */}
                <ModeEditOutlineIcon />
              </Box>
              <Typography variant="h5" component="h2" fontWeight={600}>
                Editar Gasto
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
            {/* Updated Chip design */}
            <Chip
              label="Edición"
              icon={<ModeEditOutlineIcon />}
              size="small"
              variant="outlined" // Changed to outlined variant
              sx={{
                position: "absolute",
                right: 48,
                top: 12,
                // Using theme color for better integration
                borderColor: alpha(theme.palette.secondary.light, 0.5), // Subtle border
                bgcolor: alpha(theme.palette.secondary.dark, 0.3), // Slightly darker background
                color: theme.palette.secondary.contrastText, // Text color that contrasts well
                fontWeight: 500,
                "& .MuiChip-icon": {
                  // Style the icon within the chip
                  color: theme.palette.secondary.contrastText,
                },
              }}
            />
          </ModalHeader>
          <ModalBody>
            <Stack spacing={3}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <StyledTextField
                label="Concepto del Gasto"
                variant="outlined"
                fullWidth
                value={concepto}
                onChange={(e) => setConcepto(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                required
                error={!!error && !concepto.trim()}
                helperText={
                  !!error && !concepto.trim()
                    ? "El concepto es obligatorio"
                    : ""
                }
              />

              <FormControl fullWidth required error={!!error && !tipoGasto}>
                <InputLabel id="gasto-tipo-label">Tipo de Gasto</InputLabel>
                <Select
                  labelId="gasto-tipo-label"
                  id="gasto-tipo-select"
                  value={tipoGasto}
                  label="Tipo de Gasto"
                  onChange={(e) =>
                    setTipoGasto(e.target.value as "fijo" | "variable")
                  }
                  startAdornment={
                    <InputAdornment position="start">
                      <CategoryIcon color="action" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">
                    <em>Seleccione un tipo</em>
                  </MenuItem>
                  <MenuItem value="fijo">Fijo</MenuItem>
                  <MenuItem value="variable">Variable</MenuItem>
                </Select>
                {!!error && !tipoGasto && (
                  <Typography color="error" variant="caption">
                    El tipo de gasto es obligatorio
                  </Typography>
                )}
              </FormControl>

              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={es}
              >
                <DatePicker
                  label="Fecha del Gasto"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "outlined",
                      required: true,
                      error: !!error && !selectedDate,
                      helperText:
                        !!error && !selectedDate
                          ? "La fecha es obligatoria"
                          : "",
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EventIcon color="action" />
                          </InputAdornment>
                        ),
                      },
                    },
                  }}
                />
              </LocalizationProvider>

              <Box sx={{ display: "flex", gap: 2 }}>
                <StyledTextField
                  label="Hora"
                  variant="outlined"
                  type="number"
                  value={hour}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (
                      (parseInt(val) >= 0 && parseInt(val) <= 23) ||
                      val === ""
                    ) {
                      setHour(val);
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeIcon color="action" />
                      </InputAdornment>
                    ),
                    inputProps: { min: 0, max: 23 },
                  }}
                  error={
                    !!error &&
                    (isNaN(parseInt(hour, 10)) ||
                      parseInt(hour, 10) < 0 ||
                      parseInt(hour, 10) > 23)
                  }
                  helperText={
                    !!error &&
                    (isNaN(parseInt(hour, 10)) ||
                      parseInt(hour, 10) < 0 ||
                      parseInt(hour, 10) > 23)
                      ? "Hora válida (0-23)"
                      : ""
                  }
                  fullWidth
                />
                <StyledTextField
                  label="Minuto"
                  variant="outlined"
                  type="number"
                  value={minute}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (
                      (parseInt(val) >= 0 && parseInt(val) <= 59) ||
                      val === ""
                    ) {
                      setMinute(val);
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeIcon color="action" />
                      </InputAdornment>
                    ),
                    inputProps: { min: 0, max: 59 },
                  }}
                  error={
                    !!error &&
                    (isNaN(parseInt(minute, 10)) ||
                      parseInt(minute, 10) < 0 ||
                      parseInt(minute, 10) > 59)
                  }
                  helperText={
                    !!error &&
                    (isNaN(parseInt(minute, 10)) ||
                      parseInt(minute, 10) < 0 ||
                      parseInt(minute, 10) > 59)
                      ? "Minuto válido (0-59)"
                      : ""
                  }
                  fullWidth
                />
                <StyledTextField
                  label="Segundo"
                  variant="outlined"
                  type="number"
                  value={second}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (
                      (parseInt(val) >= 0 && parseInt(val) <= 59) ||
                      val === ""
                    ) {
                      setSecond(val);
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeIcon color="action" />
                      </InputAdornment>
                    ),
                    inputProps: { min: 0, max: 59 },
                  }}
                  error={
                    !!error &&
                    (isNaN(parseInt(second, 10)) ||
                      parseInt(second, 10) < 0 ||
                      parseInt(second, 10) > 59)
                  }
                  helperText={
                    !!error &&
                    (isNaN(parseInt(second, 10)) ||
                      parseInt(second, 10) < 0 ||
                      parseInt(second, 10) > 59)
                      ? "Segundo válido (0-59)"
                      : ""
                  }
                  fullWidth
                />
              </Box>

              <StyledTextField
                label="Monto Gastado"
                variant="outlined"
                fullWidth
                type="number"
                value={montoGastado}
                onChange={(e) => setMontoGastado(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography color="textSecondary">$</Typography>
                    </InputAdornment>
                  ),
                }}
                required
                error={
                  !!error &&
                  (isNaN(parseFloat(montoGastado)) ||
                    parseFloat(montoGastado) <= 0)
                }
                helperText={
                  !!error &&
                  (isNaN(parseFloat(montoGastado)) ||
                    parseFloat(montoGastado) <= 0)
                    ? "El monto debe ser un número positivo"
                    : ""
                }
              />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <StyledButton
              onClick={handleClose}
              color="error"
              disabled={loading}
            >
              Cancelar
            </StyledButton>
            <StyledButton
              onClick={handleUpdateGasto}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Actualizar Gasto"
              )}
            </StyledButton>
          </ModalFooter>
        </ModalContent>
      </Fade>
    </StyledModal>
  );
};
