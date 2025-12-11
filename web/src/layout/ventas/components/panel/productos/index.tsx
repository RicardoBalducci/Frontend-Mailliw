"use client";

import {
  Card,
  CardHeader,
  CardContent,
  Box,
  TextField,
  Button,
  Autocomplete,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import ProductServices from "../../../../../api/ProductServices";
import { useSnackbar } from "../../../../../components/context/SnackbarContext";
import { ProductoDTO } from "../../../../../Dto/Productos.dto";

// Tipo que usamos para el carrito
export interface ProductRow {
  id: number;
  nombre: string;
  descripcion?: string;
  stock: number;
  marca?: string;
  precio_unitario: number; // tomaremos de precio_venta
  precio_venta?: number;
}

interface PanelProductosProps {
  onAddToCart: (producto: ProductRow, cantidad: number) => void;
}

export default function PanelProductos({ onAddToCart }: PanelProductosProps) {
  const { showSnackbar } = useSnackbar();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductRow | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    fetchProducts();
  }, []);

const fetchProducts = async () => {
  try {
    setLoading(true);
    const response = await ProductServices.fetchProductos();
    if (response.success && response.data) {
      const mapped: ProductRow[] = (response.data as ProductoDTO[]).map((p) => ({
        id: p.id,
        nombre: p.nombre,
        descripcion: p.descripcion,
        stock: p.stock,
        marca: p.marca,
        precio_unitario: Number(p.precio_venta), // Normalizamos para carrito
        precio_venta: Number(p.precio_venta),
      }));
      setProducts(mapped);
    } else {
      setProducts([]);
      showSnackbar(response.message || "Error al cargar productos", "error");
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    showSnackbar("Error al cargar productos", "error");
    setProducts([]);
  } finally {
    setLoading(false);
  }
};
  const handleAdd = () => {
    if (!selectedProduct) {
      showSnackbar("Selecciona un producto", "warning");
      return;
    }
    if (quantity > selectedProduct.stock) {
      showSnackbar(
        `Cantidad no puede superar el stock (${selectedProduct.stock})`,
        "warning"
      );
      return;
    }

    onAddToCart(selectedProduct, quantity);
    showSnackbar(
      `Añadido al carrito: ${selectedProduct.nombre} (Cantidad: ${quantity})`,
      "success"
    );
    setSelectedProduct(null);
    setQuantity(1);
  };

  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 3,
        boxShadow: 4,
        background: "linear-gradient(135deg, #fdfdfd, #e3f2fd)",
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6" fontWeight={700} color="primary">
            Panel Productos
          </Typography>
        }
      />

      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            gap: 2,
            mt: 1,
          }}
        >
          <Autocomplete
            sx={{ flex: 1, minWidth: 200 }}
            options={products}
            getOptionLabel={(option) => option.nombre}
            value={selectedProduct}
            onChange={(_, newValue) => {
              setSelectedProduct(newValue);
              setQuantity(1);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Selecciona un producto"
                variant="outlined"
                fullWidth
              />
            )}
          />

          <TextField
            label="Cantidad"
            type="number"
            value={quantity}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (selectedProduct) {
                setQuantity(Math.min(Math.max(1, val), selectedProduct.stock));
              } else {
                setQuantity(Math.max(1, val));
              }
            }}
            inputProps={{
              min: 1,
              max: selectedProduct?.stock || 1,
            }}
            sx={{ width: { xs: "100%", sm: 120 } }}
            disabled={!selectedProduct}
          />

          <Button
            variant="contained"
            color="success"
            sx={{ height: 56, width: { xs: "100%", sm: "auto" } }}
            onClick={handleAdd}
            disabled={!selectedProduct}
          >
            Añadir al carrito
          </Button>
        </Box>

        {selectedProduct && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, fontStyle: "italic" }}
          >
            Stock disponible: {selectedProduct.stock}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
