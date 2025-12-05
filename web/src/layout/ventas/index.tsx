"use client";

import { useState } from "react";
import { Container, Fade, Box, Typography, useTheme } from "@mui/material";
import { DollarSign } from "lucide-react";
import { StyledPaper } from "../../theme/StyledComponents";
import {  RespuestaClienteDTO } from "../../Dto/Cliente.dto";
import BuscarCliente from "./componentes/BuscarCliente";
import ClientePanel from "./componentes/ClientePanel";

export function Ventas() {
  const theme = useTheme();
  const [cliente, setCliente] = useState<RespuestaClienteDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Box>
          {/* Título */}
          <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
              color="primary"
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 1,
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
              <DollarSign />
              Venta
            </Typography>
          </Box>

          {/* Panel de búsqueda de cliente */}
          <StyledPaper sx={{ p: 3, mb: 3 }}>
            <BuscarCliente
              setCliente={setCliente}
              setError={setError}
              setLoading={setLoading}
              loading={loading}
            />
            {error && <Typography color="error" mt={2}>{error}</Typography>}
            {cliente && <ClientePanel cliente={cliente} />}
          </StyledPaper>
          
        </Box>
      </Fade>
    </Container>
  );
}

export default Ventas;
