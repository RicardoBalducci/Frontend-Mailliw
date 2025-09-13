import React from "react";
import { Box, Typography, Chip, useTheme } from "@mui/material";
import EngineeringIcon from "@mui/icons-material/Engineering"; // More appropriate icon for technicians
import { ServicioDTO } from "../../../Dto/Servicio.dto";

interface HeaderServiciosProps {
  servicios: ServicioDTO[];
}

const HeaderServicios: React.FC<HeaderServiciosProps> = ({ servicios }) => {
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
        <EngineeringIcon sx={{ mr: 1 }} />
        Gestión de Servicios
      </Typography>
      <Chip
        label={`${servicios.length} Servicios`}
        color="primary"
        variant="outlined"
        sx={{ ml: 2, fontWeight: 500, height: 28 }}
      />
    </Box>
  );
};

export default HeaderServicios;
/*


*/
