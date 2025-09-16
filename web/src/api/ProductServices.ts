// src/api/ProductServices.ts
import { ProductoDTO } from "../Dto/Productos.dto";
import { BASE_API } from "./Base";

class ProductosServices {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = `${BASE_API}productos`;
    // In a real application, you'd want a more robust way to manage tokens (e.g., context, Redux)
    this.token = localStorage.getItem("access_token");
  }

  // Generic response handler for consistency
  private async handleResponse<T>(
    response: Response
  ): Promise<{ success: boolean; data?: T; message?: string }> {
    if (response.ok) {
      // For DELETE, response might be empty, so check content type
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return { success: true, data, message: "Operación exitosa." };
      } else {
        return { success: true, message: "Operación exitosa." }; // No JSON data, likely a successful DELETE
      }
    } else {
      let message = "Error en la operación.";
      try {
        const errorData = await response.json();
        message = errorData.message || message;
      } catch {
        // If response is not JSON, use default message
      }
      return { success: false, message };
    }
  }

  async fetchProductos(): Promise<{
    success: boolean;
    data?: ProductoDTO[];
    message?: string;
  }> {
    try {
      const response = await fetch(this.baseUrl, {
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
        message: "Error de conexión al obtener productos.",
      };
    }
  }

  async createProduct(
    product: ProductoDTO
  ): Promise<{ success: boolean; data?: ProductoDTO; message?: string }> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error("Error creating product:", error);
      return {
        success: false,
        message: "Error de conexión al crear producto.",
      };
    }
  }

  async updateProduct(
    id: number,
    product: ProductoDTO
  ): Promise<{ success: boolean; data?: ProductoDTO; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PATCH", // Using PATCH for partial updates, PUT for full replacement
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error("Error updating product:", error);
      return {
        success: false,
        message: "Error de conexión al actualizar producto.",
      };
    }
  }

  async deleteProduct(
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
      console.error("Error deleting product:", error);
      return {
        success: false,
        message: "Error de conexión al eliminar producto.",
      };
    }
  }
}

export default new ProductosServices();
