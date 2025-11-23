// API/UserServices.ts
import axios from "axios";
import { UserDto } from "../layout/Technics/interface/user.dto";
import { BASE_API } from "./Base";

class UserServices {
  static async loginUser(username: string, password: string) {
    try {
      const response = await axios.post(`${BASE_API}auth/login`, {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Error en la autenticación"
        );
      }
      throw new Error("Error de conexión");
    }
  }

  static async getTechnicians() {
    try {
      const response = await axios.get(`${BASE_API}users/tecnicos`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Error al obtener técnicos"
        );
      }
      throw new Error("Error de conexión");
    }
  }


    static async getAll() {
    try {
      const response = await axios.get(`${BASE_API}users`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Error al obtener técnicos"
        );
      }
      throw new Error("Error de conexión");
    }
  }

  static async createTechnician(technicianData: UserDto) {
    try {
      const response = await axios.post(
        `${BASE_API}auth/register`,
        technicianData
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Error al crear técnico"
        );
      }
      throw new Error("Error de conexión");
    }
  }

  static async deleteUser(id: number) {
    try {
      const response = await axios.delete(`${BASE_API}users/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Error al eliminar usuario"
        );
      }
      throw new Error("Error de conexión");
    }
  }

  static async updateTechnician(id: number, updatedData: Partial<UserDto>) {
    try {
      const response = await axios.put(`${BASE_API}users/${id}`, updatedData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Error al actualizar el técnico"
        );
      }
      throw new Error("Error de conexión");
    }
  }
}

export default UserServices;
