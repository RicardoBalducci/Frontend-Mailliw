export interface VentaOption {
  label: string;
  value: string;
}

export interface VentasModuleData {
  message: string;
  options: VentaOption[];
}

export const VentasModule = (): VentasModuleData => ({
  message: `Módulo de *Ventas*: en esta sección puedes gestionar todas las operaciones comerciales del sistema. 
Aquí podrás consultar el historial de ventas realizadas, así como registrar nuevas ventas de manera rápida y organizada. 
Selecciona una de las opciones a continuación para continuar:`,
  options: [
    { label: "Historial de ventas", value: "historial_ventas" },
    { label: "Realización de venta", value: "realizar_venta" },
  ],
});

export const handleVentasOption = (value: string) => {
  const volverVentas = { label: "Volver a Ventas", value: "ventas" };
  const volverInicio = { label: "Volver al inicio", value: "inicio" };

  switch (value) {
    case "historial_ventas":
      return {
        text: `Historial de Ventas:\nEn esta sección puedes consultar todas las ventas registradas en el sistema, filtrar por fechas, clientes, productos o servicios, y obtener información detallada de cada transacción.\nPuedes elegir una de las siguientes acciones:`,
        options: [
          { label: "Ver historial de ventas", value: "ver_historial_ventas" },
          { label: "Exportar historial de ventas", value: "exportar_historial_ventas" },
          volverVentas,
          volverInicio,
        ],
      };

    case "realizar_venta":
      return {
        text: `Realización de Venta:\nEste proceso te permite registrar una nueva venta paso a paso de manera segura y organizada:\n
>1️⃣ Ingresa el D.I. del cliente. Si el cliente no está registrado, primero registralo.\n
>2️⃣ Selecciona los productos o servicios que se añadirán a la venta, asegurándote de verificar cantidades y precios.\n
>3️⃣ Indica el método de pago que se utilizará: Zelle, transferencia bancaria o pago móvil.\n
>4️⃣ Agrega una nota o comentario adicional sobre la venta (opcional, por ejemplo, detalles del pedido o información relevante del cliente).\n
>5️⃣ Confirma y finaliza la venta, registrando la transacción en el sistema de manera definitiva.`,
        options: [volverVentas, volverInicio],
      };

    case "ver_historial_ventas":
      return {
        text: `Ver Historial de Ventas:\nAquí podrás consultar todas las ventas realizadas, con información detallada como fecha, cliente, productos/servicios vendidos y total de la transacción. Puedes aplicar filtros para facilitar la búsqueda y encontrar rápidamente la información que necesitas.`,
        options: [volverVentas, volverInicio],
      };

    case "exportar_historial_ventas":
      return {
        text: `Exportar Historial de Ventas:\nDesde esta opción puedes generar reportes completos del historial de ventas en formato como PDF, lo que permite analizar la información de manera externa, compartirla con el equipo o mantener registros contables actualizados.`,
        options: [volverVentas, volverInicio],
      };

    default:
      return {
        text: `Opción desconocida. Por favor selecciona una de las opciones disponibles para continuar.`,
        options: [volverVentas, volverInicio],
      };
  }
};
