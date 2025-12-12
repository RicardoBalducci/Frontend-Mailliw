import { BASE_API } from "./Base";

const API_BASE_URL = `${BASE_API}estadisticas/daily`;

export interface ProductoBajoStock {
  id: number;
  nombre: string;
  stock: number;
}

export interface ProductoVendido {
  id: number | null;
  nombre: string | null;
  cantidad_vendida: string;
}

export interface VentaVsGastos {
  total_ventas: number;
  total_gastos: number;
  balance: number;
}

export interface ProductosVsServicios {
  productos: number;
  servicios: number;
}

export interface EstadisticaDiaria {
  fecha: string;
  producto_bajo_stock: ProductoBajoStock[];
  productos_vendidos: ProductoVendido[];
  servicios_realizados: number;
  venta_vs_gastos: VentaVsGastos;
  productos_vs_servicios: ProductosVsServicios;
}

class EstadisticaServices {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP error! Status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        console.warn("No se pudo parsear la respuesta de error");
      }
      throw new Error(errorMessage);
    }

    try {
      return await response.json();
    } catch {
      throw new Error("Respuesta JSON inválida del servidor");
    }
  }

  // Obtener estadísticas del día
  async getDaily(): Promise<EstadisticaDiaria> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return await this.handleResponse<EstadisticaDiaria>(response);
    } catch (error) {
      console.error("Error en getDaily:", error);
      throw new Error(
        error instanceof Error ? error.message : "Error al obtener estadísticas diarias."
      );
    }
  }
}

export default new EstadisticaServices();
