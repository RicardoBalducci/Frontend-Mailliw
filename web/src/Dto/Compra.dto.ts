export interface CompraDTO {
  id: number;
  proveedor_id: number;
  fecha_compra: string;
  total_usd: number;
  total_bs: number;

  materiales: Array<{
    material_id: number;
    cantidad: number;
    precio_unitario_usd: number;
    precio_unitario_bs: number;
  }>;

  productos: Array<{
    producto_id: number;
    cantidad: number;
    precio_unitario_usd: number;
    precio_unitario_bs: number;
  }>;
}
