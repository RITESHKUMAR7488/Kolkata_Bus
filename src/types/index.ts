export interface StopLocation {
  lat: number | null;
  lng: number | null;
}

export interface BusRoute {
  busNumber: string;
  type: string;
  stops: string[];
}

export interface BusData {
  stops: Record<string, StopLocation>;
  routes: BusRoute[];
}

export interface DirectRoute {
  type: 'direct';
  busNumber: string;
  busType: string;
  origin: string;
  destination: string;
  totalStops: number;
  intermediateStops: string[];
  fullRoute: RouteStop[];
}

export interface MultiHopRoute {
  type: 'multiHop';
  hops: Hop[];
  junctionStop: string;
  totalStops: number;
}

export interface Hop {
  busNumber: string;
  busType: string;
  from: string;
  to: string;
  stops: number;
  route: RouteStop[];
}

export interface RouteStop {
  name: string;
  lat: number | null;
  lng: number | null;
  isJunction: boolean;
  sequence: number;
}

export type RouteResult = DirectRoute | MultiHopRoute;

export interface SearchState {
  fromStop: string;
  toStop: string;
  busNumber: string;
  fromSuggestions: string[];
  toSuggestions: string[];
  busSuggestions: string[];
  showFromDropdown: boolean;
  showToDropdown: boolean;
  showBusDropdown: boolean;
}

export interface AppState {
  theme: 'light' | 'dark';
  activeTab: 'journey' | 'bus' | 'metro' | 'train';
  metroView: 'schematic' | 'map';
  trainView: 'schematic' | 'map';
  search: SearchState;
  results: RouteResult[] | null;
  selectedBus: BusRoute | null;
  selectedRoute: RouteResult | null;
  selectedTrainLine: string | null;
  loading: boolean;
  error: string | null;
  showMap: boolean;
}
