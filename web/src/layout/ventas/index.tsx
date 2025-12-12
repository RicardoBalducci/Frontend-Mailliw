"use client";

import { useState } from "react";
import { Container, Fade, Box, Typography, useTheme } from "@mui/material";
import { DollarSign } from "lucide-react";
import { StyledPaper } from "../../theme/StyledComponents";
import { RespuestaClienteDTO } from "../../Dto/Cliente.dto";
import BuscarCliente from "./components/search";
import ClientModal, { ClientData } from "../client/components/ClientModal";
import Swal from "sweetalert2";
import ClientServices from "../../api/ClientServices";
import { useSnackbar } from "../../components/context/SnackbarContext";
import ClienteInfo from "./components/ClientInfo";
import PanelVenta from "./components/panel/Panel";

export function Ventas() {
  const theme = useTheme();

  const [cliente, setCliente] = useState<RespuestaClienteDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState("");
    const { showSnackbar } = useSnackbar();
  
  const [openModal, setOpenModal] = useState(false);
  const [currentClient, setCurrentClient] = useState<ClientData | null>(null);

  const handleCloseModal = () => setOpenModal(false);

  // 🔥 Guardar cliente — solo crear, no actualizar
  const handleSaveClient = async (clientData: ClientData) => {
    try {
      Swal.fire({
        title: "Guardando cliente...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        customClass: {
          popup: "swal-over-modal",
        },
      });

      const response = await ClientServices.createCliente(clientData);

      if (response.success) {
        showSnackbar("Cliente creado correctamente", "success");
        setOpenModal(false);
        return true;
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: response.message || "No se pudo crear el cliente.",
      });

      return false;
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al crear el cliente.",
      });
      return false;
    } finally {
      Swal.close();
    }
  };

  return (
    
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Box>
          {/* Header */}
          <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
              color="primary"
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 1,
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
              <DollarSign />
              Venta
            </Typography>
          </Box>

          <StyledPaper sx={{ p: 3, mb: 3 }}>
            <BuscarCliente
              setCliente={setCliente}
              setError={setError}
              setLoading={setLoading}
              loading={loading}
              onNotFound={() => {
                showSnackbar("Cliente no encontrado, crea uno nuevo", "warning");
                setCurrentClient(null); 
                setOpenModal(true);
              }}
               onAddCliente={() => setOpenModal(true)}
            />
            
            {cliente && <>
              <ClienteInfo cliente={cliente}/>
              <PanelVenta  cliente={cliente}/>
            </>} 
          </StyledPaper>

          <ClientModal
            open={openModal}
            onClose={handleCloseModal}
            currentClient={currentClient}
            onRefresh={() => {}}
            onSave={handleSaveClient}
          />
          
        </Box>
      </Fade>
    </Container>
  );
}

export default Ventas;
