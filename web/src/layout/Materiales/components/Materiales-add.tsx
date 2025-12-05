"use client";

import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import BaseModal from "../../../components/global/modal/modal";
import InputField from "../../../components/global/TextField/InputField";
import TextAreaField from "../../../components/global/TextField/TextAreaField";
import MaterialesServices from "../../../api/MaterialesServices";
import { CreateMaterialesDto } from "../../../Dto/Materiales.dto";
import { useSnackbar } from "../../../components/context/SnackbarContext";
import { FileText, Hash } from "lucide-react";

interface MaterialAddProps {
  open: boolean;
  onClose: () => void;
  onMaterialAdded?: () => void;
}

export function MaterialAdd({
  open,
  onClose,
  onMaterialAdded,
}: MaterialAddProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [marca, setMarca] = useState("");
  const [stock, setStock] = useState<number | "">("");
  const [precioUnitario, setPrecioUnitario] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    nombre: "",
    descripcion: "",
    stock: "",
    marca: "",
    precioUnitario: "",
  });

  const { showSnackbar } = useSnackbar();

  const resetForm = () => {
    setNombre("");
    setDescripcion("");
    setStock("");
    setPrecioUnitario("");
    setErrors({
      nombre: "",
      descripcion: "",
      stock: "",
      precioUnitario: "",
      marca: "",
    });
  };

  useEffect(() => {
    if (open) resetForm();
  }, [open]);

  const validateFields = () => {
    const newErrors = {
      nombre: !nombre.trim() ? "Campo obligatorio" : "",
      descripcion: !descripcion.trim() ? "Campo obligatorio" : "",
      stock: stock === "" ? "Campo obligatorio" : "",
      precioUnitario: precioUnitario === "" ? "Campo obligatorio" : "",
      marca: marca === "" ? "Campo obligatorio" : "",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  };

  const handleNumericInput = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    return cleaned === "" ? "" : Number(cleaned);
  };

  const handleAddMaterial = async () => {
    if (!validateFields()) return;

    const newMaterial: CreateMaterialesDto = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      stock: Number(stock),
      marca: marca.trim(),
      precio_unitario_usd: Number(precioUnitario),
    };

    try {
      setLoading(true);
      const response = await MaterialesServices.create(newMaterial);

      if (response) {
        resetForm();
        if (onMaterialAdded) onMaterialAdded();
        setTimeout(() => onClose(), 800);
        showSnackbar("Material creado exitosamente", "success"); // ✅ Snackbar
      }
    } catch (err) {
      console.error("Error creando material:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddMaterial();
    }
  };

  return (
    <BaseModal
      open={open}
      saveText="Añadir Material"
      onClose={onClose}
      onSave={handleAddMaterial}
      title="Añadir Material"
    >
      <Box component="form" onKeyDown={handleKeyPress}>
        <InputField
          label="Nombre del Material"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          startIcon={<FileText />}
          disabled={loading}
          errorMessage={errors.nombre}
        />

        <TextAreaField
          label="Descripción del Material"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          startIcon={<FileText />}
          disabled={loading}
          errorMessage={errors.descripcion}
        />

        <InputField
          label="Marca del Material"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          startIcon={<FileText />}
          disabled={loading}
          errorMessage={errors.marca}
        />

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
          <InputField
            label="Stock"
            value={stock}
            onChange={(e) => setStock(handleNumericInput(e.target.value))}
            startIcon={<Hash />}
            onlyNumbers
            disabled={loading}
            errorMessage={errors.stock}
          />

          <InputField
            label="Precio Unitario (USD)"
            value={precioUnitario}
            onChange={(e) =>
              setPrecioUnitario(handleNumericInput(e.target.value))
            }
            startIcon={<Hash />}
            onlyNumbers
            disabled={loading}
            errorMessage={errors.precioUnitario}
          />
        </Box>
      </Box>
    </BaseModal>
  );
}

export default MaterialAdd;
