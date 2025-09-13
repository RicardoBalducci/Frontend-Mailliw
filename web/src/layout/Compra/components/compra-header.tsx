import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"; // Icon for compras

const HeaderCompra: React.FC = () => {
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
        <ShoppingCartIcon sx={{ mr: 1 }} /> {/* Icon for purchases */}
        Sección de Compras
      </Typography>
    </Box>
  );
};

export default HeaderCompra;
