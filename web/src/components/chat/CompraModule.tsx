export interface CompraOption {
  label: string;
  value: string;
}

export interface ComprasModuleData {
  message: string;
  options: CompraOption[];
}

// Módulo principal de Compras
export const ComprasModule = (): ComprasModuleData => ({
  message: `Módulo de *Compras*: aquí puedes gestionar todas las compras con proveedores. 
Puedes consultar el historial o registrar una nueva compra. Selecciona una opción para continuar:`,
  options: [
    { label: "Historial de compras", value: "historial_compras" },
    { label: "Registrar nueva compra", value: "registrar_compra" },
  ],
});

// Función que maneja las opciones del módulo de compras
export const handleComprasOption = (value: string) => {
  const volverCompras = { label: "Volver a Compras", value: "compra" };
  const volverInicio = { label: "Volver al inicio", value: "inicio" };

  switch (value) {
    case "historial_compras":
      return {
        text: `Historial de Compras:\nConsulta todas las compras registradas, filtrando por fechas, proveedores, materiales o productos. Puedes revisar los detalles de cada transacción.`,
        options: [
          { label: "Ver historial de compras", value: "ver_historial_compras" },
          { label: "Exportar historial de compras", value: "exportar_historial_compras" },
          volverCompras,
          volverInicio,
        ],
      };

    case "registrar_compra":
      return {
        text: `Registrar Nueva Compra:\nSigue estos pasos para registrar una compra correctamente:\n
>1️⃣ Busca el nombre del proveedor. Si no existe, registralo dando click en "añadir proveedor".\n
>2️⃣ Selecciona el material o producto que deseas comprar.\n
>3️⃣ Ingresa la cantidad deseada.\n
>4️⃣ Haz clic en "Añadir al carrito" para incluirlo en la compra.\n
>5️⃣ Cuando hayas agregado todos los productos, haz clic en "Guardar compra" para finalizar y registrar la transacción.`,
        options: [volverCompras, volverInicio],
      };

    case "ver_historial_compras":
      return {
        text: `Ver Historial de Compras:\nAquí puedes consultar todas las compras registradas con detalles como proveedor, materiales/productos, cantidades y fecha de adquisición.`,
        options: [volverCompras, volverInicio],
      };

    case "exportar_historial_compras":
      return {
        text: `Exportar Historial de Compras:\nGenera un archivo PDF con el historial completo de compras para análisis, control de inventario o registro contable.`,
        options: [volverCompras, volverInicio],
      };

    default:
      return {
        text: `Opción desconocida. Por favor selecciona una de las opciones disponibles.`,
        options: [volverCompras, volverInicio],
      };
  }
};
