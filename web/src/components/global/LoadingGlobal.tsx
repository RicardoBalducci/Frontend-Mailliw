import React from "react";
import { CircularProgress, Typography, Backdrop } from "@mui/material";

interface LoadingGlobalProps {
  open: boolean;
  text?: string;
}

const LoadingGlobal: React.FC<LoadingGlobalProps> = ({
  open,
  text = "Cargando...",
}) => {
  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 9999, // Muy por encima de modales
        color: "#fff",
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <CircularProgress color="inherit" size={70} thickness={4} />
      <Typography variant="h6" sx={{ fontWeight: 500 }}>
        {text}
      </Typography>
    </Backdrop>
  );
};

export default LoadingGlobal;
