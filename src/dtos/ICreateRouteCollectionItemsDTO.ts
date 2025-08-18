import { type RouteCollectionItemsModel } from '@models/RouteCollectionItemsModel';

export interface ICreateRouteCollectionItemsDTO {
  customerId: string;
  clientId: string;
  clientCode: string;
  receberId: string;
  orderId: string;
  orderNumber: string;
  orderDate: Date;
  invoiceId?: string | null;
  notes?: string | null;
  status: string;
  nfeNumber?: string | null;
  nfeUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  visitOrder: number;
  checkInDate?: Date | null;
  checkOutDate?: Date | null;
  RouteColletionItemsPhotos?: RouteCollectionItemsModel[];
  // RouteColletionNotFoundClient: RouteCollectionNotFoundClientModel[];
}
