"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Fade,
  Button,
  CircularProgress,
  Typography,
  TextField,
  MenuItem,
  Paper,
  Divider,
  InputAdornment,
} from "@mui/material";

import { Clock, FileText, Search, Funnel, TriangleAlert } from "lucide-react";

import HeaderSection from "../../../components/global/Header/header";
import VentasServices from "../../../api/VentasServices";
import { StyledPaper } from "../../../theme/StyledComponents";
import SalesTable from "./historialTabla";
import { generarHistorialVentasPDF } from "../../../utils/pdfGenerator";

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  rif: string;
  direccion: string;
  telefono: string;
}

interface ProductoVentaHist {
  id: number;
  nombre: string;
  cantidad?: number;
}

interface ServicioVentaHist {
  id: number;
  nombre: string;
  cantidad?: number;
}

interface Venta {
  id: number;
  fechaVenta: string;
  total_bs: string;
  total_usd: string;
  tipo_venta: string;
  nota?: string | null;
  cliente: Cliente;
  productos?: ProductoVentaHist[];
  servicios?: ServicioVentaHist[];
}

interface VentasResponse {
  success: boolean;
  data: Venta[];
}

export function HistorialVentas() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Filtros
  const [nombre, setNombre] = useState(""); // Búsqueda por nombre
  const [debouncedNombre, setDebouncedNombre] = useState(nombre);

  const [persona, setPersona] = useState(""); // D.I / RIF
  const [tipoDocumento, setTipoDocumento] = useState("V");
  const [tipoVenta, setTipoVenta] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
const [debouncedPersona, setDebouncedPersona] = useState(persona);


useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedPersona(persona); // Actualiza solo después de 5 segundos
  }, 3000); // 5000 ms = 5 segundos

  return () => clearTimeout(handler); // Limpiar timeout si el usuario sigue escribiendo
}, [persona]);
  // 🔹 Debounce para nombre
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedNombre(nombre);
    }, 2000);
    return () => clearTimeout(handler);
  }, [nombre]);

  // 🔹 Fetch ventas con filtros separados
  const fetchVentas = async () => {
    try {
      setLoading(true);
      const response: VentasResponse = await VentasServices.getVentas({
        fecha_inicio: fechaInicio || undefined,
        fecha_fin: fechaFin || undefined,
        tipo_venta: tipoVenta || undefined,
        rif: persona ? `${tipoDocumento}-${persona}` : undefined, // filtro RIF
        nombre: debouncedNombre || undefined, // filtro nombre
      });
      setVentas(response.data || []);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) setError(err.message);
      else setError("Error al obtener las ventas.");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  fetchVentas();
}, [debouncedNombre, debouncedPersona, tipoDocumento, tipoVenta, fechaInicio, fechaFin]);

  // 🔹 Transformación de datos para la tabla
  const rowsEjemplo = ventas.map((venta) => {
    const cantProductos =
      venta.productos?.reduce((acc, p) => acc + (p.cantidad ?? 1), 0) || 0;
    const cantServicios =
      venta.servicios?.reduce((acc, s) => acc + (s.cantidad ?? 1), 0) || 0;

    return {
      id: venta.id,
      cliente: `${venta.cliente.nombre} ${venta.cliente.apellido}`,
      rif: venta.cliente.rif,
      totalBs: Number(venta.total_bs),
      totalUsd: Number(venta.total_usd),
      cantProductos,
      cantServicios,
      fecha: new Date(venta.fechaVenta).toLocaleDateString(),
      tipo: venta.tipo_venta,
      nota: venta.nota || "-",
    };
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Box>
          <HeaderSection title="Historial de Ventas" icon={<Clock />} />

          <StyledPaper
            sx={{
              p: 3,
              borderRadius: "18px",
              boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
            }}
          >
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <Box>
                {/* 🔹 BARRA SUPERIOR */}
                <Box
                  display="flex"
                  flexDirection={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "stretch", sm: "center" }}
                  mb={3}
                  gap={2}
                >
                  {/* 🔍 Buscador por NOMBRE */}
                  <TextField
                    placeholder="Buscar por nombre..."
                    variant="outlined"
                    fullWidth
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search size={20} color="#6c757d" />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: "12px", bgcolor: "white" },
                    }}
                    sx={{ maxWidth: { xs: "100%", sm: 500 } }}
                  />

                  <Box
                    display="flex"
                    flexDirection={{ xs: "column", sm: "row" }}
                    justifyContent={{ xs: "center", sm: "flex-start" }}
                    alignItems={{ xs: "stretch", sm: "center" }}
                    gap={1.5}
                    width={{ xs: "100%", sm: "auto" }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<Funnel size={18} />}
                      sx={{
                        px: 3,
                        py: 1.15,
                        borderRadius: "12px",
                        textTransform: "none",
                        fontWeight: 600,
                        color: "#1e4fa8",
                        borderColor: "#1e4fa8",
                        ":hover": {
                          background: "rgba(30,79,168,0.08)",
                          borderColor: "#163b80",
                        },
                      }}
                      onClick={() => setMostrarFiltros((prev) => !prev)}
                    >
                      Filtros
                    </Button>

                    {/* 📄 BOTÓN PDF */}
                    <Button
                      variant="contained"
                      startIcon={<FileText size={18} />}
                      sx={{
                        px: 3,
                        py: 1.2,
                        borderRadius: "12px",
                        fontSize: "0.9rem",
                        textTransform: "none",
                        background: "#1e4fa8",
                        ":hover": { background: "#163b80" },
                      }}
                      onClick={() => generarHistorialVentasPDF(ventas)}
                    >
                      PDF
                    </Button>
                  </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* 🔹 PANEL FILTROS AVANZADOS */}
                {mostrarFiltros && (
                  <Box
                    component={Paper}
                    elevation={0}
                    sx={{
                      p: 3,
                      mb: 3,
                      borderRadius: "16px",
                      background: "#f9fafc",
                      border: "1px solid #e1e5eb",
                      animation: "fadeIn 0.35s ease",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Funnel size={20} color="#1e4fa8" />
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ color: "#1e4fa8" }}
                      >
                        Filtros Avanzados
                      </Typography>
                    </Box>

                    {/* 🔹 ROW 1: Fechas */}
                    <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Fecha inicio"
                        InputLabelProps={{ shrink: true }}
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                      />
                      <TextField
                        fullWidth
                        type="date"
                        label="Fecha fin"
                        InputLabelProps={{ shrink: true }}
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                      />
                    </Box>

                    <Box
                      display="flex"
                      flexDirection={{ xs: "column", sm: "row" }}
                      gap={2}
                      alignItems="center"
                    >
                      {/* Tipo de Documento */}
                      <TextField
                        select
                        label="Tipo"
                        value={tipoDocumento}
                        onChange={(e) => setTipoDocumento(e.target.value)}
                        sx={{
                          flex: "0 0 80px",
                          minWidth: 20,
                        }}
                      >
                        <MenuItem value="V">V</MenuItem>
                        <MenuItem value="J">J</MenuItem>
                        <MenuItem value="G">G</MenuItem>
                        <MenuItem value="R">R</MenuItem>
                      </TextField>

                      {/* Documento de Identidad */}
                      <TextField
                        label="D.I"
                        placeholder="Ej: 29830187"
                        value={persona}
                        onChange={(e) => setPersona(e.target.value)}
                        sx={{
                          flex: "0 0 590px",
                          Width: 100,
                        }}
                      />

                      {/* Tipo de Venta */}
                      <TextField
                        select
                        label="Tipo de Venta"
                        value={tipoVenta}
                        onChange={(e) => setTipoVenta(e.target.value)}
                        sx={{
                          flex: 1,
                          minWidth: 200,
                        }}
                      >
                        <MenuItem value="">Todas</MenuItem>
                        <MenuItem value="Pago Móvil">Pago Móvil</MenuItem>
                        <MenuItem value="Efectivo BS">Efectivo BS</MenuItem>
                        <MenuItem value="Efectivo USD">Efectivo USD</MenuItem>
                        <MenuItem value="Transferencia">Transferencia</MenuItem>
                        <MenuItem value="Zelle">Zelle</MenuItem>
                        <MenuItem value="Mixto">Mixto</MenuItem>
                      </TextField>
                    </Box>
                  </Box>
                )}

                {/* 🔹 TABLA */}
                {rowsEjemplo.length > 0 ? (
                  <SalesTable rows={rowsEjemplo} searchTerm="" />
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      py: 8,
                      textAlign: "center",
                      color: "text.secondary",
                      gap: 2,
                      bgcolor: "#f5f5f5",
                      borderRadius: 2,
                      p: 4,
                    }}
                  >
                    <TriangleAlert size={48} color="#f59e0b" />
                    <Typography variant="h6" fontWeight={700} color="text.primary">
                      No se encontraron ventas
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      No hay datos disponibles para los filtros seleccionados o no se pudo cargar la información.
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      onClick={fetchVentas}
                    >
                      Recargar
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </StyledPaper>
        </Box>
      </Fade>
    </Container>
  );
}
