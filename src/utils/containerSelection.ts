interface ContainerSpec {
  type: string;
  displayName: string;
  maxVolume: number; // cubic meters
  maxWeight: number; // kilograms
  costPerContainer: number; // PKR
  dimensions: {
    length: number; // meters
    width: number; // meters
    height: number; // meters
  };
}

interface ContainerOption {
  container: ContainerSpec;
  utilization: {
    volume: number; // percentage
    weight: number; // percentage
  };
  efficiency: {
    volumeEfficiency: number; // cost per cubic meter utilized
    weightEfficiency: number; // cost per kilogram utilized
    overallScore: number; // 0-100 ranking score
  };
  reasoning: string;
  pros: string[];
  cons: string[];
  canFit: boolean;
}

export interface ContainerSelectionResult {
  recommendedOption: ContainerOption;
  allOptions: ContainerOption[];
  totalVolume: number;
  totalWeight: number;
  analysis: {
    bestForCost: ContainerOption;
    bestForSpace: ContainerOption;
    mostEfficient: ContainerOption;
  };
}

// Standard container specifications based on real-world data
export const CONTAINER_SPECS: ContainerSpec[] = [
  {
    type: "20ft_standard",
    displayName: "20ft Standard Container",
    maxVolume: 33.2,
    maxWeight: 28230,
    costPerContainer: 45000,
    dimensions: { length: 5.9, width: 2.35, height: 2.39 }
  },
  {
    type: "20ft_high_cube",
    displayName: "20ft High Cube Container",
    maxVolume: 37.4,
    costPerContainer: 52000,
    maxWeight: 28230,
    dimensions: { length: 5.9, width: 2.35, height: 2.69 }
  },
  {
    type: "40ft_standard",
    displayName: "40ft Standard Container",
    maxVolume: 67.7,
    maxWeight: 28750,
    costPerContainer: 78000,
    dimensions: { length: 12.03, width: 2.35, height: 2.39 }
  },
  {
    type: "40ft_high_cube",
    displayName: "40ft High Cube Container",
    maxVolume: 76.4,
    maxWeight: 28750,
    costPerContainer: 88000,
    dimensions: { length: 12.03, width: 2.35, height: 2.69 }
  }
];

interface Product {
  cartons: number;
  dimensions: { length: number; width: number; height: number };
  weightPerCarton: number;
}

export function selectOptimalContainer(products: Product[]): ContainerSelectionResult {
  // Calculate total cargo requirements
  const totalVolume = products.reduce((sum, product) => {
    return sum + (product.cartons * (product.dimensions.length * product.dimensions.width * product.dimensions.height) / 1000000);
  }, 0);

  const totalWeight = products.reduce((sum, product) => {
    return sum + (product.cartons * product.weightPerCarton);
  }, 0);

  // Evaluate each container option
  const options: ContainerOption[] = CONTAINER_SPECS.map(container => {
    const volumeUtilization = (totalVolume / container.maxVolume) * 100;
    const weightUtilization = (totalWeight / container.maxWeight) * 100;
    
    const canFitVolume = totalVolume <= container.maxVolume;
    const canFitWeight = totalWeight <= container.maxWeight;
    const canFit = canFitVolume && canFitWeight;
    
    // Efficiency calculations
    const volumeEfficiency = canFit ? container.costPerContainer / Math.max(totalVolume, 1) : Infinity;
    const weightEfficiency = canFit ? container.costPerContainer / Math.max(totalWeight, 1) : Infinity;
    
    // Overall score (0-100) - higher is better
    let overallScore = 0;
    if (canFit) {
      const utilizationScore = Math.min(volumeUtilization + weightUtilization, 100) / 2;
      const costScore = 100 - ((container.costPerContainer - 45000) / (88000 - 45000)) * 30; // Cost penalty
      overallScore = utilizationScore * 0.7 + costScore * 0.3;
    }
    
    // Generate reasoning and pros/cons
    let reasoning = "";
    const pros: string[] = [];
    const cons: string[] = [];
    
    if (!canFit) {
      if (!canFitVolume && !canFitWeight) {
        reasoning = "Cannot accommodate cargo - exceeds both volume and weight limits";
        cons.push("Insufficient volume capacity", "Insufficient weight capacity");
      } else if (!canFitVolume) {
        reasoning = "Cannot accommodate cargo - exceeds volume limit";
        cons.push("Insufficient volume capacity");
      } else {
        reasoning = "Cannot accommodate cargo - exceeds weight limit";
        cons.push("Insufficient weight capacity");
      }
    } else {
      if (volumeUtilization > 85) {
        reasoning = "Excellent space utilization";
        pros.push("High volume efficiency");
      } else if (volumeUtilization > 60) {
        reasoning = "Good space utilization";
        pros.push("Reasonable volume efficiency");
      } else {
        reasoning = "Low space utilization but fits cargo";
        cons.push("Underutilized volume");
      }
      
      if (container.costPerContainer <= 52000) {
        pros.push("Cost-effective option");
      } else if (container.costPerContainer >= 78000) {
        cons.push("Higher cost option");
      }
      
      if (container.type.includes("high_cube")) {
        pros.push("Extra height for tall cargo");
      }
      
      if (container.type.includes("40ft")) {
        pros.push("More floor space");
      } else {
        pros.push("Easier handling and placement");
      }
    }
    
    return {
      container,
      utilization: {
        volume: Math.round(volumeUtilization * 10) / 10,
        weight: Math.round(weightUtilization * 10) / 10
      },
      efficiency: {
        volumeEfficiency: Math.round(volumeEfficiency),
        weightEfficiency: Math.round(weightEfficiency * 100) / 100,
        overallScore: Math.round(overallScore)
      },
      reasoning,
      pros,
      cons,
      canFit
    };
  });

  // Find viable options and sort by overall score
  const viableOptions = options.filter(opt => opt.canFit).sort((a, b) => b.efficiency.overallScore - a.efficiency.overallScore);
  
  // If no viable options, return the largest container with explanation
  if (viableOptions.length === 0) {
    const largestContainer = options[options.length - 1];
    largestContainer.reasoning = "Cargo exceeds standard container limits - consider multiple containers or special arrangements";
    
    return {
      recommendedOption: largestContainer,
      allOptions: options,
      totalVolume,
      totalWeight,
      analysis: {
        bestForCost: largestContainer,
        bestForSpace: largestContainer,
        mostEfficient: largestContainer
      }
    };
  }

  const recommendedOption = viableOptions[0];
  
  // Find best options for different criteria
  const bestForCost = viableOptions.reduce((best, current) => 
    current.container.costPerContainer < best.container.costPerContainer ? current : best
  );
  
  const bestForSpace = viableOptions.reduce((best, current) => 
    current.utilization.volume > best.utilization.volume ? current : best
  );
  
  const mostEfficient = viableOptions.reduce((best, current) => 
    current.efficiency.overallScore > best.efficiency.overallScore ? current : best
  );

  return {
    recommendedOption,
    allOptions: options,
    totalVolume,
    totalWeight,
    analysis: {
      bestForCost,
      bestForSpace,
      mostEfficient
    }
  };
}