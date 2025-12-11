import { useEffect, useState } from "react";
import { Compra } from "../../../types/compras";
import ComprasServices from "../../../api/ComprasServices";
import {
  Box,
  CircularProgress,
  Container,
  Fade,
  Typography,
    Paper,
  Divider,
  Alert,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import HeaderSection from "../../../components/global/Header/header";
import { Clock, FileText, Funnel, Search } from "lucide-react";
import { StyledPaper } from "../../../theme/StyledComponents";
import PurchasesTable from "./PurchasesTable";
import { generarHistorialComprasPDF } from "./generatePDF";

const HistorialCompras = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
      const [mostrarFiltros, setMostrarFiltros] = useState(false);
    
  // Filtros
  const [proveedor, setProveedor] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useEffect(() => {
    fetchCompras();
  }, []);

  const fetchCompras = async () => {
    try {
      setLoading(true);

      const data = await ComprasServices.getCompras(
        proveedor || undefined,
        fechaInicio || undefined,
        fechaFin || undefined
      );

      // Forzar compatibilidad de tipos
setCompras(data as unknown as Compra[]);
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Error al obtener las compras."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Box>
          <HeaderSection title="Historial de Compras" icon={<Clock />} />

          <StyledPaper
            sx={{
              p: 3,
              borderRadius: "18px",
              boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
            }}
          >
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
              </Box>
            )}

           {!loading && error && (
            <Fade in timeout={400}>
                <Alert 
                severity="error" 
                sx={{ mt: 2, borderRadius: "12px" }}
                >
                {error}
                </Alert>
            </Fade>
            )}

            {/* Lista de compras */}
            {!loading && !error && compras.length > 0 && (
              <Box>
                <Box
                  display="flex"
                  flexDirection={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "stretch", sm: "center" }}
                  mb={3}
                  gap={2}
                >
                     <TextField
                    placeholder="Buscar por nombre..."
                    variant="outlined"
                    fullWidth
                    value={proveedor}
                    onChange={(e) => setProveedor(e.target.value)}
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
                      onClick={() => generarHistorialComprasPDF(compras)}
                    >
                      PDF
                    </Button>
                  </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

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
                    {/* Título */}
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
                    </Box>
                )
                    
                }
                <PurchasesTable rows={compras} searchTerm={proveedor} />

              </Box>
            )}
          </StyledPaper>
        </Box>
      </Fade>
    </Container>
  );
};

export default HistorialCompras;
