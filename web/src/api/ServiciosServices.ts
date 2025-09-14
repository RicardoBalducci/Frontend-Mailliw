import type { ServicioDTO } from "../Dto/Servicio.dto";
import type {
  CreateServicioDto,
  UpdateServicioDto,
} from "../Dto/Servicio-request.dto";

const API_BASE_URL = "http://localhost:3000/servicios";

class ServiciosServices {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;

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
    } catch (e) {
      if (e instanceof Error) {
        throw e; // Re-lanza el mismo error
      }
      throw new Error(String(e));
    }
  }

  async getServicios(page = 1, perPage = 10): Promise<ServicioDTO[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}?page=${page}&per_page=${perPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await this.handleResponse<
        ServicioDTO[] | { data: ServicioDTO[] }
      >(response);

      // Manejar tanto respuestas directas como paginadas
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      console.error("Error en getServicios:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error al obtener los servicios."
      );
    }
  }

  async getServicioById(id: number): Promise<ServicioDTO> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return await this.handleResponse<ServicioDTO>(response);
    } catch (error) {
      console.error("Error en getServicioById:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : `Servicio con ID ${id} no encontrado.`
      );
    }
  }

  async createServicio(servicioData: CreateServicioDto): Promise<ServicioDTO> {
    try {
      // Validar datos antes de enviar
      if (!servicioData.nombre?.trim()) {
        throw new Error("El nombre del servicio es requerido");
      }
      if (!servicioData.descripcion?.trim()) {
        throw new Error("La descripción es requerida");
      }
      if (
        typeof servicioData.precio_estandar_usd !== "number" ||
        servicioData.precio_estandar_usd <= 0
      ) {
        throw new Error("El precio en USD debe ser un número mayor a 0");
      }
      if (
        typeof servicioData.monto_bs !== "number" ||
        servicioData.monto_bs <= 0
      ) {
        throw new Error("El monto en Bs debe ser un número mayor a 0");
      }

      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(servicioData),
      });

      return await this.handleResponse<ServicioDTO>(response);
    } catch (error) {
      console.error("Error en createServicio:", error);
      throw new Error(
        error instanceof Error ? error.message : "Error al crear el servicio."
      );
    }
  }

  async updateServicio(
    id: number,
    updatedData: UpdateServicioDto
  ): Promise<ServicioDTO> {
    try {
      if (!id || id <= 0) {
        throw new Error("ID de servicio inválido");
      }

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      return await this.handleResponse<ServicioDTO>(response);
    } catch (error) {
      console.error("Error en updateServicio:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : `Error al actualizar el servicio con ID ${id}.`
      );
    }
  }

  async deleteServicio(id: number): Promise<void> {
    try {
      if (!id || id <= 0) {
        throw new Error("ID de servicio inválido");
      }

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      await this.handleResponse<void>(response);
    } catch (error) {
      console.error("Error en deleteServicio:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : `Error al eliminar el servicio con ID ${id}.`
      );
    }
  }
}

export default new ServiciosServices();
