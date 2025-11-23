import React from "react";
import CustomButton from "./CustomButton";
import SaveIcon from "@mui/icons-material/Save";

interface SaveButtonProps {
  onClick: () => void;
  texto?: string;
  startIcon?: React.ReactNode; // ya estaba definido
}

const SaveButton: React.FC<SaveButtonProps> = ({
  onClick,
  texto = "Guardar",
  startIcon = <SaveIcon />, // default icon si no se pasa
}) => {
  return (
    <CustomButton
      onClick={onClick}
      texto={texto}
      startIcon={startIcon} // ahora sí se envía correctamente
      color="primary"
      variant="contained"
    />
  );
};

export default SaveButton;
