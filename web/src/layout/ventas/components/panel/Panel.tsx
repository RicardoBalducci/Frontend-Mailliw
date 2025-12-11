"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, TextField, Button, CircularProgress } from "@mui/material";
import PanelServicios, { ServicioRow } from "./servicios";
import PanelProductos, { ProductRow } from "./productos";
import CartTable, { CartItem } from "./table";
import CartSummary from "./card/CartSummary";
import PagoSelect from "../../componentes/PagoSelect";
import { CreateVentaDto } from "../../../../Dto/Ventas-create.dto";
import VentasServices from "../../../../api/VentasServices";

export default function PanelVenta({ cliente }: { cliente: { id: number } }) {
  const [activePanel, setActivePanel] = useState<"servicios" | "productos" | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [dollarOficial, setDollarOficial] = useState<number>(1);
  const [tipoPago, setTipoPago] = useState<string>("Pago móvil");
  const [nota, setNota] = useState<string>("");
  const [loadingVenta, setLoadingVenta] = useState<boolean>(false);

  useEffect(() => {
    const storedDollar = localStorage.getItem("dollar_oficial");
    if (storedDollar) setDollarOficial(Number(storedDollar));
  }, []);

  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.tipo === item.tipo);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.tipo === item.tipo
            ? { ...i, cantidad: i.cantidad + item.cantidad }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const handleRemoveFromCart = (id: number, tipo: "producto" | "servicio") => {
    setCart((prev) => prev.filter((i) => i.id !== id || i.tipo !== tipo));
  };

  // Resumen
  const totalProductos = cart.filter(i => i.tipo === "producto").reduce((sum, i) => sum + i.cantidad, 0);
  const totalServicios = cart.filter(i => i.tipo === "servicio").reduce((sum, i) => sum + i.cantidad, 0);
  const totalUSD = cart.reduce((sum, i) => sum + i.precio_unitario * i.cantidad, 0);
  const totalBS = totalUSD * dollarOficial;

  const handleRealizarVenta = async () => {
    if (cart.length === 0) return;

    setLoadingVenta(true);

    // Separar productos y servicios
    const carritoProductos = cart
      .filter(i => i.tipo === "producto")
      .map(p => ({ id: p.id, cantidad: p.cantidad }));

    const carritoServicios = cart
      .filter(i => i.tipo === "servicio")
      .map(s => ({ id: s.id, cantidad: s.cantidad }));

    const venta: CreateVentaDto & { tipo_venta?: string; nota?: string } = {
      cliente_id: cliente.id,
      productos: carritoProductos,
      servicios: carritoServicios,
      tipo_venta: tipoPago,
      nota,
    };

    try {
      await VentasServices.createVenta(venta);

      // Limpiar estados
      setCart([]);
      setNota("");
      setTipoPago("Pago móvil");
      alert("Venta realizada con éxito!");
    } catch (error) {
      console.error("Error al registrar la venta:", error);
      alert("Ocurrió un error al registrar la venta.");
    } finally {
      setLoadingVenta(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
        Panel de Venta
      </Typography>

      {/* Botones selección */}
      <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
        {["servicios", "productos"].map((tipo) => (
          <Card
            key={tipo}
            sx={{
              flex: "1 1 200px",
              cursor: "pointer",
              background: activePanel === tipo ? "#1976d2" : "#f5f5f5",
              color: activePanel === tipo ? "#fff" : "#000",
              transition: "all 0.3s ease",
              "&:hover": { transform: "translateY(-2px)", boxShadow: 4 },
            }}
            onClick={() => setActivePanel(tipo as "servicios" | "productos")}
          >
            <CardContent>
              <Typography variant="h6" fontWeight={600} textAlign="center">
                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Panel activo */}
      <Box sx={{ mb: 4 }}>
        {activePanel === "servicios" && (
          <PanelServicios
            onAddToCart={(servicio: ServicioRow, cantidad: number) =>
              handleAddToCart({
                id: servicio.id,
                tipo: "servicio",
                nombre: servicio.nombre,
                descripcion: servicio.descripcion,
                precio_unitario: servicio.precio_unitario,
                cantidad,
              })
            }
          />
        )}

        {activePanel === "productos" && (
          <PanelProductos
            onAddToCart={(producto: ProductRow, cantidad: number) =>
              handleAddToCart({
                id: producto.id,
                tipo: "producto",
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                precio_unitario: Number(producto.precio_unitario),
                cantidad,
              })
            }
          />
        )}
      </Box>

      {cart.length > 0 && (
        <>
          <CartTable cart={cart} onRemove={handleRemoveFromCart} />
          <CartSummary
            totalProductos={totalProductos}
            totalServicios={totalServicios}
            totalUSD={totalUSD}
            totalBS={totalBS}
          />

          <Box sx={{ pt: 3, pb: 3 }}>
            <PagoSelect tipoPago={tipoPago} setTipoPago={setTipoPago} />
          </Box>

          <Box sx={{ pt: 3, pb: 3 }}>
            <TextField
              label="Nota"
              placeholder="Agrega una nota sobre esta venta"
              multiline
              minRows={3}
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              fullWidth
            />
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={handleRealizarVenta}
              disabled={loadingVenta}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              {loadingVenta ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Realizar Venta"}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
