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
/* import Swal from "sweetalert2";
 */import HeaderSection from "../../components/global/Header/header";
import { Anvil } from "lucide-react";
import ConfirmModal from "../../components/global/modal/ConfirmModal";
/* import ServiciosEdit from "./components/Servicio-Update";
 */
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
      const serviciosData = await ServiciosServices.getServicios();
      setServicios(serviciosData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error desconocido al cargar los servicios."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);

/*   const [openEditModal, setOpenEditModal] = useState(false);
  const [servicioToModify, setServicioToModify] = useState<ServicioDTO | null>(
    null
  ); */

 const handleModify = (servicio: ServicioDTO) => {
  console.log(servicio)
/*     setServicioToModify(servicio);
    setOpenEditModal(true); */
  };

/*   const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setServicioToModify(null);
  };  */

  // 🔥 Manejo de eliminación
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

  // ✅ Confirmar eliminación
  const confirmDelete = async () => {
    if (!servicioToDelete?.id) {
      handleServicioActionError("No se pudo obtener el ID del servicio.");
      return;
    }

    setLoading(true);
    try {
      await ServiciosServices.deleteServicio(servicioToDelete.id);
      handleServicioActionSuccess(
        `Servicio "${servicioToDelete.nombre}" eliminado correctamente.`
      );
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error al eliminar servicio:", error);
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Error al eliminar el servicio.";
      handleServicioActionError(errorMsg);
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

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Fade in={true} timeout={800}>
          <Box>
            <HeaderSection
              title="Lista de Servicios"
              icon={<Anvil />}
              chipLabel={`${servicios.length} servicios`}
            />

            <StyledPaper>
              {/* 🔍 Barra de búsqueda y acciones */}
              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                gap={2}
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
                  sx={{ maxWidth: { xs: "100%", sm: 500 }, bgcolor: "white" }}
                />

                <Box
                  display="flex"
                  flexDirection={{ xs: "column", sm: "row" }}
                  alignItems="center"
                  gap={1.5}
                >
                  <Tooltip title="Actualizar tabla">
                    <IconButton
                      onClick={fetchServicios}
                      sx={{
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
                    onClick={handleOpenAddModal}
                    startIcon={<AddIcon />}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                  >
                    Añadir Servicio
                  </ActionButton>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* 🧾 Tabla de servicios */}
              <ServiciosTable
                rows={servicios}
                searchTerm={searchTerm}
                onModify={handleModify}
                onDelete={handleDelete}
              />
            </StyledPaper>

            {/* ➕ Modal de agregar servicio */}
            <ServicioAdd
              open={openAddModal}
              onClose={handleCloseAddModal}
              onServicioAdded={() =>
                handleServicioActionSuccess("Servicio añadido exitosamente!")
              }
            />

            <ConfirmModal
              open={openDeleteModal}
              onClose={handleCloseDeleteModal}
              onConfirm={confirmDelete}
              title="Eliminar Servicio"
              description={`¿Estás seguro de eliminar el servicio "${servicioToDelete?.nombre}"?`}
              confirmText="Eliminar"
              /* confirmColor="error" */
            />
            {/* <ServiciosEdit
              open={openEditModal}
              onClose={handleCloseEditModal}
              servicio={servicioToModify}
              onServicioUpdated={() =>
                handleServicioActionSuccess("Servicio modificado exitosamente!")
              }
            /> */}
          </Box>
        </Fade>
      </Container>

      {/* 🔔 Snackbar de alertas */}
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
