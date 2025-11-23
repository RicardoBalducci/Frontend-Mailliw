import { Card, CardContent, Typography, Box } from "@mui/material";
import React, { ReactElement } from "react";

interface DashboardCardProps {
  lineColor?: string;
  icon?: ReactElement; // cualquier icono JSX
  iconBg?: string;
  title?: string;
  value?: string | number;
  description?: string;
}

export function DashboardCard({
  lineColor = "#1976d2",
  icon,
  iconBg = "#e3f2fd",
  title = "Título",
  value = "0",
  description = "Descripción",
}: DashboardCardProps) {
  return (
    <Card
      sx={{
        p: 2,
        position: "relative",
        overflow: "hidden",
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        boxShadow: "0px 3px 12px rgba(0, 0, 0, 0.06)",
        background: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
        transition: "all 0.2s ease",
        width: "100%",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0px 6px 18px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* Línea decorativa */}
      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "5px",
          height: "100%",
          background: lineColor,
          boxShadow: `0 0 8px ${lineColor}`,
        }}
      />

      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.6,
          p: "0 !important",
        }}
      >
        {/* Icono */}
        {icon && (
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "12px",
              backgroundColor: iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 8px ${iconBg}`,
            }}
          >
            {icon} {/* Ya viene con color y tamaño aplicado */}
          </Box>
        )}

        {/* Texto */}
        <Box>
          <Typography
            variant="caption"
            sx={{
              opacity: 0.6,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              fontSize: "0.72rem",
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="h5"
            fontWeight="700"
            sx={{ mt: 0.3, lineHeight: 1.2 }}
          >
            {value}
          </Typography>

          <Typography
            variant="body2"
            sx={{ mt: 0.3, fontSize: "0.8rem", opacity: 0.75 }}
          >
            {description}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
