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

// Import the ClienteDTO
import { ClienteDTO } from "../../Dto/Cliente.dto"; // ADJUST THIS PATH if your DTO is located elsewhere!

// Styled components for enhanced UI
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: "#ffffff",
  borderRadius: (theme.shape.borderRadius as number) * 2,
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
    borderRadius: (theme.shape.borderRadius as number) * 3,
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
  borderRadius: (theme.shape.borderRadius as number) * 3,
  padding: "10px 24px",
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.12)",
  transition: "all 0.3s",
  fontWeight: 600,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
  },
}));

// We can extend ClienteDTO for ClientRow if there's an ID
export interface ClientRow extends ClienteDTO {
  id: number; // ID is usually added by the backend
}

export function Client() {
  const theme = useTheme();
  const [rows, setRows] = useState<ClientRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [currentClient, setCurrentClient] = useState<ClientRow | null>(null); // Type it as ClientRow
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<ClientRow | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  ); // Added alert severity

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
      setLoading(true);
      const response = await ClienteServices.fetchClientes();

      if (response.success && response.data) {
        setRows(response.data as ClientRow[]); // Cast to ClientRow[]
        setStats({
          total: response.data.length,
          personal: response.data.filter((client: ClienteDTO) =>
            client.rif.startsWith("V-")
          ).length,
          business: response.data.filter(
            (client: ClienteDTO) =>
              client.rif.startsWith("E-") || client.rif.startsWith("R-")
          ).length,
        });
      } else {
        setAlertMessage(response.message || "Error al cargar los clientes.");
        setAlertSeverity("error");
        setAlertOpen(true);
        setRows([]); // Clear rows on error
      }
    } catch (error) {
      console.error("Error fetching clientes:", error);
      setAlertMessage("Error de conexión al cargar los clientes.");
      setAlertSeverity("error");
      setAlertOpen(true);
      setRows([]);
    } finally {
      setLoading(false);
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
        setAlertMessage("Cliente eliminado correctamente.");
        setAlertSeverity("success");
        setAlertOpen(true);
        handleRefresh();
        setDeleteModalOpen(false);
        setClientToDelete(null);
      } else {
        setAlertMessage(response.message || "Error al eliminar el cliente.");
        setAlertSeverity("error");
        setAlertOpen(true);
      }
    } catch (error) {
      console.error("Error eliminando cliente:", error);
      setAlertMessage("Ocurrió un error inesperado al eliminar el cliente.");
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  const handleOpenModal = () => {
    setCurrentClient(null); // No client for "Add Client" mode
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentClient(null); // Clear current client state
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

          {/* Stats Cards - You might want to implement these based on your design */}

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
                minHeight={200} // Added minHeight for better loading spinner visibility
              >
                <CircularProgress />
              </Box>
            ) : (
              <ClientTable
                key={refreshKey}
                rows={rows.map((row) => ({
                  ...row,
                  apellido: row.apellido ?? "",
                  nombre: row.nombre ?? "",
                  direccion: row.direccion ?? "",
                  telefono: row.telefono ?? "",
                  rif: row.rif ?? "",
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
            currentClient={currentClient} // currentClient is already ClientRow | null
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
              severity={alertSeverity} // Use the alertSeverity state
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
