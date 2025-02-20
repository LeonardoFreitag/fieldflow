import { type PaymentFormModel } from './PaumentFormModel';
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
