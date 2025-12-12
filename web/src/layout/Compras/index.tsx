"use client"

import { useState, useEffect, useCallback } from "react"
import { Box, Container, Fade, Alert } from "@mui/material"
import { ShoppingCart } from "lucide-react"
import HeaderSection from "../../components/global/Header/header"
import { StyledPaper } from "../../theme/StyledComponents"
import type { ProveedorDto } from "../../Dto/Proveedor.dto"
import ProveedorServices from "../../api/ProveedorServices"
import MaterialesServices from "../../api/MaterialesServices"
import ProductServices from "../../api/ProductServices"
import type { MaterialesDto } from "../../Dto/Materiales.dto"
import type { ProductoDTO } from "../../Dto/Productos.dto"
import ComprasServices from "../../api/ComprasServices"
import type { CompraMaterialDto, CompraProductoDto, CreateCompraDto } from "../../Dto/Compra-request.dto"
import CarritoCompra, { type CarritoItem } from "../../components/compras/carrito-compra"
import TablaCarritoItems from "../../components/compras/tabla-carrito-items"
import ResumenCompra from "../../components/compras/resumen-compra"
import SaveButton from "../../components/global/Button/Save"
import ProveedorAdd from "../Proveedor/components/Proveedor-add"
import MaterialAdd from "../Materiales/components/Materiales-add"
import ProductsAdd from "../Products/components/ProductsAdd"
import { useNotifications } from "../../pages/Dashboard/components/NotificationsContext"
import ProveedorSelector from "./components/ProveedorSelector"
import ProveedorInfo from "../../components/compras/panel-proveedor"
import NavSelector from "./components/NavSelector"

// Subcomponentes

export default function Compra() {
  const { refrescarNotificaciones } = useNotifications()

  // Estados
  const [proveedores, setProveedores] = useState<ProveedorDto[]>([])
  const [, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [selectedProveedor, setSelectedProveedor] = useState<ProveedorDto | null>(null)
  const [openAddModal, setOpenAddModal] = useState(false)
  const [openAddMaterialModal, setOpenAddMaterialModal] = useState(false)
  const [openAddProductModal, setOpenAddProductModal] = useState(false)

  const [navValue, setNavValue] = useState<"materiales" | "productos">("materiales")
  const [materiales, setMateriales] = useState<MaterialesDto[]>([])
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialesDto | null>(null)
  const [productos, setProducts] = useState<ProductoDTO[]>([])
  const [selectedProduct, setSelectedProduct] = useState<ProductoDTO | null>(null)
  const [carritoItems, setCarritoItems] = useState<CarritoItem[]>([])

  // Fetch proveedores
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
    else fetchProducts()
  }, [navValue])

  // Carrito
  const handleAgregarAlCarrito = (item: CarritoItem) => {
    const existingItem = carritoItems.find(ci => ci.id === item.id && ci.tipo === item.tipo)
    if (existingItem) {
      setCarritoItems(carritoItems.map(ci =>
        ci.id === item.id && ci.tipo === item.tipo ? { ...ci, cantidad: ci.cantidad + item.cantidad } : ci
      ))
    } else setCarritoItems([...carritoItems, item])

    if (item.tipo === "material") setSelectedMaterial(null)
    else setSelectedProduct(null)
  }

  const handleEliminarDelCarrito = (id: number, tipo: string) => {
    setCarritoItems(carritoItems.filter(item => !(item.id === id && item.tipo === tipo)))
  }

  const handleGuardar = async () => {
    setError(null)
    setSuccessMessage(null)
    if (!selectedProveedor) return setError("Selecciona un proveedor")
    if (carritoItems.length === 0) return setError("Agrega al menos un ítem al carrito")

    setLoading(true)
    try {
      const newCompra: CreateCompraDto = {
        proveedor_id: selectedProveedor.id,
        materiales: carritoItems.filter(i => i.tipo === "material").map<CompraMaterialDto>(i => ({
          material_id: i.id,
          cantidad: i.cantidad,
          precio_unitario_bs: i.precio_unitario_bs || 0,
          precio_unitario_usd: i.precio_unitario_usd || 0,
        })),
        productos: carritoItems.filter(i => i.tipo === "producto").map<CompraProductoDto>(i => ({
          producto_id: i.id,
          cantidad: i.cantidad,
          precio_unitario_bs: i.precio_unitario_bs || 0,
          precio_unitario_usd: i.precio_unitario_usd || 0,
        })),
      }

      await ComprasServices.createCompra(newCompra)
      setSuccessMessage("Compra realizada exitosamente!")
      await refrescarNotificaciones()
      setCarritoItems([])
      setSelectedProveedor(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar la compra")
      console.error(err)
    } finally { setLoading(false) }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in={true} timeout={800}>
        <Box>
          <HeaderSection title="Registro de compras" icon={<ShoppingCart />} />
          <StyledPaper sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
            {successMessage && <Alert severity="success" onClose={() => setSuccessMessage(null)}>{successMessage}</Alert>}

            <ProveedorSelector
              proveedores={proveedores}
              loading={loading}
              selectedProveedor={selectedProveedor}
              onChange={setSelectedProveedor}
              onNuevo={() => setOpenAddModal(true)}
            />

           {selectedProveedor && (
  <>
    {/* Info del proveedor */}
    <ProveedorInfo proveedor={selectedProveedor} />

    {/* Selector de navegación */}
    <NavSelector value={navValue} onChange={setNavValue} />
    <CarritoCompra
      items={navValue === "materiales" ? materiales : productos}
      selectedItem={navValue === "materiales" ? selectedMaterial : selectedProduct}
      tipo={navValue === "materiales" ? "material" : "producto"}
      loading={loading}
      onChange={(item) => {
        if (navValue === "materiales") setSelectedMaterial(item as MaterialesDto | null)
        else setSelectedProduct(item as ProductoDTO | null)
      }}
      onNuevo={navValue === "materiales" ? () => setOpenAddMaterialModal(true) : () => setOpenAddProductModal(true)}
      onAgregar={handleAgregarAlCarrito}
    />



    {/* Tabla, resumen y botón solo si hay items */}
    {carritoItems.length > 0 && (
      <>
        <TablaCarritoItems items={carritoItems} onEliminar={handleEliminarDelCarrito} />
        <ResumenCompra items={carritoItems} />

        <Box mt={2} display="flex" justifyContent="flex-end">
          <SaveButton texto="Guardar compra" onClick={handleGuardar} />
        </Box>
      </>
    )}
  </>
)}
          </StyledPaper>
        </Box>
      </Fade>

      {/* Modales */}
      <ProveedorAdd open={openAddModal} onClose={() => { setOpenAddModal(false); fetchProveedores(1, 50) }} />
      <MaterialAdd open={openAddMaterialModal} onClose={() => { setOpenAddMaterialModal(false); fetchMateriales(1, 50) }} />
      <ProductsAdd open={openAddProductModal} onClose={() => { setOpenAddProductModal(false); fetchProducts() }} onProductAdded={fetchProducts} />
    </Container>
  )
}
