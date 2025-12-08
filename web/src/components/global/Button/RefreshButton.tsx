import { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { alpha } from "@mui/material/styles";

const RefreshButton = ({ onRefresh }: { onRefresh: () => void }) => {
  const [rotating, setRotating] = useState(false);

  const handleClick = async () => {
    if (rotating) return;
    setRotating(true);

    try {
      await onRefresh();
    } finally {
      setTimeout(() => setRotating(false), 800);
    }
  };

  return (
    <Tooltip title="Actualizar tabla" arrow placement="top">
      <IconButton
        onClick={handleClick}
        sx={(theme) => ({
          /* Responsiveness */
          width: { xs: "100%", sm: 48 },
          height: { xs: 50, sm: 48 },
          borderRadius: { xs: 2, sm: 3 },

          /* Diseño premium */
          backdropFilter: "blur(6px)",
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.18)}`,
          transition: "all 0.28s ease",

          "&:hover": {
            transform: { xs: "none", sm: "scale(1.07)" },
            backgroundColor: alpha(theme.palette.primary.main, 0.15),
            boxShadow: `0 6px 18px ${alpha(theme.palette.primary.main, 0.25)}`,
          },

          "&:active": {
            transform: { xs: "none", sm: "scale(0.96)" },
          },
        })}
      >
        <RefreshIcon
          color="primary"
          sx={{
            fontSize: { xs: 24, sm: 26 },
            transition: "transform 0.6s ease",
            transform: rotating ? "rotate(360deg)" : "none",
          }}
        />
      </IconButton>
    </Tooltip>
  );
};

export default RefreshButton;
