"use client";

import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { RespuestaClienteDTO } from "../../../Dto/Cliente.dto";
import ClientServices from "../../../api/ClientServices";

import {
  Box,
  Select,
  MenuItem,
  TextField,
  Button,
  InputLabel,
  FormControl,
} from "@mui/material";

interface Props {
  setCliente: (cliente: RespuestaClienteDTO | null) => void;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
  onNotFound?: () => void;
  onAddCliente?: () => void; // ← NUEVO callback opcional
}

const TIPO_DOCUMENTO = ["R", "J", "V", "G"];

export default function BuscarCliente({
  setCliente,
  setError,
  setLoading,
  loading,
  onNotFound,
  onAddCliente,
}: Props) {
  const [tipo, setTipo] = useState("J");
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
        if (onNotFound) onNotFound();
      }
    } catch (err) {
      console.error(err);
      setError("Error al buscar el cliente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="tipo-label">Tipo</InputLabel>
        <Select
          labelId="tipo-label"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          {TIPO_DOCUMENTO.map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Número de documento"
        value={numero}
        onChange={(e) => setNumero(e.target.value.replace(/\D/g, ""))}
        inputProps={{ maxLength: 12 }}
        fullWidth
      />

      <Button
        onClick={handleBuscarCliente}
        disabled={loading}
        variant="contained"
        color="primary"
        sx={{ minWidth: 120, fontWeight: 600 }}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Buscando...
          </>
        ) : (
          "Buscar"
        )}
      </Button>

      <Button
        variant="contained"
        color="primary"
        startIcon={<UserPlus size={18} />}
        sx={{
          minWidth: 170,
          fontWeight: 700,
          textTransform: "none",
          "&:hover": {
            boxShadow: 4,
          },
        }}
        onClick={() => onAddCliente && onAddCliente()}
      >
        Añadir Cliente
      </Button>

    </Box>
  );
}
