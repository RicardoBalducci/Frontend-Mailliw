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
  tipo_venta?: string;        // nuevo
  nota?: string;              // nuevo
  productos?: ProductoVenta[];
  servicios?: ServicioVenta[];
}
