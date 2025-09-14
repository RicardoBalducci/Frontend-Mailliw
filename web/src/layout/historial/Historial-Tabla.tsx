"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { HistorialDTO } from "../../api/HistorialServices";

interface HistorialTableProps {
  historiales: HistorialDTO[];
}

export const HistorialTable: React.FC<HistorialTableProps> = ({
  historiales,
}) => {
  if (!historiales || historiales.length === 0) {
    return <Typography>No hay historiales disponibles.</Typography>;
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Proveedor</TableCell>
            <TableCell>Cliente / Usuario</TableCell>
            <TableCell>Materiales</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {historiales.map((h) => (
            <TableRow key={h.id}>
              <TableCell>{h.id}</TableCell>
              <TableCell>
                {h.fecha ? new Date(h.fecha).toLocaleString() : "N/A"}
              </TableCell>
              <TableCell>{h.proveedor?.nombre ?? "N/A"}</TableCell>
              <TableCell>
                {h.user
                  ? `${h.user.nombre ?? ""} ${h.user.apellido ?? ""}`.trim() ||
                    "N/A"
                  : "N/A"}
              </TableCell>
              <TableCell>
                {h.materiales?.length
                  ? h.materiales
                      .map((m) => m.material?.nombre ?? "N/A")
                      .join(", ")
                  : "N/A"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
