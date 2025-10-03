// API/DolarServices.ts
import axios from "axios";
import { BASE_API } from "./Base";

class DolarServices {
  static async getDolarToday() {
    try {
      const response = await axios.get(`${BASE_API}exchange/dollar`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Error al obtener dólar oficial"
        );
      }
      throw new Error("Error de conexión");
    }
  }
}

export default DolarServices;
