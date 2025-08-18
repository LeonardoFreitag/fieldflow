export interface TravelClientOrdersItemsCompositionModel {
  id?: string;
  travelClientOrdersItemsId?: string;
  productId: string;
  stockId: string;
  pCode: string;
  pReference: string;
  pDescription: string;
  pUnity: string;
  pQuantity: number; // Use number para Decimal, ou uma lib como Decimal.js se necessário
  pPrice: number;
  pAmount: number;
  removed: boolean;
  tableCode: string;
  photoFileName?: string;
  photoUrl?: string;
  photoSize?: string;
}
