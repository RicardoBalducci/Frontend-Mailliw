"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, Typography, Box, Divider } from "@mui/material"
import type { CarritoItem } from "./carrito-compra"
import { formatNumber } from "../../utils/format"

interface ResumenCompraProps {
  items: CarritoItem[]
}

export const ResumenCompra: React.FC<ResumenCompraProps> = ({ items }) => {
  const [dollarOficial, setDollarOficial] = useState<number>(1)

  useEffect(() => {
    const storedDollar = localStorage.getItem("dollar_oficial")
    if (storedDollar) setDollarOficial(Number(storedDollar))
  }, [])

  // ============================
  //   CÁLCULOS DE COSTOS
  // ============================

  const materiales = items.filter((i) => i.tipo === "material")
  const productos = items.filter((i) => i.tipo === "producto")

  const materialesCostUSD = materiales.reduce(
    (sum, item) => sum + item.cantidad * item.precio_unitario_usd,
    0
  )

  const productosCostUSD = productos.reduce(
    (sum, item) => sum + item.cantidad * item.precio_unitario_usd,
    0
  )

  const totalUSD = materialesCostUSD + productosCostUSD
  const totalBS = totalUSD * dollarOficial

  return (
    <Card
      sx={{
        mt: 3,
        p: 1,
        borderRadius: 3,
        overflow: "hidden",
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 8px 28px rgba(0,0,0,0.12)",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: "#1a1a1a",
            letterSpacing: "0.5px",
          }}
        >
          Resumen de la compra
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* MATERIAL / PRODUCTO */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            {/* Materiales */}
            <Box
              sx={{
                flex: 1,
                p: 2.2,
                borderRadius: 2,
                background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
                border: "1px solid rgba(56,142,60,0.25)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#2e7d32" }}>
                Materiales
              </Typography>

              <Typography variant="h5" sx={{ fontWeight: 700, color: "#2e7d32", mt: 0.5 }}>
                {materiales.length} {materiales.length === 1 ? "item" : "items"}
              </Typography>
            </Box>

            {/* Productos */}
            <Box
              sx={{
                flex: 1,
                p: 2.2,
                borderRadius: 2,
                background: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
                border: "1px solid rgba(251,140,0,0.3)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#ef6c00" }}>
                Productos
              </Typography>

              <Typography variant="h5" sx={{ fontWeight: 700, color: "#ef6c00", mt: 0.5 }}>
                {productos.length} {productos.length === 1 ? "item" : "items"}
              </Typography>
            </Box>
          </Box>

          {/* TOTALES */}
          <Divider sx={{ my: 1 }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            {/* Total USD */}
            <Box
              sx={{
                flex: 1,
                p: 2.5,
                borderRadius: 2,
                background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                border: "1px solid rgba(25,118,210,0.3)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1565c0" }}>
                Total $
              </Typography>

              <Typography variant="h4" sx={{ fontWeight: 800, color: "#1565c0", mt: 1 }}>
                ${formatNumber(totalUSD)}
              </Typography>
            </Box>

            {/* Total BS */}
            <Box
              sx={{
                flex: 1,
                p: 2.5,
                borderRadius: 2,
                background: "linear-gradient(135deg, #ffece0 0%, #ffccbc 100%)",
                border: "1px solid rgba(255,112,67,0.3)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#d84315" }}>
                Total BS
              </Typography>

              <Typography variant="h4" sx={{ fontWeight: 800, color: "#d84315", mt: 1 }}>
                Bs. {formatNumber(totalBS)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ResumenCompra
