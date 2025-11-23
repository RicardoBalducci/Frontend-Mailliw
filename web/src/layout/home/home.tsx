"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function HomeContent() {
  const [currentTime, setCurrentTime] = useState("");
  const [ventas, setVentas] = useState(120); // Ejemplo de cantidad de ventas
  const [clientes, setClientes] = useState(45); // Ejemplo de cantidad de clientes

  const chartData = [
    { dia: "Lun", ventas: 10 },
    { dia: "Mar", ventas: 15 },
    { dia: "Mié", ventas: 20 },
    { dia: "Jue", ventas: 25 },
    { dia: "Vie", ventas: 30 },
    { dia: "Sáb", ventas: 18 },
    { dia: "Dom", ventas: 22 },
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      setCurrentTime(now.toLocaleDateString("es-ES", options));
    };

    updateTime();
    const timerId = setInterval(updateTime, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>
        Dashboard - Empresa de Entrada y Venta
      </Typography>
      <Typography variant="subtitle1" mb={4}>
        Hora actual: {currentTime}
      </Typography>

      {/* Estadísticas principales */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Ventas Realizadas</Typography>
              <Typography variant="h3" color="primary">
                {ventas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Clientes Registrados</Typography>
              <Typography variant="h3" color="secondary">
                {clientes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráfica */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Ventas por Día
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ventas" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Botones de acceso rápido */}
      <Box mb={4} display="flex" gap={2}>
        <Button variant="contained" color="primary">
          Crear Venta
        </Button>
        <Button variant="contained" color="secondary">
          Registrar Cliente
        </Button>
        <Button variant="outlined" color="success">
          Reportes
        </Button>
      </Box>

      {/* Información extra */}
      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Últimas Actividades
          </Typography>
          <ul>
            <li>Cliente Juan Pérez registrado</li>
            <li>Venta #125 realizada</li>
            <li>Producto “Cerradura XYZ” agregado al inventario</li>
            <li>Venta #126 realizada</li>
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
}

export default HomeContent;
