import React, { useState } from "react";
import { Box, Typography, CircularProgress, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

import {
  StyledModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  StyledButton,
} from "../theme/StyleModalDelete"; // Corrected import path, assuming StyleModalDelete is now part of StyledModalComponents
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import UserServices from "../../../api/UserSevices"; // Corrected import from UserSevices to UserServices
import { UserDto } from "../interface/user.dto";

// Adjusted props for the delete modal
interface TecnicoDeleteModalProps {
  open: boolean;
  onClose: () => void;
  tecnico: UserDto | null; // technician to be deleted
  onDeleteSuccess: (message: string) => void; // Callback for successful deletion
  onDeleteError: (message: string) => void; // Callback for deletion error
}

const TecnicoDelete: React.FC<TecnicoDeleteModalProps> = ({
  open,
  onClose,
  tecnico,
  onDeleteSuccess,
  onDeleteError,
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  // If no technician is provided, don't render the modal content
  if (!open || !tecnico) {
    return null;
  }

  const tecnicoNombreCompleto = `${tecnico.nombre || ""} ${
    tecnico.apellido || ""
  }`.trim();
  const displayTecnicoName =
    tecnicoNombreCompleto || tecnico.username || "este técnico"; // Fallback for display

  const handleDeleteConfirm = async () => {
    // Log the entire tecnico object to the console
    console.log("JSON completo del técnico a eliminar:", tecnico);

    // Ensure the technician object has an ID before proceeding
    if (tecnico.id === undefined || tecnico.id === null) {
      onDeleteError(
        "Error: No se pudo obtener el ID del técnico para eliminar."
      );
      console.error("Attempted to delete a technician without an ID:", tecnico);
      return;
    }

    setLoading(true);
    try {
      // Call the deleteUser service with the technician's ID
      await UserServices.deleteUser(tecnico.id);
      onDeleteSuccess(
        `Técnico '${displayTecnicoName}' eliminado correctamente.`
      );
      onClose(); // Close modal on successful deletion
    } catch (error) {
      console.error("Error deleting technician:", error);
      let errorMessage = "Error de conexión al eliminar el técnico.";
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
              Eliminar Técnico
            </Typography>
            <IconButton onClick={onClose} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </ModalHeader>
        <ModalBody sx={{ textAlign: "center", py: 4 }}>
          <ReportProblemOutlinedIcon
            sx={{
              fontSize: 60,
              color: theme.palette.error.main,
              mb: 2,
            }}
          />
          <Typography variant="h6" gutterBottom>
            ¿Estás seguro de que quieres eliminar a
          </Typography>
          <Typography
            variant="h5"
            color="text.primary"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            {displayTecnicoName}?
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
            startIcon={
              loading && <CircularProgress size={20} color="inherit" />
            }
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </StyledButton>
        </ModalFooter>
      </ModalContent>
    </StyledModal>
  );
};

export default TecnicoDelete;
