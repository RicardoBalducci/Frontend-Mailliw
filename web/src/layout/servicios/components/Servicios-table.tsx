"use client";

import React, { useEffect, useState } from "react";

import type { ReactElement } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
/* import EditIcon from "@mui/icons-material/Edit";
 */import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Tooltip,
  Typography,
  Paper,
  useTheme,
  alpha,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import type { ServicioDTO } from "../../../Dto/Servicio.dto";
import { formatNumber } from "../../../utils/format";

interface ServiciosTableProps {
  rows: ServicioDTO[];
  searchTerm: string;
  onModify: (servicio: ServicioDTO) => void;
  onDelete: (servicio: ServicioDTO) => void;
}

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: "none",
  backgroundColor: "#ffffff",
  borderRadius: 12,
  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
  transition: "all 0.3s ease",
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#ffffff", // Fondo blanco para contraste
    color: "#000000", // Letras negras
    fontSize: "0.9rem",
    fontWeight: 700,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    "& .MuiDataGrid-columnSeparator": {
      color: alpha(theme.palette.common.black, 0.1), // separador sutil
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: 800,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
    },
  },
  "& .MuiDataGrid-cell": {
    borderBottom: "1px solid rgba(224, 224, 224, 0.4)",
    fontSize: "0.9rem",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    "&:focus": {
      outline: "none",
    },
    "&:focus-within": {
      outline: "none",
    },
  },
  "& .MuiDataGrid-row": {
    "&:nth-of-type(even)": {
      backgroundColor: alpha(theme.palette.primary.light, 0.04),
    },
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.light, 0.1),
      transition: "background-color 0.2s ease",
    },
    "&.Mui-selected": {
      backgroundColor: alpha(theme.palette.primary.light, 0.15),
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.light, 0.2),
      },
    },
  },
  "& .MuiDataGrid-footerContainer": {
    borderTop: "none",
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: theme.spacing(1.5, 2),
    display: "flex",
    justifyContent: "flex-end",
  },
  "& .MuiTablePagination-root": {
    color: theme.palette.text.secondary,
  },
  "& .MuiDataGrid-virtualScroller": {
    backgroundColor: "#ffffff",
  },
  "& .MuiCheckbox-root": {
    color: theme.palette.primary.main,
  },
  "& .MuiDataGrid-columnHeaderTitleContainer": {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  minWidth: 0,
  padding: "7px 10px",
  borderRadius: 8,
  transition: "all 0.3s ease",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    transform: "translateY(-2px) scale(1.05)",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
  },
  color: theme.palette.common.white,
  "& .MuiSvgIcon-root": {
    fontSize: "1.2rem",
  },
}));

const ServiciosTable: React.FC<ServiciosTableProps> = ({
  rows,
  searchTerm,
/*   onModify, */
  onDelete,
}): ReactElement => {
  const theme = useTheme();
  const [dollarOficial, setDollarOficial] = useState<number | null>(null);

  useEffect(() => {
    const storedDollar = localStorage.getItem("dollar_oficial");
    if (storedDollar) setDollarOficial(Number(storedDollar));
  }, []);

  const safeSearch = (value: unknown, searchTerm: string): boolean => {
    if (value === null || value === undefined) return false;
    return String(value).toLowerCase().includes(searchTerm.toLowerCase());
  };

  const filteredRows = React.useMemo(() => {
    if (!searchTerm.trim()) return rows;

    return rows.filter((row) => {
      try {
        const basicFieldsMatch =
          safeSearch(row.nombre, searchTerm) ||
          safeSearch(row.descripcion, searchTerm) ||
          safeSearch(row.precio_estandar_usd, searchTerm)
          
        const materialesMatch =
          Array.isArray(row.materialesUsados) &&
          row.materialesUsados.some(
            (material) => material && safeSearch(material.nombre, searchTerm)
          );

        return basicFieldsMatch || materialesMatch;
      } catch (error) {
        console.error("Error filtering row:", error, row);
        return false;
      }
    });
  }, [rows, searchTerm]);

const columns: GridColDef[] = [
  {
    field: "nombre",
    headerName: "Nombre",
    flex: 1.5,
    minWidth: 150,
    renderCell: (params) => (
      <Typography variant="body2" fontWeight={500}>
        {params.value || "N/A"}
      </Typography>
    ),
    headerAlign: "left",
    align: "left",
  },
  {
    field: "descripcion",
    headerName: "Descripción",
    flex: 2,
    minWidth: 200,
    renderCell: (params) => (
      <Tooltip title={params.value || ""}>
        <Typography variant="body2" noWrap>
          {params.value || "Sin descripción"}
        </Typography>
      </Tooltip>
    ),
    headerAlign: "left",
    align: "left",
  },

  // ✅ MATERIALES ASOCIADOS
  {
    field: "materialesUsados",
    headerName: "Materiales Asociados",
    flex: 1.5,
    minWidth: 200,
    renderCell: (params) => {
      const materiales = params.value;

      if (!Array.isArray(materiales) || materiales.length === 0) {
        return (
          <Typography variant="body2" color="text.secondary">
            Ninguno
          </Typography>
        );
      }

      const displayed = materiales.slice(0, 2);
      const remaining = materiales.length - displayed.length;

      return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {displayed.map((m, index) => (
            <Chip
              key={m.id || index}
              label={m.nombre}
              size="small"
              variant="outlined"
              color="success"
            />
          ))}
          {remaining > 0 && (
            <Chip label={`+${remaining}`} size="small" color="info" />
          )}
        </Box>
      );
    },
  },

  // ✅ PRODUCTOS ASOCIADOS
  {
    field: "productosAsociados",
    headerName: "Productos Asociados",
    flex: 1.5,
    minWidth: 200,
    renderCell: (params) => {
      const productos = params.value;

      if (!Array.isArray(productos) || productos.length === 0) {
        return (
          <Typography variant="body2" color="text.secondary">
            Ninguno
          </Typography>
        );
      }

      const displayed = productos.slice(0, 2);
      const remaining = productos.length - displayed.length;

      return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {displayed.map((p, index) => (
            <Chip
              key={p.id || index}
              label={p.nombre}
              size="small"
              variant="outlined"
              color="primary"
            />
          ))}
          {remaining > 0 && (
            <Chip label={`+${remaining}`} size="small" color="info" />
          )}
        </Box>
      );
    },
  },

  {
    field: "precio_estandar_usd",
    headerName: "Precio ($)",
    flex: 1,
    minWidth: 120,
    renderCell: (params) => {
      const precioUSD = Number(params.value) || 0;

      return (
        <Typography variant="body2" fontWeight={500}>
          ${formatNumber(precioUSD)}
        </Typography>
      );
    },
    headerAlign: "right",
    align: "right",
  },

  {
    field: "precio_estandar_bs",
    headerName: "Precio (Bs)",
    flex: 1,
    minWidth: 150,
    renderCell: (params) => {
      const precioUSD = Number(params.row.precio_estandar_usd) || 0;
      const precioBS = precioUSD * (dollarOficial || 0);

      return (
        <Typography variant="body2" fontWeight={500}>
          Bs. {formatNumber(precioBS)}
        </Typography>
      );
    },
    headerAlign: "left",
    align: "left",
  },

  {
    field: "acciones",
    headerName: "Acciones",
    flex: 0.8,
    minWidth: 150,
    headerAlign: "center",
    align: "center",
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Box display="flex" gap={1} justifyContent="center" alignItems="center">
       {/*  <Tooltip title="Editar servicio">
          <ActionButton
            variant="contained"
            onClick={() => onModify(params.row)}
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.9),
              "&:hover": { bgcolor: theme.palette.primary.main },
            }}
          >
            <EditIcon />
          </ActionButton>
        </Tooltip> */}

        <Tooltip title="Eliminar servicio">
          <ActionButton
            variant="contained"
            color="error"
            onClick={() => onDelete(params.row)}
            sx={{
              bgcolor: alpha(theme.palette.error.main, 0.9),
              "&:hover": { bgcolor: theme.palette.error.main },
            }}
          >
            <DeleteIcon />
          </ActionButton>
        </Tooltip>
      </Box>
    ),
  },
];

  return (
    <Paper
      elevation={0}
      sx={{
        height: 500,
        width: "100%",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)", // Sombra mejorada
        border: "1px solid rgba(0, 0, 0, 0.05)",
      }}
    >
      <StyledDataGrid
        rows={filteredRows}
        columns={columns}
        getRowId={(row) => row.id}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 10 } },
        }}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        density="comfortable"
        autoHeight={false}
        sx={{ height: "100%" }}
        loading={!rows.length}
        localeText={{
          noRowsLabel: "No hay servicios disponibles",
          noResultsOverlayLabel: "No se encontraron resultados",
        }}
      />
    </Paper>
  );
};

export default ServiciosTable;
