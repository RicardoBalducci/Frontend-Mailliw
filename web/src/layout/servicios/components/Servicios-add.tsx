"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Fade,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  type SelectChangeEvent,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ServicesIcon from "@mui/icons-material/BuildCircleOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import PersonIcon from "@mui/icons-material/Person";
import InventoryIcon from "@mui/icons-material/Inventory";

import type { CreateServicioDto } from "../../../Dto/Servicio-request.dto";
import ServiciosServices from "../../../api/ServiciosServices";
import UserServices from "../../../api/UserSevices";
import MaterialServices from "../../../api/MaterialesServices";
import type { UserDto } from "../../../Dto/UserDto";
import type { MaterialesDto } from "../../../Dto/Materiales.dto";

import {
  StyledModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CloseButton,
  StatusChip,
  StyledButton,
} from "../theme/styled-modal";

// TextField personalizado
const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    backgroundColor: alpha(theme.palette.common.white, 0.8),
    backdropFilter: "blur(10px)",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.9),
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: alpha(theme.palette.primary.main, 0.5),
      },
    },
    "&.Mui-focused": {
      backgroundColor: theme.palette.common.white,
      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    },
  },
  "& .MuiInputLabel-root": {
    fontWeight: 500,
    "&.Mui-focused": {
      color: theme.palette.primary.main,
      fontWeight: 600,
    },
  },
}));

// FormControl personalizado
const StyledFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    backgroundColor: alpha(theme.palette.common.white, 0.8),
    backdropFilter: "blur(10px)",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.9),
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: alpha(theme.palette.primary.main, 0.5),
      },
    },
    "&.Mui-focused": {
      backgroundColor: theme.palette.common.white,
      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    },
  },
  "& .MuiInputLabel-root": {
    fontWeight: 500,
    "&.Mui-focused": {
      color: theme.palette.primary.main,
      fontWeight: 600,
    },
  },
}));

// Alert personalizado
const StyledAlert = styled(Alert)(({ theme }) => ({
  borderRadius: 12,
  backdropFilter: "blur(10px)",
  border: "1px solid",
  fontWeight: 500,
  "& .MuiAlert-icon": {
    fontSize: "1.2rem",
  },
  "&.MuiAlert-standardInfo": {
    backgroundColor: alpha(theme.palette.info.main, 0.1),
    borderColor: alpha(theme.palette.info.main, 0.2),
    color: theme.palette.info.dark,
  },
  "&.MuiAlert-standardError": {
    backgroundColor: alpha(theme.palette.error.main, 0.1),
    borderColor: alpha(theme.palette.error.main, 0.2),
    color: theme.palette.error.dark,
  },
  "&.MuiAlert-standardSuccess": {
    backgroundColor: alpha(theme.palette.success.main, 0.1),
    borderColor: alpha(theme.palette.success.main, 0.2),
    color: theme.palette.success.dark,
  },
}));

// Chip personalizado para selecciones
const SelectionChip = styled(Chip)(({ theme }) => ({
  borderRadius: 8,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.dark,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  fontWeight: 500,
  fontSize: "0.75rem",
  "& .MuiChip-deleteIcon": {
    color: alpha(theme.palette.primary.main, 0.7),
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
}));

interface ServicioAddProps {
  open: boolean;
  onClose: () => void;
  onServicioAdded: () => void;
}

export function ServicioAdd({
  open,
  onClose,
  onServicioAdded,
}: ServicioAddProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio_estandar_usd, setPrecioEstandarUsd] = useState<number | "">("");
  const [monto_bs, setMontoBs] = useState<number | "">("");
  const [tecnicosCalificados, setTecnicosCalificados] = useState<number[]>([]);
  const [materialesUsados, setMaterialesUsados] = useState<number[]>([]);
  const [availableTecnicos, setAvailableTecnicos] = useState<UserDto[]>([]);
  const [availableMateriales, setAvailableMateriales] = useState<
    MaterialesDto[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fetchingData, setFetchingData] = useState(false);

  useEffect(() => {
    if (open) {
      resetForm();
      fetchDependencies();
    }
  }, [open]);

  const resetForm = () => {
    setNombre("");
    setDescripcion("");
    setPrecioEstandarUsd("");
    setMontoBs("");
    setTecnicosCalificados([]);
    setMaterialesUsados([]);
    setError(null);
    setSuccess(null);
  };

  const fetchDependencies = async () => {
    setFetchingData(true);
    setError(null);

    try {
      const [tecnicosResponse, materialesResponse] = await Promise.all([
        UserServices.getTechnicians().catch((err) => {
          console.error("Error fetching technicians:", err);
          return { data: [] };
        }),
        MaterialServices.findAll().catch((err) => {
          console.error("Error fetching materials:", err);
          return { data: [] };
        }),
      ]);

      const tecnicos = Array.isArray(tecnicosResponse)
        ? tecnicosResponse
        : tecnicosResponse?.data || [];
      const materiales = Array.isArray(materialesResponse)
        ? materialesResponse
        : materialesResponse?.data || [];

      setAvailableTecnicos(tecnicos);
      setAvailableMateriales(materiales);
    } catch (err) {
      console.error("Error fetching dependencies:", err);
      setError("Error al cargar la lista de técnicos o materiales.");
    } finally {
      setFetchingData(false);
    }
  };

  const validateForm = (): boolean => {
    if (!nombre.trim()) {
      setError("El nombre del servicio es requerido.");
      return false;
    }
    if (!descripcion.trim()) {
      setError("La descripción es requerida.");
      return false;
    }
    if (precio_estandar_usd === "" || precio_estandar_usd <= 0) {
      setError("El precio en USD debe ser mayor a 0.");
      return false;
    }
    if (monto_bs === "" || monto_bs <= 0) {
      setError("El monto en Bs debe ser mayor a 0.");
      return false;
    }
    return true;
  };

  const handleAddServicio = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const newServicioData: CreateServicioDto = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio_estandar_usd: Number(precio_estandar_usd),
      monto_bs: Number(monto_bs),
      tecnicos_calificados: tecnicosCalificados,
      materiales_utilizados: materialesUsados,
    };

    try {
      await ServiciosServices.createServicio(newServicioData);
      setSuccess("¡Servicio añadido exitosamente!");

      setTimeout(() => {
        onServicioAdded();
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error adding service:", err);

      let errorMessage = "Ocurrió un error inesperado al añadir el servicio.";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTecnicosChange = (event: SelectChangeEvent<number[]>) => {
    const { value } = event.target;
    setTecnicosCalificados(
      typeof value === "string" ? value.split(",").map(Number) : value
    );
  };

  const handleMaterialesChange = (event: SelectChangeEvent<number[]>) => {
    const { value } = event.target;
    setMaterialesUsados(
      typeof value === "string" ? value.split(",").map(Number) : value
    );
  };

  const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
      setPrecioEstandarUsd(value === "" ? "" : Number(value));
    }
  };

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
      setMontoBs(value === "" ? "" : Number(value));
    }
  };

  return (
    <StyledModal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open} timeout={400}>
        <ModalContent>
          <ModalHeader>
            <Box sx={{ display: "flex", alignItems: "center", pr: 12 }}>
              <Box
                sx={{
                  mr: 2,
                  p: 1.5,
                  bgcolor: "rgba(255,255,255,0.15)",
                  borderRadius: "12px",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <ServicesIcon sx={{ fontSize: "1.5rem" }} />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  component="h2"
                  fontWeight={700}
                  sx={{ mb: 0.5 }}
                >
                  Crear Nuevo Servicio
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ opacity: 0.9, fontSize: "0.875rem" }}
                >
                  Complete la información del servicio
                </Typography>
              </Box>
            </Box>

            <StatusChip>
              <AddIcon sx={{ fontSize: "0.875rem" }} />
              Nuevo
            </StatusChip>

            <CloseButton onClick={onClose} disabled={loading}>
              <CloseIcon />
            </CloseButton>
          </ModalHeader>

          <ModalBody>
            {fetchingData && (
              <StyledAlert severity="info" sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <CircularProgress size={18} />
                  <Typography variant="body2" fontWeight={500}>
                    Cargando datos necesarios...
                  </Typography>
                </Box>
              </StyledAlert>
            )}

            {error && (
              <StyledAlert severity="error" sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight={500}>
                  {error}
                </Typography>
              </StyledAlert>
            )}

            {success && (
              <StyledAlert severity="success" sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight={500}>
                  {success}
                </Typography>
              </StyledAlert>
            )}

            <Stack spacing={3}>
              <StyledTextField
                label="Nombre del Servicio"
                variant="outlined"
                fullWidth
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={loading}
                required
                placeholder="Ej: Reparación de equipos"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ServicesIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <StyledTextField
                label="Descripción del Servicio"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                disabled={loading}
                required
                placeholder="Describe detalladamente el servicio que se ofrece..."
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <StyledTextField
                  label="Precio (USD)"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={precio_estandar_usd}
                  onChange={handlePrecioChange}
                  disabled={loading}
                  required
                  placeholder="0.00"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />

                <StyledTextField
                  label="Monto (Bs)"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={monto_bs}
                  onChange={handleMontoChange}
                  disabled={loading}
                  required
                  placeholder="0.00"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PaidOutlinedIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <StyledFormControl fullWidth disabled={loading || fetchingData}>
                <InputLabel id="tecnicos-calificados-label">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PersonIcon sx={{ fontSize: "1rem" }} />
                    Técnicos Calificados
                  </Box>
                </InputLabel>
                <Select
                  labelId="tecnicos-calificados-label"
                  multiple
                  value={tecnicosCalificados}
                  onChange={handleTecnicosChange}
                  input={<OutlinedInput label="Técnicos Calificados" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => {
                        const tecnico = availableTecnicos.find(
                          (t) => t.id === value
                        );
                        return (
                          <SelectionChip
                            key={value}
                            label={
                              tecnico
                                ? `${tecnico.nombre} ${
                                    tecnico.apellido || ""
                                  }`.trim()
                                : `ID: ${value}`
                            }
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {availableTecnicos.map((tecnico) => (
                    <MenuItem key={tecnico.id} value={tecnico.id}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <PersonIcon
                          sx={{ fontSize: "1rem", color: "action.active" }}
                        />
                        {`${tecnico.nombre} ${tecnico.apellido || ""}`.trim()}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>

              <StyledFormControl fullWidth disabled={loading || fetchingData}>
                <InputLabel id="materiales-usados-label">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <InventoryIcon sx={{ fontSize: "1rem" }} />
                    Materiales Utilizados
                  </Box>
                </InputLabel>
                <Select
                  labelId="materiales-usados-label"
                  multiple
                  value={materialesUsados}
                  onChange={handleMaterialesChange}
                  input={<OutlinedInput label="Materiales Utilizados" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => {
                        const material = availableMateriales.find(
                          (m) => m.id === value
                        );
                        return (
                          <SelectionChip
                            key={value}
                            label={material ? material.nombre : `ID: ${value}`}
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {availableMateriales.map((material) => (
                    <MenuItem key={material.id ?? ""} value={material.id ?? ""}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <InventoryIcon
                          sx={{ fontSize: "1rem", color: "action.active" }}
                        />
                        {material.nombre}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
            </Stack>
          </ModalBody>

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
              onClick={handleAddServicio}
              disabled={loading || fetchingData}
            >
              {loading ? (
                <>
                  <CircularProgress size={18} color="inherit" />
                  Creando...
                </>
              ) : (
                <>
                  <AddIcon sx={{ fontSize: "1rem" }} />
                  Crear Servicio
                </>
              )}
            </StyledButton>
          </ModalFooter>
        </ModalContent>
      </Fade>
    </StyledModal>
  );
}
