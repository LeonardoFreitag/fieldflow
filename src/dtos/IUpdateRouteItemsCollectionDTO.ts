export interface IUpdateRouteCollectionItems {
  id: string;
  routeCollectionId?: string | null;
  customerId: string;
  clientId: string;
  clientCode: string;
  receberId: string;
  orderId: string;
  orderNumber: string;
  orderDate: Date;
  invoiceId?: string | null;
  notes?: string | null;
  status: string; // "pending", "visited", "visited_received","not_visited", "canceled"
  nfeNumber?: string | null;
  nfeUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  visitOrder: number;
  checkInDate?: Date | null;
  checkOutDate?: Date | null;
}
