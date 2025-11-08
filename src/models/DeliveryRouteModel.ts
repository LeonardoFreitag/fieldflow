import { type DeliveryItemModel } from './DeliveryItemModel';
import { type DeliveryRouteCoordsModel } from './DliveryRouteCoordsModel';

export interface DeliveryRouteModel {
  id: string;
  customerId: string;
  routeId: string;
  sellerId: string;
  startDate: Date;
  endDate?: Date;
  status: string; // "open", "closed", "canceled"
  completedCharge: boolean;
  dateTimeCompletedCharge?: Date;
  DeliveryItems: DeliveryItemModel[];
  DeliveryItemsCharge: DeliveryItemModel[];
  DeliveryRouteCoords: DeliveryRouteCoordsModel[];
}
