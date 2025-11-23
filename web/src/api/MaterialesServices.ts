import axios from "axios";
import {
  CreateMaterialesDto,
  MaterialesDto,
  UpdateMaterialesDto,
} from "../Dto/Materiales.dto";
import { Material } from "../interface/material.interace";
import { BASE_API } from "./Base";
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
    this.baseUrl = `${BASE_API}materiales`;
    this.token = localStorage.getItem("access_token");
  }

  // Crear un nuevo material
  async create(createMaterialDto: CreateMaterialesDto): Promise<{
    success: boolean;
    message: string;
    data: Material | null;
  }> {
    try {
      const response = await axios.post(this.baseUrl, createMaterialDto, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      return {
        success: true,
        message: "Material creado exitosamente.",
        data: response.data,
      };
    } catch (error) {
      console.error("Error creando material:", error);

      return {
        success: false,
        message: "Error al crear el material.",
        data: null,
      };
    }
  }

  async findAll(
    pagina: number = 1,
    perPage: number = 10
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
    updateMaterialDto: UpdateMaterialesDto
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
