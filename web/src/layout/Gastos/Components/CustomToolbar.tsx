import React from "react";
import { Typography, Box, IconButton } from "@mui/material";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface CustomToolbarProps {
  label: string;
  onNavigate: (action: "prev" | "next" | "today", newDate?: Date) => void;
  view: string;
  date: Date;
}

export const CustomToolbar: React.FC<CustomToolbarProps> = ({
  date,
  onNavigate,
}) => {
  const formattedDate = format(date, "MMMM yyyy", { locale: es });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 2,
        padding: 1,
        backgroundColor: "rgba(0, 0, 0, 0.04)",
        borderRadius: 1,
      }}
    >
      <IconButton onClick={() => onNavigate("prev")} size="small">
        <ArrowBackIosIcon fontSize="small" />
      </IconButton>

      <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
        {formattedDate}
      </Typography>

      <IconButton onClick={() => onNavigate("next")} size="small">
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};
