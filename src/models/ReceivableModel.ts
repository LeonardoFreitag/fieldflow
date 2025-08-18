import { type PartialPaymentModel } from './PartialPaymentModel';

export interface ReceivableModel {
  id: string;
  customer_id: string;
  customer_name: string;
  sale_date: Date;
  sale_number: string;
  sale_url: string;
  invoice_number: string;
  invoice_url: string;
  value: number;
  dueDate: Date;
  status: 'PENDING' | 'PAID' | 'PARTIAL';
  partialPayments: PartialPaymentModel[];
}
