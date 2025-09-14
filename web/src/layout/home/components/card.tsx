import React from "react";
import { Box, Typography, Card, styled } from "@mui/material";
import { LucideIcon } from "lucide-react"; // Asegúrate de importar LucideIcon

interface DataCardProps {
  title: string;
  value: string;
  icon: LucideIcon; // Tipado como LucideIcon
  color: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  transition: "transform 0.3s, box-shadow 0.3s",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[8],
  },
}));

export function DataCard({ title, value, icon, color }: DataCardProps) {
  return (
    <StyledCard
      elevation={3}
      sx={{
        p: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderLeft: `5px solid ${color}`,
      }}
    >
      <Box>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography
          variant="h4"
          component="div"
          fontWeight={700}
          color="text.primary"
        >
          {value}
        </Typography>
      </Box>
      <Box
        sx={{
          color: color,
          opacity: 0.8,
          ml: 2,
          bgcolor: `${color}1A`,
          borderRadius: "50%",
          width: 50,
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {React.createElement(icon, { size: 30, color })}{" "}
        {/* ✅ Aquí usamos createElement */}
      </Box>
    </StyledCard>
  );
}
