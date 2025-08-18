export interface TravelClientOrdersPaymentFormModel {
  id?: string;
  travelClientOrdersId?: string;
  paymentFormId: string;
  description: string;
  amount: number;
  installments?: number;
}
