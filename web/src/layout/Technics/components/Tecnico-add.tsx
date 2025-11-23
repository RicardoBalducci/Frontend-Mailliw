"use client";

import { useEffect, useState } from "react";
import BaseModal from "../../../components/global/modal/modal";
import InputField from "../../../components/global/TextField/InputField";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { TextField, MenuItem, Box } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";

import { UserDto } from "../interface/user.dto";
import UserServices from "../../../api/UserSevices";
import { useSnackbar } from "../../../components/context/SnackbarContext";

interface TecnicoAddProps {
  open: boolean;
  onClose: () => void;
  onTecnicoAdded?: () => void;
}

// StyledTextField para select
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

export function TecnicoAdd({ open, onClose, onTecnicoAdded }: TecnicoAddProps) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("0412"); // 🔹 Código telefónico
  const [phoneNumber, setPhoneNumber] = useState(""); // 🔹 Número sin código

  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [, setSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    nombre: "",
    apellido: "",
    email: "",
    phone: "",
  });

  // ✅ Validación
  const validateFields = (): boolean => {
    const newErrors = {
      nombre: !nombre.trim() ? "El nombre es obligatorio" : "",
      apellido: !apellido.trim() ? "El apellido es obligatorio" : "",
      email: !email.trim()
        ? "El correo es obligatorio"
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? "Correo electrónico inválido"
        : "",
      phone: !phoneNumber.trim()
        ? "El teléfono es obligatorio"
        : !/^\d+$/.test(phoneNumber)
        ? "Solo se permiten números"
        : "",
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some((err) => err !== "")) {
      showSnackbar("Todos los campos son obligatorios.", "error");
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setNombre("");
    setApellido("");
    setEmail("");
    setPhoneCode("0412");
    setPhoneNumber("");
    setErrors({
      nombre: "",
      apellido: "",
      email: "",
      phone: "",
    });
    setSuccess(null);
  };

  const handleAddTecnico = async () => {
    if (!validateFields()) return;

    const newTecnico: UserDto = {
      username: nombre,
      nombre,
      apellido,
      email,
      password: "12345678",
      phone: `${phoneCode}-${phoneNumber}`, // 🔹 Concatenado
      role: "tecnico",
    };

    try {
      setLoading(true);
      const response = await UserServices.createTechnician(newTecnico);

      if (response.success) {
        showSnackbar("Técnico añadido exitosamente", "success");
        if (onTecnicoAdded) onTecnicoAdded();

        resetForm();
        onClose();
      } else {
        setErrors((prev) => ({
          ...prev,
          nombre: response.message || "Error al añadir el técnico",
        }));
      }
    } catch (err) {
      console.error("Error al crear técnico:", err);
      showSnackbar("Error al crear técnico:", "error");
      setErrors((prev) => ({
        ...prev,
        nombre: "Error inesperado al añadir el técnico.",
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) resetForm();
  }, [open]);

  return (
    <BaseModal
      open={open}
      saveText={loading ? "Guardando..." : "Añadir Técnico"}
      onClose={onClose}
      onSave={handleAddTecnico}
      title="Añadir Técnico"
    >
      <InputField
        label="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        startIcon={<PersonIcon />}
        sx={{ flex: 1, minWidth: 200 }}
        disabled={loading}
        errorMessage={errors.nombre}
        onlyLetters
      />

      <InputField
        label="Apellido"
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
        startIcon={<EngineeringIcon />}
        sx={{ flex: 1, minWidth: 200 }}
        disabled={loading}
        errorMessage={errors.apellido}
        onlyLetters
      />

      <InputField
        label="Correo Electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        startIcon={<EmailIcon />}
        sx={{ flex: 1, minWidth: 200 }}
        disabled={loading}
        errorMessage={errors.email}
      />

      {/* 🔹 Teléfono con select de código + número */}
      <Box display="flex" gap={2}>
        <StyledTextField
          select
          label="Código"
          value={phoneCode}
          onChange={(e) => setPhoneCode(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ flex: 1, minWidth: 120 }}
          disabled={loading}
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
          startIcon={<PhoneIcon />}
          onlyNumbers
          maxLength={7} // Números locales
          errorMessage={errors.phone}
          sx={{ flex: 2 }}
          disabled={loading}
        />
      </Box>
    </BaseModal>
  );
}

export default TecnicoAdd;
