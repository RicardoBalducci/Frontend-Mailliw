"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material"
import { Plus } from "lucide-react"
import Autocomplete from "@mui/material/Autocomplete"
import type { MaterialesDto } from "../../Dto/Materiales.dto"
import type { ProductoDTO } from "../../Dto/Productos.dto"

export type ItemTipo = "material" | "producto"

export interface CarritoItem {
  id: number
  nombre: string
  cantidad: number
  precio_unitario_usd: number
  precio_unitario_bs: number
  tipo: ItemTipo
}

interface CarritoCompraProps<T extends MaterialesDto | ProductoDTO> {
  items: T[]
  selectedItem: T | null
  tipo: ItemTipo
  loading: boolean
  onAgregar: (item: CarritoItem) => void
  onChange: (item: T | null) => void
  onNuevo: () => void
}


const getPreciosDelItem = (item: MaterialesDto | ProductoDTO | null, tipo: ItemTipo) => {
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

interface CarritoCompraProps<T extends MaterialesDto | ProductoDTO> {
  items: T[]
  selectedItem: T | null
  tipo: ItemTipo
  loading: boolean
  onAgregar: (item: CarritoItem) => void
  onChange: (item: T | null) => void
  onNuevo: () => void
}

export default function CarritoCompra<T extends MaterialesDto | ProductoDTO>({
  items,
  selectedItem,
  tipo,
  loading,
  onAgregar,
  onChange,
  onNuevo,
}: CarritoCompraProps<T>) {
  const [cantidad, setCantidad] = useState<number>(1)
  const [precioUSD, setPrecioUSD] = useState<number>(getPreciosDelItem(selectedItem, tipo).usd)
  const [precioBS, setPrecioBS] = useState<number>(0)

  useEffect(() => {
    const precios = getPreciosDelItem(selectedItem, tipo)
    setPrecioUSD(precios.usd)
    setPrecioBS(precios.bs)
  }, [selectedItem, tipo])

  const handleAgregar = () => {
    if (!selectedItem) return
    if (precioUSD === 0 && precioBS === 0) return

    const carritoItem: CarritoItem = {
      id: selectedItem.id ?? 0, // Maneja null
      nombre: selectedItem.nombre,
      cantidad,
      precio_unitario_usd: precioUSD,
      precio_unitario_bs: precioBS,
      tipo,
    }

    onAgregar(carritoItem)
    setCantidad(1)
    setPrecioUSD(getPreciosDelItem(selectedItem, tipo).usd)
    setPrecioBS(0)
  }

  return (
    <Card sx={{ p: 2, mt: 2, borderRadius: 3, boxShadow: 4, background: "linear-gradient(135deg, #fdfdfd, #e3f2fd)" }}>
      <CardHeader
        title={<Typography variant="h6" fontWeight={700} color="primary">Agregar {tipo} al carrito</Typography>}
      />

      <CardContent>
        {/* Selector del item */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Autocomplete
              options={items}
              getOptionLabel={(option) => option.nombre || ""}
              value={selectedItem}
              onChange={(_, newValue) => onChange(newValue)}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={`Selecciona un ${tipo}`}
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading && <CircularProgress color="inherit" size={20} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Box>

          <Button
            variant="outlined"
            startIcon={<Plus size={20} />}
            onClick={onNuevo}
            sx={{ mt: 1, borderColor: "#43a047", color: "#43a047", "&:hover": { backgroundColor: "rgba(67, 160, 71, 0.08)" } }}
          >
            Nuevo
          </Button>
        </Box>

        {/* Cantidad y precios solo si hay un item seleccionado */}
        {selectedItem && (
          <>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "stretch", sm: "center" }, gap: 2, mt: 1 }}>
              <TextField
                label="Cantidad"
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1 }}
                sx={{ flex: 1, minWidth: 100 }}
              />
              <Button
                variant="contained"
                color="success"
                sx={{ height: 56, width: { xs: "100%", sm: "auto" } }}
                startIcon={<Plus size={20} />}
                onClick={handleAgregar}
              >
                Añadir al carrito
              </Button>
            </Box>

            <Box sx={{ mt: 2, p: 2, borderRadius: 2, backgroundColor: "#e3f2fd" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2" color="textSecondary">Subtotal USD:</Typography>
                <Typography variant="body2" fontWeight={700} color="primary">${(cantidad * precioUSD).toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="textSecondary">Subtotal BS:</Typography>
                <Typography variant="body2" fontWeight={700} color="secondary">Bs {(cantidad * precioBS).toFixed(2)}</Typography>
              </Box>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  )
}