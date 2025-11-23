import React from "react";
import {
  Box,
  Chip,
  Paper,
  Tooltip,
  Typography,
  useTheme,
  alpha,
  Button,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import { UserDto } from "../../Technics/interface/user.dto";

// Styled DataGrid para look moderno
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
    "& .MuiDataGrid-columnSeparator": { color: "rgba(255, 255, 255, 0.2)" },
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
  },
  "& .MuiDataGrid-row": {
    "&:nth-of-type(even)": { backgroundColor: alpha(theme.palette.primary.light, 0.04) },
    "&:hover": { backgroundColor: alpha(theme.palette.primary.light, 0.1) },
    "&.Mui-selected": { backgroundColor: alpha(theme.palette.primary.light, 0.15) },
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

const ActionButton = styled(Button)(({ theme }) => ({
  minWidth: 0,
  padding: "7px 10px",
  borderRadius: 8,
  transition: "all 0.2s ease",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  "&:hover": { transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" },
  color: theme.palette.common.white,
  "& .MuiSvgIcon-root": { fontSize: "1.2rem" },
}));

interface PersonalTableProps {
  personal: UserDto[];
  onModify: (user: UserDto) => void;
  onDelete: (user: UserDto) => void;
}

export const PersonalTable: React.FC<PersonalTableProps> = ({
  personal,
  onModify,
  onDelete,
}) => {
  const theme = useTheme();

  const columns: GridColDef[] = [
    {
      field: "nombre",
      headerName: "Nombre",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => <Typography>{params.value}</Typography>,
    },
    {
      field: "apellido",
      headerName: "Apellido",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => <Typography>{params.value}</Typography>,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
      minWidth: 180,
      renderCell: (params) => <Typography>{params.value}</Typography>,
    },
    {
      field: "phone",
      headerName: "Teléfono",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => <Typography>{params.value}</Typography>,
    },
    {
      field: "role",
      headerName: "Rol",
      flex: 0.8,
      minWidth: 90,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Chip
            label={params.value}
            color={params.value === "administrador" ? "secondary" : "primary"}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>
      ),
      headerAlign: "center",
      align: "center",
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 0.8,
      minWidth: 150,
      sortable: false,
      filterable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box display="flex" gap={1} justifyContent="center" alignItems="center">
          <Tooltip title="Editar personal">
            <ActionButton
              variant="contained"
              color="primary"
              onClick={() => onModify(params.row)}
              sx={{ bgcolor: alpha(theme.palette.primary.main, 0.9), "&:hover": { bgcolor: theme.palette.primary.main } }}
            >
              <EditIcon />
            </ActionButton>
          </Tooltip>
          <Tooltip title="Eliminar personal">
            <ActionButton
              variant="contained"
              color="error"
              onClick={() => onDelete(params.row)}
              sx={{ bgcolor: alpha(theme.palette.error.main, 0.9), "&:hover": { bgcolor: theme.palette.error.main } }}
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
      sx={{ height: 500, width: "100%", borderRadius: 3, overflow: "hidden", boxShadow: "0 6px 30px rgba(0,0,0,0.1)" }}
    >
      <StyledDataGrid
        rows={personal}
        columns={columns}
        getRowId={(row) => row.id} // ID único
        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        density="comfortable"
        autoHeight={false}
      />
    </Paper>
  );
};

export default PersonalTable;
