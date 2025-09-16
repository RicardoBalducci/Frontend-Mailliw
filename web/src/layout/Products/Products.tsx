"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  InputAdornment,
  Fade,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import ProductosServices from "../../api/ProductServices";
import { alpha, useTheme } from "@mui/material/styles";
import ProductTable from "./components/ProductsTable";
import { ProductsAdd } from "./components/ProductsAdd";
import { ProductoDTO } from "../../Dto/Productos.dto";
import { DeleteProduct } from "../client/components/DeleteProduct";

import {
  StyledPaper,
  SearchTextField,
  ActionButton,
} from "../../theme/StyledComponents";
import Swal from "sweetalert2";

// Extend ProductoDTO for table rows, ensuring all required fields are present
export interface ProductRow extends ProductoDTO {
  id: number;
}

export function Product() {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAddEditModal, setOpenAddEditModal] = useState(false); // Renamed for clarity
  const [openDeleteModal, setOpenDeleteModal] = useState(false); // State for delete modal
  const [, setCurrentProduct] = useState<ProductRow | null>(null);
  const [productToDelete, setProductToDelete] = useState<{
    id: number;
    nombre: string;
  } | null>(null); // State for product to delete

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await ProductosServices.fetchProductos();
      if (response.success && response.data) {
        setProducts(response.data as ProductRow[]); // Cast to ProductRow[] assuming IDs are present
      } else {
        setAlertMessage(response.message || "Error al cargar los productos.");
        setAlertSeverity("error");
        setAlertOpen(true);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setAlertMessage("Error de conexión al obtener productos.");
      setAlertSeverity("error");
      setAlertOpen(true);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
  };

  const handleOpenAddEditModal = () => {
    setCurrentProduct(null); // Clear current product for "add" mode
    setOpenAddEditModal(true);
  };

  const handleCloseAddEditModal = () => {
    setOpenAddEditModal(false);
    setCurrentProduct(null); // Clear current product after closing
  };

  const handleOpenDeleteModal = (id: number, nombre: string) => {
    setProductToDelete({ id, nombre });
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setProductToDelete(null);
  };

  const handleProductActionSuccess = (message: string) => {
    fetchProducts(); // Re-fetch products to update the table
    setAlertMessage(message);
    setAlertSeverity("success");
    setAlertOpen(true);
  };

  const handleProductActionError = (message: string) => {
    setAlertMessage(message);
    setAlertSeverity("error");
    setAlertOpen(true);
  };

  const handleModify = (product: ProductRow): void => {
    setCurrentProduct(product);
    Swal.fire("En proceso de desarrollo", "", "info");
  };

  // The handleDelete in Product component will now open the DeleteProduct modal
  const handleDelete = (id: number): void => {
    const product = products.find((p) => p.id === id);
    if (product) {
      handleOpenDeleteModal(product.id, product.nombre);
    }
  };

  const handleModifyStock = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      // This is where you'd implement specific logic for stock modification,
      // potentially opening a different modal or an inline edit.
      alert(`Modificar stock para: ${product.nombre} (ID: ${product.id})`);
    }
  };

  const handleModifyPrice = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      // Similar to stock, this would be for price modification.
      alert(`Modificar precio para: ${product.nombre} (ID: ${product.id})`);
    }
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
              <ShoppingCartIcon sx={{ mr: 1 }} />
              Gestión de Productos
            </Typography>
            <Chip
              label={`${products.length} productos`}
              color="primary"
              variant="outlined"
              sx={{ ml: 2, fontWeight: 500, height: 28 }}
            />
          </Box>

          <StyledPaper>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <SearchTextField
                placeholder="Buscar por nombre, descripción..."
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ShoppingCartIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ maxWidth: 500, bgcolor: "white" }}
              />
              <Box>
                <Tooltip title="Actualizar tabla">
                  <IconButton
                    onClick={fetchProducts}
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
                  onClick={handleOpenAddEditModal} // Use the renamed handler
                  startIcon={<AddIcon />}
                  sx={{ ml: 2 }}
                >
                  Añadir Producto
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
                minHeight={200}
              >
                <CircularProgress />
              </Box>
            ) : (
              <ProductTable
                rows={products.filter(
                  (product) =>
                    product.nombre
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    product.descripcion
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                )}
                searchTerm={searchTerm}
                onModify={handleModify}
                onDelete={handleDelete}
                onModifyStock={handleModifyStock}
                onModifyPrice={handleModifyPrice}
              />
            )}
          </StyledPaper>

          {/* ProductsAdd/Edit modal */}
          <ProductsAdd
            open={openAddEditModal} // Use the renamed state variable
            onClose={handleCloseAddEditModal} // Use the renamed handler
            onProductAdded={() =>
              handleProductActionSuccess("Producto guardado exitosamente.")
            }
          />

          {/* DeleteProduct modal */}
          {productToDelete && ( // Render only when there's a product to delete
            <DeleteProduct
              open={openDeleteModal}
              onClose={handleCloseDeleteModal}
              productId={productToDelete.id}
              productName={productToDelete.nombre}
              onDeleteSuccess={handleProductActionSuccess}
              onDeleteError={handleProductActionError}
            />
          )}

          {/* Snackbar for alerts */}
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
        </Box>
      </Fade>
    </Container>
  );
}

export default Product;
