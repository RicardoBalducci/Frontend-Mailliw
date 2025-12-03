/* "use client"
import { Paper, Typography, Box } from "@mui/material"
import { User, Phone, FileText, MapPin } from "lucide-react"

const ClienteInfoCard = ({ cliente: ClienteDTO }) => {
  if (!cliente) return null

  const infoData = [
    { label: "RIF / Cédula", value: cliente.rifNumber, icon: <FileText size={20} color="#1976d2" /> },
    { label: "Nombre", value: `${cliente.nombre} ${cliente.apellido}`, icon: <User size={20} color="#1976d2" /> },
    { label: "Teléfono", value: cliente.telefono, icon: <Phone size={20} color="#1976d2" /> },
    { label: "Dirección", value: cliente.direccion, icon: <MapPin size={20} color="#1976d2" /> },
  ]

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 3,
        p: 3,
        borderRadius: 3,
        backgroundColor: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
        border: "2px solid #1976d2",
        background: "linear-gradient(135deg, #e3f2fd 0%, #fff3e0 100%)",
        boxShadow: "0 4px 20px rgba(25, 118, 210, 0.15)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Box
          sx={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <User size={24} color="#fff" />
        </Box>
        <Typography variant="h6" fontWeight={700} sx={{ color: "#1976d2" }}>
          Información del Cliente
        </Typography>
      </Box>

      <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr" }} gap={2}>
        {infoData.map((item, index) => (
          <Box
            key={index}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: "#fff",
              border: "1px solid #e0e0e0",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(25, 118, 210, 0.2)",
                transform: "translateY(-4px)",
                borderColor: "#1976d2",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <Box sx={{ mt: 0.5 }}>{item.icon}</Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#666",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    fontSize: "11px",
                    letterSpacing: "0.5px",
                  }}
                >
                  {item.label}
                </Typography>
                <Typography variant="body2" fontWeight={700} sx={{ color: "#1976d2", mt: 0.5 }}>
                  {item.value}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  )
}

export default ClienteInfoCard
 */