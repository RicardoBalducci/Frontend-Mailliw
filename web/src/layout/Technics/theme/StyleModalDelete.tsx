import { Box, Button, Modal } from "@mui/material";
import { styled } from "@mui/material/styles";
import { UserDto } from "../interface/user.dto";

export interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  Tecnico: UserDto | null;
}

/**
 * StyledModal: A Material-UI Modal component styled to center its content.
 */
export const StyledModal = styled(Modal)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
export const ModalHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  borderTopLeftRadius: theme.shape.borderRadius * 2,
  borderTopRightRadius: theme.shape.borderRadius * 2,
  position: "relative",
}));
export const ModalBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

export const ModalFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(2),
}));

/**
 * ModalContent: A styled Box component serving as the main container for
 * the modal's content, with modern design elements like rounded corners and shadow.
 */
export const ModalContent = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "400px", // Specific width for this modal type
  maxWidth: "95vw",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0 8px 40px rgba(0, 0, 0, 0.12)",
  padding: theme.spacing(3), // Added padding here as per original snippet
  "&:focus": {
    outline: "none",
  },
}));

/**
 * StyledButton: A styled Material-UI Button component with a modern,
 * rounded design, prominent shadow, and subtle hover effects.
 */
export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 3,
  padding: "10px 24px",
  fontWeight: 600,
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.12)",
  transition: "all 0.3s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
  },
}));

// This component itself doesn't render anything but exports the styled components.
const StylesComponentDeleteModal = () => {
  return null;
};

export default StylesComponentDeleteModal;
