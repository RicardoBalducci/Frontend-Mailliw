import { Box, CircularProgress, Typography } from "@mui/material";

/**
 * Componente de indicador de carga moderno.
 * Muestra un spinner de carga y un mensaje "Cargando...".
 */
const LoadingIndicator = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "200px", // Asegura que el indicador tenga espacio
        width: "100%",
        padding: 3,
        borderRadius: 2,
        backgroundColor: "background.paper",
        boxShadow: 3,
      }}
    >
      <CircularProgress size={60} sx={{ color: "primary.main", mb: 2 }} />
      <Typography variant="h6" color="text.secondary">
        Cargando datos...
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={1}>
        Por favor, espere.
      </Typography>
    </Box>
  );
};

export default LoadingIndicator;
