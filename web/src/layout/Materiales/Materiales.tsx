// src/pages/Materiales/Materiales.tsx
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
import HeaderMateriales from "./components/Header-Materiales";
import {
  ActionButton, // Assuming this is defined in your StyledComponents
  SearchTextField, // Assuming this is defined in your StyledComponents
  StyledPaper, // Assuming this is defined in your StyledComponents
} from "../../theme/StyledComponents";
import BuildIcon from "@mui/icons-material/Build";
import LoadingIndicator from "../../utils/LoadingIndicator";
import ErrorMessagePanel from "../../utils/ErrorIndicator";
import RefreshIcon from "@mui/icons-material/Refresh";
import { MaterialesDto } from "../../Dto/Materiales.dto";
import MaterialesServices from "../../api/MaterialesServices";
import MaterialTable from "./components/Materiales-tabla";
import AddIcon from "@mui/icons-material/Add";
import { MaterialAdd } from "./components/Materiales-add";
import { DeleteMaterial } from "./widget/Delete-Materiales";
import { toast } from "react-toastify";
import { MaterialUpdate } from "./components/Materiales-update";

export function Materiales() {
  const theme = useTheme();
  const [materiales, setMateriales] = useState<MaterialesDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);

  // State for Delete Material modal
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [materialToDeleteId, setMaterialToDeleteId] = useState<number | null>(
    null
  );
  const [materialToDeleteName, setMaterialToDeleteName] = useState("");

  // --- NEW STATE FOR UPDATE MATERIAL MODAL ---
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [materialToEdit, setMaterialToEdit] = useState<MaterialesDto | null>(
    null
  );
  // ------------------------------------------

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchMateriales(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const fetchMateriales = async (pagina: number, perPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await MaterialesServices.findAll(pagina, perPage);
      setMateriales(response.data);
      setTotalItems(response.total);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido al obtener los materiales.");
      }
      console.error("Error fetching materiales:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setCurrentPage(newPage + 1);
  };

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const newItemsPerPage = Number(event.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
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

  const filteredMateriales = materiales.filter((material) =>
    Object.values(material).some(
      (value) =>
        value && String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    fetchMateriales(currentPage, itemsPerPage); // Re-fetch data after adding
  };

  function handleSearch(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    setSearchTerm(event.target.value);
  }

  // Handlers for Delete Material modal
  const handleOpenDeleteModal = (id: number, name: string) => {
    setMaterialToDeleteId(id);
    setMaterialToDeleteName(name);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setMaterialToDeleteId(null);
    setMaterialToDeleteName("");
  };

  const handleDeleteSuccess = (message: string) => {
    toast.success(message);
    fetchMateriales(currentPage, itemsPerPage); // Re-fetch materials after successful deletion
  };

  const handleDeleteError = (message: string) => {
    toast.error(message);
  };

  // --- NEW HANDLERS FOR UPDATE MATERIAL MODAL ---
  const handleOpenUpdateModal = (material: MaterialesDto) => {
    setMaterialToEdit(material);
    setOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
    setMaterialToEdit(null); // Clear the material being edited
  };

  const handleUpdateSuccess = (message: string) => {
    toast.success(message);
    fetchMateriales(currentPage, itemsPerPage); // Re-fetch materials after successful update
  };

  const handleUpdateError = (message: string) => {
    toast.error(message);
  };
  // --------------------------------------------

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Fade in={true} timeout={800}>
          <Box>
            <HeaderMateriales Materiales={materiales} />
            <StyledPaper>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <SearchTextField
                  placeholder="Buscar por nombre, descripción o precio..."
                  variant="outlined"
                  fullWidth
                  value={searchTerm}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BuildIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ maxWidth: 500, bgcolor: "white" }}
                />
                <Box>
                  <Tooltip title="Actualizar tabla">
                    <IconButton
                      onClick={() => fetchMateriales(currentPage, itemsPerPage)}
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
                    onClick={handleOpenAddModal}
                    startIcon={<AddIcon />}
                    sx={{ ml: 2 }}
                  >
                    Añadir Material
                  </ActionButton>
                </Box>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <MaterialTable
                rows={filteredMateriales}
                searchTerm={searchTerm}
                onModify={handleOpenUpdateModal} // Pass the new handler for update
                onDelete={handleOpenDeleteModal}
                totalItems={totalItems}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </StyledPaper>
            <MaterialAdd open={openAddModal} onClose={handleCloseAddModal} />

            {/* Delete Material Modal */}
            <DeleteMaterial
              open={openDeleteModal}
              onClose={handleCloseDeleteModal}
              materialId={materialToDeleteId}
              materialName={materialToDeleteName}
              onDeleteSuccess={handleDeleteSuccess}
              onDeleteError={handleDeleteError}
            />

            {/* --- NEW Material Update Modal --- */}
            <MaterialUpdate
              open={openUpdateModal}
              onClose={handleCloseUpdateModal}
              materialToEdit={materialToEdit}
              onUpdateSuccess={handleUpdateSuccess}
              onUpdateError={handleUpdateError}
            />
            {/* ---------------------------------- */}
          </Box>
        </Fade>
      </Container>
    </>
  );
}
