"use client";

import { useState, useEffect } from "react";
import { Box } from "@mui/material";

import ProductServices from "../../../api/ProductServices";
import { CreateProductoDTO } from "../../../Dto/Productos.dto";

import BaseModal from "../../../components/global/modal/modal";
import InputField from "../../../components/global/TextField/InputField";
import TextAreaField from "../../../components/global/TextField/TextAreaField";
import { Box as BoxIcon, FileText, Hash, Package } from "lucide-react";
import { useSnackbar } from "../../../components/context/SnackbarContext";

interface ProductsAddProps {
  open: boolean;
  onClose: () => void;
  onProductAdded?: () => void;
}

export function ProductsAdd({
  open,
  onClose,
  onProductAdded,
}: ProductsAddProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [stock, setStock] = useState<number | "">("");
  const [precioUnitario, setPrecioUnitario] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const [errors, setErrors] = useState({
    nombre: "",
    descripcion: "",
    stock: "",
    precioUnitario: "",
  });

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
    });
  };

  const validateFields = () => {
    const newErrors = {
      nombre: !nombre.trim() ? "Campo obligatorio" : "",
      descripcion: !descripcion.trim() ? "Campo obligatorio" : "",
      stock: stock === "" ? "Campo obligatorio" : "",
      precioUnitario: precioUnitario === "" ? "Campo obligatorio" : "",
    };

    setErrors(newErrors);

    // Si no hay errores, retorna true
    return Object.values(newErrors).every((e) => e === "");
  };

  const handleAddProduct = async () => {
    if (!validateFields()) return;

    const newProductData: CreateProductoDTO = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      stock: Number(stock),
      precio_unitario: Number(precioUnitario),
    };

    try {
      setLoading(true);
      const response = await ProductServices.createProduct(newProductData);

      if (response?.success) {
        resetForm();
        if (onProductAdded) onProductAdded();
        setTimeout(() => onClose(), 800);
        showSnackbar("Creado exitosamente", "success");
      }
    } catch (err) {
      console.error("Error creando producto:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) resetForm();
  }, [open]);

  const handleNumericInput = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    return cleaned === "" ? "" : Number(cleaned);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddProduct();
    }
  };

  return (
    <BaseModal
      open={open}
      saveText="Añadir Producto"
      onClose={onClose}
      onSave={handleAddProduct}
      title="Añadir Producto"
    >
      <Box component="form" onKeyDown={handleKeyPress}>
        <InputField
          label="Nombre del Producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          startIcon={<Package />}
          sx={{ flex: 2, minWidth: 200 }}
          disabled={loading}
          errorMessage={errors.nombre}
        />

        <TextAreaField
          label="Descripción del Producto"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          startIcon={<FileText />}
          sx={{ flex: 2, minWidth: 200 }}
          rows={4}
          disabled={loading}
          errorMessage={errors.descripcion}
        />

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
          <InputField
            label="Stock"
            value={stock}
            onChange={(e) => setStock(handleNumericInput(e.target.value))}
            startIcon={<BoxIcon />}
            sx={{ flex: 1, minWidth: 150 }}
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
            sx={{ flex: 1, minWidth: 150 }}
            onlyNumbers
            disabled={loading}
            errorMessage={errors.precioUnitario}
          />
        </Box>
      </Box>
    </BaseModal>
  );
}

export default ProductsAdd;
