import { type ClientModel } from './ClientModel';
import { type RouteCoordinatesModel } from './RouteCoordenatesModel';
import { type TravelClientsModel } from './TravelClientsModel';

export interface TravelModel {
  id?: string;
  customerId: string;
  userId: string;
  routeId: string;
  startDate: Date;
  endDate?: Date;
  notes?: string | null;
  status: string; // "open", "closed", "canceled"
  orderedClients?: ClientModel[];
  route?: RouteCoordinatesModel[];
  TravelClients?: TravelClientsModel[];
}

export type { TravelClientsModel };
