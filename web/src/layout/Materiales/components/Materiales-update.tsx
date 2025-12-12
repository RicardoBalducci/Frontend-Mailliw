"use client";

import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import BaseModal from "../../../components/global/modal/modal";
import InputField from "../../../components/global/TextField/InputField";
import TextAreaField from "../../../components/global/TextField/TextAreaField";
import MaterialesServices from "../../../api/MaterialesServices";
import {
  MaterialesDto,
  UpdateMaterialesDto,
} from "../../../Dto/Materiales.dto";
import { useSnackbar } from "../../../components/context/SnackbarContext";
import { FileText, Hash } from "lucide-react";

interface MaterialUpdateProps {
  open: boolean;
  onClose: () => void;
  materialToEdit: MaterialesDto | null;
  onUpdateSuccess?: () => void;
}

export function MaterialUpdate({
  open,
  onClose,
  materialToEdit,
  onUpdateSuccess,
}: MaterialUpdateProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [marca, setMarca] = useState("");
  const [stock, setStock] = useState<number | "">("");
  const [precioUnitario, setPrecioUnitario] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    nombre: "",
    descripcion: "",
    marca: "",
    stock: "",
    precioUnitario: "",
  });

  const { showSnackbar } = useSnackbar();

  // Populate form when modal opens
  useEffect(() => {
    if (open && materialToEdit) {
      setNombre(materialToEdit.nombre || "");
      setDescripcion(materialToEdit.descripcion || "");
      setMarca(materialToEdit.marca || "");
      setStock(materialToEdit.stock || "");
      setPrecioUnitario(materialToEdit.precio_unitario_usd || "");
      setErrors({ nombre: "", descripcion: "", marca: "", stock: "", precioUnitario: "" });
    } else if (!open) {
      setNombre("");
      setDescripcion("");
      setMarca("");
      setStock("");
      setPrecioUnitario("");
      setErrors({ nombre: "", descripcion: "", marca: "", stock: "", precioUnitario: "" });
    }
  }, [open, materialToEdit]);

  const validateFields = () => {
    const newErrors = {
      nombre: !nombre.trim() ? "Campo obligatorio" : "",
      descripcion: !descripcion.trim() ? "Campo obligatorio" : "",
      marca: !marca.trim() ? "Campo obligatorio" : "",
      stock: stock === "" ? "Campo obligatorio" : "",
      precioUnitario: precioUnitario === "" ? "Campo obligatorio" : "",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  };

  const handleNumericInput = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    return cleaned === "" ? "" : Number(cleaned);
  };

  const handleUpdateMaterial = async () => {
    if (!validateFields()) return;
    if (!materialToEdit?.id) return;

    const updatedMaterial: UpdateMaterialesDto = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      marca: marca.trim(),
      stock: Number(stock),
      precio_unitario_usd: Number(precioUnitario),
    };
    try {
      setLoading(true);
      await MaterialesServices.update(materialToEdit.id, updatedMaterial);
      showSnackbar("Material modificado exitosamente", "success");
      if (onUpdateSuccess) onUpdateSuccess();
      setTimeout(() => onClose(), 300);
    } catch (err) {
      console.error("Error actualizando material:", err);
      showSnackbar("Error al modificar el material", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleUpdateMaterial();
    }
  };

  return (
    <BaseModal
      open={open}
      saveText="Guardar Cambios"
      onClose={onClose}
      onSave={handleUpdateMaterial}
      title="Modificar Material"
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

export default MaterialUpdate;
