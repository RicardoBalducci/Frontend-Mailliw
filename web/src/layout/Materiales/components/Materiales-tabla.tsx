import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
import { MaterialesDto } from "../../../Dto/Materiales.dto";

interface MaterialTableProps {
  rows: MaterialesDto[];
  searchTerm: string;
  onModify: (material: MaterialesDto) => void;
  onDelete: (id: number, name: string) => void;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => void;
  onItemsPerPageChange: (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
}

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
    display: "none",
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

const MaterialTable: React.FC<MaterialTableProps> = ({
  rows,
  searchTerm,
  onModify,
  onDelete,
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const theme = useTheme();

  const [dollarOficial, setDollarOficial] = useState<number | null>(null);

  useEffect(() => {
    const storedDollar = localStorage.getItem("dollar_oficial");

    if (storedDollar) setDollarOficial(Number(storedDollar));
  }, []);
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
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          {params.value}
        </Typography>
      ),
      headerAlign: "left",
      align: "left",
    },
    {
      field: "descripcion",
      headerName: "Descripción",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          {params.value}
        </Typography>
      ),
      headerAlign: "left",
      align: "left",
    },
    {
      field: "precio_unitario_usd",
      headerName: "Precio (USD)",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const precioUSD = Number(params.value);
        const formatted = new Intl.NumberFormat("es-VE", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(precioUSD);

        return (
          <Typography variant="body2" fontWeight={500}>
            {formatted} {/* Ej: $1.234,56 */}
          </Typography>
        );
      },
      headerAlign: "left",
      align: "left",
    },
    {
      field: "precio_unitario_bs",
      headerName: "Precio (Bs)",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const precioUSD = Number(params.row.precio_unitario_usd);
        const precioBS = precioUSD * (dollarOficial || 0);

        const formatted = new Intl.NumberFormat("es-VE", {
          style: "currency",
          currency: "VES", // Bolívar Soberano
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(precioBS);

        return (
          <Typography variant="body2" fontWeight={500}>
            {formatted} {/* Ej: Bs. 1.000.000,00 */}
          </Typography>
        );
      },
      headerAlign: "left",
      align: "left",
    },

    {
      field: "stock",
      headerName: "Cantidad",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          {params.value}
        </Typography>
      ),
      headerAlign: "left",
      align: "left",
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1} justifyContent="center" alignItems="center">
          <Tooltip title="Editar material">
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
          <Tooltip title="Eliminar material">
            <ActionButton
              variant="contained"
              color="error"
              size="small"
              onClick={() => onDelete(params.row.id, params.row.nombre)}
              sx={{
                bgcolor: alpha(theme.palette.error.main, 0.9),
                "&:hover": {
                  bgcolor: theme.palette.error.main,
                },
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
        boxShadow: "0 6px 30px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <StyledDataGrid
        rows={filteredRows}
        columns={columns}
        getRowId={(row) => row.id}
        paginationMode="server"
        rowCount={totalItems}
        paginationModel={{ page: currentPage - 1, pageSize: itemsPerPage }}
        disableRowSelectionOnClick
        density="comfortable"
        hideFooterPagination
        sx={{ flexGrow: 1 }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          py: 1.5,
          px: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          minHeight: 52,
        }}
      >
        <TablePagination
          component="div"
          count={totalItems}
          page={currentPage - 1}
          onPageChange={onPageChange}
          rowsPerPage={itemsPerPage}
          onRowsPerPageChange={onItemsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </Box>
    </Paper>
  );
};

export default MaterialTable;
