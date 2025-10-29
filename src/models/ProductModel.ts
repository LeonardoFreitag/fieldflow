import { type ProductCompositionModel } from './ProductCompositionModel';
import { type ProductPriceModel } from './ProductPriceModel';
import { type ProductSimilarModel } from './ProductSimilarModel';

export interface ProductModel {
  id: string;
  customerId: string;
  code: string;
  reference: string;
  description: string;
  unity: string;
  groupId: string;
  group: string;
  price: number;
  photoFileName?: string;
  photoUrl?: string;
  photoSize?: string;
  isComposed: boolean;
  ProductPrice?: ProductPriceModel[];
  ProductSimilar?: ProductSimilarModel[];
  ProductComposition?: ProductCompositionModel[];
  selected?: boolean;
  qty?: number;
}
