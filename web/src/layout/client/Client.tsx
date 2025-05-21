"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  Fade,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  useTheme,
  alpha,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import ClienteServices from "../../api/ClientServices";
import ClientTable from "./components/ClientTable";
import ClientModal from "./components/ClientModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import { styled } from "@mui/material/styles";

// Styled components for enhanced UI
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: "#ffffff",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0 8px 40px rgba(0, 0, 0, 0.12)",
  overflow: "hidden",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "6px",
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  },
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius * 3,
    transition: "all 0.3s",
    "&:hover": {
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    },
    "&.Mui-focused": {
      boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.25)}`,
    },
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 3,
  padding: "10px 24px",
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.12)",
  transition: "all 0.3s",
  fontWeight: 600,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
  },
}));

export interface ClientRow {
  id: number;
  rif: string;
  nombre: string;
  apellido?: string;
  direccion: string;
  telefono: string;
  email?: string; // Added email property
}

export function Client() {
  const theme = useTheme();
  const [rows, setRows] = useState<ClientRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [currentClient, setCurrentClient] = useState<ClientRow | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<ClientRow | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Used to force refresh the table
  const [loading, setLoading] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  // Stats for dashboard cards
  const [stats, setStats] = useState({
    total: 0,
    personal: 0,
    business: 0,
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true); // Inicia la carga

      const data = await ClienteServices.fetchClientes();
      setRows(data);

      // Calculate stats
      setStats({
        total: data.length,
        personal: data.filter((client: ClientRow) =>
          client.rif.startsWith("V-")
        ).length,
        business: data.filter(
          (client: ClientRow) =>
            client.rif.startsWith("E-") || client.rif.startsWith("R-")
        ).length,
      });
    } catch (error) {
      console.error("Error fetching clientes:", error);
    } finally {
      setLoading(false); // Finaliza la carga
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
  };

  const handleModify = (row: ClientRow): void => {
    setCurrentClient(row);
    setOpenModal(true);
  };

  const handleDelete = (id: number): void => {
    const client = rows.find((row) => row.id === id) || null;
    setClientToDelete(client);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async (): Promise<void> => {
    if (!clientToDelete) return;

    try {
      const response = await ClienteServices.deleteCliente(clientToDelete.id);
      if (response.success) {
        // Supongamos que la respuesta tiene una propiedad 'success'
        handleRefresh(); // Actualiza la tabla
        setDeleteModalOpen(false);
        setClientToDelete(null);
        setAlertMessage("Cliente eliminado correctamente."); // Mensaje de éxito
        setAlertOpen(true); // Muestra la alerta
      } else {
        // Maneja el caso en que la eliminación no fue exitosa
        setAlertMessage(response.message || "Error al eliminar el cliente."); // Mensaje de error
        setAlertOpen(true);
      }
    } catch (error) {
      console.error("Error eliminando cliente:", error);
      setAlertMessage("Ocurrió un error inesperado."); // Mensaje de error general
      setAlertOpen(true);
    }
  };

  const handleOpenModal = () => {
    setCurrentClient(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentClient(null);
  };

  const handleRefresh = () => {
    fetchClientes();
    setRefreshKey((prev) => prev + 1); // Force table refresh
  };

  return (
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
              Gestión de Clientes
            </Typography>
            <Chip
              label={`${stats.total} clientes`}
              color="primary"
              variant="outlined"
              sx={{ ml: 2, fontWeight: 500, height: 28 }}
            />
          </Box>

          {/* Stats Cards */}

          <StyledPaper>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <SearchTextField
                placeholder="Buscar por nombre, RIF, dirección..."
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ maxWidth: 500, bgcolor: "white" }}
              />
              <Box>
                <Tooltip title="Actualizar tabla">
                  <IconButton
                    onClick={handleRefresh}
                    sx={{
                      ml: 1,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                      },
                    }}
                  >
                    <RefreshIcon color="primary" />
                  </IconButton>
                </Tooltip>
                <ActionButton
                  variant="contained"
                  color="primary"
                  onClick={handleOpenModal}
                  startIcon={<AddIcon />}
                  sx={{ ml: 2 }}
                >
                  Añadir Cliente
                </ActionButton>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <CircularProgress />
              </Box>
            ) : (
              <ClientTable
                key={refreshKey}
                rows={rows.map((row) => ({
                  ...row,
                  apellido: row.apellido || "",
                }))}
                searchTerm={searchTerm}
                onModify={handleModify}
                onDelete={handleDelete}
              />
            )}
          </StyledPaper>

          <ClientModal
            open={openModal}
            onClose={handleCloseModal}
            currentClient={
              currentClient
                ? { ...currentClient, email: currentClient.email || "" }
                : null
            }
            onRefresh={fetchClientes}
          />

          <ConfirmDeleteModal
            open={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            client={clientToDelete}
          />
          <Snackbar
            open={alertOpen}
            autoHideDuration={6000}
            onClose={() => setAlertOpen(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert
              onClose={() => setAlertOpen(false)}
              severity="success"
              sx={{ width: "100%" }}
            >
              {alertMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Fade>
    </Container>
  );
}
/*
<Box sx={{ mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item={true} xs={12} md={4}>
                <StatsCard>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: "50%",
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          mr: 2,
                        }}
                      >
                        <PeopleAltIcon color="primary" />
                      </Box>
                      <Typography variant="h6" fontWeight={600}>
                        Total Clientes
                      </Typography>
                    </Box>
                    <Typography variant="h3" fontWeight={700} color="primary">
                      {stats.total}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Clientes registrados en el sistema
                    </Typography>
                  </CardContent>
                </StatsCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <StatsCard>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: "50%",
                          bgcolor: alpha(theme.palette.info.main, 0.1),
                          mr: 2,
                        }}
                      >
                        <PersonAddAlt1Icon color="info" />
                      </Box>
                      <Typography variant="h6" fontWeight={600}>
                        Clientes Personales
                      </Typography>
                    </Box>
                    <Typography variant="h3" fontWeight={700} color="info.main">
                      {stats.personal}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Clientes con RIF tipo V
                    </Typography>
                  </CardContent>
                </StatsCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <StatsCard>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: "50%",
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          mr: 2,
                        }}
                      >
                        <BusinessIcon color="success" />
                      </Box>
                      <Typography variant="h6" fontWeight={600}>
                        Clientes Empresariales
                      </Typography>
                    </Box>
                    <Typography
                      variant="h3"
                      fontWeight={700}
                      color="success.main"
                    >
                      {stats.business}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Clientes con RIF tipo E o R
                    </Typography>
                  </CardContent>
                </StatsCard>
              </Grid>
            </Grid>
          </Box>
*/
