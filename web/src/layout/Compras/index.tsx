"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Box,
  Container,
  Fade,
  CircularProgress,
  TextField,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Alert,
  Button,
} from "@mui/material"
import { ShoppingCart, HardHat, Package, Plus } from "lucide-react"
import Autocomplete from "@mui/material/Autocomplete"
import HeaderSection from "../../components/global/Header/header"
import { StyledPaper } from "../../theme/StyledComponents"
import type { ProveedorDto } from "../../Dto/Proveedor.dto"
import ProveedorServices from "../../api/ProveedorServices"
import MaterialesServices from "../../api/MaterialesServices"
import ProveedorInfo from "../../components/compras/panel-proveedor"
import SaveButton from "../../components/global/Button/Save"
import ProveedorAdd from "../Proveedor/components/Proveedor-add"
import MaterialAdd from "../Materiales/components/Materiales-add"
import ProductsAdd from "../Products/components/ProductsAdd"
import type { MaterialesDto } from "../../Dto/Materiales.dto"
import type { ProductoDTO } from "../../Dto/Productos.dto"
import ProductServices from "../../api/ProductServices"
import CarritoCompra, { type CarritoItem } from "../../components/compras/carrito-compra"
import TablaCarritoItems from "../../components/compras/tabla-carrito-items"
import ResumenCompra from "../../components/compras/resumen-compra"
import ComprasServices from "../../api/ComprasServices"
import type { CompraMaterialDto, CompraProductoDto, CreateCompraDto } from "../../Dto/Compra-request.dto"

export default function Compra() {
  const [proveedores, setProveedores] = useState<ProveedorDto[]>([])
  const [, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [selectedProveedor, setSelectedProveedor] = useState<ProveedorDto | null>(null)
  const [, setNewProveedorName] = useState("")
  const [openAddModal, setOpenAddModal] = useState(false)
  const [, setPendingProveedorName] = useState<string | null>(null)

  const [openAddMaterialModal, setOpenAddMaterialModal] = useState(false)
  const [openAddProductModal, setOpenAddProductModal] = useState(false)

  const [carritoItems, setCarritoItems] = useState<CarritoItem[]>([])

  // Estado BottomNavigation
  const [navValue, setNavValue] = useState<"materiales" | "productos">("materiales")

  // Materiales
  const [materiales, setMateriales] = useState<MaterialesDto[]>([])
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialesDto | null>(null)

  // Productos
  const [productos, setProducts] = useState<ProductoDTO[]>([])
  const [selectedProduct, setSelectedProduct] = useState<ProductoDTO | null>(null)

  const fetchProveedores = useCallback(async (pagina: number, perPage: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await ProveedorServices.findAll(pagina, perPage)
      setProveedores(response.data)
      setTotalItems(response.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchMateriales = async (pagina: number, perPage: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await MaterialesServices.findAll(pagina, perPage)
      setMateriales(response.data)
      setTotalItems(response.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido al obtener materiales")
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await ProductServices.fetchProductos()
      if (response.success && response.data) {
        setProducts(response.data)
      } else {
        setProducts([])
        console.error(response.message || "Error al cargar productos")
      }
    } catch (err) {
      console.error("Error al cargar productos:", err)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProveedores(1, 50)
  }, [fetchProveedores])

  useEffect(() => {
    if (navValue === "materiales") fetchMateriales(1, 50)
    else if (navValue === "productos") fetchProducts()
  }, [navValue])

  const handleAgregarAlCarrito = (item: CarritoItem) => {
    const existingItem = carritoItems.find((ci) => ci.id === item.id && ci.tipo === item.tipo)

    if (existingItem) {
      setCarritoItems(
        carritoItems.map((ci) =>
          ci.id === item.id && ci.tipo === item.tipo ? { ...ci, cantidad: ci.cantidad + item.cantidad } : ci,
        ),
      )
    } else {
      setCarritoItems([...carritoItems, item])
    }

    // Reset selected item
    if (item.tipo === "material") {
      setSelectedMaterial(null)
    } else {
      setSelectedProduct(null)
    }
  }

  const handleEliminarDelCarrito = (id: number, tipo: string) => {
    setCarritoItems(carritoItems.filter((item) => !(item.id === id && item.tipo === tipo)))
  }

  const handleGuardar = async () => {
    setError(null)
    setSuccessMessage(null)

    if (!selectedProveedor) {
      setError("Selecciona un proveedor")
      return
    }

    if (carritoItems.length === 0) {
      setError("Agrega al menos un ítem al carrito")
      return
    }

    setLoading(true)

    try {
      const newCompra: CreateCompraDto = {
        proveedor_id: selectedProveedor.id,
        materiales: carritoItems
          .filter((item) => item.tipo === "material")
          .map<CompraMaterialDto>((item) => ({
            material_id: item.id,
            cantidad: item.cantidad,
            precio_unitario_bs: item.precio_unitario_bs || 0,
            precio_unitario_usd: item.precio_unitario_usd || 0,
          })),
        productos: carritoItems
          .filter((item) => item.tipo === "producto")
          .map<CompraProductoDto>((item) => ({
            producto_id: item.id,
            cantidad: item.cantidad,
            precio_unitario_bs: item.precio_unitario_bs || 0,
            precio_unitario_usd: item.precio_unitario_usd || 0,
          })),
      }

      await ComprasServices.createCompra(newCompra)

      setSuccessMessage("Compra realizada exitosamente!")

      setCarritoItems([])
      setSelectedProveedor(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al guardar la compra"
      setError(errorMessage)
      console.error("Error al guardar compra:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in={true} timeout={800}>
        <Box>
          <HeaderSection title="Realización de compras" icon={<ShoppingCart />} />
          <StyledPaper sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
            {successMessage && (
              <Alert severity="success" onClose={() => setSuccessMessage(null)}>
                {successMessage}
              </Alert>
            )}

            {/* Autocomplete Proveedor */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
              <Box sx={{ flex: 1 }}>
                <Autocomplete
                  options={proveedores}
                  getOptionLabel={(option) => option.nombre || ""}
                  value={selectedProveedor}
                  onChange={(_, newValue) => setSelectedProveedor(newValue)}
                  loading={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Selecciona un proveedor"
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
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
                onClick={() => setOpenAddModal(true)}
                sx={{
                  mt: 1,
                  borderColor: "#1a73e8",
                  color: "#1a73e8",
                  "&:hover": { backgroundColor: "rgba(26, 115, 232, 0.08)" },
                }}
              >
                Nuevo
              </Button>
            </Box>
            {selectedProveedor && (
              <>
                <ProveedorInfo proveedor={selectedProveedor} />

                <Box sx={{ mt: 3 }}>
                  <Paper sx={{ mt: 2, width: "100%" }}>
                    <BottomNavigation value={navValue} onChange={(_, newValue) => setNavValue(newValue)} showLabels>
                      <BottomNavigationAction label="Materiales" value="materiales" icon={<HardHat size={20} />} />
                      <BottomNavigationAction label="Productos" value="productos" icon={<Package size={20} />} />
                    </BottomNavigation>
                  </Paper>

                  {/* Panel dinámico */}
                  <Box sx={{ mt: 2 }}>
                    {navValue === "materiales" && (
                      <>
                        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Autocomplete
                              options={materiales}
                              getOptionLabel={(option) => option.nombre || ""}
                              value={selectedMaterial}
                              onChange={(_, newValue) => setSelectedMaterial(newValue)}
                              loading={loading}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Selecciona un material"
                                  variant="outlined"
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
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
                            onClick={() => setOpenAddMaterialModal(true)}
                            sx={{
                              mt: 1,
                              borderColor: "#43a047",
                              color: "#43a047",
                              "&:hover": { backgroundColor: "rgba(67, 160, 71, 0.08)" },
                            }}
                          >
                            Nuevo
                          </Button>
                        </Box>
                        <CarritoCompra item={selectedMaterial} tipo="material" onAgregar={handleAgregarAlCarrito} />
                      </>
                    )}
                    {navValue === "productos" && (
                      <>
                        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Autocomplete
                              options={productos}
                              getOptionLabel={(option) => option.nombre || ""}
                              value={selectedProduct}
                              onChange={(_, newValue) => setSelectedProduct(newValue)}
                              loading={loading}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Selecciona un producto"
                                  variant="outlined"
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
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
                            onClick={() => setOpenAddProductModal(true)}
                            sx={{
                              mt: 1,
                              borderColor: "#fb8c00",
                              color: "#fb8c00",
                              "&:hover": { backgroundColor: "rgba(251, 140, 0, 0.08)" },
                            }}
                          >
                            Nuevo
                          </Button>
                        </Box>
                        <CarritoCompra item={selectedProduct} tipo="producto" onAgregar={handleAgregarAlCarrito} />
                      </>
                    )}
                  </Box>
                </Box>

                <TablaCarritoItems items={carritoItems} onEliminar={handleEliminarDelCarrito} />
                <ResumenCompra items={carritoItems} />

                {/* Botón Guardar */}
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <SaveButton texto="Guardar compra" onClick={handleGuardar} />
                </Box>
              </>
            )}
          </StyledPaper>
        </Box>
      </Fade>
      {/* Modals */}
      <ProveedorAdd
        open={openAddModal}
        onClose={() => {
          setOpenAddModal(false)
          fetchProveedores(1, 50)
          setNewProveedorName("")
          setPendingProveedorName(null)
        }}
      />
      <MaterialAdd
        open={openAddMaterialModal}
        onClose={() => {
          setOpenAddMaterialModal(false)
          fetchMateriales(1, 50)
        }}
      />
      <ProductsAdd
        open={openAddProductModal}
        onClose={() => {
          setOpenAddProductModal(false)
          fetchProducts()
        }}
        onProductAdded={fetchProducts}
      />
    </Container>
  )
}
