"use client";

import React from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {  Tooltip, Typography, Paper,  alpha } from "@mui/material";
import { styled } from "@mui/material/styles";

// === Props ===
interface SalesTableProps {
  rows: Array<{
    id: number;
    cliente: string;
    rif: string;
    totalBs: number;
    totalUsd: number;
    cantProductos: number;
    cantServicios: number;
    fecha: string;
    tipo: string;
    nota: string;
  }>;
  searchTerm: string;
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

const SalesTable: React.FC<SalesTableProps> = ({ rows, searchTerm }) => {

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
      field: "cliente",
      headerName: "Cliente",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "rif",
      headerName: "RIF",
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          {params.value}
        </Typography>
      ),
    },
{
  field: "totalBs",
  headerName: "Total Bs",
  flex: 0.8,
  minWidth: 120,
  renderCell: (params) => {
    const formatterBs = new Intl.NumberFormat("es-VE", {
      style: "currency",
      currency: "VES",
      minimumFractionDigits: 2,
    });
    return (
      <Typography
        variant="body2"
        fontWeight={600}
        sx={{ color: "primary.main" }}
      >
        {formatterBs.format(params.value)}
      </Typography>
    );
  },
},
{
  field: "totalUsd",
  headerName: "Total USD",
  flex: 0.8,
  minWidth: 120,
  renderCell: (params) => {
    const formatterUsd = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
    return (
      <Typography
        variant="body2"
        fontWeight={600}
        sx={{ color: "success.main" }}
      >
        {formatterUsd.format(params.value)}
      </Typography>
    );
  },
},
    {
      field: "cantProductos",
      headerName: "Cant. Productos",
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2">{params.value}</Typography>
      ),
    },
    {
      field: "cantServicios",
      headerName: "Cant. Servicios",
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2">{params.value}</Typography>
      ),
    },
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Typography variant="body2">{params.value}</Typography>
      ),
    },
    {
      field: "tipo",
      headerName: "Tipo",
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2">{params.value}</Typography>
      ),
    },
    {
      field: "nota",
      headerName: "Nota",
      flex: 1.2,
      minWidth: 180,
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
            {params.value || "—"}
          </Typography>
        </Tooltip>
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
        loading={!rows.length}
        localeText={{
          noRowsLabel: "No hay registros disponibles",
          noResultsOverlayLabel: "No se encontraron resultados",
        }}
      />
    </Paper>
  );
};

export default SalesTable;