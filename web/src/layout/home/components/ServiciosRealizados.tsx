import { Box, Typography, Paper, Divider } from "@mui/material";

interface Servicio {
  nombre: string;
  realizados: number;
}

interface Props {
  servicios: Servicio[];
}

export default function ServiciosRealizados({ servicios }: Props) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: "0 3px 20px rgba(0,0,0,0.08)" }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Servicios realizados
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {servicios.map((s, i) => (
        <Box
          key={i}
          sx={{ display: "flex", justifyContent: "space-between", p: 1, borderBottom: "1px solid #eee" }}
        >
          <Typography>{s.nombre}</Typography>
          <Typography sx={{ fontWeight: 600, color: "#1976d2" }}>{s.realizados} servicios</Typography>
        </Box>
      ))}
    </Paper>
  );
}
