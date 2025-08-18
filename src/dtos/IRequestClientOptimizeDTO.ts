export interface IRequestClientOptimizeDTO {
  origin: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
  waypoints: Array<{
    address: string;
    latitude: number;
    longitude: number;
    id: string;
  }>;
}
