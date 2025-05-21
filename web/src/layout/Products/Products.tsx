import {
  Box,
  Chip,
  Container,
  Fade,
  Typography,
  useTheme,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"; // Import the icon

export function Product() {
  const theme = useTheme();

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Fade in={true} timeout={800}>
          <Box>
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
                <ShoppingCartIcon sx={{ mr: 1 }} /> {/* Add icon with margin */}
                Gestión de Productos
              </Typography>
              <Chip
                label={`10 productos`} //${stats.total}
                color="primary"
                variant="outlined"
                sx={{ ml: 2, fontWeight: 500, height: 28 }}
              />
            </Box>
          </Box>
        </Fade>
      </Container>
    </>
  );
}
