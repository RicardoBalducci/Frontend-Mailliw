import type React from "react"
import { Card, CardContent, Typography, Box } from "@mui/material"
import PersonIcon from "@mui/icons-material/Person"
import PhoneIcon from "@mui/icons-material/Phone"
import HomeIcon from "@mui/icons-material/Home"
import type { ProveedorDto } from "../../Dto/Proveedor.dto"

interface ProveedorInfoProps {
  proveedor: ProveedorDto
}

const ProveedorInfo: React.FC<ProveedorInfoProps> = ({ proveedor }) => {
  const infoItems = [
    {
      icon: PersonIcon,
      label: "Nombre",
      value: proveedor.nombre,
      color: "#1e88e5",
    },
    {
      icon: PhoneIcon,
      label: "Teléfono",
      value: proveedor.telefono,
      color: "#43a047",
    },
    {
      icon: HomeIcon,
      label: "Dirección",
      value: proveedor.direccion,
      color: "#fb8c00",
    },
  ]

  return (
    <Card
      sx={{
        mt: 3,
        borderRadius: 2,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        background: "#ffffff",
        border: "1px solid rgba(0, 0, 0, 0.06)",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          transform: "translateY(-2px)",
        },
      }}
    >
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
            sx={{
              fontWeight: "700",
              color: "#1a1a1a",
              letterSpacing: "-0.5px",
              mb: 0.5,
            }}
          >
            Información del Proveedor
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

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {infoItems.map((item, index) => {
            const IconComponent = item.icon
            return (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  p: 2,
                  borderRadius: 1.5,
                  background: "rgba(30, 136, 229, 0.04)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: "rgba(30, 136, 229, 0.08)",
                  },
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
                  <IconComponent sx={{ color: "#fff", fontSize: "20px" }} />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      color: "#666",
                      fontSize: "12px",
                      fontWeight: "600",
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
                      fontWeight: "500",
                      fontSize: "14px",
                      lineHeight: "1.5",
                      wordBreak: "break-word",
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
      </CardContent>
    </Card>
  )
}

export default ProveedorInfo
