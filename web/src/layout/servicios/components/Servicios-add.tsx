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
import InventoryIcon from "@mui/icons-material/Inventory";
import { FileText, Hash } from "lucide-react";

import type { CreateServicioDto } from "../../../Dto/Servicio-request.dto";
import ServiciosServices from "../../../api/ServiciosServices";
import MaterialServices from "../../../api/MaterialesServices";
import type { MaterialesDto } from "../../../Dto/Materiales.dto";
import BaseModal from "../../../components/global/modal/modal";
import InputField from "../../../components/global/TextField/InputField";
import ProductServices from "../../../api/ProductServices";
import { ProductoDTO } from "../../../Dto/Productos.dto";

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
}));

// 🔹 Alert personalizado
const StyledAlert = styled(Alert)(({ theme }) => ({
  borderRadius: 12,
  backdropFilter: "blur(10px)",
  border: "1px solid",
  fontWeight: 500,
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
}));

interface ServicioAddProps {
  open: boolean;
  onClose: () => void;
  onServicioAdded: () => void;
}

export function ServicioAdd({ open, onClose, onServicioAdded }: ServicioAddProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio_estandar_usd, setPrecioEstandarUsd] = useState<number | "">("");

  const [materialesUsados, setMaterialesUsados] = useState<number[]>([]);
  const [productosAsociados, setProductosAsociados] = useState<number[]>([]);

  const [availableMateriales, setAvailableMateriales] = useState<MaterialesDto[]>([]);
  const [availableProductos, setAvailableProductos] = useState<ProductoDTO[]>([]);

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
    setProductosAsociados([]);
    setMaterialesUsados([]);
    setError(null);
    setSuccess(null);
  };

  const fetchDependencies = async () => {
    setFetchingData(true);
    setError(null);

    try {
      const [materialesResponse, productosResponse] = await Promise.all([
        MaterialServices.findAll().catch(() => []),
        ProductServices.fetchProductos().catch(() => []),
      ]);

      const materiales = Array.isArray(materialesResponse)
        ? materialesResponse
        : materialesResponse?.data || [];

      const productos = Array.isArray(productosResponse)
        ? productosResponse
        : productosResponse?.data || [];

      setAvailableMateriales(materiales);
      setAvailableProductos(productos);

    } catch {
      setError("Error al cargar materiales o productos.");
    } finally {
      setFetchingData(false);
    }
  };

  const validateForm = (): boolean => {
    if (!nombre.trim()) return setError("El nombre del servicio es requerido."), false;
    if (!descripcion.trim()) return setError("La descripción es requerida."), false;
    if (precio_estandar_usd === "" || precio_estandar_usd <= 0)
      return setError("El precio en USD debe ser mayor a 0."), false;

    return true;
  };

  const handleAddServicio = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

   const newServicioData: CreateServicioDto = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio_estandar_usd: Number(precio_estandar_usd),

      materiales_utilizados: materialesUsados,
      productos_asociados: productosAsociados
    };
    try {
      await ServiciosServices.createServicio(newServicioData);
      setSuccess("¡Servicio añadido exitosamente!");
      onServicioAdded();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al añadir el servicio.");
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
      <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 1 }}>

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

        {/* Productos */}
        <StyledFormControl fullWidth disabled={loading || fetchingData}>
          <InputLabel id="productos-asociados-label">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <InventoryIcon sx={{ fontSize: "1rem" }} />
              Productos Asociados
            </Box>
          </InputLabel>

          <Select
            labelId="productos-asociados-label"
            multiple
            value={productosAsociados}
            onChange={(e) =>
              setProductosAsociados(
                typeof e.target.value === "string"
                  ? e.target.value.split(",").map(Number)
                  : e.target.value
              )
            }
            input={<OutlinedInput label="Productos Asociados" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => {
                  const prod = availableProductos.find((p) => p.id === value);
                  return (
                    <SelectionChip
                      key={value}
                      label={prod ? prod.nombre : `ID: ${value}`}
                      size="small"
                    />
                  );
                })}
              </Box>
            )}
          >
            {availableProductos.map((prod) => (
              <MenuItem key={prod.id} value={prod.id}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <InventoryIcon sx={{ fontSize: "1rem", color: "action.active" }} />
                  {prod.nombre}
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
                  const material = availableMateriales.find((m) => m.id === value);
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
              <MenuItem key={material.id ?? 0} value={material.id ?? 0}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <InventoryIcon sx={{ fontSize: "1rem", color: "action.active" }} />
                  {material.nombre}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>

        {error && (
          <StyledAlert severity="error">
            <Typography variant="body2" fontWeight={500}>{error}</Typography>
          </StyledAlert>
        )}

        {success && (
          <StyledAlert severity="success">
            <Typography variant="body2" fontWeight={500}>{success}</Typography>
          </StyledAlert>
        )}
      </Box>
    </BaseModal>
  );
}
