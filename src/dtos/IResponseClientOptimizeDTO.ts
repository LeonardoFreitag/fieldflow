export interface Coordinate {
  lat: number;
  lng: number;
}

export interface OrderedClient {
  id: string;
  latitude: number;
  longitude: number;
}

export interface DistanceDuration {
  text: string;
  value: number;
}

export interface Step {
  distance: DistanceDuration;
  duration: DistanceDuration;
  end_location: Coordinate;
  html_instructions: string;
  polyline: {
    points: string;
  };
  start_location: Coordinate;
  travel_mode: string;
  maneuver?: string;
}

export interface Leg {
  distance: DistanceDuration;
  duration: DistanceDuration;
  end_address: string;
  end_location: Coordinate;
  start_address: string;
  start_location: Coordinate;
  steps: Step[];
  traffic_speed_entry: any[];
  via_waypoint: any[];
}

export interface OptimizedRoute {
  bounds: {
    northeast: Coordinate;
    southwest: Coordinate;
  };
  copyrights: string;
  legs: Leg[];
  overview_polyline: {
    points: string;
  };
  summary: string;
  warnings: string[];
  waypoint_order: number[];
}

export interface RouteOptimizationResult {
  orderedClients: OrderedClient[];
  optimizedRoute: OptimizedRoute;
}
