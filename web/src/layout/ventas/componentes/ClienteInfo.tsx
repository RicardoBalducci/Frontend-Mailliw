/* import { Box, TextField } from "@mui/material";
import { ClienteDTO } from "../../Dto/Cliente.dto";

interface Props {
  cliente: ClienteDTO;
}

export default function ClienteInfo({ cliente }: Props) {
  return (
    <Box display="flex" flexWrap="wrap" gap={2} sx={{ mt: 2 }}>
      <TextField
        label="RIF"
        value={cliente.rif}
        InputProps={{ readOnly: true }}
        sx={{ flex: 1 }}
      />
      <TextField
        label="Nombre"
        value={cliente.nombre}
        InputProps={{ readOnly: true }}
        sx={{ flex: 1 }}
      />
      <TextField
        label="Apellido"
        value={cliente.apellido}
        InputProps={{ readOnly: true }}
        sx={{ flex: 1 }}
      />
      <TextField
        label="Dirección"
        value={cliente.direccion}
        InputProps={{ readOnly: true }}
        fullWidth
      />
      <TextField
        label="Teléfono"
        value={cliente.telefono}
        InputProps={{ readOnly: true }}
        sx={{ flex: 1 }}
      />
    </Box>
  );
}
 */
