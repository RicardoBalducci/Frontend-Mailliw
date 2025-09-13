// src/dtos/Producto.dto.ts
export interface ProductoDTO {
  id?: number; // Optional because it might not exist on creation
  nombre: string;
  descripcion: string;
  stock: number;
  precio_unitario: number; // This will be in Bolívares
  precio_usd: number;
  // category?: string;
}
