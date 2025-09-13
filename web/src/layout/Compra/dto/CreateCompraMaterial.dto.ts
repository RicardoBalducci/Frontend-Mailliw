export interface CreateCompraMaterialDto {
  material_id: number;
  cantidad: number;
  precio_unitario_bs: number;
  precio_unitario_usd?: number;
}
