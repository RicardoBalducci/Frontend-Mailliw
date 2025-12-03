// src/types/dto/venta.dto.ts

export interface ProductoVenta {
  id: number;
  cantidad: number;
}

export interface ServicioVenta {
  id: number;
  cantidad?: number;
}

export interface CreateVentaDto {
  cliente_id: number;
  productos?: ProductoVenta[];
  servicios?: ServicioVenta[];
}
