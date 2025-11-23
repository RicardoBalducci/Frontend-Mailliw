import React from "react";
import { Box, Typography, Chip, useTheme, SxProps, Theme } from "@mui/material";

interface HeaderSectionProps {
  title: string;
  icon: React.ReactNode;
  chipLabel?: string | number;
  chipColor?:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
  chipVariant?: "filled" | "outlined";
  sx?: SxProps<Theme>;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  title,
  icon,
  chipLabel,
  chipColor = "primary",
  chipVariant = "outlined",
  sx,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        mb: 4,
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        ...sx,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        fontWeight="700"
        color="primary"
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -8,
            left: 0,
            width: 60,
            height: 4,
            borderRadius: 2,
            backgroundColor: theme.palette.primary.main,
          },
        }}
      >
        <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>{icon}</Box>
        {title}
      </Typography>

      {chipLabel !== undefined && (
        <Chip
          label={chipLabel}
          color={chipColor}
          variant={chipVariant}
          sx={{ ml: 2, fontWeight: 500, height: 28 }}
        />
      )}
    </Box>
  );
};

export default HeaderSection;
