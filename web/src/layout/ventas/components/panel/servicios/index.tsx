"use client";

import {
  Card,
  CardHeader,
  CardContent,
  Box,
  TextField,
  Button,
  Autocomplete,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import ServiciosServices from "../../../../../api/ServiciosServices";
import { ServicioDTO } from "../../../../../Dto/Servicio.dto";

// Tipo que usamos para agregar al carrito
export interface ServicioRow {
  id: number;
  nombre: string;
  descripcion?: string;
  precio_unitario: number; // tomaremos de precio_estandar_usd
  precio_venta: number; // si quieres manejar otro precio
}

interface PanelServiciosProps {
  onAddToCart: (servicio: ServicioRow, cantidad: number) => void;
}

export default function PanelServicios({ onAddToCart }: PanelServiciosProps) {
  const [servicios, setServicios] = useState<ServicioDTO[]>([]);
  const [, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedServicio, setSelectedServicio] = useState<ServicioDTO | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    setLoading(true);
    setError(null);
    try {
      const serviciosData: ServicioDTO[] = await ServiciosServices.getServicios();
      setServicios(serviciosData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error desconocido al cargar los servicios."
      );
    } finally {
      setLoading(false);
    }
  };

    const handleAdd = () => {
    if (!selectedServicio) return;

    // Convertimos precio_estandar_usd (string) a number
    const servicioParaCarrito: ServicioRow = {
        id: selectedServicio.id,
        nombre: selectedServicio.nombre,
        descripcion: selectedServicio.descripcion,
        precio_unitario: Number(selectedServicio.precio_estandar_usd),
        precio_venta: Number(selectedServicio.precio_estandar_usd),
    };

    onAddToCart(servicioParaCarrito, quantity);
    setSelectedServicio(null);
    setQuantity(1);
    };


  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 3,
        boxShadow: 4,
        background: "linear-gradient(135deg, #fdfdfd, #fbd0f5ff)",
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6" fontWeight={700} color="primary">
            Panel Servicios
          </Typography>
        }
      />

      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            gap: 2,
            mt: 1,
          }}
        >
          <Autocomplete
            sx={{ flex: 1, minWidth: 200 }}
            options={servicios}
            getOptionLabel={(option) => option.nombre}
            value={selectedServicio}
            onChange={(_, newValue) => {
              setSelectedServicio(newValue);
              setQuantity(1);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Selecciona un servicio"
                variant="outlined"
                fullWidth
              />
            )}
          />

          <TextField
            label="Cantidad"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            inputProps={{ min: 1 }}
            sx={{ width: { xs: "100%", sm: 120 } }}
            disabled={!selectedServicio}
          />

          <Button
            variant="contained"
            color="success"
            sx={{ height: 56, width: { xs: "100%", sm: "auto" } }}
            onClick={handleAdd}
            disabled={!selectedServicio}
          >
            Añadir al carrito
          </Button>
        </Box>

        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
