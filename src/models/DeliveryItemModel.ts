import { type ClientModel } from './ClientModel';
import { type DeliveryItemPhotoModel } from './DeliveryItemPhotoModel';
import { type NotDeliveredItemsModel } from './NotDeliveredItemsModel';
import { type TravelClientOrdersModel } from './TravelClientOrdersModel';

export interface DeliveryItemModel {
  id?: string;
  customerId: string;
  deliveryRouteId?: string;
  clientId: string;
  clientCode: string;
  Client?: ClientModel;
  orderId: string;
  TravelClientOrders?: TravelClientOrdersModel;
  orderNumber: string;
  orderDate: Date;
  orderUrl?: string;
  invoiceId?: string;
  notes?: string;
  status: string; // "pending", "charged", "in_progress", "delivered", "canceled"
  nfeNumber?: string;
  nfeUrl?: string;
  deliveryOrder: number;
  deliveryDate?: Date;
  signatureFileName?: string;
  signatureUrl?: string;
  signatureBase64?: string;
  latitude?: number; // ou number, se usar Decimal.js, pode ser Decimal
  longitude?: number; // idem acima
  // Relacionamentos
  DeliveryItemsPhotos: DeliveryItemPhotoModel[];
  NotDeliveredItems: NotDeliveredItemsModel[];
}
