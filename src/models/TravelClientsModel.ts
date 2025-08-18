import { type ClientModel } from './ClientModel';
import { type TravelClientOrdersModel } from './TravelClientOrdersModel';
import { type TravelClientVisitFailureModel } from './TravelClientVisitFailureModel';

export interface TravelClientsModel {
  id?: string;
  travelId?: string;
  clientId: string;
  clientCode: string;
  Client?: ClientModel;
  orderInRoute: number;
  latitude?: number | null;
  longitude?: number | null;
  checkInDate?: Date | null;
  checkOutDate?: Date | null;
  notes?: string | null;
  status: string; // "pending", "visited", "not_visited"
  dataFrom: string; // "manual", "route"
  TravelClientOrders?: TravelClientOrdersModel[];
  TravelClientVisitFailures?: TravelClientVisitFailureModel[];
}
