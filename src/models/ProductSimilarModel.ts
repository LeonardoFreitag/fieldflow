import { ProductModel } from './ProductModel';

export interface ProductSimilarModel {
  id: string;
  productId: string;
  internalId: string;
  internalSimilarId: string;
  createdAt: Date;
  updatedAt: Date;
  Product: ProductModel;
}
