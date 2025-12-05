export interface CompraMaterialDto {
  material_id: number;
  cantidad: number;
  precio_unitario_bs: number;
  precio_unitario_usd: number;
}

export interface CompraProductoDto {
  producto_id: number;
  cantidad: number;
  precio_unitario_bs: number;
  precio_unitario_usd: number;
}

export interface CreateCompraDto {
  proveedor_id: number;
  materiales: CompraMaterialDto[];
  productos: CompraProductoDto[];
}
