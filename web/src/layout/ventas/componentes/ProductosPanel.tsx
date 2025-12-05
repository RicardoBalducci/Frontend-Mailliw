"use client";

import { Box, BottomNavigation, BottomNavigationAction, CircularProgress, Autocomplete, TextField, Paper } from "@mui/material";
import { Package, Settings } from "lucide-react";
import { ProductoDTO } from "../../../Dto/Productos.dto";



interface ProductosPanelProps {
  products: ProductoDTO[];
  selected: ProductoDTO | null;
  setSelected: (value: ProductoDTO | null) => void;
  tab: "servicios" | "productos";
  setTab: (value: "servicios" | "productos") => void;
  loading?: boolean;
}

const ProductosPanel: React.FC<ProductosPanelProps> = ({
  products,
  selected,
  setSelected,
  tab,
  setTab,
  loading = false,
}) => {
  return (
    <Paper sx={{ p: 3 }}>
      {/* BottomNavigation */}
      <BottomNavigation
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        sx={{ mb: 3 }}
      >
        <BottomNavigationAction label="Servicios" value="servicios" icon={<Settings />} />
        <BottomNavigationAction label="Productos" value="productos" icon={<Package />} />
      </BottomNavigation>

      {/* Autocomplete */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={3}>
          <CircularProgress />
        </Box>
      ) : (
        <Autocomplete
          options={products}
          getOptionLabel={(option) => option.nombre}
          value={selected}
          onChange={(_, newValue) => setSelected(newValue)}
          renderInput={(params) => <TextField {...params} label="Seleccionar Producto" fullWidth />}
        />
      )}
    </Paper>
  );
};

export default ProductosPanel;
