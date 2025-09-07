import { Truck, TruckType } from "@/types/truck";
import { ContainerSelectionResult } from "@/utils/containerSelection";
import { Product } from "@/components/shipment/ProductForm";

export interface TruckOption {
  truck: Truck;
  score: number;
  reasoning: string;
  pros: string[];
  cons: string[];
  compatibilityIssues: string[];
  utilizationPercentage: number;
  etaHours: number;
}

export interface TruckSelectionResult {
  recommendedTruck: TruckOption | null;
  alternativeOptions: TruckOption[];
  totalTrucks: number;
  availableTrucks: number;
}

// Container-Truck compatibility matrix
const CONTAINER_TRUCK_COMPATIBILITY: Record<string, TruckType[]> = {
  "20ft Standard": ["Container Truck", "Flatbed"],
  "20ft High Cube": ["Container Truck"],
  "40ft Standard": ["Container Truck", "Flatbed"],
  "40ft High Cube": ["Container Truck"],
  "40ft Refrigerated": ["Refrigerated"],
  "LCL": ["Box Truck", "Container Truck"]
};

function calculateTruckScore(
  truck: Truck,
  containerResult: ContainerSelectionResult,
  origin: string,
  pickupDate?: string,
  pickupTime?: string
): TruckOption {
  const compatibleTrucks = CONTAINER_TRUCK_COMPATIBILITY[containerResult.recommendedOption.container.displayName] || [];
  const isCompatible = compatibleTrucks.includes(truck.truckType);
  
  // Calculate capacity utilization
  const totalWeight = containerResult.totalWeight;
  const totalVolume = containerResult.totalVolume;
  const weightUtilization = (totalWeight / truck.capacity.maxWeight) * 100;
  const volumeUtilization = (totalVolume / truck.capacity.maxVolume) * 100;
  const utilizationPercentage = Math.max(weightUtilization, volumeUtilization);
  
  // Calculate ETA in hours
  let etaHours = 0;
  if (truck.currentLocation !== origin) {
    const now = new Date();
    etaHours = (truck.eta.getTime() - now.getTime()) / (1000 * 60 * 60);
    etaHours = Math.max(0, etaHours);
  }
  
  // Scoring system (0-100)
  let score = 0;
  const pros: string[] = [];
  const cons: string[] = [];
  const issues: string[] = [];
  
  // Compatibility Score (40%)
  if (isCompatible) {
    score += 40;
    pros.push(`Compatible with ${containerResult.recommendedOption.container.displayName}`);
  } else {
    issues.push(`Not compatible with recommended container type`);
  }
  
  // Availability Score (25%)
  if (truck.isAvailableForBooking) {
    if (etaHours === 0) {
      score += 25;
      pros.push("Currently available at origin");
    } else if (etaHours <= 2) {
      score += 20;
      pros.push(`Available in ${Math.round(etaHours)}h`);
    } else if (etaHours <= 6) {
      score += 15;
      cons.push(`Will arrive in ${Math.round(etaHours)} hours`);
    } else {
      score += 5;
      cons.push(`Long wait time: ${Math.round(etaHours)} hours`);
    }
  } else {
    issues.push("Not currently available for booking");
  }
  
  // Capacity Utilization Score (20%)
  if (utilizationPercentage <= 100) {
    if (utilizationPercentage >= 70 && utilizationPercentage <= 90) {
      score += 20;
      pros.push("Optimal capacity utilization");
    } else if (utilizationPercentage >= 50) {
      score += 15;
      pros.push("Good capacity utilization");
    } else {
      score += 10;
      cons.push("Low capacity utilization - may be costly");
    }
  } else {
    issues.push("Exceeds truck capacity");
  }
  
  // Location Score (15%)
  if (truck.currentLocation === origin) {
    score += 15;
    pros.push("Already at origin location");
  } else {
    score += Math.max(0, 15 - etaHours);
    if (etaHours > 0) {
      cons.push(`Currently in ${truck.currentLocation}`);
    }
  }
  
  // Generate reasoning
  let reasoning = "";
  if (score >= 80) {
    reasoning = "Excellent match with optimal timing and capacity utilization";
  } else if (score >= 60) {
    reasoning = "Good option with minor trade-offs";
  } else if (score >= 40) {
    reasoning = "Acceptable option but with some limitations";
  } else {
    reasoning = "Poor match - consider alternatives or wait for better options";
  }
  
  return {
    truck,
    score,
    reasoning,
    pros,
    cons,
    compatibilityIssues: issues,
    utilizationPercentage,
    etaHours
  };
}

export function selectOptimalTruck(
  trucks: Truck[],
  containerResult: ContainerSelectionResult,
  origin: string,
  pickupDate?: string,
  pickupTime?: string
): TruckSelectionResult {
  // Filter trucks that are at least potentially viable
  const viableTrucks = trucks.filter(truck => {
    const compatibleTrucks = CONTAINER_TRUCK_COMPATIBILITY[containerResult.recommendedOption.container.displayName] || [];
    const isCompatible = compatibleTrucks.includes(truck.truckType);
    const canCarryWeight = containerResult.totalWeight <= truck.capacity.maxWeight;
    const canCarryVolume = containerResult.totalVolume <= truck.capacity.maxVolume;
    
    return isCompatible && canCarryWeight && canCarryVolume;
  });
  
  // Score all viable trucks
  const truckOptions = viableTrucks.map(truck => 
    calculateTruckScore(truck, containerResult, origin, pickupDate, pickupTime)
  );
  
  // Sort by score (highest first)
  truckOptions.sort((a, b) => b.score - a.score);
  
  const recommendedTruck = truckOptions.length > 0 ? truckOptions[0] : null;
  const alternativeOptions = truckOptions.slice(1, 4); // Top 3 alternatives
  
  return {
    recommendedTruck,
    alternativeOptions,
    totalTrucks: trucks.length,
    availableTrucks: trucks.filter(t => t.isAvailableForBooking).length
  };
}

export function formatETA(etaHours: number): string {
  if (etaHours === 0) {
    return "Available Now";
  } else if (etaHours < 1) {
    return `${Math.round(etaHours * 60)}min`;
  } else if (etaHours < 24) {
    const hours = Math.floor(etaHours);
    const minutes = Math.round((etaHours - hours) * 60);
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
  } else {
    const days = Math.floor(etaHours / 24);
    const hours = Math.round(etaHours % 24);
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  }
}