export interface ReceberParcialModel {
  id?: string;
  receberId: string;
  paymentFormId: string;
  valorRecebido: number;
  dataRecebimento: Date;
  observacao?: string;
  fileName?: string;
  fileUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
