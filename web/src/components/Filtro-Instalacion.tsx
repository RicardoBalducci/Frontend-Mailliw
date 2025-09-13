import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
  Box,
  Stack,
  Typography,
  IconButton,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { FileDown, Funnel, Search } from "lucide-react";
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from "@mui/icons-material/Delete";

interface UserDTOs {
  id: number;
  nombre: string;
  apellido: string;
}

interface FiltrosInstalacionesProps {
  fechaInicio: string;
  setFechaInicio: (fecha: string) => void;
  fechaFin: string;
  setFechaFin: (fecha: string) => void;
  estadoFiltro: string;
  setEstadoFiltro: (estado: string) => void;
  contratistas: UserDTOs[];
  contratista: string;
  setContratista: (contratista: string) => void;
  loadingContratistas: boolean;
  errorContratistas: string | null;
  onFilterClick: () => void;
}

// Lista de todos los estados de instalación disponibles
const estadosDeInstalacion = [
  "ASIGNADO",
  "POSPUESTO",
  "EN DESARROLLO",
  "FECHA ASIGNADA",
  "FECHA ADELANTADA",
  "ESPERA INFO CAJA",
  "ESPERA APROVISIONAMIENTO",
  "ESPERA POTENCIA ONU",
  "ESPERA MATERIALES",
  "FINALIZADO",
];

export const FiltrosInstalaciones: React.FC<FiltrosInstalacionesProps> = ({
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  estadoFiltro,
  setEstadoFiltro,
  onFilterClick,
  contratistas,
  contratista,
  setContratista,
  loadingContratistas,
  errorContratistas,
}) => {
  const theme = useTheme();
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);

  const handleToggleAdvancedFilters = () => {
    setIsAdvancedFiltersOpen((prev) => !prev);
  };

  const handleClearFilters = () => {
    // Aquí puedes añadir la lógica para limpiar los campos de los filtros avanzados
    alert("Filtros avanzados limpiados");
  };

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Fecha de Inicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Fecha de Fin"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                onClick={onFilterClick}
                startIcon={<Search />}
                sx={{
                  height: 50,
                  color: "#fff",
                  backgroundImage:
                    "linear-gradient(45deg, #2196F3 30%, #1E88E5 90%)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  borderRadius: "8px",
                  transition: "box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    backgroundImage:
                      "linear-gradient(45deg, #1E88E5 30%, #1565C0 90%)",
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
                  },
                }}
                variant="contained"
              >
                Buscar
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                onClick={() => alert("HOLA")}
                startIcon={<FileDown />}
                sx={{
                  height: 50,
                  color: "#fff",
                  backgroundImage:
                    "linear-gradient(45deg, #4CAF50 30%, #43A047 90%)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  borderRadius: "8px",
                  transition: "box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    backgroundImage:
                      "linear-gradient(45deg, #43A047 30%, #388E3C 90%)",
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
                  },
                }}
                variant="contained"
              >
                Descargar
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                startIcon={<Funnel />}
                sx={{
                  height: 50,
                  color: "#fff",
                  backgroundImage:
                    "linear-gradient(45deg, #9C27B0 30%, #8E24AA 90%)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  borderRadius: "8px",
                  transition: "box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    backgroundImage:
                      "linear-gradient(45deg, #8E24AA 30%, #7B1FA2 90%)",
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
                  },
                }}
                variant="contained"
                onClick={handleToggleAdvancedFilters}
              >
                Búsqueda Avanzada
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Collapse in={isAdvancedFiltersOpen} timeout="auto" unmountOnExit>
        <Box
          sx={{
            mt: 4,
            p: 3,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            bgcolor: theme.palette.background.paper,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <FilterListIcon
              sx={{ fontSize: 40, color: theme.palette.secondary.main }}
            />
            <Typography
              variant="h6"
              component="h3"
              sx={{
                flexGrow: 1,
                fontWeight: "medium",
                color: theme.palette.text.primary,
              }}
            >
              Filtros Avanzados
            </Typography>
            <IconButton
              onClick={handleClearFilters}
              color="primary"
              sx={{ color: theme.palette.error.main }}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="estado-instalacion-label">Estado</InputLabel>
                <Select
                  labelId="estado-instalacion-label"
                  id="estado-instalacion-select"
                  value={estadoFiltro}
                  label="Estado"
                  onChange={(e) => setEstadoFiltro(e.target.value as string)}
                >
                  <MenuItem value="TODOS">TODOS</MenuItem>
                  {estadosDeInstalacion.map((estado) => (
                    <MenuItem key={estado} value={estado}>
                      {estado}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={loadingContratistas}>
                <InputLabel id="contratista-label">Contratista</InputLabel>
                <Select
                  labelId="contratista-label"
                  id="contratista-select"
                  label="Contratista"
                  value={contratista}
                  onChange={(e) => setContratista(e.target.value as string)}
                >
                  <MenuItem value="">
                    <em>Ninguno</em>
                  </MenuItem>
                  {loadingContratistas && (
                    <MenuItem disabled>
                      <CircularProgress size={20} />
                      <span style={{ marginLeft: "10px" }}>Cargando...</span>
                    </MenuItem>
                  )}
                  {errorContratistas && (
                    <MenuItem disabled>Error al cargar</MenuItem>
                  )}
                  {!loadingContratistas &&
                    !errorContratistas &&
                    contratistas.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.nombre} {user.apellido}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Search />}
                onClick={onFilterClick}
                sx={{
                  height: 50,
                  color: "#fff",
                  backgroundImage:
                    "linear-gradient(45deg, #1E88E5 30%, #1565C0 90%)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  borderRadius: "8px",
                  transition: "box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    backgroundImage:
                      "linear-gradient(45deg, #1565C0 30%, #0D47A1 90%)",
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
                  },
                }}
              >
                Aplicar Búsqueda
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </>
  );
};
/*
import React from "react";
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { FileDown, Funnel, Search } from "lucide-react";

interface UserDTOs {
  id: number;
  nombre: string;
  apellido: string;
}

interface FiltrosInstalacionesProps {
  fechaInicio: string;
  setFechaInicio: (fecha: string) => void;
  fechaFin: string;
  setFechaFin: (fecha: string) => void;
  estadoFiltro: string;
  setEstadoFiltro: (estado: string) => void;
  contratistas: UserDTOs[];
  contratista: string;
  setContratista: (contratista: string) => void;
  loadingContratistas: boolean;
  errorContratistas: string | null;
  onFilterClick: () => void;
}

// Lista de todos los estados de instalación disponibles
const estadosDeInstalacion = [
  "ASIGNADO",
  "POSPUESTO",
  "EN DESARROLLO",
  "FECHA ASIGNADA",
  "FECHA ADELANTADA",
  "ESPERA INFO CAJA",
  "ESPERA APROVISIONAMIENTO",
  "ESPERA POTENCIA ONU",
  "ESPERA MATERIALES",
  "FINALIZADO",
];

export const FiltrosInstalaciones: React.FC<FiltrosInstalacionesProps> = ({
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  estadoFiltro,
  setEstadoFiltro,
  onFilterClick,
  contratistas,
  contratista,
  setContratista,
  loadingContratistas,
  errorContratistas,
}) => {
  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            label="Fecha de Inicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            label="Fecha de Fin"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel id="estado-instalacion-label">Estado</InputLabel>
            <Select
              labelId="estado-instalacion-label"
              id="estado-instalacion-select"
              value={estadoFiltro}
              label="Estado"
              onChange={(e) => setEstadoFiltro(e.target.value as string)}
            >
              <MenuItem value="TODOS">TODOS</MenuItem>
              {estadosDeInstalacion.map((estado) => (
                <MenuItem key={estado} value={estado}>
                  {estado}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        

        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                onClick={onFilterClick}
                startIcon={<Search />}
                sx={{
                  height: 50,
                  color: "#fff",
                  backgroundImage:
                    "linear-gradient(45deg, #2196F3 30%, #1E88E5 90%)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  borderRadius: "8px",
                  transition: "box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    backgroundImage:
                      "linear-gradient(45deg, #1E88E5 30%, #1565C0 90%)",
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
                  },
                }}
                variant="contained"
              >
                Buscar
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                onClick={() => alert("HOLA")}
                startIcon={<FileDown />}
                sx={{
                  height: 50,
                  color: "#fff",
                  backgroundImage:
                    "linear-gradient(45deg, #4CAF50 30%, #43A047 90%)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  borderRadius: "8px",
                  transition: "box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    backgroundImage:
                      "linear-gradient(45deg, #43A047 30%, #388E3C 90%)",
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
                  },
                }}
                variant="contained"
              >
                Descargar
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

*/
