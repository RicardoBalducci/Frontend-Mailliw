import React from "react";
import { Box, Alert, AlertTitle, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"; // Icono de error

interface ErrorMessagePanelProps {
  message?: string;
}

const ErrorMessagePanel: React.FC<ErrorMessagePanelProps> = ({ message }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "200px", // Asegura que el panel tenga espacio
        width: "100%",
        padding: 3,
        borderRadius: 2,
        backgroundColor: "background.paper",
        boxShadow: 3,
      }}
    >
      <Alert
        severity="error"
        icon={<ErrorOutlineIcon fontSize="inherit" />}
        sx={{ width: "100%", maxWidth: 500 }}
      >
        <AlertTitle>Error</AlertTitle>
        <Typography variant="body1">
          {message || "Ha ocurrido un error inesperado."}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Por favor, intente de nuevo más tarde o contacte al soporte.
        </Typography>
      </Alert>
    </Box>
  );
};

export default ErrorMessagePanel;
