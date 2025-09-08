// Advanced carton placement algorithm with 3D bin packing
interface CartonDimensions {
  length: number;
  width: number;
  height: number;
}

interface PlacedCarton {
  id: string;
  productCode: string;
  position: { x: number; y: number; z: number };
  dimensions: CartonDimensions;
  rotation: number; // 0, 90, 180, 270 degrees
  stackLevel: number;
  weight: number;
  isFragile: boolean;
  color: string;
}

interface ContainerDimensions {
  length: number;
  width: number;
  height: number;
  maxWeight: number;
}

interface Product {
  id: string;
  productCode: string;
  cartons: number;
  dimensions: CartonDimensions;
  weightPerCarton: number;
  isFragile?: boolean;
}

export interface PlacementResult {
  placedCartons: PlacedCarton[];
  unplacedCartons: number;
  volumeUtilization: number;
  weightUtilization: number;
  centerOfGravity: { x: number; y: number; z: number };
  stackingEfficiency: number;
}

// Color palette for different products
const PRODUCT_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#84CC16', // Lime
];

export class CartonPlacementEngine {
  private container: ContainerDimensions;
  private placedCartons: PlacedCarton[] = [];
  private occupiedSpaces: boolean[][][] = [];
  private gridResolution = 10; // cm resolution for placement grid

  constructor(container: ContainerDimensions) {
    this.container = container;
    this.initializeGrid();
  }

  private initializeGrid() {
    const lengthCells = Math.ceil((this.container.length * 100) / this.gridResolution);
    const widthCells = Math.ceil((this.container.width * 100) / this.gridResolution);
    const heightCells = Math.ceil((this.container.height * 100) / this.gridResolution);

    this.occupiedSpaces = Array(lengthCells)
      .fill(null)
      .map(() =>
        Array(widthCells)
          .fill(null)
          .map(() => Array(heightCells).fill(false))
      );
  }

  private canPlaceCarton(
    position: { x: number; y: number; z: number },
    dimensions: CartonDimensions,
    rotation: number
  ): boolean {
    const rotatedDims = this.getRotatedDimensions(dimensions, rotation);
    
    // Check container bounds
    if (
      position.x + rotatedDims.length > this.container.length * 100 ||
      position.y + rotatedDims.width > this.container.width * 100 ||
      position.z + rotatedDims.height > this.container.height * 100
    ) {
      return false;
    }

    // Check for overlaps in grid
    const startX = Math.floor(position.x / this.gridResolution);
    const endX = Math.ceil((position.x + rotatedDims.length) / this.gridResolution);
    const startY = Math.floor(position.y / this.gridResolution);
    const endY = Math.ceil((position.y + rotatedDims.width) / this.gridResolution);
    const startZ = Math.floor(position.z / this.gridResolution);
    const endZ = Math.ceil((position.z + rotatedDims.height) / this.gridResolution);

    for (let x = startX; x < endX && x < this.occupiedSpaces.length; x++) {
      for (let y = startY; y < endY && y < this.occupiedSpaces[0].length; y++) {
        for (let z = startZ; z < endZ && z < this.occupiedSpaces[0][0].length; z++) {
          if (this.occupiedSpaces[x][y][z]) {
            return false;
          }
        }
      }
    }

    return true;
  }

  private markSpaceOccupied(
    position: { x: number; y: number; z: number },
    dimensions: CartonDimensions,
    rotation: number,
    occupied: boolean
  ) {
    const rotatedDims = this.getRotatedDimensions(dimensions, rotation);
    const startX = Math.floor(position.x / this.gridResolution);
    const endX = Math.ceil((position.x + rotatedDims.length) / this.gridResolution);
    const startY = Math.floor(position.y / this.gridResolution);
    const endY = Math.ceil((position.y + rotatedDims.width) / this.gridResolution);
    const startZ = Math.floor(position.z / this.gridResolution);
    const endZ = Math.ceil((position.z + rotatedDims.height) / this.gridResolution);

    for (let x = startX; x < endX && x < this.occupiedSpaces.length; x++) {
      for (let y = startY; y < endY && y < this.occupiedSpaces[0].length; y++) {
        for (let z = startZ; z < endZ && z < this.occupiedSpaces[0][0].length; z++) {
          this.occupiedSpaces[x][y][z] = occupied;
        }
      }
    }
  }

  private getRotatedDimensions(dimensions: CartonDimensions, rotation: number): CartonDimensions {
    if (rotation === 90 || rotation === 270) {
      return {
        length: dimensions.width,
        width: dimensions.length,
        height: dimensions.height,
      };
    }
    return dimensions;
  }

  private findBestPosition(
    dimensions: CartonDimensions,
    weight: number,
    isFragile: boolean
  ): { position: { x: number; y: number; z: number }; rotation: number } | null {
    const rotations = [0, 90]; // Try both orientations
    const stepSize = this.gridResolution;

    // Sort by priority: heavy items at bottom, fragile items on top
    const maxZ = isFragile 
      ? this.container.height * 100 
      : Math.min(this.container.height * 100, this.getMaxStackHeight() + dimensions.height);

    for (let z = 0; z < maxZ; z += stepSize) {
      for (let x = 0; x < this.container.length * 100; x += stepSize) {
        for (let y = 0; y < this.container.width * 100; y += stepSize) {
          for (const rotation of rotations) {
            const position = { x, y, z };
            
            // Check if position has proper support (not floating)
            if (z > 0 && !this.hasProperSupport(position, dimensions, rotation)) {
              continue;
            }

            if (this.canPlaceCarton(position, dimensions, rotation)) {
              return { position, rotation };
            }
          }
        }
      }
    }

    return null;
  }

  private hasProperSupport(
    position: { x: number; y: number; z: number },
    dimensions: CartonDimensions,
    rotation: number
  ): boolean {
    if (position.z === 0) return true; // On ground level

    const rotatedDims = this.getRotatedDimensions(dimensions, rotation);
    const supportCheckHeight = position.z - this.gridResolution;

    // Check if at least 80% of the base area has support
    const totalArea = (rotatedDims.length / this.gridResolution) * (rotatedDims.width / this.gridResolution);
    let supportedArea = 0;

    const startX = Math.floor(position.x / this.gridResolution);
    const endX = Math.ceil((position.x + rotatedDims.length) / this.gridResolution);
    const startY = Math.floor(position.y / this.gridResolution);
    const endY = Math.ceil((position.y + rotatedDims.width) / this.gridResolution);
    const supportZ = Math.floor(supportCheckHeight / this.gridResolution);

    for (let x = startX; x < endX && x < this.occupiedSpaces.length; x++) {
      for (let y = startY; y < endY && y < this.occupiedSpaces[0].length; y++) {
        if (supportZ >= 0 && supportZ < this.occupiedSpaces[0][0].length) {
          if (this.occupiedSpaces[x][y][supportZ]) {
            supportedArea++;
          }
        }
      }
    }

    return (supportedArea / totalArea) >= 0.8;
  }

  private getMaxStackHeight(): number {
    let maxHeight = 0;
    for (const carton of this.placedCartons) {
      const cartonTop = carton.position.z + carton.dimensions.height;
      maxHeight = Math.max(maxHeight, cartonTop);
    }
    return maxHeight;
  }

  public placeProducts(products: Product[]): PlacementResult {
    this.placedCartons = [];
    this.initializeGrid();
    
    let unplacedCartons = 0;
    let totalWeight = 0;
    let totalVolume = 0;

    // Sort products by weight (heaviest first) and fragility (non-fragile first)
    const sortedProducts = [...products].sort((a, b) => {
      if (a.isFragile !== b.isFragile) {
        return a.isFragile ? 1 : -1; // Non-fragile first
      }
      return b.weightPerCarton - a.weightPerCarton; // Heavier first
    });

    sortedProducts.forEach((product, productIndex) => {
      const color = PRODUCT_COLORS[productIndex % PRODUCT_COLORS.length];
      
      for (let cartonIndex = 0; cartonIndex < product.cartons; cartonIndex++) {
        const placement = this.findBestPosition(
          product.dimensions,
          product.weightPerCarton,
          product.isFragile || false
        );

        if (placement) {
          const stackLevel = Math.floor(placement.position.z / product.dimensions.height);
          
          const placedCarton: PlacedCarton = {
            id: `${product.id}-${cartonIndex}`,
            productCode: product.productCode,
            position: placement.position,
            dimensions: this.getRotatedDimensions(product.dimensions, placement.rotation),
            rotation: placement.rotation,
            stackLevel,
            weight: product.weightPerCarton,
            isFragile: product.isFragile || false,
            color,
          };

          this.placedCartons.push(placedCarton);
          this.markSpaceOccupied(placement.position, product.dimensions, placement.rotation, true);
          
          totalWeight += product.weightPerCarton;
          totalVolume += (product.dimensions.length * product.dimensions.width * product.dimensions.height) / 1000000; // Convert to m³
        } else {
          unplacedCartons++;
        }
      }
    });

    // Calculate metrics
    const containerVolume = this.container.length * this.container.width * this.container.height;
    const volumeUtilization = (totalVolume / containerVolume) * 100;
    const weightUtilization = (totalWeight / this.container.maxWeight) * 100;
    
    const centerOfGravity = this.calculateCenterOfGravity();
    const stackingEfficiency = this.calculateStackingEfficiency();

    return {
      placedCartons: this.placedCartons,
      unplacedCartons,
      volumeUtilization,
      weightUtilization,
      centerOfGravity,
      stackingEfficiency,
    };
  }

  private calculateCenterOfGravity(): { x: number; y: number; z: number } {
    if (this.placedCartons.length === 0) {
      return { x: 0, y: 0, z: 0 };
    }

    let totalWeight = 0;
    let weightedX = 0;
    let weightedY = 0;
    let weightedZ = 0;

    this.placedCartons.forEach((carton) => {
      const centerX = carton.position.x + carton.dimensions.length / 2;
      const centerY = carton.position.y + carton.dimensions.width / 2;
      const centerZ = carton.position.z + carton.dimensions.height / 2;

      weightedX += centerX * carton.weight;
      weightedY += centerY * carton.weight;
      weightedZ += centerZ * carton.weight;
      totalWeight += carton.weight;
    });

    return {
      x: weightedX / totalWeight,
      y: weightedY / totalWeight,
      z: weightedZ / totalWeight,
    };
  }

  private calculateStackingEfficiency(): number {
    const containerHeight = this.container.height * 100;
    const maxUsedHeight = this.getMaxStackHeight();
    return (maxUsedHeight / containerHeight) * 100;
  }
}

export function optimizeCartonPlacement(
  products: Product[],
  containerDimensions: ContainerDimensions
): PlacementResult {
  const engine = new CartonPlacementEngine(containerDimensions);
  return engine.placeProducts(products);
}