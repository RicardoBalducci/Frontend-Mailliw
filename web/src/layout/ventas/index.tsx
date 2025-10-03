/* import { useState } from "react";
import { Container, Fade, Box, Typography, useTheme } from "@mui/material";
import { DollarSign } from "lucide-react";
import { StyledPaper } from "../../theme/StyledComponents";
import { ClienteDTO } from "../../Dto/Cliente.dto";
import BuscarCliente from "./BuscarCliente";
import ClienteInfo from "./ClienteInfo";

export function Ventas() {
  const theme = useTheme();
  const [cliente, setCliente] = useState<ClienteDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in={true} timeout={800}>
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
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <DollarSign />
            Venta
          </Typography>
        </Box>
      </Fade>

      <StyledPaper sx={{ p: 3 }}>
        <BuscarCliente
          setCliente={setCliente}
          setError={setError}
          setLoading={setLoading}
          loading={loading}
        />
        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}
        {cliente && <ClienteInfo cliente={cliente} />}
      </StyledPaper>
    </Container>
  );
}
 */
