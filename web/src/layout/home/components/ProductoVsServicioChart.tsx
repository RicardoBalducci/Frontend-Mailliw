import { Paper, Typography, Divider, Box } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ProductosVsServicios } from "../../../api/EstadisticaServices";

interface Props {
  data: ProductosVsServicios | null; // recibimos un solo objeto
}

export default function ProductoVsServicioChart({ data }: Props) {
  const chartData = data
    ? [
        {
          dia: "Hoy",
          total: data.productos,
          costo: data.servicios,
        },
      ]
    : [];

  return (
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: "0 3px 20px rgba(0,0,0,0.08)" }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Producto vs Servicio
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#1976d2" strokeWidth={3} name="Productos" />
            <Line type="monotone" dataKey="costo" stroke="#d32f2f" strokeWidth={3} name="Servicios" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
