// API/UserServices.ts

import axios from "axios";

export const loginUser = async (username: string, password: string) => {
  try {
    // Realiza la solicitud POST a la API de inicio de sesión
    const response = await axios.post("http://localhost:3000/auth/login", {
      password,
      username,
    });

    return response.data; // Retorna la respuesta de la API
  } catch (error) {
    // Manejo de errores
    if (axios.isAxiosError(error) && error.response) {
      // Si el error es de Axios y hay una respuesta
      throw new Error(
        error.response.data.message || "Error en la autenticación"
      );
    }
    throw new Error("Error de conexión"); // Manejo de errores de conexión
  }
};
