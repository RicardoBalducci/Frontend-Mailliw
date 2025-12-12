export interface ProveedorOption {
  label: string;
  value: string;
}

export interface ProveedoresModuleData {
  message: string;
  options: ProveedorOption[];
}

export const ProveedoresModule = (): ProveedoresModuleData => ({
  message: `Módulo de *Proveedores*: aquí puedes gestionar los proveedores del sistema. 
Selecciona una de las siguientes opciones para continuar:`,
  options: [
    { label: "Ver proveedor", value: "ver_proveedor" },
    { label: "Crear proveedor", value: "crear_proveedor" },
    { label: "Eliminar proveedor", value: "eliminar_proveedor" },
    { label: "Modificar proveedor", value: "modificar_proveedor" },
  ],
});

export const handleProveedorOption = (value: string) => {
  const volverProveedores = { label: "Volver a Proveedores", value: "proveedores" };
  const volverInicio = { label: "Volver al inicio", value: "inicio" };

  switch (value) {
    case "ver_proveedor":
      return {
        text: `Ver proveedor:\n1️⃣ Ingresa al módulo de Proveedores.\n2️⃣ Selecciona "Ver proveedor".\n3️⃣ Consulta la lista o busca por nombre/código.`,
        options: [volverProveedores, volverInicio],
      };
    case "crear_proveedor":
      return {
        text: `Crear proveedor:\n1️⃣ Haz clic en "Añadir Proveedor".\n2️⃣ Completa el formulario.\n3️⃣ Haz clic en "Añadir Proveedor".\n✅ Proveedor agregado.`,
        options: [volverProveedores, volverInicio],
      };
    case "modificar_proveedor":
      return {
        text: `Modificar proveedor:\n1️⃣ Busca el proveedor.\n2️⃣ Haz clic en editar ✏️.\n3️⃣ Actualiza los datos.\n✅ Proveedor modificado.`,
        options: [volverProveedores, volverInicio],
      };
    case "eliminar_proveedor":
      return {
        text: `Eliminar proveedor:\n1️⃣ Busca el proveedor.\n2️⃣ Haz clic en el ícono de basura 🗑️.\n3️⃣ Confirma la eliminación.\n✅ Proveedor eliminado.`,
        options: [volverProveedores, volverInicio],
      };
    default:
      return {
        text: `Opción desconocida. Por favor elige otra opción.`,
        options: [volverProveedores, volverInicio],
      };
  }
};
