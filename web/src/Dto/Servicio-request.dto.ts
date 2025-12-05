// DTO para crear un nuevo servicio
export interface CreateServicioDto {
  nombre: string;
  descripcion: string;
  precio_estandar_usd: number;

  materiales_utilizados?: number[];
  productos_asociados?: number[];
}

// DTO para actualizar servicio
export interface UpdateServicioDto {
  nombre?: string;
  descripcion?: string;
  precio_estandar_usd?: number;

  materiales_utilizados?: number[];
  productos_asociados?: number[];
}
