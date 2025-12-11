export interface MaterialItem {
  id: number;
  cantidad: number;
  precio_unitario_bs: string;
  precio_unitario_usd: string;
  material: {
    id: number;
    nombre: string;
    descripcion: string;
    stock: number;
    marca: string;
    precio_unitario_usd: string;
  };
}

export interface ProductoItem {
  id: number;
  cantidad: number;
  precio_unitario: number;
  producto: {
    id: number;
    nombre: string;
    descripcion: string;
    stock: number;
    marca: string;
    precio_unitario: string;
    precio_venta: string;
  };
}

export interface Proveedor {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
}

export interface Compra {
  id: number;
  fecha: string;
  proveedor: Proveedor;
  materiales: MaterialItem[];
  productos: ProductoItem[];
  totalUsd: number;
}
export interface CompraDTO {
  id: number;
  fecha: string;
  proveedor: {
    id: number;
    nombre: string;
    telefono: string;
    rif:string;
    direccion: string;
  };
  materiales: MaterialItem[];
  productos: ProductoItem[];
}
