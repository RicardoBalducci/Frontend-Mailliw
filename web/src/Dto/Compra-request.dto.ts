export interface CompraMaterialDto {
  material_id: number;
  cantidad: number;
}

export interface CreateCompraDto {
  proveedor_id: number;
  materiales: CompraMaterialDto[];
}
