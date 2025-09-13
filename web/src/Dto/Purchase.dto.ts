// src/Dto/Purchase.dto.ts

import { MaterialesDto } from "./Materiales.dto"; // Adjust path as needed

// PurchaseItem should extend MaterialesDto and add purchase-specific properties
export interface PurchaseItem extends MaterialesDto {
  quantity: number;
  totalPrice: number;
}
