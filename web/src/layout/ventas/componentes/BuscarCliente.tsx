/* import { useState } from "react";
import { Box, TextField, Button, CircularProgress } from "@mui/material";
import { ClienteDTO } from "../../../Dto/Cliente.dto";
//Acomodar

interface Props {
  setCliente: (cliente: ClienteDTO | null) => void;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
}

export default function BuscarCliente({
  setCliente,
  setError,
  setLoading,
  loading,
}: Props) {
  const [rif, setRif] = useState("");

  const handleBuscarCliente = async () => {
    if (!rif.trim()) {
      setError("Por favor ingresa un RIF válido");
      setCliente(null);
      return;
    }

    setLoading(true);
    setError("");
    setCliente(null);

    try {
      const res = await ClienteServices.fetchClientes(rif);
      if (res.success && res.data && res.data.length > 0) {
        setCliente(res.data[0]);
      } else {
        setError("Cliente no encontrado");
      }
    } catch (err) {
      console.error(err);
      setError("Error al buscar el cliente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" gap={2} alignItems="center" mb={3}>
      <TextField
        label="RIF del cliente"
        value={rif}
        onChange={(e) => setRif(e.target.value)}
        fullWidth
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleBuscarCliente}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Buscar"}
      </Button>
    </Box>
  );
}
 */
