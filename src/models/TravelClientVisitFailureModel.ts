import { type TravelClientsModel } from './TravelClientsModel';

export interface TravelClientVisitFailureModel {
  id?: string;
  travelClientId: string;
  reason: string; // ex: "Cliente ausente", "Estabelecimento fechado"
  rescheduleDate?: Date; // caso tenha agendamento futuro
  travelClient?: TravelClientsModel;
}
