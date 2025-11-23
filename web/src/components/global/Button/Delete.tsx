import React from "react";
import CustomButton from "./CustomButton";
import DeleteIcon from "@mui/icons-material/Delete";

interface DeleteButtonProps {
  onClick: () => void;
  texto?: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  texto = "Eliminar",
}) => {
  return (
    <CustomButton
      onClick={onClick}
      texto={texto}
      startIcon={<DeleteIcon />}
      color="error"
      variant="contained"
    />
  );
};

export default DeleteButton;
