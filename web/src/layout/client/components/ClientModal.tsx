"use client";

import React, { useState, useEffect } from "react";
import { TextField, MenuItem, Box } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";

import BaseModal from "../../../components/global/modal/modal";
import InputField from "../../../components/global/TextField/InputField";
import TextAreaField from "../../../components/global/TextField/TextAreaField";
import { LocateIcon, User, Phone, Hash } from "lucide-react";
import { useSnackbar } from "../../../components/context/SnackbarContext";

export interface ClientData {
  id?: number;
  rif: string;
  nombre: string;
  apellido?: string;
  direccion: string;
  telefono: string;
}

interface ClientModalProps {
  open: boolean;
  onClose: () => void;
  currentClient?: ClientData | null;
  onRefresh: () => void;
  onSave: (clientData: ClientData) => Promise<boolean>;
}

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius as number,
    transition: "all 0.3s",
    "&:hover": {
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    },
    "&.Mui-focused": {
      boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.25)}`,
    },
  },
}));

const ClientModal: React.FC<ClientModalProps> = ({
  open,
  onClose,
  currentClient,
  onRefresh,
  onSave,
}) => {
  const [rifType, setRifType] = useState("V");
  const [rifNumber, setRifNumber] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");

  const [errors, setErrors] = useState({
    rifNumber: "",
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
  });

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (currentClient) {
      const rifParts = currentClient.rif.split("-");
      setRifType(rifParts[0] || "V");
      setRifNumber(rifParts[1] || "");
      setNombre(currentClient.nombre);
      setApellido(currentClient.apellido || "");
      setDireccion(currentClient.direccion);
      setTelefono(currentClient.telefono);
    } else {
      setRifType("V");
      setRifNumber("");
      setNombre("");
      setApellido("");
      setDireccion("");
      setTelefono("");
    }
    // Reset errors al abrir modal
    setErrors({
      rifNumber: "",
      nombre: "",
      apellido: "",
      direccion: "",
      telefono: "",
    });
  }, [currentClient, open]);

  const isCompany = rifType === "G" || rifType === "J";

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors = { ...errors };

    if (!rifNumber.trim()) {
      newErrors.rifNumber = "Campo requerido";
      valid = false;
    } else newErrors.rifNumber = "";

    if (!nombre.trim()) {
      newErrors.nombre = "Campo requerido";
      valid = false;
    } else newErrors.nombre = "";

    if (!isCompany && !apellido.trim()) {
      newErrors.apellido = "Campo requerido";
      valid = false;
    } else newErrors.apellido = "";

    if (!direccion.trim()) {
      newErrors.direccion = "Campo requerido";
      valid = false;
    } else newErrors.direccion = "";

    if (!telefono.trim()) {
      newErrors.telefono = "Campo requerido";
      valid = false;
    } else newErrors.telefono = "";

    setErrors(newErrors);
    return valid;
  };

  const handleLocalSave = async () => {
    if (!validateForm()) return;

    const clientDataToSave: ClientData = {
      id: currentClient?.id,
      rif: `${rifType}-${rifNumber}`,
      nombre,
      apellido: apellido || "",
      direccion,
      telefono,
    };

    try {
      const success = await onSave(clientDataToSave);
      if (success) {
        showSnackbar(
          currentClient
            ? "Cliente actualizado correctamente"
            : "Cliente creado correctamente",
          "success"
        );
        onRefresh();
      }
    } finally {
      onClose(); // cierra automáticamente el modal
    }
  };

  return (
    <BaseModal
      open={open}
      saveText={currentClient ? "Editar Cliente" : "Crear Cliente"}
      onClose={onClose}
      onSave={handleLocalSave}
      title={currentClient ? "Editar Cliente" : "Nuevo Cliente"}
    >
      <Box display="flex" gap={2} flexWrap="wrap">
        <StyledTextField
          select
          label="Tipo de RIF / Cédula"
          value={rifType}
          onChange={(e) => setRifType(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ flex: 1, minWidth: 150 }}
        >
          <MenuItem value="V">V - Venezolano</MenuItem>
          <MenuItem value="E">E - Extranjero</MenuItem>
          <MenuItem value="J">J - Jurídico</MenuItem>
          <MenuItem value="G">G - Gubernamental</MenuItem>
          <MenuItem value="R">R - Rif</MenuItem>
        </StyledTextField>

        <InputField
          label="Número de RIF"
          value={rifNumber}
          onChange={(e) => setRifNumber(e.target.value)}
          startIcon={<Hash />}
          errorMessage={errors.rifNumber}
          sx={{ flex: 2, minWidth: 200 }}
        />
      </Box>

      <InputField
        label="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        startIcon={<User />}
        errorMessage={errors.nombre}
      />

      {!isCompany && (
        <InputField
          label="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          startIcon={<User />}
          errorMessage={errors.apellido}
        />
      )}

      <TextAreaField
        label="Dirección"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        startIcon={<LocateIcon />}
        errorMessage={errors.direccion}
      />

      <InputField
        label="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        startIcon={<Phone />}
        errorMessage={errors.telefono}
      />
    </BaseModal>
  );
};

export default ClientModal;
