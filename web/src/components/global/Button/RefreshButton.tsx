import { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { alpha } from "@mui/material/styles";

const RefreshButton = ({ onRefresh }: { onRefresh: () => void }) => {
  const [rotating, setRotating] = useState(false);

  const handleClick = async () => {
    if (rotating) return; // evita doble clic
    setRotating(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setRotating(false), 800); // duración del giro
    }
  };

  return (
    <Tooltip title="Actualizar tabla">
      <IconButton
        onClick={handleClick}
        sx={{
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
          "&:hover": {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
          },
          borderRadius: 2,
          width: { xs: "100%", sm: "auto" },
          height: 48,
          transition: "all 0.3s ease",
        }}
      >
        <RefreshIcon
          color="primary"
          sx={{
            transition: "transform 0.6s ease",
            transform: rotating ? "rotate(360deg)" : "none",
          }}
        />
      </IconButton>
    </Tooltip>
  );
};

export default RefreshButton;
