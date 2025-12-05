"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, TextField, Button, Typography, Box } from "@mui/material"
import { Plus } from "lucide-react"
import type { MaterialesDto } from "../../Dto/Materiales.dto"
import type { ProductoDTO } from "../../Dto/Productos.dto"

export interface CarritoItem {
  id: number
  nombre: string
  cantidad: number
  precio_unitario_usd: number
  precio_unitario_bs: number
  tipo: "material" | "producto"
}

interface CarritoCompraProps {
  item: MaterialesDto | ProductoDTO | null
  tipo: "material" | "producto"
  onAgregar: (item: CarritoItem) => void
}

const getPreciosDelItem = (item: MaterialesDto | ProductoDTO | null, tipo: string) => {
  if (!item) return { usd: 0, bs: 0 }

  if (tipo === "material") {
    const material = item as MaterialesDto
    return {
      usd: material.precio_unitario_usd ? Number(material.precio_unitario_usd) : 0,
      bs: 0,
    }
  } else {
    const producto = item as ProductoDTO
    const precioUnitario = producto.precio_unitario ? Number(producto.precio_unitario) : 0
    const precioVenta = producto.precio_usd ? Number(producto.precio_usd) : 0
    const precioFinal = precioVenta !== 0 ? precioVenta : precioUnitario
    return { usd: precioFinal, bs: 0 }
  }
}

export const CarritoCompra: React.FC<CarritoCompraProps> = ({ item, tipo, onAgregar }) => {
  const [cantidad, setCantidad] = useState<number>(1)
  const [precioUSD, setPrecioUSD] = useState<number>(getPreciosDelItem(item, tipo).usd)
  const [precioBS, setPrecioBS] = useState<number>(0)

  useEffect(() => {
    const precios = getPreciosDelItem(item, tipo)
    setPrecioUSD(precios.usd)
    setPrecioBS(precios.bs)
  }, [item, tipo])

  const handleAgregar = () => {
    if (!item) return
    if (precioUSD === 0 && precioBS === 0) return

    const carritoItem: CarritoItem = {
      id: Number(item.id),
      nombre: item.nombre,
      cantidad,
      precio_unitario_usd: precioUSD,
      precio_unitario_bs: precioBS,
      tipo,
    }
    onAgregar(carritoItem)
    setCantidad(1)
    setPrecioUSD(getPreciosDelItem(item, tipo).usd)
    setPrecioBS(0)
  }

  if (!item) {
    return (
      <Card sx={{ p: 3, backgroundColor: "rgba(33, 150, 243, 0.04)" }}>
        <Typography color="textSecondary" sx={{ textAlign: "center" }}>
          Selecciona un {tipo === "material" ? "material" : "producto"} para comenzar
        </Typography>
      </Card>
    )
  }

  const precioDefault = getPreciosDelItem(item, tipo).usd

  return (
    <Card
      sx={{
        p: 3,
        mt: 2,
        background: "linear-gradient(135deg, rgba(33, 150, 243, 0.08), rgba(56, 142, 60, 0.08))",
        border: "1px solid rgba(33, 150, 243, 0.2)",
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ mb: 2, pb: 2, borderBottom: "2px solid rgba(33, 150, 243, 0.2)" }}>
          <Typography variant="h6" sx={{ fontWeight: "700", color: "#1a73e8" }}>
            Agregar a carrito: {item.nombre}
          </Typography>
          {precioDefault > 0 && (
            <Typography variant="caption" sx={{ color: "#666", mt: 0.5, display: "block" }}>
              Precio sugerido: ${precioDefault.toFixed(2)} USD
            </Typography>
          )}
        </Box>

        {/* Contenedor de inputs */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Cantidad"
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(Math.max(1, Number.parseInt(e.target.value) || 1))}
            inputProps={{ min: 1 }}
            variant="outlined"
            size="small"
          />
          <TextField
            fullWidth
            label="Precio Unitario (USD)"
            type="number"
            value={precioUSD}
            onChange={(e) => setPrecioUSD(Number.parseFloat(e.target.value) || 0)}
            inputProps={{ step: 0.01, min: 0 }}
            variant="outlined"
            size="small"
          />
          <TextField
            fullWidth
            label="Precio Unitario (BS)"
            type="number"
            value={precioBS}
            onChange={(e) => setPrecioBS(Number.parseFloat(e.target.value) || 0)}
            inputProps={{ step: 0.01, min: 0 }}
            variant="outlined"
            size="small"
          />
        </Box>

        {/* Resumen de subtotales */}
        <Box sx={{ p: 2, backgroundColor: "rgba(33, 150, 243, 0.08)", borderRadius: 1, mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="caption" color="textSecondary">
              Subtotal USD:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: "bold", color: "#1a73e8" }}>
              ${(cantidad * precioUSD).toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="caption" color="textSecondary">
              Subtotal BS:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: "bold", color: "#ff6f00" }}>
              Bs {(cantidad * precioBS).toFixed(2)}
            </Typography>
          </Box>
        </Box>

        {/* Botón agregar */}
        <Box>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={handleAgregar}
            sx={{
              background: "linear-gradient(135deg, #1a73e8 0%, #1565c0 100%)",
              color: "white",
              fontWeight: 600,
              "&:hover": {
                background: "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
              },
            }}
          >
            Agregar al carrito
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CarritoCompra
