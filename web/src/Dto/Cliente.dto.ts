export interface ClienteDTO {
  rif: string;
  nombre: string;
  apellido?: string; // Optional because it might not always be present for companies
  direccion: string;
  telefono: string;
}

export interface RespuestaClienteDTO {
  id: string;
  rif: string;
  nombre: string;
  apellido?: string; // Optional because it might not always be present for companies
  direccion: string;
  telefono: string;
}
