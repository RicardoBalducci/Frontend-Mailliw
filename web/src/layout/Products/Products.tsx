"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Container,
  Box,
  InputAdornment,
  Fade,
  IconButton,
  Tooltip,
  Divider,
  CircularProgress,
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
import { StyledPaper, SearchTextField } from "../../theme/StyledComponents";
import SaveButton from "../../components/global/Button/Save";
import ProductsEdit from "./components/PorductsUpdate";
import { Package } from "lucide-react";
import HeaderSection from "../../components/global/Header/header";
import { useSnackbar } from "../../components/context/SnackbarContext";

export interface ProductRow extends ProductoDTO {
  id: number;
}

export function Product() {
  const theme = useTheme();
  const { showSnackbar } = useSnackbar();

  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAddEditModal, setOpenAddEditModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductRow | null>(null);
  const [productToDelete, setProductToDelete] = useState<{
    id: number;
    nombre: string;
  } | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await ProductosServices.fetchProductos();
      if (response.success && response.data) {
        setProducts(response.data as ProductRow[]);
      } else {
        setProducts([]);
        showSnackbar(response.message || "Error al cargar productos", "error");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      showSnackbar("Error al cargar productos", "error");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenAddEditModal = () => {
    setCurrentProduct(null);
    setOpenAddEditModal(true);
  };

  const handleCloseAddEditModal = () => {
    setOpenAddEditModal(false);
    setCurrentProduct(null);
    fetchProducts(); // refresca productos después de cerrar
  };

  const handleOpenDeleteModal = (id: number, nombre: string) => {
    setProductToDelete({ id, nombre });
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setProductToDelete(null);
    fetchProducts(); // refresca productos después de cerrar
  };

  const handleModify = (product: ProductRow) => {
    setCurrentProduct(product);
    setOpenEditModal(true);
  };

  const handleDelete = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (product) handleOpenDeleteModal(product.id, product.nombre);
  };

  const handleModifyStock = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (product)
      alert(`Modificar stock para: ${product.nombre} (ID: ${product.id})`);
  };

  const handleModifyPrice = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (product)
      alert(`Modificar precio para: ${product.nombre} (ID: ${product.id})`);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in={true} timeout={800}>
        <Box>
          <HeaderSection
            title="Gestión de Productos"
            icon={<Package />}
            chipLabel={`${products.length} productos`}
          />

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

                <SaveButton
                  onClick={handleOpenAddEditModal}
                  startIcon={<AddIcon />}
                  texto="Añadir Producto"
                />
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height={200}
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

          <ProductsAdd
            open={openAddEditModal}
            onClose={handleCloseAddEditModal}
            onProductAdded={fetchProducts}
          />

          {productToDelete && (
            <DeleteProduct
              open={openDeleteModal}
              onClose={handleCloseDeleteModal}
              productId={productToDelete.id}
              productName={productToDelete.nombre}
              onDeleteSuccess={fetchProducts}
              onDeleteError={() =>
                showSnackbar("Error al eliminar producto", "error")
              }
            />
          )}

          <ProductsEdit
            open={openEditModal}
            onClose={() => setOpenEditModal(false)}
            product={currentProduct}
            onProductUpdated={fetchProducts}
          />
        </Box>
      </Fade>
    </Container>
  );
}

export default Product;
