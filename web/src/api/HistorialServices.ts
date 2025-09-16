// ClienteServices.ts (updated)
import { MaterialesDto } from "../Dto/Materiales.dto";
import { ProveedorDto } from "../Dto/Proveedor.dto";
import { UserDto } from "../Dto/UserDto";
import { BASE_API } from "./Base";

export interface HistorialMaterialDTO {
  id: number;
  cantidad: number;
  precio_unitario_bs: string;
  precio_unitario_usd: string;
  material: MaterialesDto;
}
export interface HistorialDTO {
  id: number;
  fecha: string; // ISO string
  proveedor?: ProveedorDto;
  materiales?: HistorialMaterialDTO[];
  user?: UserDto | null;
}

class HistorialServices {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = `${BASE_API}historial`;
    this.token = localStorage.getItem("access_token");
  }

  private async handleResponse<T>(
    response: Response
  ): Promise<{ success: boolean; data?: T; message?: string }> {
    if (response.ok) {
      const data = await response.json();
      return { success: true, data, message: "Operación exitosa." };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Error en la operación.",
      };
    }
  }

  async fetchHistorial(params?: {
    proveedorId?: number;
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<{ success: boolean; data?: HistorialDTO[]; message?: string }> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.proveedorId)
        queryParams.append("proveedor_id", String(params.proveedorId));
      if (params?.page) queryParams.append("page", String(params.page));
      if (params?.limit) queryParams.append("limit", String(params.limit));
      if (params?.startDate) queryParams.append("startDate", params.startDate);
      if (params?.endDate) queryParams.append("endDate", params.endDate);

      const response = await fetch(
        `${this.baseUrl}?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return this.handleResponse<HistorialDTO[]>(response);
    } catch (error) {
      console.error("Error fetching historial:", error);
      return {
        success: false,
        message: "Error de conexión al obtener el historial.",
      };
    }
  }
}

export default new HistorialServices();
