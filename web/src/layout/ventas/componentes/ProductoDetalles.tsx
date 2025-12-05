"use client";

import React from "react";
import { Paper, Typography, TextField } from "@mui/material";
import { ProductoDTO } from "../../../Dto/Productos.dto";

interface ProductoDetallesProps {
  producto: ProductoDTO;
  cantidad: number;
  setCantidad: (value: number) => void;
}

const ProductoDetalles: React.FC<ProductoDetallesProps> = ({ producto, cantidad, setCantidad }) => {
  return (
    <Paper sx={{ mt: 4, p: 3 }}>
      <Typography variant="h6">Detalles del Producto</Typography>
      <Typography><strong>Nombre:</strong> {producto.nombre}</Typography>
      <Typography><strong>Stock disponible:</strong> {producto.stock}</Typography>

      <TextField
        label="Cantidad a comprar"
        type="number"
        value={cantidad}
        onChange={(e) => {
          const val = parseInt(e.target.value, 10);
          if (!isNaN(val)) setCantidad(val);
        }}
        inputProps={{ min: 0, max: producto.stock }}
        sx={{ mt: 2 }}
        fullWidth
      />
    </Paper>
  );
};

export default ProductoDetalles;
