// Si tu API devuelve un objeto de compra después de la creación, define su estructura aquí.
// Por ahora, asumimos que la respuesta de creación es simple o no se usa directamente.
// Si la API devuelve el objeto completo de la compra, podrías tener algo como:
export interface CompraDTO {
  id: number;
  proveedor_id: number;
  fecha_compra: string; // O Date
  total_usd: number;
  total_bs: number;
  materiales: Array<{
    material_id: number;
    cantidad: number;
    precio_unitario_usd: number;
    precio_unitario_bs: number;
  }>;
  // ... otras propiedades de la compra
}
