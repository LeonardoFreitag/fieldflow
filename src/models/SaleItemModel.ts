import { type SaleItemCompositionModel } from './SaleItemCompositionModel';

export interface SaleItemModel {
  id: string;
  sale_id: string;
  product_id: string;
  product: string;
  quantity: number;
  unity: string;
  price: number;
  is_compound: boolean;
  composition: SaleItemCompositionModel[];
  cover_image: string;
  is_composed: boolean;
  is_deleted: boolean;
}
