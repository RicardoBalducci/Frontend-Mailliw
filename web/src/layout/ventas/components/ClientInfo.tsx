"use client";

import { User, Phone, MapPin } from "lucide-react";
import { ClienteDTO } from "../../../Dto/Cliente.dto";
import { Card, CardContent, Typography, Box } from "@mui/material";

interface Props {
  cliente: ClienteDTO;
}

export default function ClienteInfo({ cliente }: Props) {
  const infoItems = [
    { icon: User, label: "D.I.", value: cliente.rif, color: "#1e88e5" },
    { icon: User, label: "Nombre", value: cliente.nombre, color: "#43a047" },
    { icon: User, label: "Apellido", value: cliente.apellido, color: "#f4511e" },
    { icon: Phone, label: "Teléfono", value: cliente.telefono, color: "#fb8c00" },
  ];

  return (
    <Card
      sx={{
        mt: 3,
        borderRadius: 2,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.06)",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        "&:hover": {
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)",
          height: "4px",
        }}
      />
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.5px", mb: 0.5 }}
          >
            Información del Cliente
          </Typography>
          <Box
            sx={{
              height: "2px",
              width: "40px",
              background: "#1e88e5",
              borderRadius: "1px",
            }}
          />
        </Box>

        {/* 2x2 Info Items */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mb: 2,
          }}
        >
          {infoItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Box
                key={index}
                sx={{
                  flex: "1 1 calc(50% - 8px)", // 2 columnas
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  p: 2,
                  borderRadius: 1.5,
                  background: "rgba(30,136,229,0.04)",
                  transition: "all 0.2s ease",
                  "&:hover": { background: "rgba(30,136,229,0.08)" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    background: item.color,
                    flexShrink: 0,
                    mt: 0.5,
                  }}
                >
                  <IconComponent color="#fff" size={20} />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      color: "#666",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      mb: 0.5,
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#1a1a1a",
                      fontWeight: 500,
                      fontSize: "14px",
                      lineHeight: "1.5",
                      wordBreak: "break-word",
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Dirección — Full Width */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 2,
            p: 2,
            borderRadius: 1.5,
            background: "rgba(37,99,235,0.04)",
            "&:hover": { background: "rgba(37,99,235,0.08)" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "44px",
              height: "44px",
              borderRadius: "10px",
              background: "#1e88e5",
              flexShrink: 0,
              mt: 0.5,
            }}
          >
            <MapPin color="#fff" size={20} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: "#666",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                mb: 0.5,
              }}
            >
              Dirección
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#1a1a1a",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "1.5",
                wordBreak: "break-word",
              }}
            >
              {cliente.direccion}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
