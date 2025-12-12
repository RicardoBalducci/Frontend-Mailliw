import { Box, Typography, Paper, Divider } from "@mui/material";

interface Producto {
  nombre: string;
  stock: number;
}

interface Props {
  productos: Producto[];
}

export default function ProductosBajoStock({ productos }: Props) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: "0 3px 20px rgba(0,0,0,0.08)" }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Productos con bajo stock
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {productos.length === 0 ? (
        <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
          <Typography variant="body2">
            ¡Todos los productos están en buen stock! 🎉
          </Typography>
        </Box>
      ) : (
        productos.map((p, i) => (
          <Box
            key={i}
            sx={{ display: "flex", justifyContent: "space-between", p: 1, borderBottom: "1px solid #eee" }}
          >
            <Typography>{p.nombre}</Typography>
            <Typography sx={{ color: p.stock <= 5 ? "#d32f2f" : "#ffa000", fontWeight: 600 }}>
              {p.stock} unidades
            </Typography>
          </Box>
        ))
      )}
    </Paper>
  );
}
