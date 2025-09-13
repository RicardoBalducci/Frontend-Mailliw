import React from "react";
import { Box, Typography, Card, styled } from "@mui/material";

interface DataCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
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
        borderLeft: `5px solid ${color}`, // Retain the color accent
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
          bgcolor: `${color}1A`, // Light background for the icon
          borderRadius: "50%",
          width: 50,
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {React.cloneElement(icon as React.ReactElement, {
          size: 30, // Use Lucide's size prop for consistency
          sx: { color: color }, // Ensure icon color is applied
        })}
      </Box>
    </StyledCard>
  );
}
