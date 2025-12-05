import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Fade,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Clock, FileText } from "lucide-react";
import HeaderSection from "../../../components/global/Header/header";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import VentasServices from "../../../api/VentasServices";
import { StyledPaper } from "../../../theme/StyledComponents";

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

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        setLoading(true);
        const response: VentasResponse = await VentasServices.getVentas();
        setVentas(response.data || []);
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error al obtener las ventas.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchVentas();
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Historial de Ventas", 14, 15);

    const tableColumn = [
      "Cliente",
      "RIF",
      "Total Bs",
      "Total USD",
      "Cant. Productos",
      "Cant. Servicios",
      "Fecha",
      "Tipo",
      "Nota",
    ];
    const tableRows: (string | number)[][] = [];

    ventas.forEach((venta) => {
      const cantProductos =
        venta.productos?.reduce((acc, p) => acc + (p.cantidad ?? 1), 0) || 0;
      const cantServicios =
        venta.servicios?.reduce((acc, s) => acc + (s.cantidad ?? 1), 0) || 0;

      const ventaData: (string | number)[] = [
        `${venta.cliente.nombre} ${venta.cliente.apellido}`,
        venta.cliente.rif,
        venta.total_bs,
        venta.total_usd,
        cantProductos,
        cantServicios,
        new Date(venta.fechaVenta).toLocaleString(),
        venta.tipo_venta,
        venta.nota || "-",
      ];
      tableRows.push(ventaData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("historial_ventas.pdf");
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Box>
          <HeaderSection title="Historial Ventas" icon={<Clock />} />

          <StyledPaper>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <Box>
                <Button
                  variant="contained"
                  startIcon={<FileText />}
                  sx={{ mb: 2 }}
                  onClick={exportPDF}
                >
                  Descargar PDF
                </Button>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Cliente</TableCell>
                        <TableCell>RIF</TableCell>
                        <TableCell>Total Bs</TableCell>
                        <TableCell>Total USD</TableCell>
                        <TableCell>Cant. Productos</TableCell>
                        <TableCell>Cant. Servicios</TableCell>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Nota</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ventas.map((venta) => {
                        const cantProductos =
                          venta.productos?.reduce(
                            (acc, p) => acc + (p.cantidad ?? 1),
                            0
                          ) || 0;
                        const cantServicios =
                          venta.servicios?.reduce(
                            (acc, s) => acc + (s.cantidad ?? 1),
                            0
                          ) || 0;

                        return (
                          <TableRow key={venta.id}>
                            <TableCell>{`${venta.cliente.nombre} ${venta.cliente.apellido}`}</TableCell>
                            <TableCell>{venta.cliente.rif}</TableCell>
                            <TableCell>{venta.total_bs}</TableCell>
                            <TableCell>{venta.total_usd}</TableCell>
                            <TableCell>{cantProductos}</TableCell>
                            <TableCell>{cantServicios}</TableCell>
                            <TableCell>
                              {new Date(venta.fechaVenta).toLocaleString()}
                            </TableCell>
                            <TableCell>{venta.tipo_venta}</TableCell>
                            <TableCell>{venta.nota || "-"}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </StyledPaper>
        </Box>
      </Fade>
    </Container>
  );
}
