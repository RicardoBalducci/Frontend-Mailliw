import React, { useEffect, useState } from "react";
import { Box, Container, Fade, CircularProgress, Alert } from "@mui/material";
import { Clock } from "lucide-react";
import HeaderSection from "../../components/global/Header/header";
import { StyledPaper } from "../../theme/StyledComponents";
import HistorialServices, { HistorialDTO } from "../../api/HistorialServices";

// Interfaces
interface Material {
  id: number;
  nombre: string;
  descripcion: string;
  stock: number;
  precio_unitario_usd: number;
}

interface HistorialMaterialDTO {
  id: number;
  cantidad: number;
  precio_unitario_bs: number;
  precio_unitario_usd: number;
  material: Material;
}


export function HistorialPage() {
  const [historial, setHistorial] = useState<HistorialDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistorial();
  }, []);

  const fetchHistorial = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await HistorialServices.fetchHistorial();
      if (res.success) {
        setHistorial(res.data || []);
      } else {
        setError(res.message || "No se pudo obtener el historial.");
      }
    } catch (err) {
      console.error(err);
      setError("Error al obtener el historial.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in={true} timeout={800}>
        <Box>
          <HeaderSection title="Historial" icon={<Clock />} />

          <StyledPaper sx={{ mt: 3, p: 2 }}>
            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}

            {!loading && !error && (
              <>
                {historial.length === 0 ? (
                  <p>No hay historial disponible.</p>
                ) : (
                  historial.map((h) => (
                    <Box
                      key={h.id}
                      sx={{
                        mb: 2,
                        p: 2,
                        border: "1px solid #ccc",
                        borderRadius: 1,
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      <p>
                        <strong>ID:</strong> {h.id}
                      </p>
                      <p>
                        <strong>Tipo:</strong> {h.fecha || "N/A"}
                      </p>
                      <p>
                        <strong>Fecha:</strong> {new Date(h.fecha).toLocaleString()}
                      </p>
                      {h.proveedor && (
                        <p>
                          <strong>Proveedor:</strong> {h.proveedor.nombre}
                        </p>
                      )}
                      {h.user && (
                        <p>
                          <strong>Usuario:</strong> {h.user.nombre}
                        </p>
                      )}
                      {h.materiales && h.materiales.length > 0 && (
                        <Box sx={{ ml: 2 }}>
                          <p>
                            <strong>Materiales:</strong>
                          </p>
                          <ul>
                            {h.materiales.map((m) => (
                              <li key={m.id}>
                                {m.material.nombre} - Cantidad: {m.cantidad} - Precio
                                USD: {Number(m.precio_unitario_usd).toFixed(2)}
                              </li>
                            ))}
                          </ul>
                        </Box>
                      )}
                    </Box>
                  ))
                )}
              </>
            )}
          </StyledPaper>
        </Box>
      </Fade>
    </Container>
  );
}

export default HistorialPage;
