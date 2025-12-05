"use client";

import { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { TextField, MenuItem, Box, styled, alpha } from "@mui/material";
import { useSnackbar } from "../../../components/context/SnackbarContext";
import { UserDto } from "../../Technics/interface/user.dto";
import UserServices from "../../../api/UserSevices";
import BaseModal from "../../../components/global/modal/modal";
import InputField from "../../../components/global/TextField/InputField";

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

interface PersonalAddProps {
  open: boolean;
  onClose: () => void;
  onPersonalAdded?: () => void;
}

const roles = [
  { value: "administrador", label: "Administrador" },
  { value: "gerente", label: "Gerente" },
];

export function PersonalAdd({ open, onClose, onPersonalAdded }: PersonalAddProps) {
  const { showSnackbar } = useSnackbar();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phoneCode, setPhoneCode] = useState("0412");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("tecnico");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    nombre: "",
    apellido: "",
    email: "",
    phone: "",
    username: "",
  });

  // Validación
  const validateFields = (): boolean => {
    const newErrors = {
      nombre: !nombre.trim() ? "El nombre es obligatorio" : "",
      apellido: !apellido.trim() ? "El apellido es obligatorio" : "",
      email: !email.trim()
        ? "El correo es obligatorio"
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? "Correo inválido"
        : "",
      phone: !phoneNumber.trim()
        ? "El teléfono es obligatorio"
        : !/^\d+$/.test(phoneNumber)
        ? "Solo números permitidos"
        : "",
      username: !username.trim() ? "El usuario es obligatorio" : "",
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some((e) => e !== "")) {
      showSnackbar("Por favor completa todos los campos correctamente.", "error");
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setNombre("");
    setApellido("");
    setEmail("");
    setUsername("");
    setPhoneCode("0412");
    setPhoneNumber("");
    setRole("tecnico");
    setErrors({
      nombre: "",
      apellido: "",
      email: "",
      phone: "",
      username: "",
    });
  };

  const handleAddPersonal = async () => {
    if (!validateFields()) return;

    const newUser: UserDto = {
      nombre,
      apellido,
      email,
      username,
      phone: `${phoneCode}-${phoneNumber}`,
      role,
      password: "12345678", // password por defecto
    };

    try {
      setLoading(true);
      const response = await UserServices.createTechnician(newUser);

      if (response.success) {
        showSnackbar("Personal añadido exitosamente", "success");
        if (onPersonalAdded) onPersonalAdded();
        resetForm();
        onClose();
      } else {
        showSnackbar(response.message || "Error al añadir personal", "error");
      }
    } catch (err) {
      console.error("Error al crear personal:", err);
      showSnackbar("Error inesperado al añadir personal", "error");
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
      onClose={onClose}
      onSave={handleAddPersonal}
      saveText={loading ? "Guardando..." : "Añadir Personal"}
      title="Añadir Personal"
    >
      <InputField
        label="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        startIcon={<PersonIcon />}
        disabled={loading}
        errorMessage={errors.nombre}
      />
      <InputField
        label="Apellido"
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
        startIcon={<EngineeringIcon />}
        disabled={loading}
        errorMessage={errors.apellido}
      />
      <InputField
        label="Correo Electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        startIcon={<EmailIcon />}
        disabled={loading}
        errorMessage={errors.email}
      />
      <InputField
        label="Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        startIcon={<PersonIcon />}
        disabled={loading}
        errorMessage={errors.username}
      />

      {/* Teléfono con select de código */}
      <Box display="flex" gap={2} mt={1}>
        <StyledTextField
          select
          label="Código"
          value={phoneCode}
          onChange={(e) => setPhoneCode(e.target.value)}
          fullWidth
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
          maxLength={7}
          errorMessage={errors.phone}
          disabled={loading}
        />
      </Box>

      {/* Rol */}
      <StyledTextField
        select
        label="Rol"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        fullWidth
        margin="normal"
        disabled={loading}
      >
        {roles.map((r) => (
          <MenuItem key={r.value} value={r.value}>
            {r.label}
          </MenuItem>
        ))}
      </StyledTextField>
    </BaseModal>
  );
}

export default PersonalAdd;
