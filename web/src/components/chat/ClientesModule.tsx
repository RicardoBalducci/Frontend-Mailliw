export interface ClienteOption {
  label: string;
  value: string;
}

export interface ClientesModuleData {
  message: string;
  options: ClienteOption[];
}

export const ClientesModule = (): ClientesModuleData => ({
  message: `Módulo de *Clientes*: aquí puedes gestionar los clientes del sistema. 
Selecciona una de las siguientes opciones para continuar:`,
  options: [
    { label: "Ver cliente", value: "ver_cliente" },
    { label: "Crear cliente", value: "crear_cliente" },
    { label: "Eliminar cliente", value: "eliminar_cliente" },
    { label: "Modificar cliente", value: "modificar_cliente" },
  ],
});

export const handleClienteOption = (value: string) => {
  const volverClientes = { label: "Volver a Clientes", value: "clientes" };
  const volverInicio = { label: "Volver al inicio", value: "inicio" };

  switch (value) {
    case "ver_cliente":
      return {
        text: `Ver cliente:\n1️⃣ Ingresa al módulo de Clientes.\n2️⃣ Selecciona "Ver cliente".\n3️⃣ Consulta la lista o busca por nombre/código.`,
        options: [volverClientes, volverInicio],
      };
    case "crear_cliente":
      return {
        text: `Crear cliente:\n1️⃣ Haz clic en "Añadir Cliente".\n2️⃣ Completa el formulario.\n3️⃣ Haz clic en "Añadir Cliente".\n✅ Cliente agregado.`,
        options: [volverClientes, volverInicio],
      };
    case "modificar_cliente":
      return {
        text: `Modificar cliente:\n1️⃣ Busca el cliente.\n2️⃣ Haz clic en editar ✏️.\n3️⃣ Actualiza los datos.\n✅ Cliente modificado.`,
        options: [volverClientes, volverInicio],
      };
    case "eliminar_cliente":
      return {
        text: `Eliminar cliente:\n1️⃣ Busca el cliente.\n2️⃣ Haz clic en el ícono de basura 🗑️.\n3️⃣ Confirma la eliminación.\n✅ Cliente eliminado.`,
        options: [volverClientes, volverInicio],
      };
    default:
      return {
        text: `Opción desconocida. Por favor elige otra opción.`,
        options: [volverClientes, volverInicio],
      };
  }
};
