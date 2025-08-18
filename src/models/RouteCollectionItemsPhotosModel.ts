import { type RouteCollectionItemsModel } from './RouteCollectionItemsModel';

export interface RouteCollectionItemsPhotosModel {
  id: string;
  routeColletionItemsId?: string | null;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  routeCollectionItemsId?: string | null;
  RouteCollectionItems?: RouteCollectionItemsModel | null;
}
