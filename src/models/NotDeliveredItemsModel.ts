export interface NotDeliveredItemsModel {
  id: string;
  deliveryItemsId: string;
  reason: string;
  fileName?: string;
  fileUrl?: string;
  fileSize?: string;
}
