// src/pages/Proveedor/components/Proveedor-tabla.tsx
import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";

import {
  Box,
  Button,
  Tooltip,
  Paper,
  useTheme,
  alpha,
  Typography,
  TablePagination,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ProveedorDto } from "../../../Dto/Proveedor.dto"; // Ensure correct path

interface ProveedorTableProps {
  rows: ProveedorDto[];
  searchTerm: string; // Not directly used in the table, but passed from parent
  onModify: (proveedor: ProveedorDto) => void;
  totalItems: number;
  currentPage: number; // This is 1-indexed from the parent
  itemsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number // TablePagination gives 0-indexed page
  ) => void;
  onItemsPerPageChange: (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
}

// Styled components (retained from MaterialTable for consistency)
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: "none",
  backgroundColor: "#ffffff",
  borderRadius: 12,
  boxShadow: "0 6px 30px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",

  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: theme.palette.primary.main,
    fontSize: "0.95rem",
    fontWeight: 600,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    "& .MuiDataGrid-columnSeparator": {
      color: "rgba(255, 255, 255, 0.2)",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
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
    display: "none", // Explicitly hide DataGrid's internal footer elements
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
  transition: "all 0.2s ease",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  color: theme.palette.common.white,
  "& .MuiSvgIcon-root": {
    fontSize: "1.2rem",
  },
}));

const ProveedorTable: React.FC<ProveedorTableProps> = ({
  rows,
  searchTerm, // This prop is correctly passed but not directly used for filtering here.
  onModify,
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const theme = useTheme();
  const filteredRows = rows.filter((row) =>
    Object.values(row).some(
      (value) =>
        value && String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const columns: GridColDef[] = [
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          {params.value}
        </Typography>
      ),
      headerAlign: "left",
      align: "left",
    },
    {
      field: "telefono",
      headerName: "Teléfono",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          {params.value || "-"} {/* Display "-" if null */}
        </Typography>
      ),
      headerAlign: "left",
      align: "left",
    },
    {
      field: "direccion",
      headerName: "Dirección",
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          {params.value || "-"} {/* Display "-" if null */}
        </Typography>
      ),
      headerAlign: "left",
      align: "left",
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.7,
      headerAlign: "center",
      align: "center",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1} justifyContent="center" alignItems="center">
          <Tooltip title="Editar proveedor">
            <ActionButton
              variant="contained"
              color="primary"
              size="small"
              onClick={() => onModify(params.row)}
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.9),
                "&:hover": {
                  bgcolor: theme.palette.primary.main,
                },
              }}
            >
              <EditIcon />
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
        boxShadow: "0 6px 30px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <StyledDataGrid
        rows={filteredRows} // DataGrid displays the paginated and filtered rows directly
        columns={columns}
        getRowId={(row) => row.id} // Ensure 'id' is the unique key
        paginationMode="server" // Still tell DataGrid pagination is external, even if client-side is handling slice
        rowCount={totalItems} // Crucial: Total count of items after filtering (from parent)
        // DataGrid's paginationModel expects 0-indexed page, so adjust currentPage
        paginationModel={{ page: currentPage - 1, pageSize: itemsPerPage }}
        disableRowSelectionOnClick
        density="comfortable"
        hideFooterPagination={true} // Hide DataGrid's default pagination as we're using TablePagination
        sx={{ flexGrow: 1 }} // Allows DataGrid to take available space
      />
      {/* Custom TablePagination Footer */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end", // Align to the right
          alignItems: "center",
          py: 1.5,
          px: 2, // Consistent horizontal padding
          bgcolor: alpha(theme.palette.primary.main, 0.04), // Subtle background
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          minHeight: 52, // Ensure minimum height for the footer
        }}
      >
        <TablePagination
          component="div" // Render as a div
          count={totalItems} // Total number of items from the server (or filtered total)
          page={currentPage - 1} // Current page (TablePagination expects 0-indexed)
          onPageChange={onPageChange} // Handler for page change (from TablePagination)
          rowsPerPage={itemsPerPage} // Current items per page
          onRowsPerPageChange={onItemsPerPageChange} // Handler for rows per page change (from TablePagination)
          rowsPerPageOptions={[5, 10, 25, 50]} // Options for rows per page dropdown
          labelRowsPerPage="Filas por página:" // Custom label
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          } // Custom display label
        />
      </Box>
    </Paper>
  );
};

export default ProveedorTable;
