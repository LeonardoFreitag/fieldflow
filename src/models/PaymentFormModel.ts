export interface PaymentFormModel {
  id: string;
  customerId: string;
  internalId: string;
  paymentForm: string;
  installments: number;
  isActive: boolean;
  canUseCard: boolean;
  paymentCondition: string;
  firstInstallmentDeadline: number;
  daysBetweenInstallments: number;
  nfePaymentForm: string;
  collection: boolean;
  integrationType: string;
}
