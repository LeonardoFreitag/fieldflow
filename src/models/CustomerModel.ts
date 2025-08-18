export interface CustomerModel {
  id: string;
  cnpj: string;
  ie: string;
  companyName: string;
  comercialName: string;
  zipCode: string;
  streetName: string;
  streetNumber: string;
  neighborhood: string;
  complement: string;
  cityCode: string;
  city: string;
  stateCode: string;
  state: string;
  phone: string;
  cellphone: string;
  email: string;
  latitude: string;
  longitude: string;
  maxVisitsSales: number;
  maxVisitsDelivery: number;
  maxVisitsCharge: number;
  createdAt: string;
  updatedAt: string;
}
