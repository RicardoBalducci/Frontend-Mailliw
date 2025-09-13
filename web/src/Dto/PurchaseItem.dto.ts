// src/Dto/PurchaseItem.dto.ts
import { MaterialesDto } from "./Materiales.dto";
import { ProveedorDto } from "./Proveedor.dto";

export interface PurchaseItem {
  material: MaterialesDto;
  proveedor: ProveedorDto;
  quantity: number;
}
