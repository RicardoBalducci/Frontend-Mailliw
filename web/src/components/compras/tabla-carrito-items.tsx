"use client"

import type React from "react"
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
} from "@mui/material"
import { Trash2 } from "lucide-react"
import type { CarritoItem } from "./carrito-compra"
import { useEffect, useState } from "react"
import { formatNumber } from "../../utils/format"

interface TablaCarritoItemsProps {
  items: CarritoItem[]
  onEliminar: (id: number, tipo: string) => void
}

export const TablaCarritoItems: React.FC<TablaCarritoItemsProps> = ({ items, onEliminar }) => {
  if (items.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 6,
          backgroundColor: "rgba(33, 150, 243, 0.04)",
          borderRadius: 2,
          border: "1px dashed rgba(0,0,0,0.2)",
        }}
      >
        <Typography color="textSecondary">No hay items en el carrito</Typography>
      </Box>
    )
  }
    const [dollarOficial, setDollarOficial] = useState<number>(1)

  useEffect(() => {
    const storedDollar = localStorage.getItem("dollar_oficial")
    if (storedDollar) setDollarOficial(Number(storedDollar))
  }, [])

  return (
    <TableContainer
      component={Paper}
      sx={{ mt: 3, borderRadius: 2, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
    >
      <Table>
        <TableHead sx={{ background: "linear-gradient(135deg, #1a73e8 0%, #1565c0 100%)" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", color: "white", fontSize: "0.95rem" }}>Producto</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold", color: "white", fontSize: "0.95rem" }}>
              Cantidad
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold", color: "white", fontSize: "0.95rem" }}>
              Precio $
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold", color: "white", fontSize: "0.95rem" }}>
              Subtotal $
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold", color: "white", fontSize: "0.95rem" }}>
              Precio Bs.
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold", color: "white", fontSize: "0.95rem" }}>
              Subtotal Bs.
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", color: "white", fontSize: "0.95rem" }}>
              Acción
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={`${item.tipo}-${item.id}`}
              hover
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(33, 150, 243, 0.05)",
                },
              }}
            >
              <TableCell sx={{ py: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {item.nombre}
                  </Typography>
                  <Chip
                    label={item.tipo === "material" ? "Material" : "Producto"}
                    size="small"
                    variant="outlined"
                    sx={{
                      mt: 0.5,
                      backgroundColor: item.tipo === "material" ? "rgba(67, 160, 71, 0.1)" : "rgba(251, 140, 0, 0.1)",
                      borderColor: item.tipo === "material" ? "#43a047" : "#fb8c00",
                      color: item.tipo === "material" ? "#43a047" : "#fb8c00",
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                {item.cantidad}
              </TableCell>
              <TableCell align="right">${formatNumber(item.precio_unitario_usd)}</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", color: "#1a73e8" }}>
                ${formatNumber(item.cantidad * item.precio_unitario_usd)}
              </TableCell>
            <TableCell align="right">
                Bs. {formatNumber(item.precio_unitario_usd * dollarOficial)}
                </TableCell>              <TableCell align="right">
                Bs. {formatNumber(item.precio_unitario_usd * dollarOficial)}
                </TableCell>

              <TableCell align="center">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onEliminar(item.id, item.tipo)}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(244, 67, 54, 0.1)",
                    },
                  }}
                >
                  <Trash2 size={18} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TablaCarritoItems
