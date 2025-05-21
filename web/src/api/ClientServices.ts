class ClienteServices {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = "http://localhost:3000/clientes";
    this.token = localStorage.getItem("access_token");
  }

  async fetchClientes() {
    try {
      const response = await fetch(this.baseUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Error en la respuesta del servidor");
      return await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  async createCliente(cliente: {
    rif: string;
    nombre: string;
    apellido: string;
    direccion: string;
    telefono: string;
  }) {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cliente),
      });
      if (!response.ok) throw new Error("Error al crear el cliente");
      return await response.json();
    } catch (error) {
      console.error("Error creating cliente:", error);
      throw error;
    }
  }

  async updateCliente(
    id: number,
    cliente: { nombre: string; email: string; telefono: string }
  ) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cliente),
      });
      if (!response.ok) throw new Error("Error al actualizar el cliente");
      return await response.json();
    } catch (error) {
      console.error("Error updating cliente:", error);
      throw error;
    }
  }

  async deleteCliente(id: number) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Error al eliminar el cliente");
      return await response.json();
    } catch (error) {
      console.error("Error deleting cliente:", error);
      throw error;
    }
  }
}

export default new ClienteServices();
