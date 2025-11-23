"use client";

import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import ServicesIcon from "@mui/icons-material/BuildCircleOutlined";
import PersonIcon from "@mui/icons-material/Person";
import InventoryIcon from "@mui/icons-material/Inventory";
import { FileText, Hash } from "lucide-react";

import type { CreateServicioDto } from "../../../Dto/Servicio-request.dto";
import ServiciosServices from "../../../api/ServiciosServices";
import UserServices from "../../../api/UserSevices";
import MaterialServices from "../../../api/MaterialesServices";
import type { UserDto } from "../../../Dto/UserDto";
import type { MaterialesDto } from "../../../Dto/Materiales.dto";
import BaseModal from "../../../components/global/modal/modal";
import InputField from "../../../components/global/TextField/InputField";

// 🔹 FormControl personalizado
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

// 🔹 Alert personalizado
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

// 🔹 Chip personalizado
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

  // 🔹 Efectos
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
        UserServices.getTechnicians().catch(() => ({ data: [] })),
        MaterialServices.findAll().catch(() => ({ data: [] })),
      ]);

      const tecnicos = Array.isArray(tecnicosResponse)
        ? tecnicosResponse
        : tecnicosResponse?.data || [];
      const materiales = Array.isArray(materialesResponse)
        ? materialesResponse
        : materialesResponse?.data || [];

      setAvailableTecnicos(tecnicos);
      setAvailableMateriales(materiales);
    } catch {
      setError("Error al cargar la lista de técnicos o materiales.");
    } finally {
      setFetchingData(false);
    }
  };

  // 🔹 Validación
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
    return true;
  };

  // 🔹 Crear servicio
  const handleAddServicio = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    const newServicioData: CreateServicioDto = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio_estandar_usd: Number(precio_estandar_usd),
      tecnicos_calificados: tecnicosCalificados,
      materiales_utilizados: materialesUsados,
    };

    try {
      await ServiciosServices.createServicio(newServicioData);
      setSuccess("¡Servicio añadido exitosamente!");
      onServicioAdded();
      onClose();
    } catch (err) {
      let errorMessage = "Ocurrió un error al añadir el servicio.";
      if (err instanceof Error) errorMessage = err.message;
      else if (typeof err === "string") errorMessage = err;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
      setPrecioEstandarUsd(value === "" ? "" : Number(value));
    }
  };

  return (
    <BaseModal
      open={open}
      saveText="Añadir Servicio"
      onClose={onClose}
      onSave={handleAddServicio}
      title="Añadir Servicio"
    >
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.8, // Espaciado más compacto (~6px)
          "& > *": { mb: 1 }, // separa suavemente los campos sin dejar tanto espacio
        }}
      >
        <InputField
          label="Nombre del Servicio"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          startIcon={<ServicesIcon />}
          disabled={loading}
        />

        <InputField
          label="Descripción del Servicio"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          startIcon={<FileText />}
          rows={4}
          multiline
          disabled={loading}
        />

        <InputField
          label="Precio del Servicio (USD)"
          value={precio_estandar_usd}
          onChange={handlePrecioChange}
          startIcon={<Hash />}
          disabled={loading}
        />

        {/* Técnicos */}
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
            onChange={(e) =>
              setTecnicosCalificados(
                typeof e.target.value === "string"
                  ? e.target.value.split(",").map(Number)
                  : e.target.value
              )
            }
            input={<OutlinedInput label="Técnicos Calificados" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => {
                  const tecnico = availableTecnicos.find((t) => t.id === value);
                  return (
                    <SelectionChip
                      key={value}
                      label={
                        tecnico
                          ? `${tecnico.nombre} ${tecnico.apellido || ""}`.trim()
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PersonIcon
                    sx={{ fontSize: "1rem", color: "action.active" }}
                  />
                  {`${tecnico.nombre} ${tecnico.apellido || ""}`.trim()}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>

        {/* Materiales */}
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
            onChange={(e) =>
              setMaterialesUsados(
                typeof e.target.value === "string"
                  ? e.target.value.split(",").map(Number)
                  : e.target.value
              )
            }
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
            {availableMateriales.map((material) => {
              if (material.id == null) return null;
              return (
                <MenuItem key={material.id} value={material.id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <InventoryIcon
                      sx={{ fontSize: "1rem", color: "action.active" }}
                    />
                    {material.nombre}
                  </Box>
                </MenuItem>
              );
            })}
          </Select>
        </StyledFormControl>

        {/* Mensajes */}
        {error && (
          <StyledAlert severity="error">
            <Typography variant="body2" fontWeight={500}>
              {error}
            </Typography>
          </StyledAlert>
        )}
        {success && (
          <StyledAlert severity="success">
            <Typography variant="body2" fontWeight={500}>
              {success}
            </Typography>
          </StyledAlert>
        )}
      </Box>
    </BaseModal>
  );
}
