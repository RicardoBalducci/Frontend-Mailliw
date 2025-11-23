import React, { useState } from "react";
import { Button, ButtonProps, useTheme, CircularProgress } from "@mui/material";

interface CustomButtonProps extends ButtonProps {
  onClick: () => Promise<void> | void; // soporte para funciones async
  texto: string;
  startIcon?: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  texto,
  startIcon,
  sx,
  ...props
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      await onClick(); // soporta async
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      startIcon={
        loading ? <CircularProgress size={20} color="inherit" /> : startIcon
      }
      disabled={loading || props.disabled}
      sx={{
        ml: { xs: 1, sm: 2 },
        borderRadius: Number(theme.shape.borderRadius) * 2,
        padding: "10px 20px",
        fontWeight: 700,
        fontSize: "1rem",
        textTransform: "none",
        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 10px 28px rgba(0, 0, 0, 0.25)",
        },
        "&:active": {
          transform: "translateY(0)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        },
        "&:disabled": {
          background: theme.palette.grey[400],
          color: theme.palette.grey[200],
          borderColor: theme.palette.grey[400],
          boxShadow: "none",
        },
        ...sx,
      }}
      {...props}
    >
      {texto}
    </Button>
  );
};

export default CustomButton;
