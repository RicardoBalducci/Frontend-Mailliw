import { Box, Container,  } from "@mui/material";
/*Grid
 import { DashboardCard } from "../../components/global/card/Card";
import { Key, DollarSign, ShoppingCart,  CreditCard, PenTool } from "lucide-react"; */

export function HomeContent() {
  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 4,
        backgroundColor: "white",
        color: "black",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Box>
        En desarrollo
       {/*  <Grid container spacing={3}>
          <Grid>
            <DashboardCard
              lineColor="#4caf50"
              icon={<DollarSign size={28} color="#4caf50" />}
              iconBg="#e8f5e9"
              title="Ventas del día"
              value="1500"
              description="Total de ventas realizadas"
            />
          </Grid>

          <Grid>
            <DashboardCard
              lineColor="#2196f3"
              icon={<ShoppingCart size={28} color="#2196f3" />}
              iconBg="#e3f2fd"
              title="Compras del día"
              value="800"
              description="Total de compras realizadas"
            />
          </Grid>

          <Grid>
            <DashboardCard
              lineColor="#ff9800"
              icon={<PenTool size={28} color="#ff9800" />}
              iconBg="#fff3e0"
              title="Servicios del día"
              value="25"
              description="Servicios completados hoy"
            />
          </Grid>

          <Grid>
            <DashboardCard
              lineColor="#9c27b0"
              icon={<Key size={28} color="#9c27b0" />}
              iconBg="#f3e5f5"
              title="Materiales"
              value="320"
              description="Inventario disponible"
            />
          </Grid>

          <Grid>
            <DashboardCard
              lineColor="#f44336"
              icon={<CreditCard size={28} color="#f44336" />}
              iconBg="#ffebee"
              title="Gastos del día"
              value="450"
              description="Gastos realizados hoy"
            />
          </Grid>
        </Grid> */}
      </Box>
    </Container>
  );
}
