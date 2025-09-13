import React, { useEffect, useState } from "react";
import {
  Alert,
  alpha,
  Box,
  Container,
  Divider,
  Fade,
  IconButton,
  InputAdornment,
  Snackbar,
  Tooltip,
  useTheme,
} from "@mui/material";
import { UserDto } from "./interface/user.dto";
import HeaderTecnicos from "./components/Header-tecnicos";
import {
  ActionButton,
  SearchTextField,
  StyledPaper,
} from "../../theme/StyledComponents";
import EngineeringIcon from "@mui/icons-material/Engineering";
import LoadingIndicator from "../../utils/LoadingIndicator";
import ErrorMessagePanel from "../../utils/ErrorIndicator";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import TechnicianTable from "./components/Tecnicos-tabla";
import { TecnicoAdd } from "./components/Tecnico-add";
import TecnicoDelete from "./components/Tecnico-delete";
import UserServices from "../../api/UserSevices";
import TecnicoUpdate from "./components/Tecnico-update"; // Make sure this import is correct

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

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    fetchTecnicos();
  }, []);

  const fetchTecnicos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await UserServices.getTechnicians();
      // Ensure 'id' exists for table keys, if not provided by the backend, generate one.
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

  const handleTecnicoActionSuccess = (message: string) => {
    fetchTecnicos();
    setAlertMessage(message);
    setAlertSeverity("success");
    setAlertOpen(true);
  };

  const handleTecnicoActionError = (message: string) => {
    setAlertMessage(message);
    setAlertSeverity("error");
    setAlertOpen(true);
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

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Fade in={true} timeout={800}>
          <Box>
            <HeaderTecnicos tecnicos={tecnicos} />
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
                  <ActionButton
                    variant="contained"
                    color="primary"
                    onClick={handleOpenAddModal} // Changed to open add modal
                    startIcon={<AddIcon />}
                    sx={{ ml: 2 }}
                  >
                    Añadir Tecnico
                  </ActionButton>
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
              onTecnicoAdded={() =>
                handleTecnicoActionSuccess("Técnico añadido exitosamente!")
              }
            />
            <TecnicoDelete
              open={openDeleteModal}
              onClose={handleCloseDeleteModal}
              tecnico={tecnicoToDelete}
              onDeleteSuccess={() =>
                handleTecnicoActionSuccess("Técnico eliminado exitosamente!")
              }
              onDeleteError={handleTecnicoActionError}
            />
            <TecnicoUpdate
              open={openUpdateModal}
              onClose={handleCloseUpdateModal}
              selectedTecnico={selectedTecnico || undefined}
              onTecnicoUpdated={() =>
                handleTecnicoActionSuccess("Técnico actualizado exitosamente!")
              } // This prop is correctly set
              onTecnicoUpdateError={handleTecnicoActionError}
            />
          </Box>
        </Fade>
      </Container>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
