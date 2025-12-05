import {
  Container,
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
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

export default function HomeContent() {
  // Datos independientes para cada sección
  const productosBajoStock = [
    { nombre: "llave de tipo cisa", stock: 2 },
    { nombre: "control porton", stock: 5 },
    { nombre: "cerradura pomo", stock: 10 },
  ];

  const productosVendidos = [
    { nombre: "cerradura digital", cantidad: 15 },
    { nombre: "sensor de movimiento", cantidad: 8 },
    { nombre: "cámara IP", cantidad: 12 },
  ];

  const serviciosRealizados = [
    { nombre: "Instalación de portón eléctrico", realizados: 5 },
    { nombre: "Mantenimiento de cerraduras", realizados: 10 },
    { nombre: "Reparación de cámaras de seguridad", realizados: 7 },
  ];

  const ventasData = [
    { dia: "Lun", total: 20, costo: 12 },
    { dia: "Mar", total: 35, costo: 20 },
    { dia: "Mié", total: 25, costo: 15 },
    { dia: "Jue", total: 50, costo: 30 },
    { dia: "Vie", total: 45, costo: 28 },
    { dia: "Sáb", total: 60, costo: 40 },
    { dia: "Dom", total: 30, costo: 18 },
  ];

  const SectionCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: "0 3px 20px rgba(0,0,0,0.08)",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {children}
    </Paper>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Filtros */}
      <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
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
      </Box>

      {/* Secciones - 3 columnas responsivas */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" },
          gap: 3,
        }}
      >
        {/* Productos con bajo stock */}
        <SectionCard title="Productos con bajo stock">
          {productosBajoStock.map((p, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                p: 1,
                borderBottom: "1px solid #eee",
              }}
            >
              <Typography>{p.nombre}</Typography>
              <Typography
                sx={{
                  color: p.stock <= 5 ? "#d32f2f" : "#ffa000",
                  fontWeight: 600,
                }}
              >
                {p.stock} unidades
              </Typography>
            </Box>
          ))}
        </SectionCard>

        {/* Productos vendidos */}
        <SectionCard title="Productos vendidos">
          {productosVendidos.map((p, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                p: 1,
                borderBottom: "1px solid #eee",
              }}
            >
              <Typography>{p.nombre}</Typography>
              <Typography sx={{ fontWeight: 600, color: "#2e7d32" }}>
                {p.cantidad} unidades
              </Typography>
            </Box>
          ))}
        </SectionCard>

        {/* Servicios realizados */}
        <SectionCard title="Servicios realizados">
          {serviciosRealizados.map((s, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                p: 1,
                borderBottom: "1px solid #eee",
              }}
            >
              <Typography>{s.nombre}</Typography>
              <Typography sx={{ fontWeight: 600, color: "#1976d2" }}>
                {s.realizados} servicios
              </Typography>
            </Box>
          ))}
        </SectionCard>
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
        <SectionCard title="Ventas vs Gastos">
          <Box sx={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ventasData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#1976d2"
                  strokeWidth={3}
                  name="Ventas"
                />
                <Line
                  type="monotone"
                  dataKey="costo"
                  stroke="#d32f2f"
                  strokeWidth={3}
                  name="Costos"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </SectionCard>

        <SectionCard title="Producto vs Servicio">
          <Box sx={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ventasData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#1976d2"
                  strokeWidth={3}
                  name="Ventas"
                />
                <Line
                  type="monotone"
                  dataKey="costo"
                  stroke="#d32f2f"
                  strokeWidth={3}
                  name="Costos"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </SectionCard>
      </Box>
    </Container>
  );
}
