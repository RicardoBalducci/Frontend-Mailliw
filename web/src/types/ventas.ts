export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  rif: string;
  direccion: string;
  telefono: string;
}

export interface ProductoVentaHist {
  id: number;
  nombre: string;
  cantidad?: number;
}

export interface ServicioVentaHist {
  id: number;
  nombre: string;
  cantidad?: number;
}

export interface Venta {
  id: number;
  fechaVenta: string;
  total_bs: string;
  total_usd: string;
  tipo_venta: string;
  nota?: string | null;
  cliente: Cliente;
  productos?: ProductoVentaHist[];
  servicios?: ServicioVentaHist[];
}