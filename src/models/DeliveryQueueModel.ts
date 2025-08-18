import { type ClientModel } from './ClientModel';
import { type ReceberModel } from './ReceberModel';

export interface DeliveryQueueModel {
  id: string;
  customerId: string;
  routeId?: string;
  clientId: string;
  clientCode: string;
  Client: ClientModel;
  orderId: string; // vem de saleId do firebird
  orderNumber: string;
  orderDate: Date;
  invoiceId?: string;
  receber?: ReceberModel[];
  notes?: string;
  status: 'pending' | 'in_progress' | 'delivered' | 'canceled';
  nfeNumber?: string;
  nfeUrl?: string;
  boletoUrl?: string;
  isSelected?: boolean;
  reschenduleDate?: Date;
}
