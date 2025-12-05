import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Fade,
  Divider,
  IconButton,
  InputAdornment,
  Tooltip,
  useTheme,
  alpha,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { UserDto } from "../Technics/interface/user.dto";
import { SearchTextField, StyledPaper } from "../../theme/StyledComponents";
import { UserLock } from "lucide-react";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import SaveButton from "../../components/global/Button/Save";
import HeaderSection from "../../components/global/Header/header";
import UserServices from "../../api/UserSevices";
import PersonalTable from "./components/PersonalTable";
import ConfirmModal from "../../components/global/modal/ConfirmModal";
import { useSnackbar } from "../../components/context/SnackbarContext";
import PersonalAdd from "./components/Personal-add";
import { SelectChangeEvent } from "@mui/material";
import PersonalUpdate from "./components/Personal-update";

export function Personal() {
  const theme = useTheme();
  const { showSnackbar } = useSnackbar();

  const [personal, setPersonal] = useState<UserDto[]>([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedPersonal, setSelectedPersonal] = useState<UserDto | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [personalToDelete, setPersonalToDelete] = useState<UserDto | null>(null);

  useEffect(() => {
    fetchPersonal();
  }, []);

  const fetchPersonal = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await UserServices.getAll();
      const data = res.data ?? [];
      setPersonal(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error desconocido al obtener personal.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

const handleFilterRole = (event: SelectChangeEvent<string>) => {
  setRoleFilter(event.target.value);
};

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);

  const handleOpenUpdateModal = (user: UserDto) => {
    setSelectedPersonal(user);
    setOpenUpdateModal(true);
  };
  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
    setSelectedPersonal(null);
  };

  const handleDelete = (user: UserDto) => {
    setPersonalToDelete(user);
    setOpenDeleteModal(true);
  };

  
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setPersonalToDelete(null);
  };
  const handleDeleteConfirm = async () => {
    if (!personalToDelete?.id) return;
    setLoading(true);
    try {
      await UserServices.deleteUser(personalToDelete.id);
      showSnackbar(`Personal '${personalToDelete.nombre}' eliminado`, "success");
      fetchPersonal();
      handleCloseDeleteModal();
    } catch (err) {
      console.error(err);
      showSnackbar("Error eliminando personal", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredPersonal = personal
    .filter((p) =>
      Object.values(p)
        .some((v) => v && String(v).toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter((p) => roleFilter === "all" || p.role === roleFilter);

  return (
  <Container maxWidth="xl" sx={{ py: 4 }}>
          <Fade in={true} timeout={800}>
        <Box>
            <HeaderSection
            title="Lista de Personal"
            icon={<UserLock />}
            chipLabel={`${personal.length} Personal`}
          />
          <StyledPaper>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <SearchTextField
                placeholder="Buscar por nombre, apellido, usuario, email o teléfono..."
                variant="outlined"
                value={searchTerm}
                fullWidth
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <UserLock />
                    </InputAdornment>
                  ),
                }}
                sx={{ maxWidth: 500, bgcolor: "white" }}
              />
            <Box display="flex" alignItems="center" gap={1}>
                <FormControl variant="outlined" size="small">
                  <InputLabel>Filtrar por rol</InputLabel>
                  <Select
                    value={roleFilter}
                    onChange={handleFilterRole}
                    label="Filtrar por rol"
                    sx={{ minWidth: 150, bgcolor: "white" }}
                    >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="administrador">Administrador</MenuItem>
                    <MenuItem value="gerente">Gerente</MenuItem>
                    </Select>
                </FormControl>

                <Tooltip title="Actualizar tabla">
                  <IconButton
                    onClick={fetchPersonal}
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.2) },
                    }}
                  >
                    <RefreshIcon color="primary" />
                  </IconButton>
                </Tooltip>

                <SaveButton
                  startIcon={<AddIcon />}
                  texto="Añadir Personal"
                  onClick={handleOpenAddModal}
                />
                </Box>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <PersonalTable
              personal={filteredPersonal}
              onModify={handleOpenUpdateModal}
              onDelete={handleDelete}
            />
          </StyledPaper>

          <PersonalAdd
            open={openAddModal}
            onClose={handleCloseAddModal}
            onPersonalAdded={fetchPersonal}
          />
          <PersonalUpdate
            open={openUpdateModal}
            onClose={handleCloseUpdateModal}
            selectedPersonal={selectedPersonal}
            onPersonalUpdated={fetchPersonal}
          />
          <ConfirmModal
            open={openDeleteModal}
            onClose={handleCloseDeleteModal}
            onConfirm={handleDeleteConfirm}
          />
        
        </Box>
      </Fade>
    </Container>
  );
}

export default Personal;