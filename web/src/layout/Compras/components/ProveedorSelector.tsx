"use client"

import { Box, TextField, CircularProgress, Button } from "@mui/material"
import Autocomplete from "@mui/material/Autocomplete"
import { Plus } from "lucide-react"
import type { ProveedorDto } from "../../../Dto/Proveedor.dto"

interface Props {
  proveedores: ProveedorDto[]
  loading: boolean
  selectedProveedor: ProveedorDto | null
  onChange: (prov: ProveedorDto | null) => void
  onNuevo: () => void
}

export default function ProveedorSelector({ proveedores, loading, selectedProveedor, onChange, onNuevo }: Props) {
  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
      <Box sx={{ flex: 1 }}>
        <Autocomplete
          options={proveedores}
          getOptionLabel={(option) => option.nombre || ""}
          value={selectedProveedor}
          onChange={(_, newValue) => onChange(newValue)}
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Selecciona un proveedor"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Box>
      <Button
        variant="outlined"
        startIcon={<Plus size={20} />}
        onClick={onNuevo}
        sx={{
          mt: 1,
          borderColor: "#1a73e8",
          color: "#1a73e8",
          "&:hover": { backgroundColor: "rgba(26, 115, 232, 0.08)" },
        }}
      >
        Nuevo
      </Button>
    </Box>
  )
}
