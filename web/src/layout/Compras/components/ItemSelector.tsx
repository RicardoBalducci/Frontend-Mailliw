"use client"

import { Box, TextField, CircularProgress, Button } from "@mui/material"
import Autocomplete from "@mui/material/Autocomplete"
import { Plus } from "lucide-react"

interface Props<T> {
  items: T[]
  selectedItem: T | null
  loading: boolean
  label: string
  onChange: (item: T | null) => void
  onNuevo: () => void
}

export default function ItemSelector<T extends { nombre: string }>({ items, selectedItem, loading, label, onChange, onNuevo }: Props<T>) {
  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", mb: 2 }}>
      <Box sx={{ flex: 1 }}>
        <Autocomplete
          options={items}
          getOptionLabel={(option) => option.nombre || ""}
          value={selectedItem}
          onChange={(_, newValue) => onChange(newValue)}
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
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
          borderColor: "#43a047",
          color: "#43a047",
          "&:hover": { backgroundColor: "rgba(67, 160, 71, 0.08)" },
        }}
      >
        Nuevo
      </Button>
    </Box>
  )
}
