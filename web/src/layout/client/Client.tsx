"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Box,
  InputAdornment,
  Fade,
  Divider,
  alpha,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ClienteServices from "../../api/ClientServices";
import ClientTable from "./components/ClientTable";
import ClientModal, { ClientData } from "./components/ClientModal";
import { styled } from "@mui/material/styles";
import Swal from "sweetalert2";
import { ClienteDTO } from "../../Dto/Cliente.dto";
import SaveButtom from "../../components/global/Button/Save";
import ClientServices from "../../api/ClientServices";
import ConfirmModal from "../../components/global/modal/ConfirmModal";
import RefreshButton from "../../components/global/Button/RefreshButton";
import { Users } from "lucide-react";
import HeaderSection from "../../components/global/Header/header";
import { useSnackbar } from "../../components/context/SnackbarContext";

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

// We can extend ClienteDTO for ClientRow if there's an ID
export interface ClientRow extends ClienteDTO {
  id: number; // ID is usually added by the backend
}

export function Client() {
  const [rows, setRows] = useState<ClientRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [currentClient, setCurrentClient] = useState<ClientRow | null>(null); // Type it as ClientRow
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<ClientRow | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
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
        setRows([]);
      }
    } catch (error) {
      console.error("Error fetching clientes:", error);
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
        showSnackbar("Cliente eliminado correctamente", "success");
        handleRefresh();
      } else {
        showSnackbar("Error al eliminar cliente", "error");
      }
    } catch (error) {
      console.error("Error eliminando cliente:", error);
      showSnackbar("Ocurrió un error al eliminar el cliente", "error");
    } finally {
      setDeleteModalOpen(false); // ⬅️ cierra el modal automáticamente
      setClientToDelete(null); // limpia la referencia
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

  const handleSaveClient = async (clientData: ClientData) => {
  try {
    Swal.fire({
      title: "Guardando cliente...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
      customClass: {
        popup: "swal-over-modal",
      },
    });

    let response;

    if (clientData.id) {
      response = await ClientServices.updateCliente(clientData.id, clientData);
    } else {
      response = await ClientServices.createCliente(clientData);
    }

    if (response.success) {
      showSnackbar(
        clientData.id
          ? "Cliente actualizado correctamente"
          : "Cliente creado correctamente",
        "success"
      );
      handleRefresh();
      return true; // 🔥 Solo devuelve éxito
    }
    handleRefresh();
    Swal.fire({
      icon: "error",
      title: "Error",
      text: response.message || "No se pudo guardar el cliente.",
      customClass: {
        popup: "swal-over-modal",
      },
    });
    return false;

  } catch (error) {
    console.error("Error al guardar cliente:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un error al guardar el cliente.",
      customClass: {
        popup: "swal-over-modal",
      },
    });
    return false;

  } finally {
    Swal.close();
  }
};

  const handleRefresh = () => {
    fetchClientes();
    setRefreshKey((prev) => prev + 1); // Force table refresh
  };




  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in={true} timeout={800}>
        <Box>
          <HeaderSection
            title="Lista de Clientes"
            icon={<Users />}
            chipLabel={`${stats.total} Clientes`}
          />
          <StyledPaper>
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
              mb={3}
              gap={2}
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
                sx={{
                  maxWidth: { xs: "100%", sm: 500 },
                  bgcolor: "white",
                }}
              />
              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }} // 📱 botones uno debajo del otro
                justifyContent={{ xs: "center", sm: "flex-start" }}
                alignItems={{ xs: "stretch", sm: "center" }}
                gap={1.5}
                width={{ xs: "100%", sm: "auto" }} // 📱 ocupa todo el ancho en móvil
              >
                <RefreshButton onRefresh={handleRefresh} />
                <SaveButtom
                  onClick={handleOpenModal}
                  startIcon={<AddIcon />}
                  texto="Añadir Cliente"
                />
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
            onSave={handleSaveClient}
          />

          <ConfirmModal
            open={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={confirmDelete}
          />
        </Box>
      </Fade>
    </Container>
  );
}
