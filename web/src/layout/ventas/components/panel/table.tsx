"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { formatNumber } from "../../../../utils/format";

export type CartItem = {
  id: number;
  tipo: "producto" | "servicio";
  nombre: string;
  descripcion?: string;
  precio_unitario: number; // siempre normalizado
  cantidad: number;
};

interface CartTableProps {
  cart: CartItem[];
  onRemove: (id: number, tipo: "producto" | "servicio") => void;
}

export default function CartTable({ cart, onRemove }: CartTableProps) {
  const [dollarOficial, setDollarOficial] = useState<number>(1);

  useEffect(() => {
    const storedDollar = localStorage.getItem("dollar_oficial");
    if (storedDollar) setDollarOficial(Number(storedDollar));
  }, []);

  if (cart.length === 0)
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 6,
          backgroundColor: "rgba(33, 150, 243, 0.04)",
          borderRadius: 2,
          border: "1px dashed rgba(0,0,0,0.2)",
          mt: 3,
        }}
      >
        <Typography color="textSecondary">No hay items en el carrito</Typography>
      </Box>
    );

  return (
    <TableContainer
      component={Paper}
      sx={{
        mt: 3,
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <Table>
        <TableHead sx={{ background: "linear-gradient(135deg, #1a73e8 0%, #1565c0 100%)" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", color: "white" }}>Item</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold", color: "white" }}>
              Cantidad
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold", color: "white" }}>
              Precio $
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold", color: "white" }}>
              Subtotal $
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold", color: "white" }}>
              Precio BS
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold", color: "white" }}>
              Subtotal BS
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>
              Acción
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cart.map((item) => (
            <TableRow
              key={`${item.tipo}-${item.id}`}
              hover
              sx={{
                "&:hover": { backgroundColor: "rgba(33, 150, 243, 0.05)" },
              }}
            >
              <TableCell sx={{ py: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {item.nombre}
                  </Typography>
                  <Chip
                    label={item.tipo === "servicio" ? "Servicio" : "Producto"}
                    size="small"
                    variant="outlined"
                    sx={{
                      mt: 0.5,
                      backgroundColor:
                        item.tipo === "servicio"
                          ? "rgba(67, 160, 71, 0.1)"
                          : "rgba(251, 140, 0, 0.1)",
                      borderColor: item.tipo === "servicio" ? "#43a047" : "#fb8c00",
                      color: item.tipo === "servicio" ? "#43a047" : "#fb8c00",
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </TableCell>

              <TableCell align="right" sx={{ fontWeight: 600 }}>
                {item.cantidad}
              </TableCell>

              <TableCell align="right">${formatNumber(item.precio_unitario)}</TableCell>

              <TableCell align="right" sx={{ fontWeight: "bold", color: "#1a73e8" }}>
                $ {formatNumber(item.precio_unitario * item.cantidad)}
              </TableCell>

              <TableCell align="right">
                Bs. {formatNumber(item.precio_unitario * dollarOficial)}
              </TableCell>

              <TableCell align="right" sx={{ fontWeight: "bold", color: "#1a73e8" }}>
                Bs. {formatNumber(item.precio_unitario * item.cantidad * dollarOficial)}
              </TableCell>

              <TableCell align="center">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onRemove(item.id, item.tipo)}
                  sx={{ "&:hover": { backgroundColor: "rgba(244, 67, 54, 0.1)" } }}
                >
                  <Trash2 size={18} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
