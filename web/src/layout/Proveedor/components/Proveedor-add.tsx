"use client";

import { useState } from "react";
import { Box } from "@mui/material";

import ProveedorServices from "../../../api/ProveedorServices";
import { ProveedorCreateDto } from "../../../Dto/Proveedor.dto";

import BaseModal from "../../../components/global/modal/modal";
import InputField from "../../../components/global/TextField/InputField";
import { Phone, MapPin, BriefcaseBusiness } from "lucide-react";
import { useSnackbar } from "../../../components/context/SnackbarContext";

interface ProveedorAddProps {
  open: boolean;
  onClose: () => void;
}

export function ProveedorAdd({
  open,
  onClose,
}: ProveedorAddProps) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const [errors, setErrors] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    catalogo: "",
  });

  const resetForm = () => {
    setNombre("");
    setTelefono("");
    setDireccion("");
    setErrors({
      nombre: "",
      telefono: "",
      direccion: "",
      catalogo: "",
    });
  };

  const validateFields = () => {
    const newErrors = {
      nombre: !nombre.trim() ? "Campo obligatorio" : "",
      telefono: "", // opcional
      direccion: "", // opcional
      catalogo: "", // opcional
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  };

  const handleAddProveedor = async () => {
    if (!validateFields()) return;

    const newProveedorData: ProveedorCreateDto = {
      nombre: nombre.trim(),
      telefono: telefono.trim() || null,
      direccion: direccion.trim() || null,
    };

    try {
      setLoading(true);
      await ProveedorServices.create(newProveedorData);
      resetForm();
      setTimeout(() => onClose(), 800);
      showSnackbar(`Proveedor "${nombre}" añadido exitosamente`, "success");
    } catch (err) {
      console.error("Error creando proveedor:", err);
      showSnackbar("Ocurrió un error al añadir el proveedor", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddProveedor();
    }
  };

  return (
    <BaseModal
      open={open}
      saveText="Añadir Proveedor"
      onClose={onClose}
      onSave={handleAddProveedor}
      title="Añadir Proveedor"
    >
      <Box
        component="form"
        onKeyDown={handleKeyPress}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <InputField
          label="Nombre del Proveedor"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          startIcon={<BriefcaseBusiness />}
          onlyLetters
          disabled={loading}
          errorMessage={errors.nombre}
        />

        <InputField
          label="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          startIcon={<Phone />}
          disabled={loading}
          errorMessage={errors.telefono}
        />

        <InputField
          label="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          startIcon={<MapPin />}
          disabled={loading}
          errorMessage={errors.direccion}
        />
      </Box>
    </BaseModal>
  );
}

export default ProveedorAdd;
