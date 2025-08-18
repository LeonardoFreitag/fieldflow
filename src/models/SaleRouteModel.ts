import { type ClientModel } from './ClientModel';
import { type SaleModel } from './SaleModel';
import { type UserAuthModel } from './UserAuthModel';

export interface SaleRouteModel {
  id: string;
  sellerId: string;
  seller: UserAuthModel;
  clientList: ClientModel[];
  saleList: SaleModel[];
  startDateTime: Date;
  endDateTime: Date;
  status: string;
}
