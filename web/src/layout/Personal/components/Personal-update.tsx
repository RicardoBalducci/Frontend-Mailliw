import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { UserDto } from "../../Technics/interface/user.dto";
import UserServices from "../../../api/UserSevices";

interface PersonalUpdateProps {
  open: boolean;
  onClose: () => void;
  selectedPersonal: UserDto | null;
  onPersonalUpdated: () => void;
}

const roles = [
  { value: "administrador", label: "Administrador" },
  { value: "tecnico", label: "Técnico" },
];

const PersonalUpdate: React.FC<PersonalUpdateProps> = ({
  open,
  onClose,
  selectedPersonal,
  onPersonalUpdated,
}) => {
  const [form, setForm] = useState<Partial<UserDto>>(selectedPersonal || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(selectedPersonal || {});
  }, [selectedPersonal]);

  const handleChange = (field: keyof UserDto, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedPersonal?.id) return;
    setLoading(true);
    try {
      await UserServices.updateTechnician(selectedPersonal.id, form);
      onPersonalUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar personal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Personal</DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth
          margin="normal"
          label="Nombre"
          value={form.nombre || ""}
          onChange={(e) => handleChange("nombre", e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Apellido"
          value={form.apellido || ""}
          onChange={(e) => handleChange("apellido", e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          value={form.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Usuario"
          value={form.username || ""}
          onChange={(e) => handleChange("username", e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Teléfono"
          value={form.phone || ""}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
        <TextField
          select
          fullWidth
          margin="normal"
          label="Rol"
          value={form.role || "tecnico"}
          onChange={(e) => handleChange("role", e.target.value)}
        >
          {roles.map((r) => (
            <MenuItem key={r.value} value={r.value}>
              {r.label}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PersonalUpdate;
