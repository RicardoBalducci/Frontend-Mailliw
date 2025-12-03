import { useEffect, useState } from "react";
import { Box, Container, Fade } from "@mui/material";
import { Clock } from "lucide-react";
import HeaderSection from "../../components/global/Header/header";
import { StyledPaper } from "../../theme/StyledComponents";
import HistorialServices, { HistorialDTO } from "../../api/HistorialServices";

// Interfaces
/* interface Material {
  id: number;
  nombre: string;
  descripcion: string;
  stock: number;
  precio_unitario_usd: number;
} */

/* interface HistorialMaterialDTO {
  id: number;
  cantidad: number;
  precio_unitario_bs: number;
  precio_unitario_usd: number;
  material: Material;
}
 */

export function HistorialPage() {
  const [, setHistorial] = useState<HistorialDTO[]>([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

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
            <p>hola</p>
          </StyledPaper>
        </Box>
      </Fade>
    </Container>
  );
}

export default HistorialPage;
