import { type RouteCollectionCoordsModel } from './RouteCollectionCoordsModel';
import { type RouteCollectionItemsModel } from './RouteCollectionItemsModel';

export interface RouteCollectionModel {
  id: string;
  customerId: string;
  routeId: string;
  sellerId: string;
  startDate: Date;
  endDate?: Date | null;
  status: string;
  RouteCollectionItems: RouteCollectionItemsModel[]; // Relacionamento, inclua se necessário
  RouteCollectionCoords: RouteCollectionCoordsModel[]; // Relacionamento, inclua se necessário
}
