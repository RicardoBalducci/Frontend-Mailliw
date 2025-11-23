import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface GlobalSnackbarProps {
  open: boolean;
  message: string;
  severity?: "success" | "error" | "warning" | "info";
  onClose: () => void;
}

const GlobalSnackbar: React.FC<GlobalSnackbarProps> = ({
  open,
  message,
  severity = "success",
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000} // ⏱️ Dura 5 segundos
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // 📍 Centrado en pantalla
      sx={{
        "& .MuiSnackbar-root": {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: "100%",
          minWidth: 320,
          textAlign: "center",
          fontSize: "1rem",
          boxShadow: 6,
          borderRadius: 2,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalSnackbar;
