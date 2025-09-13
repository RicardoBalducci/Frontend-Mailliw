import React from "react";
import { Box, Typography, Chip, useTheme } from "@mui/material";
import { MaterialesDto } from "../../../Dto/Materiales.dto";
import BuildIcon from "@mui/icons-material/Build"; // Importa el nuevo ícono

interface HeaderMaterialesProps {
  Materiales: MaterialesDto[];
}

const HeaderMateriales: React.FC<HeaderMaterialesProps> = ({ Materiales }) => {
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
        <BuildIcon sx={{ mr: 1 }} /> {/* Changed icon to EngineeringIcon */}
        Gestión de Materiales
      </Typography>
      <Chip
        label={`${Materiales.length} Materiales`}
        color="primary"
        variant="outlined"
        sx={{ ml: 2, fontWeight: 500, height: 28 }}
      />
    </Box>
  );
};

export default HeaderMateriales;
