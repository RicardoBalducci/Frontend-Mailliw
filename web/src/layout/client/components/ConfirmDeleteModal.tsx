"use client";

import type React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Fade,
  Avatar,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CancelIcon from "@mui/icons-material/Cancel";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import { styled } from "@mui/material/styles";

const StyledModal = styled(Modal)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const ModalContent = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "400px",
  maxWidth: "95vw",
  backgroundColor: theme.palette.background.paper,
  borderRadius: (theme.shape.borderRadius as number) * 2,
  boxShadow: "0 8px 40px rgba(0, 0, 0, 0.12)",
  padding: theme.spacing(3),
  "&:focus": {
    outline: "none",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: (theme.shape.borderRadius as number) * 3,
  padding: "10px 24px",
  fontWeight: 600,
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.12)",
  transition: "all 0.3s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
  },
}));

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  client: {
    id?: number;
    rif: string;
    nombre: string;
    apellido?: string;
  } | null;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  client,
}) => {
  const theme = useTheme();

  if (!client) return null;

  const isCompany = client.rif.startsWith("E-") || client.rif.startsWith("R-");
  const clientName = isCompany
    ? client.nombre + (client.apellido ? ` (${client.apellido})` : "")
    : `${client.nombre} ${client.apellido || ""}`;

  return (
    <StyledModal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open}>
        <ModalContent>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
                margin: "0 auto 16px",
              }}
            >
              <WarningAmberIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" fontWeight={700} color="error">
              Confirmar Eliminación
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ my: 3 }}>
            <Typography align="center" variant="body1" paragraph>
              ¿Estás seguro de que deseas eliminar este cliente?
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
                bgcolor: alpha(theme.palette.error.main, 0.05),
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                mb: 2,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: isCompany
                    ? alpha(theme.palette.success.main, 0.1)
                    : alpha(theme.palette.info.main, 0.1),
                  color: isCompany
                    ? theme.palette.success.main
                    : theme.palette.info.main,
                  mr: 2,
                }}
              >
                {isCompany ? <BusinessIcon /> : <PersonIcon />}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {clientName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {client.rif}
                </Typography>
              </Box>
            </Box>

            <Typography
              align="center"
              variant="body2"
              color="error"
              sx={{ fontWeight: 500 }}
            >
              Esta acción no se puede deshacer.
            </Typography>
          </Box>

          <Box display="flex" justifyContent="center" gap={2}>
            <StyledButton
              variant="outlined"
              color="primary"
              onClick={onClose}
              startIcon={<CancelIcon />}
            >
              Cancelar
            </StyledButton>
            <StyledButton
              variant="contained"
              color="error"
              onClick={onConfirm}
              startIcon={<DeleteForeverIcon />}
            >
              Eliminar
            </StyledButton>
          </Box>
        </ModalContent>
      </Fade>
    </StyledModal>
  );
};

export default ConfirmDeleteModal;
