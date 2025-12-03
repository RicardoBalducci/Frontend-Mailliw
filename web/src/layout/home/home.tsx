import { Container, Paper, Typography, Box } from "@mui/material";
import { Users, ShoppingCart, DollarSign, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function HomeContent() {
  const stats = [
    { label: "Clientes", value: 12, color: "#1976d2", icon: Users },
    { label: "Compras", value: 85, color: "#2e7d32", icon: ShoppingCart },
    { label: "Ventas", value: 150, color: "#9c27b0", icon: DollarSign },
    { label: "Gastos Pendientes", value: 12, color: "#d32f2f", icon: AlertTriangle },
  ];

  const ventasData = [
    { dia: "Lun", total: 20 },
    { dia: "Mar", total: 35 },
    { dia: "Mié", total: 25 },
    { dia: "Jue", total: 50 },
    { dia: "Vie", total: 45 },
    { dia: "Sáb", total: 60 },
    { dia: "Dom", total: 30 },
  ];

  const comprasData = [
    { dia: "Lun", total: 10 },
    { dia: "Mar", total: 20 },
    { dia: "Mié", total: 15 },
    { dia: "Jue", total: 40 },
    { dia: "Vie", total: 25 },
    { dia: "Sáb", total: 55 },
    { dia: "Dom", total: 20 },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Tarjetas */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "space-between",
        }}
      >
        {stats.map((item, index) => (
          <Box key={index} sx={{ width: { xs: "100%", sm: "48%", md: "23%" } }}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: "center",
                background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "0.3s",
                "&:hover": {
                  boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                  transform: "translateY(-4px)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                <item.icon size={32} color={item.color} />
                <Typography variant="h6" sx={{ color: item.color, fontWeight: 600 }}>
                  {item.label}
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {item.value}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>

      {/* Gráficas */}
      <Box
        sx={{
          mt: 4,
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "space-between",
        }}
      >
        {/* Ventas */}
        <Box sx={{ width: { xs: "100%", md: "48%" } }}>
          <Paper
            sx={{
              p: 3,
              height: 380,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              background: "linear-gradient(145deg, #ffffff, #f7f7f7)",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Ventas por día
            </Typography>

            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ventasData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#1976d2" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        {/* Compras */}
        <Box sx={{ width: { xs: "100%", md: "48%" } }}>
          <Paper
            sx={{
              p: 3,
              height: 380,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              background: "linear-gradient(145deg, #ffffff, #f7f7f7)",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Compras por día
            </Typography>

            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comprasData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#2e7d32" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}
