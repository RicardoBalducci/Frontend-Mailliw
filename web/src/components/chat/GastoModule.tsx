export interface GastoOption {
  label: string;
  value: string;
}

export interface GastosModuleData {
  message: string;
  options: GastoOption[];
}

// Módulo principal de Gastos
export const GastosModule = (): GastosModuleData => ({
  message: `Módulo de *Gastos*: aquí puedes gestionar todos los gastos del sistema. 
Selecciona una de las opciones para continuar:`,
  options: [
    { label: "Ver gastos", value: "ver_gastos" },
    { label: "Añadir gasto", value: "anadir_gasto" },
    { label: "Modificar gasto", value: "modificar_gasto" },
    { label: "Eliminar gasto", value: "eliminar_gasto" },
  ],
});

// Función que maneja las opciones del módulo de Gastos
export const handleGastoOption = (value: string) => {
  const volverGastos = { label: "Volver a Gastos", value: "gastos" };
  const volverInicio = { label: "Volver al inicio", value: "inicio" };

  switch (value) {
    case "ver_gastos":
      return {
        text: `Ver gastos:\n1️⃣ Ingresa al módulo de Gastos.\n2️⃣ Selecciona "Ver gastos".\n3️⃣ Consulta la lista de gastos o filtra por fecha, categoría o monto.`,
        options: [volverGastos, volverInicio],
      };

    case "anadir_gasto":
      return {
        text: `Añadir gasto:\nSigue estos pasos para registrar un nuevo gasto:\n
1️⃣ Selecciona la fecha del gasto.\n
2️⃣ Si la fecha ya tiene gastos registrados, haz clic en "Añadir nuevo gasto".\n
3️⃣ Si no hay gastos en esa fecha, completa el formulario con los datos del gasto.\n
4️⃣ Haz clic en "Guardar gasto" para registrar la transacción.\n✅ Gasto agregado exitosamente.`,
        options: [volverGastos, volverInicio],
      };

    case "modificar_gasto":
      return {
        text: `Modificar gasto:\n1️⃣ Selecciona la fecha del gasto a modificar.\n2️⃣ Si hay varios gastos, selecciona el gasto que deseas modificar.\n3️⃣ Actualiza los datos necesarios en el formulario.\n4️⃣ Haz clic en "Guardar" para actualizar el gasto.\n✅ Gasto modificado exitosamente.`,
        options: [volverGastos, volverInicio],
      };

    case "eliminar_gasto":
      return {
        text: `Eliminar gasto:\n1️⃣ Selecciona la fecha del gasto que deseas eliminar.\n2️⃣ Si hay varios gastos, selecciona el gasto específico.\n3️⃣ Haz clic en el ícono de eliminar y confirma la acción.\n✅ Gasto eliminado exitosamente.`,
        options: [volverGastos, volverInicio],
      };

    default:
      return {
        text: `Opción desconocida. Por favor selecciona otra opción.`,
        options: [volverGastos, volverInicio],
      };
  }
};
