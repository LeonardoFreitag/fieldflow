import { type ClientModel } from './ClientModel';
import { type ReceberModel } from './ReceberModel';
import { type RouteCollectionNotFoundClientModel } from './RouteCollectionNotFoundClientModel';
import { type TravelClientOrdersModel } from './TravelClientOrdersModel';
import { type RouteCollectionItemsPhotosModel } from './RouteCollectionItemsPhotosModel';

export interface RouteCollectionItemsModel {
  id: string;
  routeCollectionId?: string | null;
  customerId: string;
  clientId: string;
  clientCode: string;
  Client: ClientModel;
  receberId: string;
  Receber: ReceberModel;
  orderId: string;
  orderNumber: string;
  orderDate: Date;
  invoiceId?: string | null;
  TravelClientOrders?: TravelClientOrdersModel;
  notes?: string | null;
  status: string; // "pending", "visited", "not_visited", "canceled"
  nfeNumber?: string | null;
  nfeUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  visitOrder: number;
  checkInDate?: Date | null;
  checkOutDate?: Date | null;
  RouteCollectionItemsPhotos: RouteCollectionItemsPhotosModel[];
  RouteCollectionNotFoundClient: RouteCollectionNotFoundClientModel[];
}
