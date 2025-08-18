import { type PaymentFormModel } from './PaymentFormModel';
import { type SaleItemModel } from './SaleItemModel';

export interface SaleModel {
  id: string;
  customer: string;
  sale_date: Date;
  total: number;
  status: 'open' | 'closed' | 'canceled';
  saleItems: SaleItemModel[];
  paymentForm: PaymentFormModel;
  reason?: string;
}
