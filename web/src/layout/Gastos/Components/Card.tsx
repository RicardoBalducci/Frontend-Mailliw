import { Paper, Typography, Stack } from "@mui/material";
import { AttachMoney, Paid, ReceiptLong } from "@mui/icons-material";

interface GastosCardProps {
  count: number;
  totalBs: number;
  totalUsd: number;
}

export default function GastosCard({ count, totalBs, totalUsd }: GastosCardProps) {
  return (
    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
      <Paper
        sx={{
          p: 3,
          flex: 1,
          borderRadius: 3,
          textAlign: "center",
          background: "linear-gradient(135deg, #0088ce, #00c6ff)",
          color: "white",
          boxShadow: 3,
        }}
      >
        <ReceiptLong fontSize="large" />
        <Typography variant="subtitle1" sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>
          Gastos del Día
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
          {count}
        </Typography>
      </Paper>

      <Paper
        sx={{
          p: 3,
          flex: 1,
          borderRadius: 3,
          textAlign: "center",
          background: "linear-gradient(135deg, #ff6600, #ff9966)",
          color: "white",
          boxShadow: 3,
        }}
      >
        <Paid fontSize="large" />
        <Typography variant="subtitle1" sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>
          Total en Bs
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
          Bs {totalBs.toFixed(2)}
        </Typography>
      </Paper>

      <Paper
        sx={{
          p: 3,
          flex: 1,
          borderRadius: 3,
          textAlign: "center",
          background: "linear-gradient(135deg, #43cea2, #185a9d)",
          color: "white",
          boxShadow: 3,
        }}
      >
        <AttachMoney fontSize="large" />
        <Typography variant="subtitle1" sx={{ fontFamily: "Montserrat", fontWeight: 600 }}>
          Total en USD
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
          $ {totalUsd.toFixed(2)}
        </Typography>
      </Paper>
    </Stack>
  );
}