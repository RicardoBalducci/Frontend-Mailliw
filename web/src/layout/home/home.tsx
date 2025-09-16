/* import type React from "react"; */
import { useState, useEffect } from "react";
/* import { Box, Container, Fade, Grid, Typography } from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import InventoryIcon from "@mui/icons-material/Inventory";
import HandymanIcon from "@mui/icons-material/Handyman";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { StyledPaper } from "../../theme/StyledComponents";
import { DataCard } from "./components/card";
import { ShortcutButton } from "./components/ShortcutButton"; */

export function HomeContent() {
  const [, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      setCurrentTime(now.toLocaleDateString("es-ES", options));
    };

    updateTime();
    const timerId = setInterval(updateTime, 1000);

    return () => clearInterval(timerId);
  }, []);

  // Simulación del precio del dólar
  /* const dollarPrice = "36.50 Bs"; */

  return (
    <h1>En Desarrollo...</h1>
    /*  <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in={true} timeout={800}>
        <Box>
          <StyledPaper sx={{ p: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
              gutterBottom
            >
              Bienvenido al Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              Resumen rápido de la actividad del sistema.
            </Typography>

            <Grid container spacing={3} alignItems="stretch">
              <Grid item xs={12} sm={6} md={3}>
                <DataCard
                  title="Clientes"
                  value="150"
                  icon={<PersonIcon fontSize="large" />}
                  color="#2196f3"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DataCard
                  title="Productos"
                  value="250"
                  icon={<ShoppingBasketIcon fontSize="large" />}
                  color="#4caf50"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DataCard
                  title="Servicios"
                  value="30"
                  icon={<HandymanIcon fontSize="large" />}
                  color="#ff9800"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DataCard
                  title="Materiales"
                  value="800"
                  icon={<InventoryIcon fontSize="large" />}
                  color="#f44336"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DataCard
                  title="Precio del Dólar"
                  value={dollarPrice}
                  icon={<AttachMoneyIcon fontSize="large" />}
                  color="#3f51b5"
                />
              </Grid>
            </Grid>

            <Box mt={6}>
              <Typography
                variant="h5"
                component="h2"
                fontWeight={700}
                gutterBottom
              >
                Gráfica
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      height: 400,
                      width: 1300,
                      backgroundColor: "#e0e0e0", // Color de fondo para simular un área de gráfico
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "text.secondary",
                    }}
                  >
                    <Typography>Área para un gráfico</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Box mt={6}>
              <Typography
                variant="h5"
                component="h2"
                fontWeight={700}
                gutterBottom
              >
                Atajos
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <ShortcutButton
                    title="Gestionar Clientes"
                    icon={<PersonIcon />}
                    color="#2196f3" // Blue
                    onClick={() =>
                      console.log("Navegar a la página de Clientes")
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <ShortcutButton
                    title="Gestionar Servicios"
                    icon={<HandymanIcon />}
                    color="#ff9800" // Orange
                    onClick={() =>
                      console.log("Navegar a la página de Servicios")
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <ShortcutButton
                    title="Gestionar Materiales"
                    icon={<InventoryIcon />}
                    color="#f44336" // Red
                    onClick={() =>
                      console.log("Navegar a la página de Materiales")
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <ShortcutButton
                    title="Gestionar Productos"
                    icon={<ShoppingBasketIcon />}
                    color="#4caf50" // Green
                    onClick={() =>
                      console.log("Navegar a la página de Productos")
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <ShortcutButton
                    title="Gestionar Proveedores"
                    icon={<ShoppingBasketIcon />}
                    color="#4caf50" // Green
                    onClick={() =>
                      console.log("Navegar a la página de Productos")
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <ShortcutButton
                    title="Gestionar Tecnicos"
                    icon={<ShoppingBasketIcon />}
                    color="#4caf50" // Green
                    onClick={() =>
                      console.log("Navegar a la página de Productos")
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </StyledPaper>
        </Box>
      </Fade>
    </Container> 
    */
  );
}
