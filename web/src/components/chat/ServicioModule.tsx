export interface ServicioOption {
  label: string;
  value: string;
}

export interface ServiciosModuleData {
  message: string;
  options: ServicioOption[];
}

// Módulo principal de Servicios
export const ServiciosModule = (): ServiciosModuleData => ({
  message: `Módulo de *Servicios*: aquí puedes gestionar los servicios ofrecidos por el sistema. 
Selecciona una de las opciones para continuar:`,
  options: [
    { label: "Ver servicio", value: "ver_servicio" },
    { label: "Crear servicio", value: "crear_servicio" },
    { label: "Modificar servicio", value: "modificar_servicio" },
    { label: "Eliminar servicio", value: "eliminar_servicio" },
  ],
});

// Función que maneja las opciones del módulo de Servicios
export const handleServicioOption = (value: string) => {
  const volverServicios = { label: "Volver a Servicios", value: "servicio" };
  const volverInicio = { label: "Volver al inicio", value: "inicio" };

  switch (value) {
    case "ver_servicio":
      return {
        text: `Ver servicio:\n1️⃣ Ingresa al módulo de Servicios.\n2️⃣ Selecciona "Ver servicio".\n3️⃣ Consulta la lista o busca por nombre/código.`,
        options: [volverServicios, volverInicio],
      };

    case "crear_servicio":
      return {
        text: `Crear servicio:\n1️⃣ Haz clic en "Añadir Servicio".\n2️⃣ Completa el formulario con los datos del nuevo servicio.\n3️⃣ Haz clic en "Añadir Servicio" para registrarlo.\n✅ Servicio agregado exitosamente.`,
        options: [volverServicios, volverInicio],
      };

    case "modificar_servicio":
      return {
        text: `Modificar servicio:\n1️⃣ Busca el servicio que deseas modificar.\n2️⃣ Haz clic en editar ✏️ junto al servicio.\n3️⃣ Actualiza los datos y guarda los cambios.\n✅ Servicio modificado exitosamente.`,
        options: [volverServicios, volverInicio],
      };

    case "eliminar_servicio":
      return {
        text: `Eliminar servicio:\n1️⃣ Busca el servicio que deseas eliminar.\n2️⃣ Haz clic en el ícono de basura 🗑️.\n3️⃣ Confirma la eliminación.\n✅ Servicio eliminado exitosamente.`,
        options: [volverServicios, volverInicio],
      };

    default:
      return {
        text: `Opción desconocida. Por favor selecciona otra opción.`,
        options: [volverServicios, volverInicio],
      };
  }
};
