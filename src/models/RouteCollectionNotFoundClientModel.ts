import { type RouteCollectionItemsModel } from './RouteCollectionItemsModel';

export interface RouteCollectionNotFoundClientModel {
  id: string;
  routeCollectionId: string;
  reason: string;
  fileName?: string | null;
  fileUrl?: string | null;
  fileSize?: string | null;
  createdAt: Date;
  updatedAt: Date;
  routeCollectionItemsId?: string | null;
  RouteCollectionItems?: RouteCollectionItemsModel;
}
