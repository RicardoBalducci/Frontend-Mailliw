// Define la estructura de los datos para crear un nuevo servicio
export interface CreateServicioDto {
  nombre: string;
  descripcion: string;
  precio_estandar_usd: number;
  //monto_bs: number;
  // Opcionalmente, si la API espera IDs de las relaciones en el DTO
  materiales_utilizados?: number[];
  tecnicos_calificados?: number[];
}

// Define la estructura de los datos para actualizar un servicio
// Todas las propiedades son opcionales, ya que solo se envían los campos que cambian
export interface UpdateServicioDto {
  nombre?: string;
  descripcion?: string;
  precio_estandar_usd?: number;
  monto_bs?: number;
  materialesUsadosIds?: number[];
  tecnicosCalificadosIds?: number[];
}
