"use client";

import { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Button,
} from "@mui/material";
import ClienteInfo from "./ClienteInfo";
import PagoSelect from "./PagoSelect";
import { RespuestaClienteDTO } from "../../../Dto/Cliente.dto";
import { ServicioDTO } from "../../../Dto/Servicio.dto";
import { ProductoDTO } from "../../../Dto/Productos.dto";
import ServiciosServices from "../../../api/ServiciosServices";
import ProductServices from "../../../api/ProductServices";
import ProductosPanel from "./ProductosPanel";
import ServiciosPanel from "./ServiciosPanel";
import { CreateVentaDto, ProductoVenta, ServicioVenta } from "../../../Dto/Ventas-create.dto";
import VentasServices from "../../../api/VentasServices";
import DetalleServicio from "./DetalleServicio";

interface ClientePanelProps {
  cliente: RespuestaClienteDTO;
}

const ClientePanel: React.FC<ClientePanelProps> = ({ cliente }) => {
  const [tab, setTab] = useState<"servicios" | "productos">("servicios");
  const [loading, setLoading] = useState(false);

  const [servicios, setServicios] = useState<ServicioDTO[]>([]);
  const [selectedServicio, setSelectedServicio] = useState<ServicioDTO | null>(null);

  const [products, setProducts] = useState<ProductoDTO[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductoDTO | null>(null);

  const [tipoPago, setTipoPago] = useState("");
  const [cantidad, setCantidad] = useState<number>(1);
  const [nota, setNota] = useState(""); 

  // Carrito de compras
  const [carritoProductos, setCarritoProductos] = useState<ProductoVenta[]>([]);
  const [carritoServicios, setCarritoServicios] = useState<ServicioVenta[]>([]);

  // Totales calculados
const totalUSD =
  carritoProductos.reduce((acc, p) => {
    const producto = products.find(prod => prod.id === p.id);
    return acc + ((producto?.precio_usd || 0) * (p.cantidad ?? 0));
  }, 0) +
  carritoServicios.reduce((acc, s) => {
    const servicio = servicios.find(serv => serv.id === s.id);
    return acc + ((servicio?.precio_estandar_usd || 0) * (s.cantidad ?? 0));
  }, 0);

const totalBS = totalUSD * (Number(localStorage.getItem("dollar_oficial")) || 0);

const cantidadTotal =
  carritoProductos.reduce((acc, p) => acc + (p.cantidad ?? 0), 0) +
  carritoServicios.reduce((acc, s) => acc + (s.cantidad ?? 0), 0);

  // Fetch servicios
  const fetchServicios = async () => {
    setLoading(true);
    try {
      const data = await ServiciosServices.getServicios();
      setServicios(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch productos
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await ProductServices.fetchProductos();
      if (response.success && response.data) setProducts(response.data);
      else setProducts([]);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "servicios") fetchServicios();
    else if (tab === "productos") fetchProducts();
  }, [tab]);

  // Agregar producto al carrito
  const agregarProductoCarrito = () => {
    if (!selectedProduct) return;
    const existing = carritoProductos.find(p => p.id === selectedProduct.id);
    if (existing) {
      setCarritoProductos(
        carritoProductos.map(p =>
          p.id === selectedProduct.id ? { ...p, cantidad } : p
        )
      );
    } else {
      setCarritoProductos([...carritoProductos, { id: selectedProduct.id, cantidad }]);
    }
    setCantidad(1);
  };

  // Agregar servicio al carrito
  const agregarServicioCarrito = () => {
    if (!selectedServicio) return;
    const existing = carritoServicios.find(s => s.id === selectedServicio.id);
    if (existing) {
      setCarritoServicios(
        carritoServicios.map(s =>
          s.id === selectedServicio.id ? { ...s, cantidad: 1 } : s
        )
      );
    } else {
      setCarritoServicios([...carritoServicios, { id: selectedServicio.id, cantidad: 1 }]);
    }
  };

  // Registrar venta
  const handleMostrarVenta = async () => {
    const venta: CreateVentaDto & { tipo_venta?: string; nota?: string } = {
      cliente_id: cliente.id,
      productos: carritoProductos,
      servicios: carritoServicios,
      tipo_venta: tipoPago,
      nota,
    };

    try {
      await VentasServices.createVenta(venta);
      setCarritoProductos([]);
      setCarritoServicios([]);
      setNota("");
      setTipoPago("");
    } catch (error) {
      console.error("Error al registrar la venta:", error);
    }
  };

  return (
    <Box mt={4}>
      <ClienteInfo cliente={cliente} />

      <Box mt={4}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress />
          </Box>
        ) : tab === "servicios" ? (
          <ServiciosPanel
            servicios={servicios}
            selected={selectedServicio}
            setSelected={setSelectedServicio}
            tab={tab}
            setTab={setTab}
          />
        ) : (
          <ProductosPanel
            products={products}
            selected={selectedProduct}
            setSelected={setSelectedProduct}
            tab={tab}
            setTab={setTab}
          />
        )}

        {selectedServicio && (
          <DetalleServicio
            servicio={selectedServicio}
            agregarServicioCarrito={agregarServicioCarrito}
          />
        )}

        {selectedProduct && (
          <Paper sx={{ mt: 4, p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>Detalles del Producto</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography><strong>Nombre:</strong> {selectedProduct.nombre}</Typography>
            <Typography><strong>Stock:</strong> {selectedProduct.stock}</Typography>
            <Typography><strong>Precio Unitario (USD):</strong> {selectedProduct.precio_usd}</Typography>
            <TextField
              label="Cantidad a comprar"
              type="number"
              value={cantidad}
              onChange={e => setCantidad(Math.max(1, Math.min(selectedProduct.stock, parseInt(e.target.value) || 1)))}
              inputProps={{ min: 1, max: selectedProduct.stock }}
              sx={{ mt: 2 }}
              fullWidth
            />
            <Button sx={{ mt: 2 }} variant="contained" onClick={agregarProductoCarrito}>
              Agregar Producto al Carrito
            </Button>
          </Paper>
        )}

        {(carritoProductos.length > 0 || carritoServicios.length > 0) && (
          <>
            <TableContainer component={Paper} sx={{ mt: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Precio / Unidad</TableCell>
                    <TableCell>Stock / Disponibles</TableCell>
                    <TableCell>Cantidad</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {carritoServicios.map(s => {
                    const servicio = servicios.find(serv => serv.id === s.id);
                    return (
                      <TableRow key={`serv-${s.id}`}>
                        <TableCell>Servicio</TableCell>
                        <TableCell>{servicio?.nombre}</TableCell>
                        <TableCell>{servicio?.precio_estandar_usd}</TableCell>
                        <TableCell>N/A</TableCell>
                        <TableCell>{s.cantidad}</TableCell>
                      </TableRow>
                    );
                  })}
                  {carritoProductos.map(p => {
                    const producto = products.find(prod => prod.id === p.id);
                    return (
                      <TableRow key={`prod-${p.id}`}>
                        <TableCell>Producto</TableCell>
                        <TableCell>{producto?.nombre}</TableCell>
                        <TableCell>{producto?.precio_usd}</TableCell>
                        <TableCell>{producto?.stock}</TableCell>
                        <TableCell>{p.cantidad}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

           
          </>
        )}

        <Box mt={4}>
          <TextField
            label="Nota de la venta"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
        </Box>

        <Box mt={4}>
          <PagoSelect tipoPago={tipoPago} setTipoPago={setTipoPago} />
        </Box>
         <Box mt={4} p={2} component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
              <Typography variant="h6">Resumen de la Compra</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography><strong>Total Items:</strong> {cantidadTotal}</Typography>
              <Typography><strong>Total USD:</strong> ${totalUSD.toFixed(2)}</Typography>
              <Typography><strong>Total Bs:</strong> Bs {totalBS.toFixed(2)}</Typography>
            </Box>
        <Box mt={4}>
          <Button fullWidth variant="contained" color="primary" onClick={handleMostrarVenta}>
            Realizar Venta
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ClientePanel;
