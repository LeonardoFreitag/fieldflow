import { type RouteCollectionCoordsModel } from '@models/RouteCollectionCoordsModel';
import { type ICreateRouteCollectionItemsDTO } from './ICreateRouteCollectionItemsDTO';

export interface ICreateRouteCollectionDTO {
  id?: string;
  customerId: string;
  routeId: string;
  sellerId: string;
  startDate: Date;
  endDate?: Date;
  status?: string; // "open", "closed", "canceled"
  RouteCollectionItems: ICreateRouteCollectionItemsDTO[]; // Relacionamento, inclua se necessário
  RouteCollectionCoords: RouteCollectionCoordsModel[]; // Relacionamento, inclua se necessário
}
