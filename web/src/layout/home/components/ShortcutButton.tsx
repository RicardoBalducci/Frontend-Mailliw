"use client";

import React from "react";
import { Box, Typography, Card, ButtonBase, styled } from "@mui/material";

interface ShortcutButtonProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  transition: "transform 0.3s, box-shadow 0.3s",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-6px)", // Slightly more pronounced lift
    boxShadow: theme.shadows[10], // Stronger shadow on hover
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
          borderBottom: `5px solid ${color}`, // Retain the color accent
        }}
      >
        <Box
          sx={{
            color: color,
            mb: 1.5,
            bgcolor: `${color}1A`, // Light background for the icon
            borderRadius: "50%",
            width: 60,
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {React.cloneElement(icon as React.ReactElement, {
            size: 36, // Use Lucide's size prop for consistency
            sx: { color: color }, // Ensure icon color is applied
          })}
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
