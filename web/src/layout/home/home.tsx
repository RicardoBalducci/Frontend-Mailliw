"use client";

import { useState, useEffect } from "react";
import { Container, Box, CircularProgress } from "@mui/material";
import ProductosBajoStock from "./components/ProductosBajoStock";
import ProductosVendidos from "./components/ProductosVendidos";
import ServiciosRealizados from "./components/ServiciosRealizados";
import VentasVsGastosChart from "./components/VentasVsGastosChart";
import ProductoVsServicioChart from "./components/ProductoVsServicioChart";
import EstadisticaServices, { EstadisticaDiaria } from "../../api/EstadisticaServices";

export default function HomeContent() {
  const [estadistica, setEstadistica] = useState<EstadisticaDiaria | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstadistica = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await EstadisticaServices.getDaily();
        setEstadistica(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar estadísticas");
      } finally {
        setLoading(false);
      }
    };

    fetchEstadistica();
  }, []);

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Box color="error.main" mt={4}>{error}</Box>;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
{/*       <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Día</InputLabel>
          <Select label="Día" defaultValue="Todos">
            <MenuItem value="Todos">Todos</MenuItem>
            <MenuItem value="L">Lunes</MenuItem>
            <MenuItem value="M">Martes</MenuItem>
            <MenuItem value="X">Miércoles</MenuItem>
            <MenuItem value="J">Jueves</MenuItem>
            <MenuItem value="V">Viernes</MenuItem>
            <MenuItem value="S">Sábado</MenuItem>
            <MenuItem value="D">Domingo</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Mes</InputLabel>
          <Select label="Mes" defaultValue="Todos">
            <MenuItem value="Todos">Todos</MenuItem>
            <MenuItem value="01">Enero</MenuItem>
            <MenuItem value="02">Febrero</MenuItem>
            <MenuItem value="03">Marzo</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Año</InputLabel>
          <Select label="Año" defaultValue="2025">
            <MenuItem value="2024">2024</MenuItem>
            <MenuItem value="2025">2025</MenuItem>
          </Select>
        </FormControl>
      </Box> */}

      {/* Tablas */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" },
          gap: 3,
        }}
      >
        <ProductosBajoStock productos={estadistica?.producto_bajo_stock || []} />
        <ProductosVendidos productos={estadistica?.productos_vendidos || []} />
        <ServiciosRealizados servicios={[{ nombre: "Servicios realizados", realizados: estadistica?.servicios_realizados || 0 }]} />
      </Box>

      {/* Gráficos */}
      <Box
        sx={{
          mt: 4,
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
        }}
      >
        <VentasVsGastosChart data={estadistica?.venta_vs_gastos || null} />
<ProductoVsServicioChart data={estadistica?.productos_vs_servicios || null} />
      </Box>
    </Container>
  );
}
