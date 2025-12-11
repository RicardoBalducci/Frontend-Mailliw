"use client";

import { TextField, MenuItem, Typography, Paper } from "@mui/material";

interface PagoSelectProps {
  tipoPago: string;
  setTipoPago: (value: string) => void;
}

const PagoSelect: React.FC<PagoSelectProps> = ({ tipoPago, setTipoPago }) => {
  const opciones = [
    "Pago móvil",
    "Efectivo Bs",
    "Efectivo USD",
    "Transferencia",
    "Zelle",
    "Mixto",
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: "0 8px 28px rgba(0,0,0,0.12)",
        backdropFilter: "blur(12px)",
        background: "rgba(255, 255, 255, 0.65)",
        border: "1px solid rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
        },
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          mb: 1.5,
          color: "#1a1a1a",
          letterSpacing: "0.5px",
        }}
      >
        Tipo de pago
      </Typography>

      <TextField
        select
        value={tipoPago}
        onChange={(e) => setTipoPago(e.target.value)}
        fullWidth
        variant="outlined"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            background: "rgba(255,255,255,0.9)",
            "& fieldset": {
              borderColor: "rgba(0,0,0,0.15)",
            },
            "&:hover fieldset": {
              borderColor: "#1976d2",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1565c0",
              borderWidth: 2,
            },
          },
          "& .MuiSelect-select": {
            padding: "12px 14px",
            fontWeight: 500,
          },
          "& .MuiSvgIcon-root": {
            color: "#1976d2",
          },
        }}
      >
        {opciones.map((op, idx) => (
          <MenuItem key={idx} value={op}>
            {op}
          </MenuItem>
        ))}
      </TextField>
    </Paper>
  );
};

export default PagoSelect;
