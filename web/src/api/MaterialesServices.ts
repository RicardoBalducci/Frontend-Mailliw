import axios from "axios";
import { MaterialesDto } from "../Dto/Materiales.dto";
import { Material } from "../interface/material.interace";
export interface PaginatedMaterialsResponse {
  data: MaterialesDto[];
  total: number;
  pagina: number;
  perPage: number;
}

// Define the structure for the pagination request body
interface PaginacionRequestBody {
  pagina?: number;
  perPage?: number;
}

class MaterialesServices {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = "http://localhost:3000/materiales";
    this.token = localStorage.getItem("access_token");
  }

  // Crear un nuevo material
  async create(createMaterialDto: MaterialesDto): Promise<Material> {
    const response = await axios.post(this.baseUrl, createMaterialDto, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return response.data;
  }

  // Obtener todos los materiales
  async findAll(
    pagina: number = 1, // Default values for the frontend
    perPage: number = 10 // Default values for the frontend
  ): Promise<PaginatedMaterialsResponse> {
    const requestBody: PaginacionRequestBody = { pagina, perPage };

    try {
      const response = await axios.get<PaginatedMaterialsResponse>(
        `${this.baseUrl}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
          params: requestBody,
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "Error al obtener materiales paginados."
        );
      }
      throw new Error("Error desconocido al obtener materiales paginados.");
    }
  }

  // Obtener un material por ID
  async findOne(id: number): Promise<Material> {
    const response = await axios.get(`${this.baseUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return response.data;
  }

  // Actualizar un material
  async update(
    id: number,
    updateMaterialDto: MaterialesDto
  ): Promise<Material> {
    const response = await axios.patch(
      `${this.baseUrl}/${id}`,
      updateMaterialDto,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
    return response.data;
  }

  // Reducir stock de un material
  async updateStock(id: number, cantidad: number): Promise<Material> {
    const response = await axios.patch(
      `${this.baseUrl}/${id}/reducir-stock`,
      { cantidad },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
    return response.data;
  }

  // Eliminar un material
  async delete(id: number): Promise<void> {
    const response = await axios.delete(`${this.baseUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return response.data;
  }
}

export default new MaterialesServices();
