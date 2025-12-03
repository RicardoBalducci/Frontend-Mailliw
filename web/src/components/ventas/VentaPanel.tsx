/* "use client"
import type React from "react"
import { useState } from "react"
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Divider,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Alert,
} from "@mui/material"
import { Trash2, Plus, ShoppingCart, AlertCircle } from "lucide-react"
import { ClienteDTO } from "../../Dto/Cliente.dto"
import { CreateVentaDto } from "../../Dto/Ventas-create.dto"

interface VentaPanelProps {
  cliente: ClienteDTO
  onRealizarVenta: (ventaJson: CreateVentaDto) => void
}

interface CarritoItem {
  id: number
  nombre: string
  descripcion: string
  tipo: "servicio" | "producto"
  precio_unitario: number
  precio_usd: number
  cantidad: number
}

const mockProductos = [
  {
    id: 1,
    nombre: "Instalación FTTH",
    descripcion: "Instalación de fibra óptica",
    tipo: "servicio",
    stock: 10,
    precio_unitario: 50000,
    precio_usd: 12.5,
  },
  {
    id: 2,
    nombre: "Router Wi-Fi",
    descripcion: "Router inalámbrico",
    tipo: "producto",
    stock: 5,
    precio_unitario: 25000,
    precio_usd: 6.25,
  },
  {
    id: 3,
    nombre: "Mantenimiento Mensual",
    descripcion: "Mantenimiento mensual",
    tipo: "servicio",
    stock: 20,
    precio_unitario: 15000,
    precio_usd: 3.75,
  },
  {
    id: 4,
    nombre: "Cable Ethernet",
    descripcion: "Cable de 50m",
    tipo: "producto",
    stock: 15,
    precio_unitario: 5000,
    precio_usd: 1.25,
  },
]

const VentaPanel: React.FC<VentaPanelProps> = ({ cliente, onRealizarVenta }) => {
  const [selectedProduct, setSelectedProduct] = useState<number | "">("")
  const [cantidad, setCantidad] = useState<number>(1)
  const [carrito, setCarrito] = useState<CarritoItem[]>([])
  const [openDialog, setOpenDialog] = useState(false)

  const handleAddToCart = () => {
    if (!selectedProduct) return
    const producto = mockProductos.find((p) => p.id === selectedProduct)
    if (!producto) return

    const existing = carrito.find((item) => item.id === producto.id)
    if (existing) {
      setCarrito(
        carrito.map((item) => (item.id === producto.id ? { ...item, cantidad: item.cantidad + cantidad } : item)),
      )
    } else {
      setCarrito([...carrito, { ...producto, cantidad } as CarritoItem])
    }
    setCantidad(1)
    setSelectedProduct("")
  }

  const handleCantidadChange = (id: number, value: number) => {
    setCarrito(carrito.map((item) => (item.id === id ? { ...item, cantidad: value || 1 } : item)))
  }

  const handleRemove = (id: number) => {
    setCarrito(carrito.filter((item) => item.id !== id))
  }

  const totalBs = carrito.reduce((acc, item) => acc + item.precio_unitario * item.cantidad, 0)
  const totalUSD = carrito.reduce((acc, item) => acc + item.precio_usd * item.cantidad, 0)
  const servicios = carrito.filter((item) => item.tipo === "servicio")
  const productos = carrito.filter((item) => item.tipo === "producto")

  const generarJSON = () => {
    const ventaData = {
      cliente_id: cliente.id,
      servicios: servicios.map((s) => ({ id: s.id, cantidad: s.cantidad })),
      productos: productos.map((p) => ({ id: p.id, cantidad: p.cantidad })),
      totales: {
        total_bs: totalBs,
        total_usd: totalUSD,
      },
      fecha: new Date().toISOString(),
    }
    onRealizarVenta(ventaData)
    setOpenDialog(false)
  }

  const handleOpenDialog = () => {
    if (carrito.length === 0) return
    setOpenDialog(true)
  }

  return (
    <Paper
      sx={{
        mt: 4,
        p: 4,
        borderRadius: 3,
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(25, 118, 210, 0.1)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <ShoppingCart size={28} color="#1976d2" />
        <Box>
          <Typography variant="h6" fontWeight={700} sx={{ color: "#1976d2" }}>
            Panel de Venta
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Cliente:{" "}
            <strong>
              {cliente.nombre} {cliente.apellido}
            </strong>
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle2"
          fontWeight={700}
          sx={{ color: "#1976d2", mb: 2, textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.5px" }}
        >
          Agregar Producto / Servicio
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            select
            label="Seleccionar Producto/Servicio"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(Number(e.target.value))}
            sx={{
              minWidth: 300,
              flex: 1,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fff",
                borderRadius: "8px",
              },
            }}
          >
            {mockProductos.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <span>{p.nombre}</span>
                  <span style={{ marginLeft: "10px", color: "#999" }}>
                    - Bs {p.precio_unitario} / $ {p.precio_usd}
                  </span>
                </Box>
              </MenuItem>
            ))}
          </TextField>
          <TextField
            type="number"
            label="Cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            sx={{ width: 120 }}
            inputProps={{ min: 1 }}
          />
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={handleAddToCart}
            sx={{
              px: 3,
              height: "56px",
              background: "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(76, 175, 80, 0.4)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Añadir
          </Button>
        </Box>
      </Box>

      {carrito.length > 0 && (
        <Box>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{ color: "#1976d2", mb: 2, textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.5px" }}
          >
            Artículos en Carrito ({carrito.length})
          </Typography>
          <Box display="flex" flexDirection="column" gap={2} sx={{ mb: 3 }}>
            {carrito.map((item) => (
              <Box
                key={item.id}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: "#fff",
                  border: "1px solid #e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(25, 118, 210, 0.15)",
                    borderColor: "#1976d2",
                  },
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                    <Typography fontWeight={700} sx={{ color: "#1976d2" }}>
                      {item.nombre}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "12px",
                        backgroundColor: item.tipo === "servicio" ? "#e3f2fd" : "#f3e5f5",
                        color: item.tipo === "servicio" ? "#1976d2" : "#7b1fa2",
                        fontWeight: 600,
                        fontSize: "10px",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.tipo}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Bs {item.precio_unitario.toLocaleString()} / $ {item.precio_usd.toFixed(2)}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <TextField
                    type="number"
                    value={item.cantidad}
                    onChange={(e) => handleCantidadChange(item.id, Number(e.target.value))}
                    sx={{ width: 80 }}
                    inputProps={{ min: 1 }}
                  />
                  <Box sx={{ minWidth: "140px", textAlign: "right" }}>
                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: "11px" }}>
                      Subtotal
                    </Typography>
                    <Typography fontWeight={700} sx={{ color: "#1976d2" }}>
                      Bs {(item.precio_unitario * item.cantidad).toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      ${(item.precio_usd * item.cantidad).toFixed(2)}
                    </Typography>
                  </Box>
                  <IconButton
                    color="error"
                    onClick={() => handleRemove(item.id)}
                    sx={{
                      transition: "all 0.3s ease",
                      "&:hover": { backgroundColor: "#ffebee" },
                    }}
                  >
                    <Trash2 size={20} />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
              mb: 3,
              p: 3,
              borderRadius: 2,
              backgroundColor: "#f5f7fa",
              border: "2px solid #1976d2",
            }}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{ color: "#666", fontWeight: 600, textTransform: "uppercase", fontSize: "11px" }}
              >
                Total en Bolívares
              </Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: "#1976d2", mt: 0.5 }}>
                Bs {totalBs.toLocaleString()}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="caption"
                sx={{ color: "#666", fontWeight: 600, textTransform: "uppercase", fontSize: "11px" }}
              >
                Total en Dólares
              </Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: "#1976d2", mt: 0.5 }}>
                ${totalUSD.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleOpenDialog}
            sx={{
              py: 2,
              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "16px",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 12px 32px rgba(25, 118, 210, 0.4)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Realizar Venta
          </Button>
        </Box>
      )}


      {carrito.length === 0 && (
        <Box
          sx={{
            py: 6,
            textAlign: "center",
            backgroundColor: "#f9f9f9",
            borderRadius: 2,
            border: "2px dashed #ddd",
          }}
        >
          <ShoppingCart size={48} color="#ccc" style={{ margin: "0 auto", marginBottom: "16px" }} />
          <Typography variant="body2" color="textSecondary">
            El carrito está vacío. Agrega productos o servicios para continuar.
          </Typography>
        </Box>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{ background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)", color: "#fff", fontWeight: 700 }}
        >
          Confirmar Venta
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Alert severity="info" icon={<AlertCircle size={20} />} sx={{ mb: 2 }}>
            ¿Confirmas que deseas realizar esta venta?
          </Alert>

          <Box sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: "8px", border: "1px solid #ddd", mb: 2 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 2, color: "#1976d2" }}>
              📋 Resumen de la venta:
            </Typography>

            {servicios.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" fontWeight={600} sx={{ display: "block", mb: 1, color: "#1565c0" }}>
                  Servicios:
                </Typography>
                {servicios.map((servicio, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: "#fff",
                      mb: 1,
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {servicio.nombre}
                    </Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ color: "#1976d2" }}>
                      x{servicio.cantidad}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            {productos.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" fontWeight={600} sx={{ display: "block", mb: 1, color: "#1565c0" }}>
                  Productos:
                </Typography>
                {productos.map((producto, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: "#fff",
                      mb: 1,
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {producto.nombre}
                    </Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ color: "#1976d2" }}>
                      x{producto.cantidad}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            <Box
              sx={{
                p: 2,
                borderRadius: 1,
                backgroundColor: "#e3f2fd",
                border: "2px solid #1976d2",
                mt: 2,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  sx={{ color: "#666", textTransform: "uppercase", fontSize: "10px" }}
                >
                  Total Bs:
                </Typography>
                <Typography variant="body2" fontWeight={700} sx={{ color: "#1976d2" }}>
                  Bs {totalBs.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  sx={{ color: "#666", textTransform: "uppercase", fontSize: "10px" }}
                >
                  Total USD:
                </Typography>
                <Typography variant="body2" fontWeight={700} sx={{ color: "#1976d2" }}>
                  ${totalUSD.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined">
            Cancelar
          </Button>
          <Button
            onClick={generarJSON}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Confirmar y Generar JSON
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}

export default VentaPanel
 */