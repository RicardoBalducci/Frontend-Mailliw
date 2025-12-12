"use client"

import { Box, Card, CardContent, Typography } from "@mui/material"

interface Props {
  value: "materiales" | "productos"
  onChange: (value: "materiales" | "productos") => void
}

export default function NavSelector({ value, onChange }: Props) {
  return (
    <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
      {["materiales", "productos"].map((tipo) => (
        <Card
          key={tipo}
          sx={{
            flex: "1 1 200px",
            cursor: "pointer",
            background: value === tipo ? "#1976d2" : "#f5f5f5",
            color: value === tipo ? "#fff" : "#000",
            transition: "all 0.3s ease",
            "&:hover": { transform: "translateY(-2px)", boxShadow: 4 },
          }}
          onClick={() => onChange(tipo as "materiales" | "productos")}
        >
          <CardContent>
            <Typography variant="h6" fontWeight={600} textAlign="center">
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}
