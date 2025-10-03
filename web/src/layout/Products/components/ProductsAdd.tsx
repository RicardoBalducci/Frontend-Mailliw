"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Alert,
  Fade,
  IconButton,
  Chip,
  InputAdornment,
  Stack,
  CircularProgress,
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; // USD Icon
import NumbersIcon from "@mui/icons-material/Numbers";
import DescriptionIcon from "@mui/icons-material/Description";
import ProductServices from "../../../api/ProductServices";
import { CreateProductoDTO } from "../../../Dto/Productos.dto";
import {
  ModalContent,
  ModalHeader,
  StyledModal,
  ModalBody,
  StyledTextField,
  ModalFooter,
  StyledButton,
} from "../../../theme/StyledModalComponents";

interface ProductsAddProps {
  open: boolean;
  onClose: () => void;
  onProductAdded?: () => void;
}

export function ProductsAdd({
  open,
  onClose,
  onProductAdded,
}: ProductsAddProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [stock, setStock] = useState<number | "">("");
  const [precio_unitario, setPrecioUnitario] = useState<number | "">(""); // This is in Bolívares
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddProduct = async () => {
    if (!nombre || !descripcion || stock === "" || precio_unitario === "") {
      setError(
        "Por favor, completa todos los campos requeridos (Nombre, Descripción, Stock, Precio Unitario (Bs), Precio Unitario (USD))."
      );
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const newProductData: CreateProductoDTO = {
      nombre,
      descripcion,
      stock: Number(stock),
      precio_unitario: Number(precio_unitario),
    };

    try {
      const response = await ProductServices.createProduct(newProductData); // Use the service

      if (response.success) {
        setSuccess("¡Producto añadido exitosamente!");

        setNombre("");
        setDescripcion("");
        setStock("");
        setPrecioUnitario("");
        if (onProductAdded) {
          onProductAdded();
        }

        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(response.message || "Error al añadir el producto.");
      }
    } catch (err) {
      setError("Ocurrió un error inesperado al añadir el producto.");
      console.error("Error adding product:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setError(null);
      setSuccess(null);
      setNombre("");
      setDescripcion("");
      setStock("");
      setPrecioUnitario("");
    }
  }, [open]);

  return (
    <StyledModal
      open={open}
      onClose={onClose}
      closeAfterTransition
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Fade in={open}>
        <ModalContent>
          <ModalHeader>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  mr: 2,
                  p: 1,
                  bgcolor: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                }}
              >
                <ShoppingCartIcon />
              </Box>
              <Typography variant="h5" component="h2" fontWeight={600}>
                {"Añadir Producto"}
              </Typography>
            </Box>
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "white",
              }}
            >
              <CloseIcon />
            </IconButton>
            <Chip
              label={"Nuevo Producto"}
              icon={<AddIcon />}
              size="small"
              sx={{
                position: "absolute",
                right: 48,
                top: 12,
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 500,
              }}
            />
          </ModalHeader>

          <ModalBody>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}
            <Stack spacing={3}>
              <StyledTextField
                label="Nombre del Producto"
                variant="outlined"
                fullWidth
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ShoppingCartIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                label="Descripción del Producto"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                label="Stock"
                variant="outlined"
                fullWidth
                type="number"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value) || "")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NumbersIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                label="Precio Unitario ($)" // Changed label to Bolívares
                variant="outlined"
                fullWidth
                type="number"
                value={precio_unitario}
                onChange={(e) =>
                  setPrecioUnitario(parseFloat(e.target.value) || "")
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon color="action" />
                      {/* Using EuroIcon for Bolívares as no specific Bolívar icon is standard in MUI */}
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </ModalBody>

          <ModalFooter>
            <StyledButton
              variant="outlined"
              color="primary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </StyledButton>
            <StyledButton
              variant="contained"
              color="primary"
              onClick={handleAddProduct}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Añadir Producto"
              )}
            </StyledButton>
          </ModalFooter>
        </ModalContent>
      </Fade>
    </StyledModal>
  );
}
