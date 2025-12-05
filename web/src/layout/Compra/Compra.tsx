/* "use client"
import {
  Box,
  Container,
  Fade,
  Stack,
  Typography,
  Autocomplete,
  CircularProgress,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
  Divider,
  Badge,
  TextField,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import InventoryIcon from "@mui/icons-material/Inventory"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

import { useState, useEffect, useMemo } from "react"

// Components
import { MaterialSelectModal } from "./components/material-select-modal"
import { ProductSelectModal } from "./components/product-select-modal"
import { PurchaseSummary } from "./components/purchase-summary"
import { PurchaseItemList } from "./components/purchase-item-list"

import ProveedorServices from "../../api/ProveedorServices"
import ComprasServices from "../../api/ComprasServices"

import type { ProveedorDto } from "../../Dto/Proveedor.dto"
import type { MaterialesDto } from "../../Dto/Materiales.dto"
import { ProductoDTO } from "../../Dto/Productos.dto"

interface PurchaseItemMaterial {
  type: "material"
  material: MaterialesDto
  cantidad: number
}

interface PurchaseItemProduct {
  type: "product"
  product: ProductoDTO
  cantidad: number
}

type PurchaseItem = PurchaseItemMaterial | PurchaseItemProduct

function TabPanel(props: any) {
  const { children, value, index, ...other } = props
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  )
}

export default function Compra() {
  // Modal states
  const [openMaterialSelectModal, setOpenMaterialSelectModal] = useState(false)
  const [openProductSelectModal, setOpenProductSelectModal] = useState(false)
  const [tabValue, setTabValue] = useState(0)

  // Data states
  const [proveedores, setProveedores] = useState<ProveedorDto[]>([])
  const [selectedProveedor, setSelectedProveedor] = useState<ProveedorDto | null>(null)
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([])

  // Loading & Error states
  const [loadingProveedores, setLoadingProveedores] = useState(false)
  const [proveedoresError, setProveedoresError] = useState<string | null>(null)
  const [savingPurchase, setSavingPurchase] = useState(false)
  const [purchaseError, setPurchaseError] = useState<string | null>(null)

  // Snackbar for notifications
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info">("success")

  const [dollarOficial, setDollarOficial] = useState<number>(1)

  useEffect(() => {
    const storedDollar = localStorage.getItem("dollar_oficial")
    if (storedDollar) setDollarOficial(Number(storedDollar))
  }, [])

  // Fetch initial data
  const fetchProveedores = async () => {
    setLoadingProveedores(true)
    setProveedoresError(null)
    try {
      const response = await ProveedorServices.findAll(1, 100)
      setProveedores(response.data)
    } catch (error: unknown) {
      setProveedoresError((error as Error).message || "Error al cargar proveedores.")
      console.error("Error fetching suppliers:", error)
      showSnackbar((error as Error).message || "Error al cargar proveedores.", "error")
    } finally {
      setLoadingProveedores(false)
    }
  }

  useEffect(() => {
    fetchProveedores()
  }, [])

  const handleMaterialSelected = (material: MaterialesDto) => {
    setPurchaseItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.type === "material" && item.material.id === material.id,
      )
      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems]
        ;(updatedItems[existingItemIndex] as PurchaseItemMaterial).cantidad += 1
        return updatedItems
      } else {
        return [...prevItems, { type: "material", material, cantidad: 1 } as PurchaseItemMaterial]
      }
    })
    setOpenMaterialSelectModal(false)
    showSnackbar(`Material '${material.nombre}' añadido a la compra.`, "success")
  }

  const handleProductSelected = (product: ProductoDto) => {
    setPurchaseItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.type === "product" && item.product.id === product.id)
      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems]
        ;(updatedItems[existingItemIndex] as PurchaseItemProduct).cantidad += 1
        return updatedItems
      } else {
        return [...prevItems, { type: "product", product, cantidad: 1 } as PurchaseItemProduct]
      }
    })
    setOpenProductSelectModal(false)
    showSnackbar(`Producto '${product.nombre}' añadido a la compra.`, "success")
  }

  const handleQuantityChange = (itemId: number, itemType: "material" | "product", newQuantity: number) => {
    setPurchaseItems((prevItems) =>
      prevItems.map((item) => {
        if (item.type === itemType) {
          const id = item.type === "material" ? item.material.id : item.product.id
          if (id === itemId) {
            return { ...item, cantidad: Math.max(1, newQuantity) }
          }
        }
        return item
      }),
    )
  }

  const handleRemoveItem = (itemId: number, itemType: "material" | "product") => {
    setPurchaseItems((prevItems) =>
      prevItems.filter((item) => {
        if (item.type === itemType) {
          const id = item.type === "material" ? item.material.id : item.product.id
          return id !== itemId
        }
        return true
      }),
    )
    showSnackbar("Artículo eliminado de la compra.", "info")
  }

  const handleSaveCompra = async () => {
    if (!selectedProveedor) {
      setPurchaseError("Por favor, selecciona un proveedor.")
      showSnackbar("Por favor, selecciona un proveedor.", "error")
      return
    }
    if (purchaseItems.length === 0) {
      setPurchaseError("Por favor, añade al menos un material o producto a la compra.")
      showSnackbar("Por favor, añade al menos un material o producto a la compra.", "error")
      return
    }

    setSavingPurchase(true)
    setPurchaseError(null)

    const materiales = purchaseItems
      .filter((item) => item.type === "material")
      .map((item) => {
        const material = (item as PurchaseItemMaterial).material
        const cantidad = item.cantidad
        const precio_unitario_usd = material.precio_unitario_usd || 0
        const precio_unitario_bs = precio_unitario_usd * dollarOficial

        return {
          material_id: material.id,
          cantidad,
          precio_unitario_bs,
          precio_unitario_usd,
        }
      })

    const productos = purchaseItems
      .filter((item) => item.type === "product")
      .map((item) => {
        const product = (item as PurchaseItemProduct).product
        const cantidad = item.cantidad
        const precio_unitario_usd = product.precio_unitario_usd || 0
        const precio_unitario_bs = precio_unitario_usd * dollarOficial

        return {
          producto_id: product.id,
          cantidad,
          precio_unitario_bs,
          precio_unitario_usd,
        }
      })

    const newCompraData = {
      proveedor_id: selectedProveedor.id,
      materiales,
      productos,
    }

    try {
      await ComprasServices.createCompra(newCompraData)
      showSnackbar("¡Compra registrada exitosamente!", "success")
      setSelectedProveedor(null)
      setPurchaseItems([])
      setTabValue(0)
    } catch (error: unknown) {
      let errorMessage = "Error al registrar la compra."
      if (error instanceof Error) {
        errorMessage = error.message
      }
      setPurchaseError(errorMessage)
      showSnackbar(errorMessage, "error")
      console.error("Error saving purchase:", error)
    } finally {
      setSavingPurchase(false)
    }
  }

  const handleCancelCompra = () => {
    setSelectedProveedor(null)
    setPurchaseItems([])
    setPurchaseError(null)
    setTabValue(0)
    showSnackbar("Compra cancelada.", "info")
  }

  const showSnackbar = (message: string, severity: "success" | "error" | "info") => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  // Calculate totals
  const totals = useMemo(() => {
    let totalUSD = 0
    let totalBS = 0

    purchaseItems.forEach((item) => {
      if (item.type === "material") {
        const precio = item.material.precio_unitario_usd || 0
        totalUSD += precio * item.cantidad
      } else {
        const precio = item.product.precio_unitario_usd || 0
        totalUSD += precio * item.cantidad
      }
    })

    totalBS = totalUSD * dollarOficial

    return { totalUSD, totalBS }
  }, [purchaseItems, dollarOficial])

  const materialItems = purchaseItems.filter((item) => item.type === "material")
  const productItems = purchaseItems.filter((item) => item.type === "product")

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Fade in={true} timeout={800}>
          <Box>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h4"
                component="h1"
                fontWeight={700}
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
              >
                <ShoppingCartIcon sx={{ fontSize: 32 }} />
                Nueva Orden de Compra
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gestiona tus compras de materiales y productos de forma eficiente
              </Typography>
            </Box>

            <Card sx={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <LocalShippingIcon fontSize="small" />
                    Seleccionar Proveedor
                  </Typography>
                  <Autocomplete
                    options={proveedores}
                    getOptionLabel={(option) => option.nombre}
                    value={selectedProveedor}
                    onChange={(_, newValue) => {
                      setSelectedProveedor(newValue)
                    }}
                    loading={loadingProveedores}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Buscar o seleccionar proveedor..." size="small" />
                    )}
                    loadingText="Cargando proveedores..."
                    noOptionsText="No se encontraron proveedores"
                  />
                  {proveedoresError && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {proveedoresError}
                    </Alert>
                  )}
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                  <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                    <Tab
                      label={
                        <Badge badgeContent={materialItems.length} color="primary" sx={{ mr: 1 }}>
                          <InventoryIcon sx={{ mr: 1 }} />
                          Materiales
                        </Badge>
                      }
                      id="tab-0"
                    />
                    <Tab
                      label={
                        <Badge badgeContent={productItems.length} color="primary" sx={{ mr: 1 }}>
                          <ShoppingCartIcon sx={{ mr: 1 }} />
                          Productos
                        </Badge>
                      }
                      id="tab-1"
                    />
                  </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                  <Stack spacing={2} sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      <button
                        onClick={() => setOpenMaterialSelectModal(true)}
                        style={{
                          flex: 1,
                          padding: "12px 16px",
                          backgroundColor: "#1976d2",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          fontSize: "16px",
                          transition: "background-color 0.3s",
                        }}
                        onMouseEnter={(e) => {
                          ;(e.target as HTMLButtonElement).style.backgroundColor = "#1565c0"
                        }}
                        onMouseLeave={(e) => {
                          ;(e.target as HTMLButtonElement).style.backgroundColor = "#1976d2"
                        }}
                      >
                        <AddIcon /> Seleccionar Material
                      </button>
                    </Box>

                    {materialItems.length === 0 ? (
                      <Box
                        sx={{
                          minHeight: 150,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          border: "2px dashed #e0e0e0",
                          borderRadius: 2,
                          p: 3,
                          color: "#999",
                          bgcolor: "#fdfdfd",
                        }}
                      >
                        <InventoryIcon sx={{ fontSize: 40, mb: 1, color: "#ccc" }} />
                        <Typography variant="body1" textAlign="center">
                          No hay materiales en esta compra.
                          <br />
                          Usa el botón de arriba para añadir materiales.
                        </Typography>
                      </Box>
                    ) : (
                      <PurchaseItemList
                        items={materialItems as PurchaseItemMaterial[]}
                        itemType="material"
                        dollarOficial={dollarOficial}
                        onQuantityChange={handleQuantityChange}
                        onRemoveItem={handleRemoveItem}
                      />
                    )}
                  </Stack>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <Stack spacing={2} sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      <button
                        onClick={() => setOpenProductSelectModal(true)}
                        style={{
                          flex: 1,
                          padding: "12px 16px",
                          backgroundColor: "#2e7d32",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          fontSize: "16px",
                          transition: "background-color 0.3s",
                        }}
                        onMouseEnter={(e) => {
                          ;(e.target as HTMLButtonElement).style.backgroundColor = "#1b5e20"
                        }}
                        onMouseLeave={(e) => {
                          ;(e.target as HTMLButtonElement).style.backgroundColor = "#2e7d32"
                        }}
                      >
                        <AddIcon /> Seleccionar Producto
                      </button>
                    </Box>

                    {productItems.length === 0 ? (
                      <Box
                        sx={{
                          minHeight: 150,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          border: "2px dashed #e0e0e0",
                          borderRadius: 2,
                          p: 3,
                          color: "#999",
                          bgcolor: "#fdfdfd",
                        }}
                      >
                        <ShoppingCartIcon sx={{ fontSize: 40, mb: 1, color: "#ccc" }} />
                        <Typography variant="body1" textAlign="center">
                          No hay productos en esta compra.
                          <br />
                          Usa el botón de arriba para añadir productos.
                        </Typography>
                      </Box>
                    ) : (
                      <PurchaseItemList
                        items={productItems as PurchaseItemProduct[]}
                        itemType="product"
                        dollarOficial={dollarOficial}
                        onQuantityChange={handleQuantityChange}
                        onRemoveItem={handleRemoveItem}
                      />
                    )}
                  </Stack>
                </TabPanel>

                <Divider sx={{ my: 3 }} />

                <PurchaseSummary totals={totals} />

                {purchaseError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {purchaseError}
                  </Alert>
                )}

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4, justifyContent: "flex-end" }}>
                  <button
                    onClick={handleCancelCompra}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "16px",
                      transition: "background-color 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      ;(e.target as HTMLButtonElement).style.backgroundColor = "#d32f2f"
                    }}
                    onMouseLeave={(e) => {
                      ;(e.target as HTMLButtonElement).style.backgroundColor = "#f44336"
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveCompra}
                    disabled={savingPurchase}
                    style={{
                      padding: "12px 32px",
                      backgroundColor: savingPurchase ? "#cccccc" : "#4caf50",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: savingPurchase ? "not-allowed" : "pointer",
                      fontWeight: 600,
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      transition: "background-color 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      if (!savingPurchase) {
                        ;(e.target as HTMLButtonElement).style.backgroundColor = "#388e3c"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!savingPurchase) {
                        ;(e.target as HTMLButtonElement).style.backgroundColor = "#4caf50"
                      }
                    }}
                  >
                    {savingPurchase ? (
                      <>
                        <CircularProgress size={20} color="inherit" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon /> Guardar Compra
                      </>
                    )}
                  </button>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Fade>
      </Container>

      <MaterialSelectModal
        open={openMaterialSelectModal}
        onClose={() => setOpenMaterialSelectModal(false)}
        onMaterialSelected={handleMaterialSelected}
      />
      <ProductSelectModal
        open={openProductSelectModal}
        onClose={() => setOpenProductSelectModal(false)}
        onProductSelected={handleProductSelected}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
 */