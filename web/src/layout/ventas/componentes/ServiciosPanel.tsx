"use client";

import { Box, BottomNavigation, BottomNavigationAction, CircularProgress, Autocomplete, TextField, Paper } from "@mui/material";
import { Settings, Package } from "lucide-react";
import { ServicioDTO } from "../../../Dto/Servicio.dto";

interface ServiciosPanelProps {
  servicios: ServicioDTO[];
  selected: ServicioDTO | null;
  setSelected: (value: ServicioDTO | null) => void;
  tab: "servicios" | "productos";
  setTab: (value: "servicios" | "productos") => void;
  loading?: boolean;
}

const ServiciosPanel: React.FC<ServiciosPanelProps> = ({
  servicios,
  selected,
  setSelected,
  tab,
  setTab,
  loading = false,
}) => {
  return (
    <Paper sx={{ p: 3 }}>
      {/* BottomNavigation para cambiar tab */}
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
          options={servicios}
          getOptionLabel={(option) => option.nombre}
          value={selected}
          onChange={(_, newValue) => setSelected(newValue)}
          renderInput={(params) => <TextField {...params} label="Seleccionar Servicio" fullWidth />}
        />
      )}
    </Paper>
  );
};

export default ServiciosPanel;
