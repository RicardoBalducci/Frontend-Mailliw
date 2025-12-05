import { MaterialesDto } from "./Materiales.dto";
import { ProductoDTO } from "./Productos.dto";

export interface ServicioDTO {
  id: number;
  nombre: string;
  descripcion: string;
  precio_estandar_usd: number;
  fecha_servicio: Date;

  materialesUsados: MaterialesDto[];
  productosAsociados: ProductoDTO[];
}
