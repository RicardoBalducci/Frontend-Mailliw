"use client";

import React from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Tooltip,
  Typography,
  Paper,
  useTheme,
  alpha,
} from "@mui/material";
import { styled } from "@mui/material/styles";

interface ClientTableProps {
  rows: Array<{
    id: number;
    rif: string;
    nombre: string;
    apellido: string;
    direccion: string;
    telefono: string;
  }>;
  searchTerm: string;
  onModify: (row: {
    id: number;
    rif: string;
    nombre: string;
    apellido: string;
    direccion: string;
    telefono: string;
  }) => void;
  onDelete: (id: number) => void;
}

// === Styled DataGrid ===
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: "none",
  backgroundColor: "#ffffff",
  borderRadius: 12,
  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
  transition: "all 0.3s ease",

  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#ffffff",
    color: "#000000",
    fontSize: "0.9rem",
    fontWeight: 700,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    "& .MuiDataGrid-columnSeparator": {
      color: alpha(theme.palette.common.black, 0.1),
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
    "&:focus, &:focus-within": { outline: "none" },
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
      "&:hover": { backgroundColor: alpha(theme.palette.primary.light, 0.2) },
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
}));

// === Styled Action Buttons ===
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

const ClientTable: React.FC<ClientTableProps> = ({
  rows,
  searchTerm,
  onModify,
  onDelete,
}) => {
  const theme = useTheme();

  const filteredRows = React.useMemo(() => {
    if (!searchTerm.trim()) return rows;
    return rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [rows, searchTerm]);

  const columns: GridColDef[] = [
    {
      field: "rif",
      headerName: "D.I.",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "apellido",
      headerName: "Apellido",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2">{params.value || "—"}</Typography>
      ),
    },
    {
      field: "direccion",
      headerName: "Dirección",
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => (
        <Tooltip title={params.value} placement="top-start">
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "100%",
            }}
          >
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "telefono",
      headerName: "Teléfono",
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.7,
      minWidth: 110,
      headerAlign: "center",
      align: "center",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box
          display="flex"
          gap={1}
          justifyContent="center"
          alignItems="center"
          sx={{ width: "100%", height: "100%" }}
        >
          <Tooltip title="Editar cliente">
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
          </Tooltip>

          <Tooltip title="Eliminar cliente">
            <ActionButton
              variant="contained"
              color="error"
              onClick={() => onDelete(params.row.id)}
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
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
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
        loading={!rows.length} // ✅ Skeleton activo mientras carga
        localeText={{
          noRowsLabel: "No hay clientes disponibles",
          noResultsOverlayLabel: "No se encontraron resultados",
        }}
      />
    </Paper>
  );
};

export default ClientTable;
