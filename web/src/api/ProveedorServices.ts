// src/api/ProveedorServices.ts (adjust path as needed, based on your project structure)
import axios from "axios";
import {
  ProveedorDto,
  ProveedorCreateDto,
  ProveedorUpdateDto,
} from "../Dto/Proveedor.dto";
import { PaginatedResponse } from "./PaginatedResponse.dto";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"; // Adjust your base URL as necessary

class ProveedorServices {
  static async create(proveedor: ProveedorCreateDto): Promise<ProveedorDto> {
    try {
      const response = await axios.post<ProveedorDto>(
        `${BASE_URL}/proveedores`,
        proveedor
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Error al crear el proveedor."
        );
      }
      throw new Error("Error de conexión al crear proveedor.");
    }
  }

  // --- UPDATED findAll method to handle pagination ---
  static async findAll(
    page: number = 1,
    perPage: number = 10
  ): Promise<PaginatedResponse<ProveedorDto>> {
    try {
      const response = await axios.get<PaginatedResponse<ProveedorDto>>(
        `${BASE_URL}/proveedores`,
        {
          params: { page, perPage }, // Pass pagination parameters as query params
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message ||
            "Error al obtener la lista de proveedores."
        );
      }
      throw new Error("Error de conexión al obtener proveedores.");
    }
  }
  // --- END UPDATED findAll method ---

  static async findOne(id: number): Promise<ProveedorDto> {
    try {
      const response = await axios.get<ProveedorDto>(
        `${BASE_URL}/proveedores/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Error al obtener el proveedor."
        );
      }
      throw new Error("Error de conexión al obtener proveedor.");
    }
  }

  static async update(
    id: number,
    proveedor: ProveedorUpdateDto
  ): Promise<ProveedorDto> {
    try {
      const response = await axios.patch<ProveedorDto>(
        `${BASE_URL}/proveedores/${id}`,
        proveedor
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Error al actualizar el proveedor."
        );
      }
      throw new Error("Error de conexión al actualizar proveedor.");
    }
  }

  static async remove(id: number): Promise<void> {
    try {
      await axios.delete(`${BASE_URL}/proveedores/${id}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Error al eliminar el proveedor."
        );
      }
      throw new Error("Error de conexión al eliminar proveedor.");
    }
  }
}

export default ProveedorServices;
