import { type ClientModel } from './ClientModel';
import { type TravelClientOrdersItemsModel } from './TravelClientOrdersItemsModel';
import { type TravelClientOrdersPaymentFormModel } from './TravelClientOrdersPaymentFormModel';
import { type TravelModel } from './TravelModel';

export interface TravelClientOrdersModel {
  id?: string;
  travelClientId: string;
  clientId: string;
  client?: ClientModel;
  orderNumber?: string;
  orderDate: Date;
  notes?: string | null;
  total: number;
  status: string; // "pending", "completed", "canceled"
  signatureFileName?: string | null;
  signatureUrl?: string | null;
  signatureBase64?: string | null;
  travel?: TravelModel;
  TravelClientOrdersItems?: TravelClientOrdersItemsModel[];
  TravelClientOrdersPaymentForm?: TravelClientOrdersPaymentFormModel[];
}
