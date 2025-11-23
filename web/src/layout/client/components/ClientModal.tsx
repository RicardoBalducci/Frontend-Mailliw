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

  // ✅ ESTADOS DE TELÉFONO
  const [phoneCode, setPhoneCode] = useState("0412");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [errors, setErrors] = useState({
    rifNumber: "",
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
  });

  const { showSnackbar } = useSnackbar();

  // ✅ CARGA DE CLIENTE AL EDITAR
  useEffect(() => {
    if (currentClient) {
      const rifParts = currentClient.rif.split("-");
      setRifType(rifParts[0] || "V");
      setRifNumber(rifParts[1] || "");

      setNombre(currentClient.nombre);
      setApellido(currentClient.apellido || "");
      setDireccion(currentClient.direccion);

      // === CARGA TELEFONO DESGLOSADO ===
      if (currentClient.telefono.includes("-")) {
        const [code, number] = currentClient.telefono.split("-");
        setPhoneCode(code || "0412");
        setPhoneNumber(number || "");
      } else {
        setPhoneCode("0412");
        setPhoneNumber(currentClient.telefono);
      }
    } else {
      setRifType("V");
      setRifNumber("");
      setNombre("");
      setApellido("");
      setDireccion("");

      setPhoneCode("0412");
      setPhoneNumber("");
    }

    setErrors({
      rifNumber: "",
      nombre: "",
      apellido: "",
      direccion: "",
      telefono: "",
    });
  }, [currentClient, open]);

  const isCompany = rifType === "G" || rifType === "J";

  // ✅ VALIDACIÓN AJUSTADA
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

    if (!phoneNumber.trim()) {
      newErrors.telefono = "Campo requerido";
      valid = false;
    } else newErrors.telefono = "";

    setErrors(newErrors);
    return valid;
  };

  // ✅ GUARDADO CONCATENADO
  const handleLocalSave = async () => {
    if (!validateForm()) return;

    const clientDataToSave: ClientData = {
      id: currentClient?.id,
      rif: `${rifType}-${rifNumber}`,
      nombre,
      apellido: apellido || "",
      direccion,
      telefono: `${phoneCode}-${phoneNumber}`, // ← ✔ AQUÍ
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
      onClose();
    }
  };

  const rifMaxLength =
    {
      V: 8,
      E: 9,
      J: 9,
      G: 9,
      R: 10,
    }[rifType] || 10;

  return (
    <BaseModal
      open={open}
      saveText={currentClient ? "Editar Cliente" : "Crear Cliente"}
      onClose={onClose}
      onSave={handleLocalSave}
      title={currentClient ? "Editar Cliente" : "Nuevo Cliente"}
    >
      {/* ===================== RIF ===================== */}
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
          onlyNumbers
          maxLength={rifMaxLength}
          errorMessage={errors.rifNumber}
          sx={{ flex: 2, minWidth: 200 }}
        />
      </Box>

      {/* ===================== NOMBRE ===================== */}
      <InputField
        label="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        startIcon={<User />}
        errorMessage={errors.nombre}
        onlyLetters
      />

      {!isCompany && (
        <InputField
          label="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          startIcon={<User />}
          errorMessage={errors.apellido}
          onlyLetters
        />
      )}

      {/* ===================== DIRECCIÓN ===================== */}
      <TextAreaField
        label="Dirección"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        startIcon={<LocateIcon />}
        errorMessage={errors.direccion}
      />

      {/* ===================== TELÉFONO ===================== */}
      <Box display="flex" gap={2}>
        <StyledTextField
          select
          label="Código"
          value={phoneCode}
          onChange={(e) => setPhoneCode(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ flex: 1, minWidth: 120 }}
        >
          <MenuItem value="0412">0412</MenuItem>
          <MenuItem value="0414">0414</MenuItem>
          <MenuItem value="0416">0416</MenuItem>
          <MenuItem value="0424">0424</MenuItem>
          <MenuItem value="0426">0426</MenuItem>
        </StyledTextField>

        <InputField
          label="Teléfono"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          startIcon={<Phone />}
          onlyNumbers
          maxLength={7}
          errorMessage={errors.telefono}
          sx={{ flex: 2 }}
        />
      </Box>
    </BaseModal>
  );
};

export default ClientModal;
