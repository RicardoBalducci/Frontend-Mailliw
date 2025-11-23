// src/pages/Proveedor/Proveedor.tsx
import React, { useEffect, useState, useCallback } from "react";
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
import SearchIcon from "@mui/icons-material/Search";
import LoadingIndicator from "../../utils/LoadingIndicator";
import ErrorMessagePanel from "../../utils/ErrorIndicator";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";

// Import Proveedor DTO and Services
import { ProveedorDto } from "../../Dto/Proveedor.dto";
import ProveedorServices from "../../api/ProveedorServices";
import ProveedorTable from "./components/Proveedor-tabla";
import { ProveedorAdd } from "./components/Proveedor-add";
import { PaginatedResponse } from "../../api/PaginatedResponse.dto";
import { ProveedorUpdate } from "./components/Proveedor-update";
import SaveButton from "../../components/global/Button/Save";

export function Proveedor() {
  const theme = useTheme();
  const [proveedores, setProveedores] = useState<ProveedorDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);

  // State for Update Proveedor modal
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [proveedorToEdit, setProveedorToEdit] = useState<ProveedorDto | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fetchProveedores = useCallback(
    async (pagina: number, perPage: number) => {
      setLoading(true);
      setError(null);
      try {
        const response: PaginatedResponse<ProveedorDto> =
          await ProveedorServices.findAll(pagina, perPage);

        setProveedores(response.data);
        setTotalItems(response.total);
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
    []
  );

  useEffect(() => {
    fetchProveedores(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage, fetchProveedores]);

  const handlePageChange = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setCurrentPage(newPage + 1);
  };

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setItemsPerPage(Number(event.target.value));
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

  // --- Client-Side Filtering ---
  const filteredProveedores = proveedores.filter((proveedor) =>
    Object.values(proveedor).some(
      (value) =>
        value && String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Handlers for Add Proveedor modal
  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    fetchProveedores(currentPage, itemsPerPage);
  };

  // Handler for search input
  const handleSearch = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setSearchTerm(event.target.value);
  };

  // Handlers for Update Proveedor modal
  const handleOpenUpdateModal = (proveedor: ProveedorDto) => {
    setProveedorToEdit(proveedor);
    setOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
    setProveedorToEdit(null);
    fetchProveedores(currentPage, itemsPerPage);
  };

  return (
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
                    onClick={() => fetchProveedores(currentPage, itemsPerPage)}
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
              rows={filteredProveedores}
              searchTerm={searchTerm}
              onModify={handleOpenUpdateModal}
              totalItems={totalItems}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </StyledPaper>
          <ProveedorAdd open={openAddModal} onClose={handleCloseAddModal} />
          <ProveedorUpdate
            open={openUpdateModal}
            onClose={handleCloseUpdateModal}
            proveedorToEdit={proveedorToEdit}
          />
        </Box>
      </Fade>
    </Container>
  );
}
