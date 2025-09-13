import { useState, useEffect } from "react";
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

import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DescriptionIcon from "@mui/icons-material/Description";
import CategoryIcon from "@mui/icons-material/Category";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { format, setHours, setMinutes, setSeconds } from "date-fns";
import { es } from "date-fns/locale";
import { CreateGastoDto, gastosService } from "../../../api/GastosServices";

// Import for Date Picker
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface NewGastoDialogProps {
  open: boolean;
  onClose: () => void;
  selectedDate: Date | null; // Keep selectedDate prop for initial value if needed
  onGastoAdded?: () => void;
}

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

export function NewGastoDialog({
  open,
  onClose,
  selectedDate: propSelectedDate, // Rename prop to avoid conflict with state
  onGastoAdded,
}: NewGastoDialogProps) {
  const [concepto, setConcepto] = useState<string>("");
  const [tipo, setTipo] = useState<"fijo" | "variable" | "">("");
  const [montoGastado, setMontoGastado] = useState<number | string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    propSelectedDate
  ); // New state for selected date

  const [hour, setHour] = useState<string>(format(new Date(), "HH"));
  const [minute, setMinute] = useState<string>(format(new Date(), "mm"));
  const [second, setSecond] = useState<string>(format(new Date(), "ss"));

  useEffect(() => {
    if (open) {
      setConcepto("");
      setTipo("");
      setMontoGastado("");
      setError(null);
      // Initialize time with current time or default to 00:00:00
      const now = new Date();
      setHour(format(now, "HH"));
      setMinute(format(now, "mm"));
      setSecond(format(now, "ss"));
      setSelectedDate(propSelectedDate); // Reset selected date when opening
    }
  }, [open, propSelectedDate]);

  const handleCreateGasto = async () => {
    if (!concepto.trim()) {
      setError("El concepto es obligatorio.");
      return;
    }
    if (!tipo) {
      setError("El tipo de gasto es obligatorio.");
      return;
    }
    if (!selectedDate) {
      setError("La fecha es obligatoria.");
      return;
    }

    const parsedMonto = parseFloat(montoGastado.toString());
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

    setError(null);
    setLoading(true);

    try {
      let preciseDate = selectedDate;
      preciseDate = setHours(preciseDate, parsedHour);
      preciseDate = setMinutes(preciseDate, parsedMinute);
      preciseDate = setSeconds(preciseDate, parsedSecond);

      const dateInUtc = preciseDate.toISOString();

      const newGastoData: CreateGastoDto = {
        concepto: concepto.trim(),
        fecha: dateInUtc,
        tipo_gasto: tipo as "fijo" | "variable",
        monto_gastado: parsedMonto,
      };

      await gastosService.createGasto(newGastoData);

      if (onGastoAdded) {
        onGastoAdded();
      }
      onClose();
    } catch (err: unknown) {
      console.error("Error creating gasto:", err);
      if (err instanceof Error) {
        setError(err.message || "Hubo un error al crear el gasto.");
      } else {
        setError("Hubo un error al crear el gasto.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledModal
      open={open}
      onClose={onClose}
      closeAfterTransition
      aria-labelledby="new-gasto-modal-title"
      aria-describedby="new-gasto-modal-description"
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
                <AttachMoneyIcon />
              </Box>
              <Typography variant="h5" component="h2" fontWeight={600}>
                Añadir Nuevo Gasto
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
              label="Nuevo Gasto"
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

              <FormControl fullWidth required error={!!error && !tipo}>
                <InputLabel id="gasto-tipo-label">Tipo de Gasto</InputLabel>
                <Select
                  labelId="gasto-tipo-label"
                  id="gasto-tipo-select"
                  value={tipo}
                  label="Tipo de Gasto"
                  onChange={(e) =>
                    setTipo(e.target.value as "fijo" | "variable")
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
                {!!error && !tipo && (
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
                  (isNaN(parseFloat(montoGastado.toString())) ||
                    parseFloat(montoGastado.toString()) <= 0)
                }
                helperText={
                  !!error &&
                  (isNaN(parseFloat(montoGastado.toString())) ||
                    parseFloat(montoGastado.toString()) <= 0)
                    ? "El monto debe ser un número positivo"
                    : ""
                }
              />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <StyledButton onClick={onClose} color="error" disabled={loading}>
              Cancelar
            </StyledButton>
            <StyledButton
              onClick={handleCreateGasto}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Crear Gasto"
              )}
            </StyledButton>
          </ModalFooter>
        </ModalContent>
      </Fade>
    </StyledModal>
  );
}
