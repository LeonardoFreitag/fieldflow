import { type DeliveryRouteCoordsModel } from '@models/DliveryRouteCoordsModel';
import { type ICreateDeliveryItemDTO } from './ICreateDeliveryItemDTO';

export interface ICreateDeliveryRouteDTO {
  id?: string;
  customerId: string;
  routeId: string;
  sellerId: string;
  startDate: Date;
  endDate?: Date;
  status?: string; // "open", "closed", "canceled"
  completedCharge?: boolean;
  dateTimeCoompletedCharge?: Date;
  DeliveryItems: ICreateDeliveryItemDTO[];
  DeliveryRouteCoords?: DeliveryRouteCoordsModel[];
}
