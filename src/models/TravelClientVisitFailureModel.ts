import { type TravelClientsModel } from './TravelClientsModel';

export interface TravelClientVisitFailureModel {
  id?: string;
  travelClientId: string;
  reason: string; // ex: "Cliente ausente", "Estabelecimento fechado"
  notes: string;
  isRescheneduled: boolean;
  reschenduleDate: Date | null;
  travelClient?: TravelClientsModel;
}
