import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  Alert,
  TablePagination,
  Chip,
} from "@mui/material";
import { Alert as AlertIcon, AccessTimeFilled } from "@mui/icons-material";

// La interfaz FinalizadaDTO se ha actualizado para coincidir con el tipo FinalizadaTask
// del componente padre, lo que asegura que los datos son consistentes.
export interface FinalizadaDTO {
  tarea_id: number;
  numero_contrato: string | null;
  cuadrilla_nombre: string;
  contratista_nombre: string;
  estado_instalacion: string;
  status_asignacion: string;
  tecnicos_cuadrilla: Array<{ nombre: string }>;
  fecha_finalizacion?: string | null;
}

interface FinalizadasTableProps {
  data: FinalizadaDTO[];
  loading: boolean;
  error: string | null;
  // Propiedades de paginación pasadas desde el componente padre
  page: number;
  rowsPerPage: number;
  count: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FinalizadasTable: React.FC<FinalizadasTableProps> = ({
  data,
  loading,
  error,
  page,
  rowsPerPage,
  count,
  onPageChange,
  onRowsPerPageChange,
}) => {
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box my={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Typography variant="body1" align="center" my={2}>
        No se encontraron tareas finalizadas con los filtros seleccionados.
      </Typography>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{ borderRadius: "12px", overflow: "hidden", marginTop: "20px" }}
    >
      <TableContainer>
        <Table stickyHeader aria-label="tabla de tareas finalizadas">
          <TableHead>
            <TableRow>
              <TableCell>Número de Contrato</TableCell>
              <TableCell>Contratista</TableCell>
              <TableCell>Cuadrilla</TableCell>
              <TableCell>Técnicos</TableCell>
              <TableCell>Prioridad</TableCell>
              <TableCell>Estado de Instalación</TableCell>
              <TableCell>Información</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Se renderizan los datos directamente sin usar .slice(), ya que la paginación se gestiona en el backend. */}
            {data.map((row) => (
              <TableRow key={row.tarea_id}>
                <TableCell>{row.numero_contrato}</TableCell>
                <TableCell>{row.contratista_nombre}</TableCell>
                <TableCell>{row.cuadrilla_nombre ?? "S/N"}</TableCell>
                <TableCell>
                  {row.tecnicos_cuadrilla
                    .map((tecnico) => tecnico.nombre)
                    .join(", ")}
                </TableCell>
                <TableCell>
                  {row.status_asignacion === "ALTA PRIORIDAD" ? (
                    <Chip
                      label={row.status_asignacion}
                      color="error"
                      icon={<AlertIcon />}
                      sx={{ width: "130px", fontSize: "12px" }}
                    />
                  ) : row.status_asignacion === "PENDIENTE" ? (
                    <Chip
                      label={row.status_asignacion}
                      color="warning"
                      icon={<AccessTimeFilled />}
                      sx={{ width: "130px", fontSize: "12px" }}
                    />
                  ) : (
                    <Box sx={{ p: 1 }}>{row.status_asignacion}</Box>
                  )}
                </TableCell>
                <TableCell>{row.estado_instalacion}</TableCell>
                <TableCell>accion</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={count} // Se usa el total de tareas de la API para el contador.
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
};
