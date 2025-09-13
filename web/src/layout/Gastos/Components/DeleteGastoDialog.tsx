"use client";

import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  useTheme,
  Avatar, // Added Avatar for the warning icon
  Divider, // Added Divider for visual separation
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber"; // Changed to WarningAmberIcon for consistency
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"; // Changed to DeleteForeverIcon for consistency
import CancelIcon from "@mui/icons-material/Cancel"; // Added CancelIcon for the cancel button
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn"; // Specific icon for Gastos
import { alpha } from "@mui/material/styles"; // Import alpha for color manipulation

interface DeleteGastoDialogProps {
  open: boolean;
  onClose: () => void;
  gastoId: number | null;
  onConfirmDelete: (id: number) => void;
}

export const DeleteGastoDialog: React.FC<DeleteGastoDialogProps> = ({
  open,
  onClose,
  gastoId,
  onConfirmDelete,
}) => {
  const theme = useTheme();

  const handleDelete = () => {
    if (gastoId !== null) {
      onConfirmDelete(gastoId);
      onClose(); // Close the dialog after confirming delete
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs" // Keeps the dialog compact
      fullWidth
      PaperProps={{
        sx: {
          boxShadow: "0 8px 40px rgba(0, 0, 0, 0.12)", // Softer, more pronounced shadow
          overflow: "hidden", // Ensure border radius clips content
        },
      }}
    >
      {/* Header section with warning icon and title */}
      <Box
        sx={{
          textAlign: "center",
          p: 3,
          pt: 4,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Avatar
          sx={{
            width: 64, // Larger avatar
            height: 64,
            bgcolor: alpha(theme.palette.error.main, 0.1), // Soft red background
            color: theme.palette.error.main, // Red icon
            margin: "0 auto 16px",
            boxShadow: `0 0 0 4px ${alpha(theme.palette.error.main, 0.08)}`, // Subtle outline
          }}
        >
          <WarningAmberIcon sx={{ fontSize: "2.5rem" }} />{" "}
          {/* Larger icon inside avatar */}
        </Avatar>
        <Typography variant="h5" fontWeight={700} color="error">
          Confirmar Eliminación
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500], // Darker color for the close icon
            "&:hover": {
              bgcolor: alpha(theme.palette.grey[500], 0.08),
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ my: 0 }} /> {/* Divider below the header */}
      <DialogContent
        sx={{
          p: 3,
          bgcolor: theme.palette.background.paper,
          textAlign: "center",
        }}
      >
        <Typography variant="body1" mb={2}>
          ¿Estás seguro de que deseas eliminar este gasto?
        </Typography>

        {/* Details Box for the Gasto ID */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
            bgcolor: alpha(theme.palette.info.main, 0.05), // Light blue background
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            mb: 2,
          }}
        >
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.info.main, 0.1), // Slightly darker blue for avatar background
              color: theme.palette.info.main, // Blue icon
              mr: 2,
            }}
          >
            <MonetizationOnIcon /> {/* Icon for expense */}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              Gasto ID: {gastoId}
            </Typography>
            {/* You can add more details here if 'gastoDetails' prop is passed */}
            {/* {gastoDetails && (
              <Typography variant="body2" color="text.secondary">
                {gastoDetails.description} - ${gastoDetails.amount.toFixed(2)}
              </Typography>
            )} */}
            <Typography variant="body2" color="text.secondary">
              Esta acción no se puede deshacer.
            </Typography>
          </Box>
        </Box>

        <Typography
          align="center"
          variant="body2"
          color="error"
          sx={{ fontWeight: 500, mt: 1 }}
        >
          ¡Todos los datos asociados a este gasto serán eliminados
          permanentemente!
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          p: 2.5, // Increased padding for actions
          borderTop: `1px solid ${theme.palette.divider}`,
          justifyContent: "center", // Center the buttons
          gap: 2, // Space between buttons
          bgcolor: theme.palette.background.paper, // Consistent background
        }}
      >
        <Button
          onClick={onClose}
          color="primary"
          variant="outlined"
          startIcon={<CancelIcon />}
          sx={{
            px: 3,
            py: 1.2, // Slightly larger buttons
            borderRadius: 3, // Fully rounded button
            fontWeight: 600,
            boxShadow: `0 4px 10px ${alpha(theme.palette.primary.main, 0.1)}`,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: `0 6px 14px ${alpha(
                theme.palette.primary.main,
                0.15
              )}`,
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          startIcon={<DeleteForeverIcon />} // Using DeleteForeverIcon
          sx={{
            px: 3,
            py: 1.2, // Slightly larger buttons
            borderRadius: 3, // Fully rounded button
            fontWeight: 600,
            boxShadow: `0 4px 14px ${alpha(theme.palette.error.main, 0.3)}`, // Soft shadow
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: `0 6px 20px ${alpha(theme.palette.error.main, 0.4)}`,
            },
          }}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
