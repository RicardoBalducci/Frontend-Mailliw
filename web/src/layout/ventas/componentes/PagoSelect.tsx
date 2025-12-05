"use client";

import { TextField, MenuItem } from "@mui/material";
import { StyledPaper } from "../../../theme/StyledComponents";

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
    <StyledPaper sx={{ p: 3 }}>
      <TextField
        select
        label="Tipo de pago"
        value={tipoPago}
        onChange={(e) => setTipoPago(e.target.value)}
        fullWidth
      >
        {opciones.map((op, idx) => (
          <MenuItem key={idx} value={op}>
            {op}
          </MenuItem>
        ))}
      </TextField>
    </StyledPaper>
  );
};

export default PagoSelect;
