// ClienteServices.ts (updated)
import { ClienteDTO } from "../Dto/Cliente.dto"; // Adjust path as needed
import { ClientRow } from "../layout/client/Client";
import { BASE_API } from "./Base";

class ClienteServices {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = `${BASE_API}clientes`;
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

  async fetchClientes(rif?: string): Promise<{
    success: boolean;
    data?: ClientRow[];
    message?: string;
  }> {
    try {
      const url = rif
        ? `${this.baseUrl}?rif=${encodeURIComponent(rif)}`
        : this.baseUrl;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error("Error fetching data:", error);
      return {
        success: false,
        message: "Error de conexión al obtener clientes.",
      };
    }
  }

  async createCliente(
    cliente: ClienteDTO // Use the DTO here
  ): Promise<{ success: boolean; data?: ClienteDTO; message?: string }> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cliente),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error("Error creating cliente:", error);
      return { success: false, message: "Error de conexión al crear cliente." };
    }
  }

  async updateCliente(
    id: number,
    cliente: ClienteDTO // Use the DTO here
  ): Promise<{ success: boolean; data?: ClienteDTO; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cliente),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error("Error updating cliente:", error);
      return {
        success: false,
        message: "Error de conexión al actualizar cliente.",
      };
    }
  }

  async deleteCliente(
    id: number
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error("Error deleting cliente:", error);
      return {
        success: false,
        message: "Error de conexión al eliminar cliente.",
      };
    }
  }
}

export default new ClienteServices();
