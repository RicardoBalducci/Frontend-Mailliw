export interface MaterialesDto {
  id: number | null;
  nombre: string;
  descripcion: string;
  stock: number;
  marca:string;
  precio_unitario_bs: number;
  precio_unitario_usd: number;
}

export interface UpdateMaterialesDto {
  nombre: string;
  descripcion: string;
  marca:string;
  stock: number;
  precio_unitario_usd: number;
}
export interface CreateMaterialesDto {
  nombre: string;
  descripcion: string;
  marca: string;
  stock: number;
  precio_unitario_usd: number;
}

export type MaterialesDtoNullable = MaterialesDto | null;
