import { useState } from "react";
import { Box, TextField, Button, CircularProgress, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import {  RespuestaClienteDTO } from "../../../Dto/Cliente.dto";
import ClientServices from "../../../api/ClientServices";

interface Props {
  setCliente: (cliente: RespuestaClienteDTO | null) => void;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
}

export default function BuscarCliente({ setCliente, setError, setLoading, loading }: Props) {
  const [tipo, setTipo] = useState<"R" | "J" | "V" | "G">("J");
  const [numero, setNumero] = useState("");

  const handleBuscarCliente = async () => {
    if (!numero.trim()) {
      setError("Por favor ingresa un número válido");
      setCliente(null);
      return;
    }

    const rif = `${tipo}-${numero}`;
    setLoading(true);
    setError("");
    setCliente(null);

    try {
      const res = await ClientServices.fetchClientes(rif);
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
      <FormControl sx={{ width: 100 }}>
        <InputLabel>Tipo</InputLabel>
        <Select
          value={tipo}
          label="Tipo"
          onChange={(e) => setTipo(e.target.value as "R" | "J" | "V" | "G")}
        >
          <MenuItem value="R">R</MenuItem>
          <MenuItem value="J">J</MenuItem>
          <MenuItem value="V">V</MenuItem>
          <MenuItem value="G">G</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Número"
        value={numero}
        onChange={(e) => setNumero(e.target.value.replace(/\D/g, ""))} 
        fullWidth
        inputProps={{ maxLength: 12 }}
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
