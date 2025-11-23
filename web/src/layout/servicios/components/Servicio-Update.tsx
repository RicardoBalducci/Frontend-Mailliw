"use client";

import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import BaseModal from "../../../components/global/modal/modal";
import InputField from "../../../components/global/TextField/InputField";
import TextAreaField from "../../../components/global/TextField/TextAreaField";
import { FileText, DollarSign, Wrench, Package } from "lucide-react";
import { ServicioDTO, UpdateServicioDTO } from "../../../Dto/Servicio.dto";
import ServiciosServices from "../../../api/ServiciosServices";

interface ServiciosEditProps {
  open: boolean;
  onClose: () => void;
  servicio: ServicioDTO | null;
  onServicioUpdated?: () => void;
}

export function ServiciosEdit({
  open,
  onClose,
  servicio,
  onServicioUpdated,
}: ServiciosEditProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precioEstandarUsd, setPrecioEstandarUsd] = useState<number | "">("");
  const [tecnicosCalificados, setTecnicosCalificados] = useState<string[]>([]);
  const [materialesUsados, setMaterialesUsados] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Cargar datos cuando se abre el modal con un servicio
  useEffect(() => {
    if (open && servicio) {
      setNombre(servicio.nombre || "");
      setDescripcion(servicio.descripcion || "");
      setPrecioEstandarUsd(servicio.precio_estandar_usd || "");
      setTecnicosCalificados(servicio.tecnicosCalificados || []);
      setMaterialesUsados(servicio.tecnicosCalificados || []);
    }
  }, [open, servicio]);

  const handleNumericInput = (value: string) => {
    const cleaned = value.replace(/[^\d.]/g, ""); // permite números y punto decimal
    return cleaned === "" ? "" : Number(cleaned);
  };

  const handleUpdateServicio = async () => {
    if (!nombre.trim() || !descripcion.trim() || precioEstandarUsd === "") {
      return;
    }

    const updatedServicio: UpdateServicioDTO = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio_estandar_usd: Number(precioEstandarUsd),
      tecnicosCalificados,
      materialesUsados,
    };

    if (!servicio) {
      console.error("No hay servicio seleccionado para actualizar.");
      return;
    }

    try {
      setLoading(true);

      const response = await ServiciosServices.updateServicio(
        servicio.id,
        updatedServicio
      );

      if (response.success) {
        if (onServicioUpdated) onServicioUpdated();
        setTimeout(() => onClose(), 1000);
      }
    } catch (err) {
      console.error("Error al actualizar el servicio:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      open={open}
      saveText="Guardar Cambios"
      onClose={onClose}
      onSave={handleUpdateServicio}
      title="Modificar Servicio"
    >
      <InputField
        label="Nombre del Servicio"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        startIcon={<Package />}
        disabled={loading}
        errorMessage={!nombre ? "Campo obligatorio" : undefined}
      />

      <TextAreaField
        label="Descripción del Servicio"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        startIcon={<FileText />}
        rows={4}
        disabled={loading}
        errorMessage={!descripcion ? "Campo obligatorio" : undefined}
      />

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
        <InputField
          label="Precio Estándar (USD)"
          value={precioEstandarUsd}
          onChange={(e) =>
            setPrecioEstandarUsd(handleNumericInput(e.target.value))
          }
          startIcon={<DollarSign />}
          sx={{ flex: 1, minWidth: 150 }}
          disabled={loading}
          onlyNumbers
          errorMessage={
            precioEstandarUsd === "" ? "Campo obligatorio" : undefined
          }
        />
      </Box>

      {/* Puedes extender esta sección más adelante con chips o selectores para técnicos y materiales */}
      <Box sx={{ mt: 3, color: "text.secondary", fontSize: 14 }}>
        <Wrench size={16} style={{ marginRight: 6 }} />
        Técnicos calificados y materiales asociados serán gestionados en futuras
        versiones.
      </Box>
    </BaseModal>
  );
}

export default ServiciosEdit;
