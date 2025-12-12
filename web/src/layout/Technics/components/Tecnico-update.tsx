"use client";

import { useState, useEffect } from "react";
import BaseModal from "../../../components/global/modal/modal";
import InputField from "../../../components/global/TextField/InputField";
import { Mail, Phone, User } from "lucide-react";

import { TextField, MenuItem, Box } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";

import { UserDto } from "../interface/user.dto";
import UserServices from "../../../api/UserSevices";
import { useSnackbar } from "../../../components/context/SnackbarContext";

interface TecnicoUpdateProps {
  open: boolean;
  onClose: () => void;
  selectedTecnico: UserDto | null;
  onTecnicoUpdated?: () => void;
}

// 🌟 StyledTextField igual al de TecnicoAdd
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

export function TecnicoUpdate({
  open,
  onClose,
  selectedTecnico,
  onTecnicoUpdated,
}: TecnicoUpdateProps) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");

  // Nueva estructura del teléfono
  const [phoneCode, setPhoneCode] = useState("0412");
  const [phoneNumber, setPhoneNumber] = useState("");

  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  // 📌 Cargar datos cuando se abre el modal
  useEffect(() => {
    if (open && selectedTecnico) {
      setNombre(selectedTecnico.nombre || "");
      setApellido(selectedTecnico.apellido || "");
      setEmail(selectedTecnico.email || "");

      // ✔ Extraer código y número: Ejemplo => "0412-1234567"
      if (selectedTecnico.phone?.includes("-")) {
        const [code, num] = selectedTecnico.phone.split("-");
        setPhoneCode(code);
        setPhoneNumber(num);
      } else {
        setPhoneNumber(selectedTecnico.phone || "");
      }
    }
  }, [open, selectedTecnico]);

  // Guardar técnico actualizado
  const handleUpdateTecnico = async () => {
    if (!nombre || !apellido || !email || !phoneNumber) {
      showSnackbar("Todos los campos son obligatorios.", "error");
      return;
    }

    if (!selectedTecnico?.id) return;

    const updatedData: Partial<UserDto> = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim(),
      phone: `${phoneCode}-${phoneNumber}`,
    };

    try {
      setLoading(true);
      const response = await UserServices.updateTechnician(
        selectedTecnico.id,
        updatedData
      );

      if (response && response.id) {
        showSnackbar("Técnico actualizado correctamente", "success");
        onTecnicoUpdated?.();
        onClose();
      } else {
        showSnackbar("Error al actualizar el técnico", "error");
      }
    } catch (err) {
      console.error("Error al actualizar técnico:", err);
      showSnackbar("Ocurrió un error al actualizar.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      open={open}
      saveText="Guardar Cambios"
      onClose={onClose}
      onSave={handleUpdateTecnico}
      title="Modificar Técnico"
    >
      <InputField
        label="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        startIcon={<User />}
        disabled={loading}
        errorMessage={!nombre ? "Campo obligatorio" : undefined}
      />

      <InputField
        label="Apellido"
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
        startIcon={<User />}
        disabled={loading}
        errorMessage={!apellido ? "Campo obligatorio" : undefined}
      />

      <InputField
        label="Correo Electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        startIcon={<Mail />}
        disabled={loading}
        errorMessage={!email ? "Campo obligatorio" : undefined}
      />

      {/* ⭐ Teléfono con Select de Código + Número */}
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
          startIcon={<Phone />}
          onlyNumbers
          maxLength={7}
          disabled={loading}
          errorMessage={!phoneNumber ? "Campo obligatorio" : undefined}
          sx={{ flex: 2 }}
        />
      </Box>
    </BaseModal>
  );
}

export default TecnicoUpdate;
