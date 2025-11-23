"use client";

import { useState, useEffect } from "react";
import BaseModal from "../../../components/global/modal/modal";
import InputField from "../../../components/global/TextField/InputField";
import { UserDto } from "../interface/user.dto";
import UserServices from "../../../api/UserSevices";
import { Mail, Phone, User } from "lucide-react";
import { useSnackbar } from "../../../components/context/SnackbarContext";

interface TecnicoUpdateProps {
  open: boolean;
  onClose: () => void;
  selectedTecnico: UserDto | null;
  onTecnicoUpdated?: () => void; // callback para refrescar datos
}

export function TecnicoUpdate({
  open,
  onClose,
  selectedTecnico,
  onTecnicoUpdated,
}: TecnicoUpdateProps) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(false);

  const { showSnackbar } = useSnackbar();
  // Cargar los datos del técnico cuando se abre el modal
  useEffect(() => {
    if (open && selectedTecnico) {
      setNombre(selectedTecnico.nombre || "");
      setApellido(selectedTecnico.apellido || "");
      setEmail(selectedTecnico.email || "");
      setTelefono(selectedTecnico.phone || "");
    }
  }, [open, selectedTecnico]);

  // ✅ Actualizar técnico
  const handleUpdateTecnico = async () => {
    if (
      !nombre.trim() ||
      !apellido.trim() ||
      !email.trim() ||
      !telefono.trim()
    ) {
      showSnackbar("Todos los campos son obligatorios.", "error");

      return;
    }

    if (!selectedTecnico?.id) {
      console.error("❌ No hay técnico seleccionado para actualizar.");
      return;
    }

    const updatedData: Partial<UserDto> = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim(),
      phone: telefono.trim(),
    };

    try {
      setLoading(true);
      const response = await UserServices.updateTechnician(
        selectedTecnico.id,
        updatedData
      );

      if (response && response.id) {
        showSnackbar("Técnico actualizado correctamente", "success");

        if (onTecnicoUpdated) onTecnicoUpdated();

        onClose();
      } else {
        console.error(
          "❌ Error: No se recibió un objeto válido al actualizar."
        );
        alert("Error: No se pudo actualizar el técnico correctamente.");
      }
    } catch (err) {
      console.error("💥 Error al actualizar el técnico:", err);
      showSnackbar("Error al actualizar el técnico", "success");
    } finally {
      setLoading(false);
    }
  };

  // Permitir solo caracteres válidos en el campo teléfono
  const handlePhoneChange = (value: string) => {
    const valid = value.replace(/[^0-9+\-\s()]/g, "");
    setTelefono(valid);
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

      <InputField
        label="Teléfono"
        value={telefono}
        onChange={(e) => handlePhoneChange(e.target.value)}
        startIcon={<Phone />}
        disabled={loading}
        errorMessage={!telefono ? "Campo obligatorio" : undefined}
      />
    </BaseModal>
  );
}

export default TecnicoUpdate;
