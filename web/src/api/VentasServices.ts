import { CreateVentaDto } from "../Dto/Ventas-create.dto";
import { BASE_API } from "./Base";

const API_BASE_URL = `${BASE_API}ventas`;

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  rif: string;
  direccion: string;
  telefono: string;
}

interface Venta {
  id: number;
  fechaVenta: string;
  total_bs: string;
  total_usd: string;
  tipo_venta: string;
  nota?: string | null;
  cliente: Cliente;
}
interface VentasResponse {
  success: boolean;
  data: Venta[];
}
class VentaServices {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP error! Status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        console.warn("Could not parse error response:", parseError);
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return {} as T;
    }

    try {
      return await response.json();
    } catch {
      throw new Error("Invalid JSON response from server");
    }
  }

  // Crear venta
  async createVenta(ventaData: CreateVentaDto & { tipo_venta?: string; nota?: string }): Promise<undefined> {
    try {
      // Validación básica
      if (!ventaData.cliente_id) {
        throw new Error("El cliente es requerido.");
      }

      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ventaData),
      });

      return await this.handleResponse<undefined>(response);
    } catch (error) {
      console.error("Error en createVenta:", error);
      throw new Error(
        error instanceof Error ? error.message : "Error al crear la venta."
      );
    }
  }

async getVentas(params?: {
  fecha_inicio?: string;
  fecha_fin?: string;
  tipo_venta?: string;
  rif?: string;
  nombre?: string;
}): Promise<VentasResponse> {
  try {
    const query = new URLSearchParams();

    if (params?.fecha_inicio) query.append("fecha_inicio", params.fecha_inicio);
    if (params?.fecha_fin) query.append("fecha_fin", params.fecha_fin);
    if (params?.tipo_venta) query.append("tipo_venta", params.tipo_venta);
    if (params?.rif) query.append("rif", params.rif);

    const url = `${API_BASE_URL}?${query.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await this.handleResponse<VentasResponse>(response);
  } catch (error) {
    console.error("Error en getVentas:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error al obtener las ventas."
    );
  }
}
}

export default new VentaServices();
