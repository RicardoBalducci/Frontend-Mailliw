"use client";

import React from "react";
import { Box, Typography, Card, ButtonBase, styled } from "@mui/material";
import { LucideIcon } from "lucide-react"; // Asegúrate de importar LucideIcon

interface ShortcutButtonProps {
  title: string;
  icon: LucideIcon; // Tipado como LucideIcon para aceptar size y color
  color: string;
  onClick: () => void;
}

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  transition: "transform 0.3s, box-shadow 0.3s",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: theme.shadows[10],
  },
}));

export function ShortcutButton({
  title,
  icon,
  color,
  onClick,
}: ShortcutButtonProps) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: "100%",
        textAlign: "center",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <StyledCard
        elevation={3}
        sx={{
          p: 3,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: `5px solid ${color}`,
        }}
      >
        <Box
          sx={{
            color: color,
            mb: 1.5,
            bgcolor: `${color}1A`,
            borderRadius: "50%",
            width: 60,
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {React.createElement(icon, { size: 36, color })}
        </Box>
        <Typography
          variant="body1"
          fontWeight={700}
          sx={{ color: "text.primary" }}
        >
          {title}
        </Typography>
      </StyledCard>
    </ButtonBase>
  );
}
