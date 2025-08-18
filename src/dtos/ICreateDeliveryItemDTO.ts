export interface ICreateDeliveryItemDTO {
  customerId: string;
  clientId: string;
  clientCode: string;
  orderId: string;
  orderNumber: string;
  orderDate: Date;
  invoiceId?: string;
  notes?: string;
  status: string; // "pending", "in_progress", "delivered", "canceled"
  nfeNumber?: string;
  nfeUrl?: string;
  deliveryOrder: string;
  deliveryDate?: Date;
  signatureFileName?: string;
  signatureUrl?: string;
  signatureBase64?: string;
  latitude?: number; // ou number, se usar Decimal.js, pode ser Decimal
  longitude?: number; // idem acima
}
