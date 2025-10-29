import { type ProductModel } from './ProductModel';
import { type TravelClientOrdersItemsCompositionModel } from './TravelClientOrdersitemsCompositionModel';

export interface TravelClientOrdersItemsModel {
  id?: string;
  travelClientOrderId?: string;
  productId: string;
  Product?: ProductModel;
  code: string;
  reference: string;
  description: string;
  unity: string;
  price: number;
  quantity: number;
  amount: number;
  notes?: string | null;
  isComposed: boolean;
  tableCode: string;
  isDeleted: boolean;
  TravelClientOrdersItemsComposition?: TravelClientOrdersItemsCompositionModel[];
}
