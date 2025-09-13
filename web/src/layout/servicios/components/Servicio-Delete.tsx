import React, { useState } from "react";
import { Box, Typography, CircularProgress, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import { ServicioDTO } from "../../../Dto/Servicio.dto";
import {
  ModalBody,
  ModalContent,
  ModalHeader,
  StyledModal,
} from "../../Technics/theme/StyleModalDelete";
import {
  ModalFooter,
  StyledButton,
} from "../../../theme/StyledModalComponents";
import ServiciosServices from "../../../api/ServiciosServices";

interface ServicioDeleteModalProps {
  open: boolean;
  onClose: () => void;
  servicio: ServicioDTO | null;
  onDeleteSuccess: (message: string) => void;
  onDeleteError: (message: string) => void;
}

const ServicioDelete: React.FC<ServicioDeleteModalProps> = ({
  open,
  onClose,
  servicio,
  onDeleteSuccess,
  onDeleteError,
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  if (!open || !servicio) {
    return null;
  }

  const handleDeleteConfirm = async () => {
    if (servicio.id === undefined || servicio.id === null) {
      onDeleteError(
        "Error: No se pudo obtener el ID del servicio para eliminar."
      );
      return;
    }

    setLoading(true);
    try {
      await ServiciosServices.deleteServicio(servicio.id);
      onDeleteSuccess(`Servicio '${servicio.nombre}' eliminado correctamente.`);
      onClose();
    } catch (error) {
      console.error("Error deleting service:", error);
      let errorMessage = "Error de conexión al eliminar el servicio.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      onDeleteError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledModal open={open} onClose={onClose}>
      <ModalContent>
        <ModalHeader sx={{ background: theme.palette.error.main }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" color="white">
              Eliminar Servicio
            </Typography>
            <IconButton onClick={onClose} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </ModalHeader>
        <ModalBody sx={{ textAlign: "center", py: 4 }}>
          <ReportProblemOutlinedIcon
            sx={{ fontSize: 60, color: theme.palette.error.main, mb: 2 }}
          />
          <Typography variant="h6" gutterBottom>
            ¿Estás seguro de que quieres eliminar el servicio
          </Typography>
          <Typography
            variant="h5"
            color="text.primary"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            {servicio.nombre}?
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Esta acción no se puede deshacer.
          </Typography>
        </ModalBody>
        <ModalFooter>
          <StyledButton
            variant="outlined"
            color="primary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </StyledButton>
          <StyledButton
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Eliminar"
            )}
          </StyledButton>
        </ModalFooter>
      </ModalContent>
    </StyledModal>
  );
};

export default ServicioDelete;
