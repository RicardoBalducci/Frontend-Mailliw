export interface MaterialOption {
  label: string;
  value: string;
}

export interface MaterialesModuleData {
  message: string;
  options: MaterialOption[];
}

// Módulo principal de Materiales
export const MaterialesModule = (): MaterialesModuleData => ({
  message: `Módulo de *Materiales*: aquí puedes gestionar todos los materiales disponibles en el sistema. 
Selecciona una de las opciones para continuar:`,
  options: [
    { label: "Ver material", value: "ver_material" },
    { label: "Crear material", value: "crear_material" },
    { label: "Modificar material", value: "modificar_material" },
    { label: "Eliminar material", value: "eliminar_material" },
  ],
});

// Función que maneja las opciones del módulo de Materiales
export const handleMaterialOption = (value: string) => {
  const volverMateriales = { label: "Volver a Materiales", value: "material" };
  const volverInicio = { label: "Volver al inicio", value: "inicio" };

  switch (value) {
    case "ver_material":
      return {
        text: `Ver material:\n1️⃣ Ingresa al módulo de Materiales.\n2️⃣ Selecciona "Ver material".\n3️⃣ Consulta la lista o busca por nombre/código.`,
        options: [volverMateriales, volverInicio],
      };

    case "crear_material":
      return {
        text: `Crear material:\n1️⃣ Haz clic en "Añadir Material".\n2️⃣ Completa el formulario con los datos del nuevo material.\n3️⃣ Haz clic en "Añadir Material" para registrarlo.\n✅ Material agregado exitosamente.`,
        options: [volverMateriales, volverInicio],
      };

    case "modificar_material":
      return {
        text: `Modificar material:\n1️⃣ Busca el material que deseas modificar.\n2️⃣ Haz clic en editar ✏️ junto al material.\n3️⃣ Actualiza los datos y guarda los cambios.\n✅ Material modificado exitosamente.`,
        options: [volverMateriales, volverInicio],
      };

    case "eliminar_material":
      return {
        text: `Eliminar material:\n1️⃣ Busca el material que deseas eliminar.\n2️⃣ Haz clic en el ícono de basura 🗑️.\n3️⃣ Confirma la eliminación.\n✅ Material eliminado exitosamente.`,
        options: [volverMateriales, volverInicio],
      };

    default:
      return {
        text: `Opción desconocida. Por favor selecciona otra opción.`,
        options: [volverMateriales, volverInicio],
      };
  }
};
