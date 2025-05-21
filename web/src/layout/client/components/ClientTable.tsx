import type React from "react";
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

// Styled components for enhanced visual design
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: "none",
  backgroundColor: "#ffffff",
  borderRadius: 12,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease",

  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: theme.palette.primary.main,
    fontSize: "0.875rem",
    fontWeight: 600,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    "& .MuiDataGrid-columnSeparator": {
      color: "rgba(255, 255, 255, 0.2)",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: 700,
    },
  },

  "& .MuiDataGrid-cell": {
    borderBottom: "1px solid rgba(224, 224, 224, 0.4)",
    fontSize: "0.875rem",
    padding: "8px 10px", // Reducir el padding
    "&:focus": {
      outline: "none",
    },
    "&:focus-within": {
      outline: "none",
    },
  },

  "& .MuiDataGrid-row": {
    "&:nth-of-type(even)": {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
    },
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
      transition: "background-color 0.2s ease",
    },
    "&.Mui-selected": {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.16),
      },
    },
  },

  "& .MuiDataGrid-footerContainer": {
    borderTop: "none",
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
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
}));

const ActionButton = styled(Button)(() => ({
  minWidth: 0,
  padding: "4px 6px", // Reducir el padding
  borderRadius: 8,
  transition: "all 0.2s ease",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
}));

const ClientTable: React.FC<ClientTableProps> = ({
  rows,
  searchTerm,
  onModify,
  onDelete,
}) => {
  const theme = useTheme();

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const columns: GridColDef[] = [
    {
      field: "rif",
      headerName: "RIF",
      width: 100, // Ajustar el ancho
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "nombre",
      headerName: "Nombre",
      width: 120, // Ajustar el ancho
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "apellido",
      headerName: "Apellido",
      width: 120, // Ajustar el ancho
      renderCell: (params) => (
        <Typography variant="body2">{params.value || "—"}</Typography>
      ),
    },
    {
      field: "direccion",
      headerName: "Dirección",
      width: 200, // Ajustar el ancho
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
      width: 120, // Ajustar el ancho
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 150, // Ajustar el ancho
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box display="flex" gap={1} justifyContent="center">
          <Tooltip title="Editar cliente">
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
              <EditIcon fontSize="small" />
            </ActionButton>
          </Tooltip>

          <Tooltip title="Eliminar cliente">
            <ActionButton
              variant="contained"
              color="error"
              size="small"
              onClick={() => onDelete(params.row.id)}
              sx={{
                bgcolor: alpha(theme.palette.error.main, 0.9),
                "&:hover": {
                  bgcolor: theme.palette.error.main,
                },
              }}
            >
              <DeleteIcon fontSize="small" />
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
      }}
    >
      <StyledDataGrid
        rows={filteredRows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        density="standard"
        autoHeight={false}
        sx={{ height: "100%" }}
      />
    </Paper>
  );
};

export default ClientTable;
