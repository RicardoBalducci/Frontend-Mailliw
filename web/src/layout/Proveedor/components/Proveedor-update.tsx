"use client";

import { useState, useEffect } from "react";
import { Box } from "@mui/material";

import ProveedorServices from "../../../api/ProveedorServices";
import { ProveedorDto, ProveedorUpdateDto } from "../../../Dto/Proveedor.dto";

import BaseModal from "../../../components/global/modal/modal";
import InputField from "../../../components/global/TextField/InputField";
import { Phone, MapPin, BriefcaseBusiness } from "lucide-react";
import { useSnackbar } from "../../../components/context/SnackbarContext";

interface ProveedorUpdateProps {
  open: boolean;
  onClose: () => void;
  proveedorToEdit: ProveedorDto | null;
  onProveedorUpdated?: () => void;
}

export function ProveedorUpdate({
  open,
  onClose,
  proveedorToEdit,
  onProveedorUpdated,
}: ProveedorUpdateProps) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const [errors, setErrors] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
  });

  useEffect(() => {
    if (open && proveedorToEdit) {
      setNombre(proveedorToEdit.nombre || "");
      setTelefono(proveedorToEdit.telefono || "");
      setDireccion(proveedorToEdit.direccion || "");
      setErrors({ nombre: "", telefono: "", direccion: "" });
    } else if (!open) {
      resetForm();
    }
  }, [open, proveedorToEdit]);

  const resetForm = () => {
    setNombre("");
    setTelefono("");
    setDireccion("");
    setErrors({ nombre: "", telefono: "", direccion: "" });
  };

  const validateFields = () => {
    const newErrors = {
      nombre: !nombre.trim() ? "Campo obligatorio" : "",
      telefono: "",
      direccion: "",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  };

  const handleUpdateProveedor = async () => {
    if (!proveedorToEdit) return;
    if (!validateFields()) return;

    const updatedProveedorData: ProveedorUpdateDto = {
      nombre: nombre.trim(),
      telefono: telefono.trim() || null,
      direccion: direccion.trim() || null,
    };

    try {
      setLoading(true);
      await ProveedorServices.update(proveedorToEdit.id, updatedProveedorData);
      showSnackbar(`Proveedor "${nombre}" actualizado exitosamente`, "success");
      if (onProveedorUpdated) onProveedorUpdated();
      setTimeout(() => onClose(), 800);
    } catch (err) {
      console.error("Error actualizando proveedor:", err);
      showSnackbar("Ocurrió un error al actualizar el proveedor", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleUpdateProveedor();
    }
  };

  return (
    <BaseModal
      open={open}
      saveText="Actualizar Proveedor"
      onClose={onClose}
      onSave={handleUpdateProveedor}
      title="Actualizar Proveedor"
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

export default ProveedorUpdate;
