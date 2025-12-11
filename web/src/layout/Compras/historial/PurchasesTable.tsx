import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Typography, Paper, alpha } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Compra } from "../../../types/compras";

interface PurchasesTableProps {
  rows: Compra[];
  searchTerm: string;
}

const StyledPaper = styled(Paper)(() => ({
  height: 500,
  width: "100%",
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
  border: "1px solid rgba(0, 0, 0, 0.05)",
}));

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: "none",
  backgroundColor: "#ffffff",
  borderRadius: 12,
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
}));

const PurchasesTable: React.FC<PurchasesTableProps> = ({ rows, searchTerm }) => {
  const [dollarOficial, setDollarOficial] = useState<number>(0);

  useEffect(() => {
    const dollar = localStorage.getItem("dollar_oficial");
    if (dollar) setDollarOficial(Number(dollar));
  }, []);

  const filteredRows = React.useMemo(() => {
    if (!searchTerm.trim()) return rows;
    return rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [rows, searchTerm]);

  // 👇 columnas sin genérico <Compra>
  const columns: GridColDef[] = [
    {
      field: "proveedor",
      headerName: "Proveedor",
      flex: 1.2,
      minWidth: 160,
     renderCell: (params: GridRenderCellParams<Compra, unknown, unknown>) => (
  <Typography variant="body2" fontWeight={600}>
    {params.row.proveedor?.nombre || "—"}
  </Typography>
)
    },
    {
      field: "cantMateriales",
      headerName: "Materiales",
      flex: 0.8,
      minWidth: 120,
     renderCell: (params: GridRenderCellParams<Compra, unknown, unknown>) => (
        <Typography variant="body2">{params.row.materiales?.length ?? 0}</Typography>
      ),
    },
    {
      field: "cantProductos",
      headerName: "Productos",
      flex: 0.8,
      minWidth: 120,
     renderCell: (params: GridRenderCellParams<Compra, unknown, unknown>) => (
        <Typography variant="body2">{params.row.productos?.length ?? 0}</Typography>
      ),
    },
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 0.8,
      minWidth: 140,
     renderCell: (params: GridRenderCellParams<Compra, unknown, unknown>) => (
        <Typography variant="body2">
          {params.row.fecha ? new Date(params.row.fecha).toLocaleDateString("es-VE") : "—"}
        </Typography>
      ),
    },
    {
      field: "totalUsd",
      headerName: "USD",
      flex: 0.8,
      minWidth: 120,
           renderCell: (params: GridRenderCellParams<Compra, unknown, unknown>) =>{
        const totalUsd = params.row.totalUsd ?? 0;
        return (
          <Typography variant="body2" fontWeight={700} color="primary">
            {totalUsd.toLocaleString("en-US", { style: "currency", currency: "USD" })}
          </Typography>
        );
      },
    },
    {
      field: "totalBs",
      headerName: "Bs",
      flex: 0.8,
      minWidth: 120,
           renderCell: (params: GridRenderCellParams<Compra, unknown, unknown>) =>  {
        const totalUsd = params.row.totalUsd ?? 0;
        const totalBs = totalUsd * dollarOficial;
        return (
          <Typography variant="body2" fontWeight={700} color="secondary">
            {totalBs.toLocaleString("es-VE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            Bs
          </Typography>
        );
      },
    },
  ];

  return (
    <StyledPaper>
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
        sx={{ height: "100%" }}
        loading={!rows.length}
        localeText={{
          noRowsLabel: "No hay compras registradas",
          noResultsOverlayLabel: "No se encontraron resultados",
        }}
      />
    </StyledPaper>
  );
};

export default PurchasesTable;