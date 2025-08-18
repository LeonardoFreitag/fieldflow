import { type CustomerModel } from './CustomerModel';

export interface UserRuleModel {
  id: string;
  rule: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface UserModel {
  id: string;
  isAdmin: boolean;
  name: string;
  cellphone: string;
  email: string;
  password: string;
  regionId: string;
  routeId: string;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  customer: CustomerModel;
  UserRules: UserRuleModel[];
  avatarUrl?: string;
}

export interface UserAuthModel {
  user: UserModel;
  token: string;
  refreshToken: string;
}
