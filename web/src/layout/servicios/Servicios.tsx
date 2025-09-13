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
import HeaderServicios from "./components/Header-Servicios";
import ServiciosServices from "../../api/ServiciosServices";
import { ServicioDTO } from "../../Dto/Servicio.dto";
import LoadingIndicator from "../../utils/LoadingIndicator";
import ErrorMessagePanel from "../../utils/ErrorIndicator";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import ServicesIcon from "@mui/icons-material/BuildCircleOutlined";

import {
  StyledPaper,
  SearchTextField,
  ActionButton,
} from "../../theme/StyledComponents";
import ServiciosTable from "./components/Servicios-table";
import { ServicioAdd } from "./components/Servicios-add";
import ServicioDelete from "./components/Servicio-Delete";

export function Servicios() {
  const theme = useTheme();
  const [servicios, setServicios] = useState<ServicioDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [servicioToDelete, setServicioToDelete] = useState<ServicioDTO | null>(
    null
  );
  const [, setServicioToModify] = useState<ServicioDTO | null>(null); // New state for editing

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    setLoading(true);
    setError(null);
    try {
      // ✨ Asigna el array directamente al estado
      const serviciosData = await ServiciosServices.getServicios();
      setServicios(serviciosData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido al cargar los servicios.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
  };

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);

  const handleModify = (servicio: ServicioDTO) => {
    setServicioToModify(servicio);
    // Open a new modal for modification, e.g., setOpenUpdateModal(true)
  };

  const handleDelete = (servicio: ServicioDTO) => {
    setServicioToDelete(servicio);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setServicioToDelete(null);
  };

  const handleServicioActionSuccess = (message: string) => {
    fetchServicios();
    setAlertMessage(message);
    setAlertSeverity("success");
    setAlertOpen(true);
  };

  const handleServicioActionError = (message: string) => {
    setAlertMessage(message);
    setAlertSeverity("error");
    setAlertOpen(true);
  };

  // The filtering logic should now be inside ServiciosTable, but we can keep it here to pass filtered data if desired.
  // The DataGrid component handles its own filtering, so passing unfiltered `servicios` and `searchTerm` is the preferred approach.

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

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Fade in={true} timeout={800}>
          <Box>
            <HeaderServicios servicios={servicios} />
            <StyledPaper>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <SearchTextField
                  placeholder="Buscar por nombre o descripción..."
                  variant="outlined"
                  fullWidth
                  value={searchTerm}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ServicesIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ maxWidth: 500, bgcolor: "white" }}
                />

                <Box>
                  <Tooltip title="Actualizar tabla">
                    <IconButton
                      onClick={fetchServicios}
                      sx={{
                        ml: 1,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                      }}
                    >
                      <RefreshIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                  <ActionButton
                    variant="contained"
                    color="primary"
                    onClick={handleOpenAddModal}
                    startIcon={<AddIcon />}
                    sx={{ ml: 2 }}
                  >
                    Añadir Servicio
                  </ActionButton>
                </Box>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <ServiciosTable
                rows={servicios} // Pass the full list of services
                searchTerm={searchTerm} // Pass the searchTerm for internal filtering
                onModify={handleModify}
                onDelete={handleDelete}
              />
            </StyledPaper>

            <ServicioAdd
              open={openAddModal}
              onClose={handleCloseAddModal}
              onServicioAdded={() =>
                handleServicioActionSuccess("Servicio añadido exitosamente!")
              }
            />

            <ServicioDelete
              open={openDeleteModal}
              onClose={handleCloseDeleteModal}
              servicio={servicioToDelete}
              onDeleteSuccess={() =>
                handleServicioActionSuccess("Servicio eliminado exitosamente!")
              }
              onDeleteError={handleServicioActionError}
            />

            {/* You will need to create and add the ServicioUpdate component */}
            {/* <ServicioUpdate /> */}
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
