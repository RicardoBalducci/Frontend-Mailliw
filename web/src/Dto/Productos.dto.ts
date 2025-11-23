// src/dtos/Producto.dto.ts
export interface ProductoDTO {
  id: number; // Optional because it might not exist on creation
  nombre: string;
  descripcion: string;
  stock: number;
  precio_unitario: number; // This will be in Bolívares
  precio_usd: number;
}
export interface CreateProductoDTO {
  nombre: string;
  descripcion: string;
  stock: number;
  precio_unitario: number; // This will be in Bolívares
}
export interface UpdateProductoDTO {
  nombre?: string;
  descripcion?: string;
  stock?: number;
  precio_unitario?: number;
}
