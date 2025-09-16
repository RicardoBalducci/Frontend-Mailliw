import axios from "axios";
import { BASE_API } from "./Base";

// Define the Gastos interface (can be shared with your component)
export interface Gasto {
  id: number;
  concepto: string;
  fecha: string; // ISO 8601 string (e.g., "YYYY-MM-DD")
  tipo_gasto: "fijo" | "variable";
  monto_gastado: string; // String as per your API example, but will be converted to number for PATCH
}
export interface CreateGastoDto {
  concepto: string;
  fecha: string;
  tipo_gasto: "fijo" | "variable";
  monto_gastado: number; // API expects a number for amount
}

// Define an interface for the update DTO if it differs from CreateGastoDto or Gasto
// For a PATCH request, you might only send partial data, so 'Partial<Gasto>' is often suitable.
export interface UpdateGastoDto {
  concepto?: string;
  fecha?: string;
  tipo_gasto?: "fijo" | "variable";
  monto_gastado?: number;
}

class GastosService {
  private baseUrl: string;
  // If your NestJS backend requires a token for fetching gastos, uncomment and use it
  // private token: string | null;

  constructor() {
    this.baseUrl = `${BASE_API}gastos`;
    // this.token = localStorage.getItem("access_token"); // Example: if authentication is needed
  }

  /**
   * Fetches all gastos from the API.
   * @returns A promise that resolves to an array of Gasto objects.
   */
  async fetchAllGastos(): Promise<Gasto[]> {
    try {
      const response = await axios.get<Gasto[]>(this.baseUrl, {
        // headers: { // Uncomment if you need authentication
        //   Authorization: `Bearer ${this.token}`,
        // },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching gastos:", error);
      // Re-throw the error so the component can handle it
      throw new Error(
        "No se pudieron cargar los gastos. Intenta de nuevo más tarde."
      );
    }
  }

  /**
   * Creates a new gasto via the API.
   * @param newGastoData The data for the new gasto.
   * @returns A promise that resolves to the created Gasto object.
   */
  async createGasto(newGastoData: CreateGastoDto): Promise<Gasto> {
    try {
      const response = await axios.post<Gasto>(this.baseUrl, newGastoData, {
        // headers: { // Uncomment if you need authentication
        //   Authorization: `Bearer ${this.token}`,
        //   'Content-Type': 'application/json', // Often not strictly necessary, but good practice
        // },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating gasto:", error);
      if (axios.isAxiosError(error) && error.response) {
        // Handle specific API error messages
        throw new Error(
          error.response.data.message ||
            "Error al crear el gasto. Verifica los datos."
        );
      }
      throw new Error("No se pudo crear el gasto. Intenta de nuevo más tarde.");
    }
  }

  /**
   * Updates an existing gasto via the API using a PATCH request.
   * @param id The ID of the gasto to update.
   * @param updatedGastoData The data to update the gasto with.
   * @returns A promise that resolves to the updated Gasto object.
   */
  async updateGasto(
    id: number,
    updatedGastoData: UpdateGastoDto
  ): Promise<Gasto> {
    try {
      // Ensure monto_gastado is converted to number if it's coming as string
      const dataToSend = {
        ...updatedGastoData,
        monto_gastado:
          updatedGastoData.monto_gastado !== undefined
            ? parseFloat(String(updatedGastoData.monto_gastado))
            : undefined,
      };

      const response = await axios.patch<Gasto>(
        `${this.baseUrl}/${id}`,
        dataToSend,
        {
          // headers: { // Uncomment if you need authentication
          //   Authorization: `Bearer ${this.token}`,
          //   'Content-Type': 'application/json',
          // },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating gasto with ID ${id}:`, error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message ||
            "Error al actualizar el gasto. Verifica los datos."
        );
      }
      throw new Error(
        "No se pudo actualizar el gasto. Intenta de nuevo más tarde."
      );
    }
  }

  /**
   * Deletes a gasto via the API.
   * @param id The ID of the gasto to delete.
   * @returns A promise that resolves when the gasto is deleted.
   */
  async deleteGasto(id: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`, {
        // headers: { // Uncomment if you need authentication
        //   Authorization: `Bearer ${this.token}`,
        // },
      });
      console.log(`Gasto with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting gasto with ID ${id}:`, error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message ||
            "Error al eliminar el gasto. Intenta de nuevo."
        );
      }
      throw new Error(
        "No se pudo eliminar el gasto. Intenta de nuevo más tarde."
      );
    }
  }
}

export const gastosService = new GastosService();
