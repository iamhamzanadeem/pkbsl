export type TruckStatus = 'Available' | 'En Route' | 'In Transit' | 'Maintenance' | 'Loading' | 'Unloading';

export type TruckType = 'Container Truck' | 'Flatbed' | 'Refrigerated' | 'Tanker' | 'Box Truck';

export interface TruckCapacity {
  maxWeight: number; // in kg
  maxVolume: number; // in cubic meters
  containerTypes?: string[]; // for container trucks
}

export interface Truck {
  truckId: string;
  driverName: string;
  driverContact: string;
  currentLocation: string;
  destinationLocation?: string;
  status: TruckStatus;
  eta: Date; // estimated time of arrival at origin
  capacity: TruckCapacity;
  truckType: TruckType;
  lastUpdated: Date;
  plateNumber: string;
  isAvailableForBooking: boolean;
}