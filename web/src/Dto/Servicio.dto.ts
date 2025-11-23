import { MaterialesDto } from "./Materiales.dto";
import { UserDto } from "./UserDto";

export interface ServicioDTO {
  id: number;
  nombre: string;
  descripcion: string;
  precio_estandar_usd: number;
  monto_bs: number;
  fecha_servicio: Date;
  materialesUsados: MaterialesDto[];
  tecnicosCalificados: UserDto[];
}

export interface UpdateServicioDTO {
  nombre: string;
  descripcion: string;
  precio_estandar_usd: number;
  materialesUsados: MaterialesDto[];
  tecnicosCalificados: UserDto[];
}
