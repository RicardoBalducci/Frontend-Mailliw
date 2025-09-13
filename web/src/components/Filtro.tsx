import React from "react";
import {
  Grid,
  TextField,
  Button,
  Box,
  Collapse,
  Typography,
  Stack,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
  SelectChangeEvent,
  Chip,
} from "@mui/material";
import { Funnel, Search, FileDown } from "lucide-react";
import { FilterList } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { UserDTOs } from "../../../dto/user.dtos";

export const Estados = {
  por_instalar: "POR INSTALAR",
  asignado: "ASIGNADO",
  en_desarrollo: "EN DESARROLLO",
  fecha_asignada: "FECHA ASIGNADA",
  fecha_adelantada: "FECHA ADELANTADA",
  pospuesto: "POSPUESTO",
  por_verificar: "POR VERIFICAR",
  espera_info_caja: "ESPERA INFO CAJA",
  espera_aprovisionamiento: "ESPERA APROVISIONAMIENTO",
  espera_potencia_onu: "ESPERA POTENCIA ONU",
  espera_materiales: "ESPERA MATERIALES",
  finalizado: "FINALIZADO",
};

interface FiltrosInstalacionesProps {
  isAdvancedFiltersOpen: boolean;
  handleToggleAdvancedFilters: () => void;
  handleClearFilters: () => void;
  contratistas: UserDTOs[];
  loadingContratistas: boolean;
  errorContratistas: string | null;
  contratista: string;
  setContratista: (value: string) => void;
  numeroContrato: string;
  setNumeroContrato: (value: string) => void;
  estadoInstalacion: string[];
  setEstadoInstalacion: (value: string[]) => void;
  prioridad: string[];
  setPrioridad: (value: string[]) => void;
  fechaInicio: string;
  setFechaInicio: (value: string) => void;
  fechaFin: string;
  setFechaFin: (value: string) => void;
  handleAdvancedSearch: () => void;
}

export const FiltrosInstalaciones: React.FC<FiltrosInstalacionesProps> = ({
  isAdvancedFiltersOpen,
  handleToggleAdvancedFilters,
  handleClearFilters,
  contratistas,
  loadingContratistas,
  errorContratistas,
  contratista,
  setContratista,
  numeroContrato,
  setNumeroContrato,
  estadoInstalacion,
  setEstadoInstalacion,
  prioridad,
  setPrioridad,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  handleAdvancedSearch,
}) => {
  const theme = useTheme();

  // Crear una lista de estados a partir del objeto, excluyendo "POR INSTALAR"
  const estadosParaFiltro = Object.values(Estados).filter(
    (estado) => estado !== "POR INSTALAR"
  );

  return (
    <>
      <Grid container spacing={2} alignItems="center">
        {/* Sección de los TextFields de fecha con sus estados */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Fecha inicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Fecha fin"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* ... (Sección de los botones) ... */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
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
            <FilterList
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
            {/* Contratista y Número de Contrato */}
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Número de Contrato"
                variant="outlined"
                value={numeroContrato}
                onChange={(e) => setNumeroContrato(e.target.value)}
              />
            </Grid>
            {/* Estado de Instalación (Multiselección) */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="estado-instalacion-label">
                  Estado de Instalación
                </InputLabel>
                <Select
                  labelId="estado-instalacion-label"
                  id="estado-instalacion-select"
                  multiple // Habilita la multiselección
                  label="Estado de Instalación"
                  value={estadoInstalacion}
                  onChange={(
                    e: SelectChangeEvent<typeof estadoInstalacion>
                  ) => {
                    const {
                      target: { value },
                    } = e;
                    setEstadoInstalacion(
                      typeof value === "string" ? value.split(",") : value
                    );
                  }}
                  // Utiliza renderValue para mostrar los estados seleccionados como Chips
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {/* Mapea los estados filtrados */}
                  {estadosParaFiltro.map((estado) => (
                    <MenuItem key={estado} value={estado}>
                      {estado}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* Prioridad (Multiselección) */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="prioridad-label">Prioridad</InputLabel>
                <Select
                  labelId="prioridad-label"
                  id="prioridad-select"
                  multiple
                  label="Prioridad"
                  value={prioridad}
                  onChange={(e: SelectChangeEvent<typeof prioridad>) => {
                    const {
                      target: { value },
                    } = e;
                    setPrioridad(
                      typeof value === "string" ? value.split(",") : value
                    );
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          color={value === "ALTA" ? "error" : "warning"}
                        />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="ALTA">ALTA PRIORIDAD</MenuItem>
                  <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Search />}
                onClick={handleAdvancedSearch}
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
