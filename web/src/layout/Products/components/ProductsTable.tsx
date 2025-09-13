import type React from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
//import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
//import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
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

interface ProductTableProps {
  rows: Array<{
    id: number;
    nombre: string;
    descripcion: string;
    stock: number;
    precio_unitario: number;
    precio_usd: number;
  }>;
  searchTerm: string;
  onModify: (row: {
    id: number;
    nombre: string;
    descripcion: string;
    stock: number;
    precio_unitario: number;
    precio_usd: number;
  }) => void;
  onDelete: (id: number) => void;
  onModifyStock: (id: number) => void;
  onModifyPrice: (id: number) => void;
}

// Styled components for enhanced visual design
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: "none",
  backgroundColor: "#ffffff",
  borderRadius: 12,
  boxShadow: "0 6px 30px rgba(0, 0, 0, 0.1)", // Sutilmente más pronunciado para un look premium
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
      letterSpacing: "0.05em", // Añade un poco de espaciado entre letras
    },
  },

  "& .MuiDataGrid-cell": {
    borderBottom: "1px solid rgba(224, 224, 224, 0.4)",
    fontSize: "0.9rem",
    padding: "12px 16px", // Más padding para un diseño más espacioso
    display: "flex", // Asegura que el contenido se alinee correctamente
    alignItems: "center", // Centra verticalmente el contenido de la celda
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
      backgroundColor: alpha(theme.palette.primary.light, 0.1), // Ligeramente más opaco al hover
      transition: "background-color 0.2s ease",
    },
    "&.Mui-selected": {
      backgroundColor: alpha(theme.palette.primary.light, 0.15), // Ligeramente más opaco al seleccionar
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
    padding: theme.spacing(1.5, 2), // Más padding
    display: "flex", // Asegura la alineación del paginador
    justifyContent: "flex-end", // Alinea el paginador a la derecha
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
  padding: "7px 10px", // Ajustado padding para iconos más grandes
  borderRadius: 8,
  transition: "all 0.2s ease",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  color: theme.palette.common.white,
  "& .MuiSvgIcon-root": {
    fontSize: "1.2rem", // Iconos ligeramente más grandes
  },
}));

const ProductTable: React.FC<ProductTableProps> = ({
  rows,
  searchTerm,
  onModify,
  onDelete,
  /*onModifyStock,
  onModifyPrice,*/
}) => {
  const theme = useTheme();

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const columns: GridColDef[] = [
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1.2,
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
      field: "descripcion",
      headerName: "Descripción",
      flex: 2,
      minWidth: 100,
      renderCell: (params) => (
        <Tooltip title={params.value} placement="top-start">
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "100%", // Asegura que ocupe el 100% del ancho disponible para que el ellipsis funcione
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
      field: "stock",
      headerName: "Stock",
      type: "number",
      flex: 0.8,
      minWidth: 90,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Chip
            label={params.value}
            color={
              params.value > 10
                ? "success"
                : params.value > 0
                ? "warning"
                : "error"
            }
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>
      ),
      headerAlign: "center",
      align: "center", // Mantenemos la alineación de la celda central
    },
    {
      field: "precio_unitario",
      headerName: "Precio Unitario (Bs)",
      type: "number",
      flex: 1,
      minWidth: 250,
      valueFormatter: (value) => {
        return new Intl.NumberFormat("es-VE", {
          style: "currency",
          currency: "VES",
          minimumFractionDigits: 2,
        }).format(value as number);
      },
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          {new Intl.NumberFormat("es-VE", {
            style: "currency",
            currency: "VES",
            minimumFractionDigits: 2,
          }).format(params.value as number)}
        </Typography>
      ),
      headerAlign: "right",
      align: "right",
    },
    {
      field: "precio_usd",
      headerName: "Precio (USD)",
      type: "number",
      flex: 1,
      minWidth: 130,
      valueFormatter: (value) => {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
        }).format(value as number);
      },
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
          }).format(params.value as number)}
        </Typography>
      ),
      headerAlign: "right",
      align: "right",
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 1.5,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1} justifyContent="center" alignItems="center">
          <Tooltip title="Editar producto">
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

          <Tooltip title="Eliminar producto">
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
          {/* 
          <Tooltip title="Modificar Stock">
            <ActionButton
              variant="contained"
              color="info"
              size="small"
              onClick={() => onModifyStock(params.row.id)}
              sx={{
                bgcolor: alpha(theme.palette.info.main, 0.9),
                "&:hover": {
                  bgcolor: theme.palette.info.main,
                },
              }}
            >
              <Inventory2OutlinedIcon />{" "}
            </ActionButton>
          </Tooltip>

          <Tooltip title="Modificar Precio">
            <ActionButton
              variant="contained"
              color="success"
              size="small"
              onClick={() => onModifyPrice(params.row.id)}
              sx={{
                bgcolor: alpha(theme.palette.success.main, 0.9),
                "&:hover": {
                  bgcolor: theme.palette.success.main,
                },
              }}
            >
              <AttachMoneyOutlinedIcon />{" "}
            </ActionButton>
          </Tooltip>
          */}
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

export default ProductTable;
