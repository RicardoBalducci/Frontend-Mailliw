import { BASE_API } from "./Base";

const API_BASE_URL = `${BASE_API}notificaciones/bajo-stock`;

export interface Notificacion {
  tipo: string;
  id: number;
  nombre: string;
  stock: number;
  mensaje: string;
}

export interface NotificacionesResponse {
  data: Notificacion[];
}

class NotificacionesServices {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP error! Status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        console.warn("Could not parse error response");
      }
      throw new Error(errorMessage);
    }

    try {
      return await response.json();
    } catch {
      throw new Error("Invalid JSON response from server");
    }
  }

  // Obtener notificaciones de bajo stock
  async getBajoStock(): Promise<NotificacionesResponse> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return await this.handleResponse<NotificacionesResponse>(response);
    } catch (error) {
      console.error("Error en getBajoStock:", error);
      throw new Error(
        error instanceof Error ? error.message : "Error al obtener notificaciones."
      );
    }
  }
}

export default new NotificacionesServices();
