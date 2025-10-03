export interface MaterialesDto {
  id: number | null;
  nombre: string;
  descripcion: string;
  stock: number;
  precio_unitario_bs: number;
  precio_unitario_usd: number;
}

export interface CreateMaterialesDto {
  nombre: string;
  descripcion: string;
  stock: number;
  precio_unitario_usd: number;
}

export type MaterialesDtoNullable = MaterialesDto | null;
