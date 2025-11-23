import React, { useEffect, useState } from "react";
import {
  alpha,
  Box,
  Container,
  Divider,
  Fade,
  IconButton,
  InputAdornment,
  Tooltip,
  useTheme,
} from "@mui/material";
import { UserDto } from "./interface/user.dto";
import { SearchTextField, StyledPaper } from "../../theme/StyledComponents";
import EngineeringIcon from "@mui/icons-material/Engineering";
import LoadingIndicator from "../../utils/LoadingIndicator";
import ErrorMessagePanel from "../../utils/ErrorIndicator";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import TechnicianTable from "./components/Tecnicos-tabla";
import { TecnicoAdd } from "./components/Tecnico-add";
import UserServices from "../../api/UserSevices";
import TecnicoUpdate from "./components/Tecnico-update"; // Make sure this import is correct
import SaveButton from "../../components/global/Button/Save";
import ConfirmModal from "../../components/global/modal/ConfirmModal";
import { Wrench } from "lucide-react";
import HeaderSection from "../../components/global/Header/header";
import { useSnackbar } from "../../components/context/SnackbarContext";

export interface TecnicoRow extends UserDto {
  id?: number;
}

export function Tecnicos() {
  const theme = useTheme();
  const [tecnicos, setTecnicos] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false); // Renamed for clarity
  const [openUpdateModal, setOpenUpdateModal] = useState(false); // New state for update modal

  const [selectedTecnico, setSelectedTecnico] = useState<UserDto | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [tecnicoToDelete, setTecnicoToDelete] = useState<UserDto | null>(null);

  const { showSnackbar } = useSnackbar();
  useEffect(() => {
    fetchTecnicos();
  }, []);

  const fetchTecnicos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await UserServices.getTechnicians();
      const tecnicosWithIds: (UserDto & { id: number })[] = data.map(
        (tecnico: UserDto, index: number) => ({
          ...tecnico,
          id: tecnico.id ?? index + 1, // Use a unique index if 'id' is missing
        })
      );
      setTecnicos(tecnicosWithIds);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while fetching technicians.");
      }
      console.error("Error fetching technicians:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <LoadingIndicator />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <ErrorMessagePanel message={error} />
      </Container>
    );
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
  };

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleOpenUpdateModal = (technician: UserDto) => {
    setSelectedTecnico(technician);
    setOpenUpdateModal(true);
  };

  const handleDelete = (technician: UserDto) => {
    setTecnicoToDelete(technician);
    setOpenDeleteModal(true);
  };

  const handleTecnicoActionSuccess = () => {
    showSnackbar("Técnico añadido exitosamente!", "success");
    fetchTecnicos();
  };

  const filteredTecnicos = tecnicos.filter((tecnico) =>
    Object.values(tecnico).some(
      (value) =>
        value && String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
    setSelectedTecnico(null); // Clear selected technician when closing
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setTecnicoToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (
      !tecnicoToDelete ||
      tecnicoToDelete.id === undefined ||
      tecnicoToDelete.id === null
    ) {
      showSnackbar(
        "Error: No se pudo obtener el ID del técnico para eliminar.",
        "error"
      );
      console.error(
        "Attempted to delete a technician without an ID:",
        tecnicoToDelete
      );
      return;
    }

    setLoading(true);
    try {
      await UserServices.deleteUser(tecnicoToDelete.id);
      fetchTecnicos();

      showSnackbar(
        `Técnico '${
          tecnicoToDelete.username || tecnicoToDelete.nombre || "Desconocido"
        }' eliminado correctamente.`
      );
      handleCloseDeleteModal(); // Cierra el modal
    } catch (error) {
      console.error("Error deleting technician:", error);
      let errorMessage = "Error de conexión al eliminar el técnico.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      showSnackbar(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Fade in={true} timeout={800}>
          <Box>
            <HeaderSection
              title="Lista de Técnicos"
              icon={<Wrench />}
              chipLabel={`${tecnicos.length} técnicos`}
            />
            <StyledPaper>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <SearchTextField
                  placeholder="Buscar por nombre, apellido, usuario, email o teléfono..."
                  variant="outlined"
                  fullWidth
                  value={searchTerm}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EngineeringIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ maxWidth: 500, bgcolor: "white" }}
                />

                <Box>
                  <Tooltip title="Actualizar tabla">
                    <IconButton
                      onClick={fetchTecnicos}
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
                  <SaveButton
                    onClick={handleOpenAddModal}
                    startIcon={<AddIcon />}
                    texto="Añadir Tecnico"
                  />
                </Box>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <TechnicianTable
                rows={filteredTecnicos}
                searchTerm={searchTerm}
                onModify={handleOpenUpdateModal} // Pass the function to open update modal
                onDelete={handleDelete}
              />
            </StyledPaper>
            <TecnicoAdd
              open={openAddModal}
              onClose={handleCloseAddModal}
              onTecnicoAdded={() => handleTecnicoActionSuccess()}
            />
            <ConfirmModal
              open={openDeleteModal}
              onClose={handleCloseDeleteModal}
              onConfirm={handleDeleteConfirm}
            />
            <TecnicoUpdate
              open={openUpdateModal}
              onClose={handleCloseUpdateModal}
              selectedTecnico={selectedTecnico}
              onTecnicoUpdated={fetchTecnicos} // 👈 Esto refresca automáticamente la tabla
            />
          </Box>
        </Fade>
      </Container>
    </>
  );
}
