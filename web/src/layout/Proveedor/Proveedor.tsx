// src/pages/Proveedor/Proveedor.tsx
import React, { useEffect, useState, useCallback } from "react"; // Removed useRef
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
import HeaderProveedor from "./components/Proveedor-header";
import { SearchTextField, StyledPaper } from "../../theme/StyledComponents";
import SearchIcon from "@mui/icons-material/Search"; // Use a more fitting search icon
import LoadingIndicator from "../../utils/LoadingIndicator";
import ErrorMessagePanel from "../../utils/ErrorIndicator";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";

// Import Proveedor DTO and Services
import { ProveedorDto } from "../../Dto/Proveedor.dto";
import ProveedorServices from "../../api/ProveedorServices";
import ProveedorTable from "./components/Proveedor-tabla";
import { ProveedorAdd } from "./components/Proveedor-add";
import { PaginatedResponse } from "../../api/PaginatedResponse.dto";
import { ProveedorDelete } from "./components/Proveedor-delete";
import { ProveedorUpdate } from "./components/Proveedor-update";
import SaveButton from "../../components/global/Button/Save";

export function Proveedor() {
  const theme = useTheme();
  const [proveedores, setProveedores] = useState<ProveedorDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Only searchTerm for immediate client-side filtering
  const [searchTerm, setSearchTerm] = useState("");

  const [openAddModal, setOpenAddModal] = useState(false);

  // State for Delete Proveedor modal
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [proveedorToDeleteId, setProveedorToDeleteId] = useState<number | null>(
    null
  );
  const [proveedorToDeleteName, setProveedorToDeleteName] = useState("");

  // State for Update Proveedor modal
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [proveedorToEdit, setProveedorToEdit] = useState<ProveedorDto | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0); // This will now come from the backend

  // Memoized fetch function to prevent unnecessary re-creation
  const fetchProveedores = useCallback(
    async (pagina: number, perPage: number) => {
      // Removed 'search' parameter
      setLoading(true);
      setError(null);
      try {
        // Call the service with pagination parameters. No search parameter passed here.
        const response: PaginatedResponse<ProveedorDto> =
          await ProveedorServices.findAll(pagina, perPage);

        setProveedores(response.data); // Set only the data for the current page
        setTotalItems(response.total); // Set total items from backend
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ocurrió un error desconocido al obtener los proveedores.");
        }
        console.error("Error fetching proveedores:", err);
      } finally {
        setLoading(false);
      }
    },
    [] // No dependencies means this function is created once
  );

  // Effect to fetch proveedores on component mount or pagination change
  useEffect(() => {
    fetchProveedores(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage, fetchProveedores]); // No longer depends on a debounced search term

  const handlePageChange = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setCurrentPage(newPage + 1); // MUI's TablePagination is 0-indexed, our currentPage is 1-indexed
  };

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const newItemsPerPage = Number(event.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when items per page changes
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

  // --- Client-Side Filtering Logic ---
  const filteredProveedores = proveedores.filter((proveedor) =>
    Object.values(proveedor).some(
      (value) =>
        value && String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  // --- End Client-Side Filtering Logic ---

  // Handlers for Add Proveedor modal
  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    fetchProveedores(currentPage, itemsPerPage); // Re-fetch data after adding
  };

  // Handler for search input (updates searchTerm immediately)
  const handleSearch = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setSearchTerm(event.target.value);
    // No need to reset page here, as filtering is client-side on the current data
  };

  // Handlers for Delete Proveedor modal
  const handleOpenDeleteModal = (id: number, name: string) => {
    setProveedorToDeleteId(id);
    setProveedorToDeleteName(name);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setProveedorToDeleteId(null);
    setProveedorToDeleteName("");
  };

  const handleDeleteSuccess = (message: string) => {
    toast.success(message);
    fetchProveedores(currentPage, itemsPerPage); // Re-fetch data after successful deletion
  };

  const handleDeleteError = (message: string) => {
    toast.error(message);
  };

  // Handlers for Update Proveedor modal
  const handleOpenUpdateModal = (proveedor: ProveedorDto) => {
    setProveedorToEdit(proveedor);
    setOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
    setProveedorToEdit(null); // Clear the material being edited
    fetchProveedores(currentPage, itemsPerPage); // Re-fetch data after adding
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Fade in={true} timeout={800}>
          <Box>
            <HeaderProveedor Proveedores={proveedores} />
            <StyledPaper>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <SearchTextField
                  placeholder="Buscar por nombre, teléfono o dirección..."
                  variant="outlined"
                  fullWidth
                  value={searchTerm} // Bind to searchTerm for immediate input display
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />{" "}
                        {/* More fitting search icon */}
                      </InputAdornment>
                    ),
                  }}
                  sx={{ maxWidth: 500, bgcolor: "white" }}
                />
                <Box>
                  <Tooltip title="Actualizar tabla">
                    <IconButton
                      onClick={
                        () => fetchProveedores(currentPage, itemsPerPage) // Manual refresh fetches current page
                      }
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
                    texto="Añadir Proveedor"
                  />
                </Box>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <ProveedorTable
                rows={filteredProveedores} // Now pass the client-side filtered data
                searchTerm={searchTerm} // Still pass searchTerm, though not used for filtering in table itself
                onModify={handleOpenUpdateModal}
                onDelete={handleOpenDeleteModal}
                totalItems={totalItems} // Use totalItems from the backend for pagination controls
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </StyledPaper>
            <ProveedorAdd
              open={openAddModal}
              onClose={handleCloseAddModal} /* 
              onProveedorAdded={handleAddSuccess}
              onAddError={handleAddError} */
            />

            <ProveedorDelete
              open={openDeleteModal}
              onClose={handleCloseDeleteModal}
              proveedorId={proveedorToDeleteId}
              proveedorName={proveedorToDeleteName}
              onDeleteSuccess={handleDeleteSuccess}
              onDeleteError={handleDeleteError}
            />

            <ProveedorUpdate
              open={openUpdateModal}
              onClose={handleCloseUpdateModal}
              proveedorToEdit={proveedorToEdit}
            />
          </Box>
        </Fade>
      </Container>
    </>
  );
}
