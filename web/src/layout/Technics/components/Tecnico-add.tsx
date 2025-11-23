"use client";

import { useEffect, useState } from "react";
import BaseModal from "../../../components/global/modal/modal";
import InputField from "../../../components/global/TextField/InputField";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import EngineeringIcon from "@mui/icons-material/Engineering";

import { UserDto } from "../interface/user.dto";
import UserServices from "../../../api/UserSevices";
import { useSnackbar } from "../../../components/context/SnackbarContext";

interface TecnicoAddProps {
  open: boolean;
  onClose: () => void;
  onTecnicoAdded?: () => void;
}

export function TecnicoAdd({ open, onClose, onTecnicoAdded }: TecnicoAddProps) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [, setSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    nombre: "",
    apellido: "",
    email: "",
    phone: "",
  });

  // ✅ Validación básica por campo
  const validateFields = (): boolean => {
    const newErrors = {
      nombre: !nombre.trim() ? "El nombre es obligatorio" : "",
      apellido: !apellido.trim() ? "El apellido es obligatorio" : "",
      email: !email.trim()
        ? "El correo es obligatorio"
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? "Correo electrónico inválido"
        : "",
      phone: !phone.trim()
        ? "El teléfono es obligatorio"
        : !/^\d+$/.test(phone)
        ? "Solo se permiten números"
        : "",
    };
    showSnackbar("Todos los campos son obligatorios.", "error");

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === "");
  };

  const resetForm = () => {
    setNombre("");
    setApellido("");
    setEmail("");
    setPhone("");
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
      phone,
      role: "tecnico",
    };

    try {
      setLoading(true);
      const response = await UserServices.createTechnician(newTecnico);

      if (response.success) {
        showSnackbar("Tecnico añadido exitosamente", "success");
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
      />

      <InputField
        label="Apellido"
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
        startIcon={<EngineeringIcon />}
        sx={{ flex: 1, minWidth: 200 }}
        disabled={loading}
        errorMessage={errors.apellido}
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

      <InputField
        label="Teléfono"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        startIcon={<PhoneIcon />}
        sx={{ flex: 1, minWidth: 200 }}
        onlyNumbers
        disabled={loading}
        errorMessage={errors.phone}
      />
    </BaseModal>
  );
}

export default TecnicoAdd;
