"use client";

import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import BaseModal from "../../../components/global/modal/modal";
import InputField from "../../../components/global/TextField/InputField";
import TextAreaField from "../../../components/global/TextField/TextAreaField";
import { Box as BoxIcon, FileText, Hash, Package } from "lucide-react";
import { ProductoDTO, UpdateProductoDTO } from "../../../Dto/Productos.dto";
import ProductServices from "../../../api/ProductServices";
import { useSnackbar } from "../../../components/context/SnackbarContext";

interface ProductsEditProps {
  open: boolean;
  onClose: () => void;
  product: ProductoDTO | null;
  onProductUpdated?: () => void;
}

export function ProductsEdit({
  open,
  onClose,
  product,
  onProductUpdated,
}: ProductsEditProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [stock, setStock] = useState<number | "">("");
  const [precioUnitario, setPrecioUnitario] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (open && product) {
      setNombre(product.nombre || "");
      setDescripcion(product.descripcion || "");
      setStock(product.stock || "");
      setPrecioUnitario(product.precio_unitario || "");
    }
  }, [open, product]);

  const handleNumericInput = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    return cleaned === "" ? "" : Number(cleaned);
  };

  const handleUpdateProduct = async () => {
    if (
      !nombre.trim() ||
      !descripcion.trim() ||
      stock === "" ||
      precioUnitario === ""
    ) {
      return;
    }

    const updatedProduct: UpdateProductoDTO = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      stock: Number(stock),
      precio_unitario: Number(precioUnitario),
    };

    if (!product) {
      console.error("No hay producto seleccionado para actualizar.");
      return;
    }

    try {
      setLoading(true);

      const response = await ProductServices.updateProduct(
        product.id, // ✅ ahora typescript sabe que no es null
        updatedProduct
      );

      if (response.success) {
        showSnackbar("Modificación realizada exitosamente", "success");
        if (onProductUpdated) onProductUpdated();
        setTimeout(() => onClose(), 1000);
      }
    } catch (err) {
      console.error("Error al actualizar el producto:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      open={open}
      saveText="Guardar Cambios"
      onClose={onClose}
      onSave={handleUpdateProduct}
      title="Modificar Producto"
    >
      <InputField
        label="Nombre del Producto"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        startIcon={<Package />}
        disabled={loading}
        errorMessage={!nombre ? "Campo obligatorio" : undefined}
      />

      <TextAreaField
        label="Descripción del Producto"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        startIcon={<FileText />}
        rows={4}
        disabled={loading}
        errorMessage={!descripcion ? "Campo obligatorio" : undefined}
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
          errorMessage={stock === "" ? "Campo obligatorio" : undefined}
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
          errorMessage={precioUnitario === "" ? "Campo obligatorio" : undefined}
        />
      </Box>
    </BaseModal>
  );
}

export default ProductsEdit;
