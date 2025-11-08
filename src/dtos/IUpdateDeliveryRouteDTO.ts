export interface IUpdateDeliveryRouteDTO {
  id: string;
  customerId: string;
  routeId: string;
  sellerId: string;
  startDate: Date;
  endDate?: Date;
  status: string; // "open", "closed", "canceled"
  completedCharge: boolean;
  dateTimeCompletedCharge?: Date;
}
