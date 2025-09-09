export interface NodeRedGeoType {
  uid: string;
  detail: string | undefined;
  how: string | undefined;
  lat: number | undefined;
  lon: number | undefined;
  time: string | undefined;
  type: string | undefined;
  location: { type: string, coordinates: [latitude: number, longitude: number] } | undefined;
  eventType: string;
}

export interface TfLocationType {
  tfName: string;
  lat: number;
  long: number;
}

export interface DestinationShelterType {
  shelterName: string;
  destination: string;
  island: string;
  lat: number;
  long: number;
}

export interface SuppliesType {
  index: string;
  aidType: string;
  consumed: number;
  delayed: number;
  delivered: number;
  destination: string;
  inTransit: number;
  island: string;
  lat: number;
  long: number;
  pending: number;
  shelterName: string;
}