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
  boxShadow: "0 6px 30px rgba(0, 0, 0, 0.1)", // Subtle but more pronounced shadow
  transition: "all 0.3s ease",

  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: theme.palette.primary.main,
    fontSize: "0.95rem", // Larger font size for headers
    fontWeight: 600,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    "& .MuiDataGrid-columnSeparator": {
      color: "rgba(255, 255, 255, 0.2)",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: 700,
      textTransform: "uppercase", // Uppercase text
      letterSpacing: "0.05em", // Letter spacing
    },
    "& .MuiDataGrid-columnHeaderTitleContainer": {
      display: "flex",
      justifyContent: "flex-start", // Align header text to start
      alignItems: "center",
    },
  },

  "& .MuiDataGrid-cell": {
    borderBottom: "1px solid rgba(224, 224, 224, 0.4)",
    fontSize: "0.9rem", // Larger font size for cells
    padding: "12px 16px", // More padding for spacious design
    display: "flex", // Ensure content aligns correctly
    alignItems: "center", // Vertically center cell content
    "&:focus": {
      outline: "none",
    },
    "&:focus-within": {
      outline: "none",
    },
  },

  "& .MuiDataGrid-row": {
    "&:nth-of-type(even)": {
      backgroundColor: alpha(theme.palette.primary.light, 0.04), // Lighter alpha for even rows
    },
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.light, 0.1), // Slightly more opaque on hover
      transition: "background-color 0.2s ease",
    },
    "&.Mui-selected": {
      backgroundColor: alpha(theme.palette.primary.light, 0.15), // Slightly more opaque when selected
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
    padding: theme.spacing(1.5, 2), // More padding
    display: "flex",
    justifyContent: "flex-end", // Align paginator to the right
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

const ActionButton = styled(Button)(({ theme }) => ({
  minWidth: 0,
  padding: "7px 10px", // Adjusted padding for slightly larger icons
  borderRadius: 8,
  transition: "all 0.2s ease",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  color: theme.palette.common.white, // Ensure icon color is white
  "& .MuiSvgIcon-root": {
    fontSize: "1.2rem", // Slightly larger icons
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
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          {params.value}
        </Typography>
      ),
      headerAlign: "left",
      align: "left",
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
      headerAlign: "left",
      align: "left",
    },
    {
      field: "apellido",
      headerName: "Apellido",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography variant="body2">{params.value || "—"}</Typography>
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
      headerAlign: "left",
      align: "left",
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
      headerAlign: "left",
      align: "left",
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
          justifyContent="center" // Ensures horizontal centering
          alignItems="center" // Ensures vertical centering
          sx={{ width: "100%", height: "100%" }} // Make the Box fill the cell
        >
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
              <EditIcon />
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
        density="comfortable"
        autoHeight={false}
        sx={{ height: "100%" }}
      />
    </Paper>
  );
};

export default ClientTable;
