import React from "react";
import { Box, Typography, Chip, useTheme } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business"; // Ícono para proveedores
import { ProveedorDto } from "../../../Dto/Proveedor.dto";

interface HeaderProveedorProps {
  Proveedores: ProveedorDto[];
}

const HeaderProveedor: React.FC<HeaderProveedorProps> = ({ Proveedores }) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
      <Typography
        variant="h4"
        component="h1"
        fontWeight="700"
        color="primary"
        sx={{
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -8,
            left: 0,
            width: 60,
            height: 4,
            borderRadius: 2,
            backgroundColor: theme.palette.primary.main,
          },
        }}
      >
        <BusinessIcon sx={{ mr: 1 }} /> {/* Changed icon to EngineeringIcon */}
        Listado de Proveedores
      </Typography>
      <Chip
        label={`${Proveedores.length} Proveedores`}
        color="primary"
        variant="outlined"
        sx={{ ml: 2, fontWeight: 500, height: 28 }}
      />
    </Box>
  );
};

export default HeaderProveedor;
