export interface TecnicoOption {
  label: string;
  value: string;
}

export interface TecnicosModuleData {
  message: string;
  options: TecnicoOption[];
}

export const TecnicosModule = (): TecnicosModuleData => ({
  message: `Módulo de *Técnicos*: aquí puedes gestionar los técnicos del sistema. 
Selecciona una de las siguientes opciones para continuar:`,
  options: [
    { label: "Ver técnico", value: "ver_tecnico" },
    { label: "Crear técnico", value: "crear_tecnico" },
    { label: "Eliminar técnico", value: "eliminar_tecnico" },
    { label: "Modificar técnico", value: "modificar_tecnico" },
  ],
});

export const handleTecnicoOption = (value: string) => {
  const volverTecnicos = { label: "Volver a Técnicos", value: "tecnicos" };
  const volverInicio = { label: "Volver al inicio", value: "inicio" };

  switch (value) {
    case "ver_tecnico":
      return {
        text: `Ver técnico:\n1️⃣ Ingresa al módulo de Técnicos.\n2️⃣ Selecciona "Ver técnico".\n3️⃣ Consulta la lista o busca por nombre/código.`,
        options: [volverTecnicos, volverInicio],
      };
    case "crear_tecnico":
      return {
        text: `Crear técnico:\n1️⃣ Haz clic en "Añadir Técnico".\n2️⃣ Completa el formulario.\n3️⃣ Haz clic en "Añadir Técnico".\n✅ Técnico agregado.`,
        options: [volverTecnicos, volverInicio],
      };
    case "modificar_tecnico":
      return {
        text: `Modificar técnico:\n1️⃣ Busca el técnico.\n2️⃣ Haz clic en editar ✏️.\n3️⃣ Actualiza los datos.\n✅ Técnico modificado.`,
        options: [volverTecnicos, volverInicio],
      };
    case "eliminar_tecnico":
      return {
        text: `Eliminar técnico:\n1️⃣ Busca el técnico.\n2️⃣ Haz clic en el ícono de basura 🗑️.\n3️⃣ Confirma la eliminación.\n✅ Técnico eliminado.`,
        options: [volverTecnicos, volverInicio],
      };
    default:
      return {
        text: `Opción desconocida. Por favor elige otra opción.`,
        options: [volverTecnicos, volverInicio],
      };
  }
};
