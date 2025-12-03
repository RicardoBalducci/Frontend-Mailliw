/* "use client"
import { useState } from "react"
import {
  Container,
  Fade,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import HeaderSection from "../../../components/global/Header/header"
import { Percent, Search, CheckCircle2, AlertCircle, SearchCheck } from "lucide-react"
import { StyledPaper } from "../../../theme/StyledComponents"
import ClienteInfoCard from "../../../components/ventas/ClienteInfoCard"
import VentaPanel from "../../../components/ventas/VentaPanel"
import { ClienteDTO } from "../../../Dto/Cliente.dto"
import ClientModal from "../../client/components/ClientModal"
import SaveButton from "../../../components/global/Button/Save"


export default function CrearVentas() {
  const [cedula, setCedula] = useState("")
  const [result, setResult] = useState<ClienteDTO | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [openClientModal, setOpenClientModal] = useState(false)
  const [currentClient, setCurrentClient] = useState<ClienteDTO | null>(null)
  const [jsonData, setJsonData] = useState<string>("")
  const [searchError, setSearchError] = useState(false)

  const handleSearch = () => {
    setSearchError(false)
    if (!cedula.trim()) {
      setSearchError(true)
      return
    }

    const mock = {
      id: 1,
      rifNumber: "J-12345678-9",
      nombre: "Carlos",
      apellido: "Pérez",
      direccion: "Av. 4 de Mayo, Margarita",
      telefono: "0414-5551234",
    }

    // Check if the cedula matches the mock (simulating search)
    if (cedula.toLowerCase() === mock.rifNumber.toLowerCase() || cedula.toLowerCase() === "j-12345678-9") {
      setResult(mock)
    } else {
      // Cliente no encontrado - abrir modal para crear uno nuevo
      setCurrentClient(null)
      setOpenClientModal(true)
    }
  }

  const handleSaveClient = async (cliente: ClienteDTO) => {
    // Here you would call your API to save the client
    console.log("Guardando cliente:", cliente)
    // For demo, we'll just set it as the current result
    setResult({
      ...cliente,
      id: Math.floor(Math.random() * 10000),
    })
  }

  const handleRefreshClients = async () => {
    console.log("Refrescando lista de clientes...")
  }

  const handleRealizarVenta = (ventaJson: any) => {
    setJsonData(JSON.stringify(ventaJson, null, 2))
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonData)
  }

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4, minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}
    >
      <Fade in={true} timeout={800}>
        <div>
          <HeaderSection title="Panel de Ventas" icon={<Percent />} />

          <StyledPaper
            sx={{
              mt: 3,
              p: 4,
              borderRadius: 3,
              background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(25, 118, 210, 0.1)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Search size={28} color="#1976d2" />
              <Typography variant="h6" fontWeight={700} sx={{ color: "#1976d2" }}>
                Buscar Cliente
              </Typography>
            </Box>

            <Box display="flex" gap={2} flexWrap="wrap">
              <TextField
                sx={{
                  flex: 1,
                  minWidth: 250,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                  },
                  "& .MuiOutlinedInput-root:hover": {
                    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.15)",
                  },
                }}
                label="Cédula / RIF"
                placeholder="J-12345678-9"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                error={searchError}
              />
              <SaveButton startIcon={<Search size={20} />} onClick={handleSearch} texto={"Buscar"} />
            </Box>

            {searchError && (
              <Alert
                severity="warning"
                icon={<AlertCircle size={24} />}
                sx={{
                  mt: 3,
                  borderRadius: "8px",
                  backgroundColor: "#fff3e0",
                  color: "#e65100",
                }}
              >
                Por favor, ingresa un RIF o cédula válido
              </Alert>
            )}

            {result && (
              <Fade in={true} timeout={500}>
                <Box sx={{ mt: 4 }}>
                  <Alert
                    icon={<CheckCircle2 size={24} />}
                    severity="success"
                    sx={{
                      mb: 3,
                      borderRadius: "8px",
                      backgroundColor: "#e8f5e9",
                      color: "#2e7d32",
                    }}
                  >
                    Cliente encontrado correctamente
                  </Alert>
                  <ClienteInfoCard cliente={result} />
                  <VentaPanel cliente={result} onRealizarVenta={handleRealizarVenta} />
                </Box>
              </Fade>
            )}
          </StyledPaper>

          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle
              sx={{ background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)", color: "#fff", fontWeight: 700 }}
            >
              Venta Registrada ✓
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Datos de la venta en formato JSON:
              </Typography>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontFamily: "monospace",
                  fontSize: "12px",
                  maxHeight: "300px",
                  overflowY: "auto",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {jsonData}
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button onClick={handleCloseDialog} variant="outlined">
                Cerrar
              </Button>
              <Button
                onClick={handleCopyJson}
                variant="contained"
                sx={{ background: "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)" }}
              >
                Copiar JSON
              </Button>
            </DialogActions>
          </Dialog>

          <ClientModal
            open={openClientModal}
            currentClient={currentClient}
            onClose={() => setOpenClientModal(false)}
            onSave={handleSaveClient}
            onRefresh={handleRefreshClients}
          />
        </div>
      </Fade>
    </Container>
  )
}
 */