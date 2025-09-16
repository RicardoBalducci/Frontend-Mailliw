import { CreateCompraDto } from "../Dto/Compra-request.dto";
import { CompraDTO } from "../Dto/Compra.dto";
import { BASE_API } from "./Base";

const API_BASE_URL = `${BASE_API}compras`;

class ComprasServices {
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

  async createCompra(compraData: CreateCompraDto): Promise<CompraDTO> {
    try {
      // Basic validation
      if (!compraData.proveedor_id) {
        throw new Error("El proveedor es requerido.");
      }
      if (!compraData.materiales || compraData.materiales.length === 0) {
        throw new Error("Debe añadir al menos un material a la compra.");
      }
      compraData.materiales.forEach((item) => {
        if (!item.material_id || item.cantidad <= 0) {
          throw new Error(
            "Cada material debe tener un ID válido y una cantidad mayor a 0."
          );
        }
      });

      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(compraData),
      });

      return await this.handleResponse<CompraDTO>(response);
    } catch (error) {
      console.error("Error en createCompra:", error);
      throw new Error(
        error instanceof Error ? error.message : "Error al crear la compra."
      );
    }
  }
}

export default new ComprasServices();
