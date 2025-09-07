import { Truck } from '@/types/truck';

export const mockTrucks: Truck[] = [
  {
    truckId: 'PKB-001',
    driverName: 'Ahmed Hassan',
    driverContact: '+92-300-1234567',
    currentLocation: 'Karachi Port',
    status: 'Available',
    eta: new Date(),
    capacity: {
      maxWeight: 30000,
      maxVolume: 76.4,
      containerTypes: ['20ft', '40ft', '40ft HC']
    },
    truckType: 'Container Truck',
    lastUpdated: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    plateNumber: 'KHI-7890',
    isAvailableForBooking: true
  },
  {
    truckId: 'PKB-002',
    driverName: 'Muhammad Ali',
    driverContact: '+92-301-2345678',
    currentLocation: 'Lahore',
    destinationLocation: 'Karachi Port',
    status: 'En Route',
    eta: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    capacity: {
      maxWeight: 25000,
      maxVolume: 67.7,
      containerTypes: ['20ft', '40ft']
    },
    truckType: 'Container Truck',
    lastUpdated: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    plateNumber: 'LHR-4567',
    isAvailableForBooking: true
  },
  {
    truckId: 'PKB-003',
    driverName: 'Tariq Mahmood',
    driverContact: '+92-302-3456789',
    currentLocation: 'Karachi Port',
    status: 'Available',
    eta: new Date(),
    capacity: {
      maxWeight: 20000,
      maxVolume: 45
    },
    truckType: 'Flatbed',
    lastUpdated: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    plateNumber: 'KHI-1234',
    isAvailableForBooking: true
  },
  {
    truckId: 'PKB-004',
    driverName: 'Rashid Khan',
    driverContact: '+92-303-4567890',
    currentLocation: 'Islamabad',
    destinationLocation: 'Karachi Port',
    status: 'En Route',
    eta: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    capacity: {
      maxWeight: 18000,
      maxVolume: 40
    },
    truckType: 'Refrigerated',
    lastUpdated: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    plateNumber: 'ISB-9876',
    isAvailableForBooking: true
  },
  {
    truckId: 'PKB-005',
    driverName: 'Fahad Malik',
    driverContact: '+92-304-5678901',
    currentLocation: 'Workshop - Karachi',
    status: 'Maintenance',
    eta: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    capacity: {
      maxWeight: 28000,
      maxVolume: 70
    },
    truckType: 'Container Truck',
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    plateNumber: 'KHI-5555',
    isAvailableForBooking: false
  },
  {
    truckId: 'PKB-006',
    driverName: 'Shahzad Iqbal',
    driverContact: '+92-305-6789012',
    currentLocation: 'Faisalabad',
    destinationLocation: 'Karachi Port',
    status: 'En Route',
    eta: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    capacity: {
      maxWeight: 15000,
      maxVolume: 30
    },
    truckType: 'Box Truck',
    lastUpdated: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    plateNumber: 'FSD-3333',
    isAvailableForBooking: true
  },
  {
    truckId: 'PKB-007',
    driverName: 'Imran Sheikh',
    driverContact: '+92-306-7890123',
    currentLocation: 'Karachi Port',
    status: 'Loading',
    eta: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now (after loading)
    capacity: {
      maxWeight: 32000,
      maxVolume: 76.4,
      containerTypes: ['40ft HC']
    },
    truckType: 'Container Truck',
    lastUpdated: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
    plateNumber: 'KHI-7777',
    isAvailableForBooking: false
  },
  {
    truckId: 'PKB-008',
    driverName: 'Nasir Ahmed',
    driverContact: '+92-307-8901234',
    currentLocation: 'Multan',
    destinationLocation: 'Karachi Port',
    status: 'En Route',
    eta: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
    capacity: {
      maxWeight: 22000,
      maxVolume: 50
    },
    truckType: 'Flatbed',
    lastUpdated: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    plateNumber: 'MLT-2468',
    isAvailableForBooking: true
  }
];