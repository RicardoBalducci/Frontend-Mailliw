"use client";

import { FC } from "react";
import { Paper, Typography, Button, Stack } from "@mui/material";
import { ServicioDTO } from "../../../Dto/Servicio.dto";

interface DetalleServicioProps {
  servicio: ServicioDTO;
  agregarServicioCarrito: () => void;
}

const DetalleServicio: FC<DetalleServicioProps> = ({ servicio, agregarServicioCarrito }) => {
  return (
    <Paper
      sx={{
        mt: 4,
        p: 3,
        borderRadius: 3,
        boxShadow: 4,
        maxWidth: 600,
        mx: "auto",
      }}
    >
      <Stack spacing={2}>
        {/* Nombre */}
        <Typography variant="h5" fontWeight="bold" color="primary">
          {servicio.nombre}
        </Typography>

        {/* Descripción */}
        <Typography variant="body1" color="text.secondary">
          {servicio.descripcion || "Sin descripción disponible"}
        </Typography>

        {/* Precio */}
        <Typography variant="h6" color="secondary">
          Precio: ${servicio.precio_estandar_usd}
        </Typography>

        {/* Botón */}
        <Button
          variant="contained"
          color="primary"
          onClick={agregarServicioCarrito}
          sx={{ alignSelf: "flex-start", mt: 1 }}
        >
          Agregar al Carrito
        </Button>
      </Stack>
    </Paper>
  );
};

export default DetalleServicio;