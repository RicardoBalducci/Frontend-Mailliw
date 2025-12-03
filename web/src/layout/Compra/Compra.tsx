 "use client";

import React from "react";
import {
  Box,
  Container,
  Fade,
  Stack,
  Typography,
  Autocomplete,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InventoryIcon from "@mui/icons-material/Inventory";

import { useState, useEffect, useMemo } from "react";

// Components
import HeaderCompra from "./components/compra-header";
import { MaterialAdd } from "../Materiales/components/Materiales-add";
import { MaterialSelectModal } from "./components/compra-material-select";

// Services
import ProveedorServices from "../../api/ProveedorServices";
import MaterialServices from "../../api/MaterialesServices";
import ComprasServices from "../../api/ComprasServices";

// DTOs
import type { ProveedorDto } from "../../Dto/Proveedor.dto";
import type { MaterialesDto } from "../../Dto/Materiales.dto";
import type { CreateCompraDto } from "../../Dto/Compra-request.dto";

// Styled Components
import {
  StyledPaper,
  StyledButton,
  StyledTextField,
  StyledAlert,
} from "./components/styled-components";
import { ProveedorAdd } from "../Proveedor/components/Proveedor-add";

// Define la estructura de un item en la lista de compra
interface PurchaseItem {
  material: MaterialesDto;
  cantidad: number;
}

export function Compra() {
  // Modal states
  const [openMaterialAddModal, setOpenMaterialAddModal] = useState(false);
  const [openProveedorModal, setOpenProveedorModal] = useState(false);
  const [openMaterialSelectModal, setOpenMaterialSelectModal] = useState(false);

  // Data states
  const [proveedores, setProveedores] = useState<ProveedorDto[]>([]);
  const [selectedProveedor, setSelectedProveedor] =
    useState<ProveedorDto | null>(null);
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);

  // Loading & Error states
  const [loadingProveedores, setLoadingProveedores] = useState(false);
  const [proveedoresError, setProveedoresError] = useState<string | null>(null);
  const [, setLoadingMaterials] = useState(false);
  const [, setMaterialsError] = useState<string | null>(null);
  const [savingPurchase, setSavingPurchase] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  // Snackbar for notifications
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");

  const [dollarOficial, setDollarOficial] = useState<number | null>(null);

  useEffect(() => {
    const storedDollar = localStorage.getItem("dollar_oficial");

    if (storedDollar) setDollarOficial(Number(storedDollar));
  }, []);

  // Fetch initial data
  const fetchProveedores = async () => {
    setLoadingProveedores(true);
    setProveedoresError(null);
    try {
      const response = await ProveedorServices.findAll(1, 100);
      setProveedores(response.data);
    } catch (error: unknown) {
      setProveedoresError(
        (error as Error).message || "Error al cargar proveedores."
      );
      console.error("Error fetching suppliers:", error);
      showSnackbar(
        (error as Error).message || "Error al cargar proveedores.",
        "error"
      );
    } finally {
      setLoadingProveedores(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchMaterials = async () => {
    setLoadingMaterials(true);
    setMaterialsError(null);
    try {
      await MaterialServices.findAll(1, 100);
    } catch (error: unknown) {
      setMaterialsError(
        (error as Error).message || "Error al cargar materiales."
      );
      console.error("Error fetching materials:", error);
      showSnackbar(
        (error as Error).message || "Error al cargar materiales.",
        "error"
      );
    } finally {
      setLoadingMaterials(false);
    }
  };

  const handleOpenMaterialAddModal = () => setOpenMaterialAddModal(true);
  const handleCloseMaterialAddModal = () => setOpenMaterialAddModal(false);
  const handleOpenProveedorModal = () => setOpenProveedorModal(true);
  const handleCloseProveedorModal = () => setOpenProveedorModal(false);
  const handleOpenMaterialSelectModal = () => {
    fetchMaterials();
    setOpenMaterialSelectModal(true);
  };
  const handleCloseMaterialSelectModal = () =>
    setOpenMaterialSelectModal(false);

  const handleMaterialAdded = () => {
    showSnackbar("Material añadido exitosamente!", "success");
  };


  const handleMaterialSelected = (material: MaterialesDto) => {
    setPurchaseItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.material.id === material.id
      );
      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].cantidad += 1;
        return updatedItems;
      } else {
        return [...prevItems, { material, cantidad: 1 }];
      }
    });
    handleCloseMaterialSelectModal();
    showSnackbar(`Material '${material.nombre}' añadido a la compra.`, "info");
  };

  const handleQuantityChange = (materialId: number, newQuantity: number) => {
    setPurchaseItems((prevItems) =>
      prevItems.map((item) =>
        item.material.id === materialId
          ? { ...item, cantidad: Math.max(1, newQuantity) }
          : item
      )
    );
  };

  const handleRemoveItem = (materialId: number) => {
    setPurchaseItems((prevItems) =>
      prevItems.filter((item) => item.material.id !== materialId)
    );
    showSnackbar("Material eliminado de la compra.", "info");
  };

  const handleSaveCompra = async () => {
    if (!selectedProveedor) {
      setPurchaseError("Por favor, selecciona un proveedor.");
      showSnackbar("Por favor, selecciona un proveedor.", "error");
      return;
    }
    if (purchaseItems.length === 0) {
      setPurchaseError("Por favor, añade al menos un material a la compra.");
      showSnackbar(
        "Por favor, añade al menos un material a la compra.",
        "error"
      );
      return;
    }

    setSavingPurchase(true);
    setPurchaseError(null);

    interface CreateCompraMaterialDto {
      material_id: number;
      cantidad: number;
      precio_unitario_bs: number;
      precio_unitario_usd?: number;
    }

    const materiales: CreateCompraMaterialDto[] = purchaseItems.map((item) => {
      const { material, cantidad } = item;
      const { id, precio_unitario_usd } = material;

      if (id === null || id === undefined) {
        throw new Error("El ID del material no puede ser nulo o indefinido.");
      }

      const numericCantidad = Number(cantidad);
      const numericPrecioUsd =
        precio_unitario_usd !== undefined ? Number(precio_unitario_usd) : 0;

      if (isNaN(numericCantidad) || isNaN(numericPrecioUsd)) {
        throw new Error(
          `Error en la conversión para el material '${material.nombre}'. Asegúrate de que los valores sean numéricos.`
        );
      }

      // Calcula el precio en Bs usando dollarOficial
      const numericPrecioBs = Number(
        (numericPrecioUsd * (dollarOficial || 0)).toFixed(3)
      );

      return {
        material_id: id,
        cantidad: numericCantidad,
        precio_unitario_bs: numericPrecioBs,
        precio_unitario_usd: numericPrecioUsd,
      };
    });

    const newCompraData: CreateCompraDto = {
      proveedor_id: selectedProveedor.id,
      materiales,
    };

    try {
      await ComprasServices.createCompra(newCompraData);
      showSnackbar("¡Compra registrada exitosamente!", "success");
      setSelectedProveedor(null);
      setPurchaseItems([]);
    } catch (error: unknown) {
      let errorMessage = "Error al registrar la compra.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setPurchaseError(errorMessage);
      showSnackbar(errorMessage, "error");
      console.error("Error saving purchase:", error);
    } finally {
      setSavingPurchase(false);
    }
  };

  const handleCancelCompra = () => {
    setSelectedProveedor(null);
    setPurchaseItems([]);
    setPurchaseError(null);
    showSnackbar("Compra cancelada.", "info");
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (
    _?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  // Calculate totals
  const totalUSD = useMemo(() => {
    return purchaseItems.reduce(
      (sum, item) =>
        sum + (item.material.precio_unitario_usd || 0) * item.cantidad,
      0
    );
  }, [purchaseItems]);

  const totalBS = useMemo(() => {
    return purchaseItems.reduce(
      (sum, item) =>
        sum +
        (item.material.precio_unitario_usd || 0) *
          (dollarOficial || 0) *
          item.cantidad,
      0
    );
  }, [purchaseItems, dollarOficial]);

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Fade in={true} timeout={800}>
          <Box>
            <HeaderCompra />
            <StyledPaper sx={{ p: 4, mb: 3 }}>
              <Typography
                variant="h5"
                component="h2"
                fontWeight={600}
                gutterBottom
                sx={{ mb: 4 }}
              >
                <ShoppingCartIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Nueva Orden de Compra
              </Typography>

              <Box sx={{ mb: 4, pb: 3, borderBottom: "1px dashed #eee" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <LocalShippingIcon fontSize="small" />
                  Seleccionar Proveedor
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems={{ xs: "stretch", sm: "center" }}
                >
                  <Autocomplete
                    options={proveedores}
                    getOptionLabel={(option) => option.nombre}
                    value={selectedProveedor}
                    onChange={(_, newValue) => {
                      setSelectedProveedor(newValue);
                    }}
                    loading={loadingProveedores}
                    renderInput={(params) => (
                      <StyledTextField
                        {...params}
                        label="Buscar o Seleccionar Proveedor"
                        variant="outlined"
                        fullWidth
                        error={!!proveedoresError}
                        helperText={proveedoresError}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingProveedores ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    loadingText="Cargando proveedores..."
                    noOptionsText="No se encontraron proveedores"
                    sx={{ flexGrow: 1 }}
                  />
                  <StyledButton
                    variant="contained"
                    color="secondary"
                    onClick={handleOpenProveedorModal}
                    startIcon={<AddIcon />}
                    size="large"
                  >
                    Añadir Proveedor
                  </StyledButton>
                </Stack>
              </Box>

              <Box sx={{ mb: 4, pb: 3, borderBottom: "1px dashed #eee" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <InventoryIcon fontSize="small" />
                  Materiales a Comprar
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems={{ xs: "stretch", sm: "center" }}
                  mb={3}
                >
                  <StyledButton
                    variant="outlined"
                    color="info"
                    onClick={handleOpenMaterialSelectModal}
                    startIcon={<AddIcon />}
                    size="large"
                    sx={{ flexGrow: 1 }}
                  >
                    Seleccionar Material Existente
                  </StyledButton>
                  <StyledButton
                    variant="contained"
                    color="primary"
                    onClick={handleOpenMaterialAddModal}
                    startIcon={<AddIcon />}
                    size="large"
                    sx={{ flexGrow: 1 }}
                  >
                    Añadir Nuevo Material
                  </StyledButton>
                </Stack>

                {purchaseItems.length === 0 ? (
                  <Box
                    minHeight={150}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                      border: "2px dashed #e0e0e0",
                      borderRadius: 2,
                      p: 3,
                      color: "#999",
                      bgcolor: "#fdfdfd",
                    }}
                  >
                    <InventoryIcon
                      sx={{ fontSize: 40, mb: 1, color: "#ccc" }}
                    />
                    <Typography variant="body1" textAlign="center">
                      Aún no has añadido materiales a esta compra.
                      <br />
                      Usa los botones de arriba para empezar.
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {purchaseItems.map((item) => (
                      <Box
                        key={item.material.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 2,
                          border: "1px solid #eee",
                          borderRadius: 2,
                          bgcolor: "#f9f9f9",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        }}
                      >
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {item.material.nombre}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Stock actual: {item.material.stock}
                          </Typography>
                        </Box>
                        <StyledTextField
                          label="Cantidad"
                          type="number"
                          value={item.cantidad}
                          onChange={(e) => {
                            // Add a check to ensure the material ID is a valid number
                            if (item.material.id !== null) {
                              handleQuantityChange(
                                item.material.id,
                                Number.parseInt(e.target.value)
                              );
                            } else {
                              // Optionally, handle the error case here, for example, by showing a snackbar
                              showSnackbar(
                                "Error: ID de material no válido.",
                                "error"
                              );
                              console.error(
                                "Attempted to change quantity for a material with a null ID."
                              );
                            }
                          }}
                          inputProps={{ min: 1 }}
                          sx={{ width: 120 }}
                          size="small"
                        />
                        <Box sx={{ minWidth: 150, textAlign: "right" }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            $
                            {(
                              (item.material.precio_unitario_usd || 0) *
                              item.cantidad
                            ).toFixed(2)}{" "}
                            USD
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Bs
                            {(
                              (item.material.precio_unitario_usd || 0) *
                              (dollarOficial || 0) *
                              item.cantidad
                            ).toFixed(2)}
                          </Typography>
                        </Box>
                        <StyledButton
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            if (item.material.id !== null) {
                              handleRemoveItem(item.material.id);
                            } else {
                              // Optionally handle the case where the ID is null,
                              // for example, by logging an error or showing a user alert.
                              console.error(
                                "Attempted to remove an item with a null ID."
                              );
                              // showSnackbar("No se pudo eliminar el material. ID no válido.", "error");
                            }
                          }}
                          size="small"
                          sx={{ minWidth: 40, p: 1 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </StyledButton>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>

              <Box sx={{ mt: 4, pt: 3, borderTop: "1px dashed #eee" }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  Resumen de la Compra
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                    p: 1,
                    bgcolor: "#f0f0f0",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body1" fontWeight={500}>
                    Total en USD:
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="primary.main"
                  >
                    ${totalUSD.toFixed(2)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1,
                    bgcolor: "#f0f0f0",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body1" fontWeight={500}>
                    Total en Bs:
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="primary.main"
                  >
                    {totalBS.toFixed(2)} Bs
                  </Typography>
                </Box>
              </Box>

              {purchaseError && (
                <StyledAlert severity="error" sx={{ mt: 3 }}>
                  {purchaseError}
                </StyledAlert>
              )}

              <Box
                display="flex"
                justifyContent="flex-end"
                sx={{ mt: 4, pt: 3, borderTop: "1px solid #eee" }}
              >
                <StyledButton
                  variant="outlined"
                  color="error"
                  onClick={handleCancelCompra}
                  size="large"
                  disabled={savingPurchase}
                  sx={{ mr: 2 }}
                >
                  Cancelar
                </StyledButton>
                <StyledButton
                  variant="contained"
                  color="success"
                  onClick={handleSaveCompra}
                  size="large"
                  disabled={
                    savingPurchase ||
                    !selectedProveedor ||
                    purchaseItems.length === 0
                  }
                >
                  {savingPurchase ? (
                    <>
                      <CircularProgress
                        size={24}
                        color="inherit"
                        sx={{ mr: 1 }}
                      />
                      Guardando...
                    </>
                  ) : (
                    "Guardar Compra"
                  )}
                </StyledButton>
              </Box>
            </StyledPaper>
          </Box>
        </Fade>
      </Container>

      <MaterialAdd
        open={openMaterialAddModal}
        onClose={handleCloseMaterialAddModal}
        onMaterialAdded={handleMaterialAdded}
      />
      <ProveedorAdd
        open={openProveedorModal}
        onClose={handleCloseProveedorModal}
      />
      <MaterialSelectModal
        open={openMaterialSelectModal}
        onClose={handleCloseMaterialSelectModal}
        onMaterialSelected={handleMaterialSelected}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <StyledAlert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </StyledAlert>
      </Snackbar>
    </>
  );
}
