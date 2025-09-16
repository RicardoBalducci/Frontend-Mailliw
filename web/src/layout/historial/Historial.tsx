
{
  
  /* 
  
  import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Fade,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
} from "@mui/material";
import HistorialServices, { HistorialDTO } from "../../api/HistorialServices";

export const Historial = () => {
  const [historiales, setHistoriales] = useState<HistorialDTO[]>([]);

  const fetchHistorial = async () => {
    const response = await HistorialServices.fetchHistorial({
      page: 1,
      limit: 10,
    });

    if (response.success) {
      setHistoriales(response.data);
    } else {
      console.error(response.errors);
    }
  };

  useEffect(() => {
    fetchHistorial();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in={true} timeout={800}>
        <Box>
          <Typography
            variant="h4"
            fontWeight="700"
            color="primary"
            sx={{ mb: 4 }}
          >
            Historial
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Proveedor</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Dirección</TableCell>
                  <TableCell>Catálogo</TableCell>
                  <TableCell>Materiales</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historiales.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell>{h.id}</TableCell>
                    <TableCell>{new Date(h.fecha).toLocaleString()}</TableCell>
                    <TableCell>
                      {h.materiales.map((m) => (
                        <Box key={m.id}>
                          Cantidad: {m.cantidad}, USD: {m.precio_unitario_usd},
                          Bs: {m.precio_unitario_bs}
                        </Box>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Fade>
    </Container>
  );
};

  <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box display="flex" gap={1} mb={3} flexWrap="nowrap">
                <DatePicker
                  label="Fecha Inicio"
                  value={fechaInicio}
                  onChange={(newValue) => setFechaInicio(newValue)}
                  slotProps={{
                    textField: {
                      size: "medium",
                      sx: { minWidth: 200, height: 50 },
                    },
                  }}
                />
                <DatePicker
                  label="Fecha Fin"
                  value={fechaFin}
                  onChange={(newValue) => setFechaFin(newValue)}
                  slotProps={{
                    textField: {
                      size: "medium",
                      sx: { minWidth: 200, height: 50 },
                    },
                  }}
                />
                <TextField
                  select
                  label="Proveedor"
                  value={proveedor}
                  onChange={(e) => setProveedor(e.target.value)}
                  size="medium"
                  sx={{ minWidth: 200, height: 50 }}
                >
                  {proveedores.map((p) => (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Cliente"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  size="medium"
                  sx={{ minWidth: 200, height: 50 }}
                >
                  {clientes.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  size="medium"
                  sx={{ minWidth: 150, height: 50 }}
                >
                  {tipos.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Download />}
                  sx={{ height: 50 }}
                  onClick={() => alert("Exportar")}
                >
                  Exportar
                </Button>
              </Box>
            </LocalizationProvider> */
}
