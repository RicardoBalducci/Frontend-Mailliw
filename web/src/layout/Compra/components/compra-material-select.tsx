import {
  Modal,
  Backdrop,
  Fade,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import MaterialesServices, {
  PaginatedMaterialsResponse,
} from "../../../api/MaterialesServices"; // Adjust path as needed
import { MaterialesDto } from "../../../Dto/Materiales.dto"; // Adjust DTO path as needed

// --- MaterialSelectModal Component ---
interface MaterialSelectModalProps {
  open: boolean;
  onClose: () => void;
  onMaterialSelected: (material: MaterialesDto) => void;
}

export function MaterialSelectModal({
  open,
  onClose,
  onMaterialSelected,
}: MaterialSelectModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [materials, setMaterials] = useState<MaterialesDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fetchMaterials = async (
    page: number,
    perPage: number,
    search: string = ""
  ) => {
    setLoading(true);
    setError(null);
    try {
      // Assuming your API handles searching on the backend with a 'search' parameter
      // If not, you'd filter `response.data` client-side based on `search`
      const response: PaginatedMaterialsResponse =
        await MaterialesServices.findAll(page + 1, perPage, search);

      // If your backend doesn't filter, uncomment the following lines for client-side filtering:
      /*
      const filteredMaterials = response.data.filter(material =>
        material.nombre.toLowerCase().includes(search.toLowerCase())
      );
      setMaterials(filteredMaterials);
      */

      // If your backend handles filtering directly:
      setMaterials(response.data);
      setTotalItems(response.total); // Assuming total is provided by the API
    } catch (err: any) {
      setError(err.message || "Error al cargar materiales.");
      console.error("Error fetching materials:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      // When the modal opens, reset search term and page before fetching
      setSearchTerm("");
      setPage(0);
      fetchMaterials(0, rowsPerPage, ""); // Fetch initial data when opened
    }
  }, [open]); // Only run when 'open' changes

  // Use a separate useEffect for fetching data based on pagination and search term
  useEffect(() => {
    if (open) {
      // Only fetch if modal is open
      const delayDebounceFn = setTimeout(() => {
        fetchMaterials(page, rowsPerPage, searchTerm);
      }, 300); // Debounce search input

      return () => clearTimeout(delayDebounceFn);
    }
  }, [page, rowsPerPage, searchTerm, open]); // Re-fetch when page, rowsPerPage, searchTerm, or open state changes

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page on new search
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 600, md: 800 },
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            maxHeight: "90vh",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Seleccionar Material
          </Typography>
          <TextField
            fullWidth
            label="Buscar Material"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={150}
            >
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Cargando materiales...</Typography>
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <>
              <TableContainer component={Paper}>
                <Table stickyHeader aria-label="materiales table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre del Material</TableCell>
                      <TableCell align="right">Stock</TableCell>
                      <TableCell align="center">Acción</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {materials.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No se encontraron materiales.
                        </TableCell>
                      </TableRow>
                    ) : (
                      materials.map((material) => (
                        <TableRow key={material.id}>
                          <TableCell>{material.nombre}</TableCell>
                          <TableCell align="right">{material.stock}</TableCell>
                          <TableCell align="center">
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => onMaterialSelected(material)}
                            >
                              Seleccionar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalItems}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Filas por página:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                }
              />
            </>
          )}
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="outlined" onClick={onClose}>
              Cerrar
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
