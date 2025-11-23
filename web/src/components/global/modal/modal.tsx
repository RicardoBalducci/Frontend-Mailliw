"use client";

import React from "react";
import {
  Modal,
  Box,
  Fade,
  Typography,
  styled,
  IconButton,
} from "@mui/material";
import DeleteButton from "../Button/Delete";
import SaveButton from "../Button/Save";
import { Save, X } from "lucide-react";

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  title: string;
  children: React.ReactNode;
  saveText?: string;
  cancelText?: string;
}

const StyledModal = styled(Modal)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const ModalContent = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "600px",
  maxWidth: "90vw",
  maxHeight: "85vh",
  backgroundColor: theme.palette.background.paper,
  borderRadius: Number(theme.shape.borderRadius) * 3,
  boxShadow: "0 10px 40px rgba(0,0,0,0.2), 0 4px 20px rgba(0,0,0,0.12)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  transition: "all 0.3s ease",
  [theme.breakpoints.down("sm")]: {
    width: "95vw",
    maxHeight: "90vh",
    borderRadius: Number(theme.shape.borderRadius) * 2,
  },
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  borderTopLeftRadius: Number(theme.shape.borderRadius) * 3,
  borderTopRightRadius: Number(theme.shape.borderRadius) * 3,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
    borderTopLeftRadius: Number(theme.shape.borderRadius) * 2,
    borderTopRightRadius: Number(theme.shape.borderRadius) * 2,
  },
}));

const ModalBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  flex: 1,
  overflowY: "auto",
  scrollbarWidth: "thin",
  scrollbarColor: `${theme.palette.grey[400]} transparent`,
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.grey[400],
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const ModalFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5, 3),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column-reverse",
    gap: theme.spacing(1.5),
    padding: theme.spacing(2),
  },
}));

const BaseModal: React.FC<BaseModalProps> = ({
  open,
  onClose,
  onSave,
  title,
  children,
  saveText = "Guardar",
  cancelText = "Cancelar",
}) => {
  return (
    <StyledModal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open} timeout={300}>
        <ModalContent>
          {/* Header */}
          <ModalHeader>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Save size={20} color="#fff" /> {/* ícono de guardar blanco */}
              <Typography
                variant="h6"
                fontWeight={700}
                fontSize={{ xs: "1.25rem", sm: "1.5rem", md: "1.75rem" }}
              >
                {title}
              </Typography>
            </Box>

            <IconButton
              aria-label="Cerrar"
              onClick={onClose}
              size="small"
              sx={{
                color: "#fff", // blanco
                position: "absolute",
                right: 16,
                top: 16,
              }}
            >
              <X />
            </IconButton>
          </ModalHeader>

          {/* Body */}
          <ModalBody>{children}</ModalBody>

          {/* Footer */}
          <ModalFooter>
            <DeleteButton onClick={onClose} texto={cancelText} />
            <SaveButton onClick={onSave} texto={saveText} />
          </ModalFooter>
        </ModalContent>
      </Fade>
    </StyledModal>
  );
};

export default BaseModal;
