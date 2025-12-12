import { Box, Typography, Paper, Divider } from "@mui/material";
import { ProductoVendido } from "../../../api/EstadisticaServices";



interface Props {
  productos: ProductoVendido[];
}

export default function ProductosVendidos({ productos }: Props) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: "0 3px 20px rgba(0,0,0,0.08)" }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Productos vendidos
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {productos.map((p, i) => (
        <Box
          key={i}
          sx={{ display: "flex", justifyContent: "space-between", p: 1, borderBottom: "1px solid #eee" }}
        >
          <Typography>{p.nombre}</Typography>
          <Typography sx={{ fontWeight: 600, color: "#2e7d32" }}>{p.cantidad_vendida} unidades</Typography>
        </Box>
      ))}
    </Paper>
  );
}
