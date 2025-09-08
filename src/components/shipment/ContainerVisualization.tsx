import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Package, ZoomIn, ZoomOut, RotateCw, Move3D } from "lucide-react";
import { optimizeCartonPlacement, type PlacementResult } from "@/utils/cartonPlacement";

interface ContainerSpec {
  type: string;
  displayName: string;
  dimensions: { length: number; width: number; height: number };
  maxWeight: number;
  costPerContainer: number;
  maxVolume: number;
}

interface Product {
  id: string;
  productCode: string;
  cartons: number;
  dimensions: { length: number; width: number; height: number };
  weightPerCarton: number;
}

interface ContainerVisualizationProps {
  selectedContainer?: ContainerSpec;
  products: Product[];
  utilizationData?: {
    volume: number;
    weight: number;
    efficiency: number;
  };
  availableContainers?: ContainerSpec[];
  onContainerChange?: (containerType: string) => void;
}

interface HoveredCarton {
  id: string;
  productCode: string;
  position: { x: number; y: number };
  weight: number;
  dimensions: { length: number; width: number; height: number };
}

// Enhanced 3D-looking Container Visualization Component
function Container2D({ 
  container, 
  products, 
  viewMode, 
  zoom,
  onCartonHover,
  onCartonClick 
}: { 
  container: ContainerSpec; 
  products: Product[];
  viewMode: "top" | "side" | "front";
  zoom: number;
  onCartonHover?: (carton: HoveredCarton | null) => void;
  onCartonClick?: (cartonId: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [placementResult, setPlacementResult] = useState<PlacementResult | null>(null);

  // Calculate optimal carton placement
  useEffect(() => {
    const validProducts = products.filter(p => p.productCode && p.cartons > 0);
    if (validProducts.length === 0) return;

    const containerDims = {
      length: container.dimensions.length,
      width: container.dimensions.width,
      height: container.dimensions.height,
      maxWeight: container.maxWeight,
    };

    const result = optimizeCartonPlacement(validProducts, containerDims);
    setPlacementResult(result);
  }, [container, products]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !placementResult) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up dimensions and scaling
    const scale = Math.min(400 / (container.dimensions.length * 100), 300 / (container.dimensions.width * 100)) * zoom;
    let containerWidth = 0;
    let containerHeight = 0;

    switch (viewMode) {
      case "top":
        containerWidth = container.dimensions.length * 100 * scale;
        containerHeight = container.dimensions.width * 100 * scale;
        break;
      case "side":
        containerWidth = container.dimensions.length * 100 * scale;
        containerHeight = container.dimensions.height * 100 * scale;
        break;
      case "front":
        containerWidth = container.dimensions.width * 100 * scale;
        containerHeight = container.dimensions.height * 100 * scale;
        break;
    }

    const offsetX = (canvas.width - containerWidth) / 2;
    const offsetY = (canvas.height - containerHeight) / 2;

    // Draw container background with grid
    ctx.fillStyle = 'hsl(var(--muted) / 0.05)';
    ctx.fillRect(offsetX, offsetY, containerWidth, containerHeight);

    // Draw grid lines
    ctx.strokeStyle = 'hsl(var(--border) / 0.3)';
    ctx.lineWidth = 0.5;
    const gridSize = 50 * scale; // 50cm grid
    
    for (let x = offsetX; x <= offsetX + containerWidth; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, offsetY);
      ctx.lineTo(x, offsetY + containerHeight);
      ctx.stroke();
    }
    
    for (let y = offsetY; y <= offsetY + containerHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(offsetX, y);
      ctx.lineTo(offsetX + containerWidth, y);
      ctx.stroke();
    }

    // Draw container outline
    ctx.strokeStyle = 'hsl(var(--border))';
    ctx.lineWidth = 2;
    ctx.strokeRect(offsetX, offsetY, containerWidth, containerHeight);

    // Draw placed cartons with 3D effect
    placementResult.placedCartons.forEach((carton) => {
      let cartonX, cartonY, cartonW, cartonH;

      switch (viewMode) {
        case "top":
          cartonX = offsetX + (carton.position.x * scale);
          cartonY = offsetY + (carton.position.y * scale);
          cartonW = carton.dimensions.length * scale;
          cartonH = carton.dimensions.width * scale;
          break;
        case "side":
          cartonX = offsetX + (carton.position.x * scale);
          cartonY = offsetY + containerHeight - ((carton.position.z + carton.dimensions.height) * scale);
          cartonW = carton.dimensions.length * scale;
          cartonH = carton.dimensions.height * scale;
          break;
        case "front":
          cartonX = offsetX + (carton.position.y * scale);
          cartonY = offsetY + containerHeight - ((carton.position.z + carton.dimensions.height) * scale);
          cartonW = carton.dimensions.width * scale;
          cartonH = carton.dimensions.height * scale;
          break;
        default:
          return;
      }

      // Draw 3D-looking carton
      drawIsometricCarton(ctx, cartonX, cartonY, cartonW, cartonH, carton.color, carton.stackLevel);

      // Draw product label if carton is large enough
      if (cartonW > 30 && cartonH > 20) {
        ctx.fillStyle = 'hsl(var(--foreground))';
        ctx.font = `${Math.max(8, Math.min(10, cartonW / 8))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(
          carton.productCode.substring(0, 6),
          cartonX + cartonW / 2,
          cartonY + cartonH / 2 + 3
        );
      }

      // Add weight indicator for side/front view
      if (viewMode !== "top" && cartonW > 25) {
        ctx.fillStyle = 'hsl(var(--muted-foreground))';
        ctx.font = '8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          `${carton.weight}kg`,
          cartonX + cartonW / 2,
          cartonY + cartonH - 3
        );
      }
    });

    // Draw center of gravity indicator
    if (viewMode === "side" || viewMode === "front") {
      const cog = placementResult.centerOfGravity;
      let cogX, cogY;

      if (viewMode === "side") {
        cogX = offsetX + (cog.x * scale);
        cogY = offsetY + containerHeight - (cog.z * scale);
      } else {
        cogX = offsetX + (cog.y * scale);
        cogY = offsetY + containerHeight - (cog.z * scale);
      }

      // Draw center of gravity cross
      ctx.strokeStyle = 'hsl(var(--destructive))';
      ctx.lineWidth = 2;
      const crossSize = 8;
      
      ctx.beginPath();
      ctx.moveTo(cogX - crossSize, cogY);
      ctx.lineTo(cogX + crossSize, cogY);
      ctx.moveTo(cogX, cogY - crossSize);
      ctx.lineTo(cogX, cogY + crossSize);
      ctx.stroke();

      // Draw circle around cross
      ctx.beginPath();
      ctx.arc(cogX, cogY, crossSize + 2, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Draw loading direction arrow (for top view)
    if (viewMode === "top") {
      const arrowX = offsetX + containerWidth - 30;
      const arrowY = offsetY + 20;
      
      ctx.strokeStyle = 'hsl(var(--primary))';
      ctx.fillStyle = 'hsl(var(--primary))';
      ctx.lineWidth = 2;
      
      // Arrow line
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(arrowX, arrowY + 20);
      ctx.stroke();
      
      // Arrow head
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY + 20);
      ctx.lineTo(arrowX - 4, arrowY + 16);
      ctx.lineTo(arrowX + 4, arrowY + 16);
      ctx.closePath();
      ctx.fill();
      
      // Label
      ctx.fillStyle = 'hsl(var(--muted-foreground))';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Loading', arrowX, arrowY - 5);
      ctx.fillText('Direction', arrowX, arrowY + 35);
    }

    // Draw dimensions and measurements
    ctx.fillStyle = 'hsl(var(--muted-foreground))';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';

    let dimensionsText = '';
    switch (viewMode) {
      case "top":
        dimensionsText = `${container.dimensions.length}m × ${container.dimensions.width}m (L×W)`;
        break;
      case "side":
        dimensionsText = `${container.dimensions.length}m × ${container.dimensions.height}m (L×H)`;
        break;
      case "front":
        dimensionsText = `${container.dimensions.width}m × ${container.dimensions.height}m (W×H)`;
        break;
    }

    ctx.fillText(dimensionsText, canvas.width / 2, offsetY - 8);

  }, [container, products, viewMode, zoom, placementResult]);

  // Helper function to draw isometric-style cartons
  function drawIsometricCarton(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    stackLevel: number
  ) {
    const depth = Math.min(width, height) * 0.3; // Pseudo-3D depth
    
    // Convert hex color to HSL-like effect
    const baseColor = color;
    const lightColor = adjustBrightness(color, 20);
    const darkColor = adjustBrightness(color, -20);
    
    // Draw main face
    ctx.fillStyle = baseColor;
    ctx.fillRect(x, y, width, height);
    
    // Draw top face (if viewed from above or showing stack)
    if (stackLevel > 0 || Math.random() > 0.7) {
      ctx.fillStyle = lightColor;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + depth * 0.5, y - depth * 0.3);
      ctx.lineTo(x + width + depth * 0.5, y - depth * 0.3);
      ctx.lineTo(x + width, y);
      ctx.closePath();
      ctx.fill();
    }
    
    // Draw right face
    ctx.fillStyle = darkColor;
    ctx.beginPath();
    ctx.moveTo(x + width, y);
    ctx.lineTo(x + width + depth * 0.5, y - depth * 0.3);
    ctx.lineTo(x + width + depth * 0.5, y + height - depth * 0.3);
    ctx.lineTo(x + width, y + height);
    ctx.closePath();
    ctx.fill();
    
    // Draw border
    ctx.strokeStyle = adjustBrightness(color, -40);
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
    
    // Add stack indicator
    if (stackLevel > 0) {
      ctx.fillStyle = 'hsl(var(--background))';
      ctx.font = '8px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`L${stackLevel + 1}`, x + width - 2, y + 10);
    }
  }

  // Helper function to adjust color brightness
  function adjustBrightness(color: string, percent: number): string {
    // Simple brightness adjustment - in a real app you'd use a proper color library
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="w-full h-64 border rounded-lg bg-background cursor-crosshair"
      />
      
      {/* Placement Statistics Overlay */}
      {placementResult && (
        <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm rounded-md p-2 text-xs space-y-1">
          <div className="flex items-center gap-2">
            <Package className="h-3 w-3" />
            <span>{placementResult.placedCartons.length} cartons placed</span>
          </div>
          {placementResult.unplacedCartons > 0 && (
            <div className="text-destructive">
              {placementResult.unplacedCartons} cartons couldn't fit
            </div>
          )}
          <div>Volume: {placementResult.volumeUtilization.toFixed(1)}%</div>
          <div>Weight: {placementResult.weightUtilization.toFixed(1)}%</div>
        </div>
      )}
    </div>
  );
}

// Main Visualization Component
export function ContainerVisualization({ 
  selectedContainer, 
  products, 
  utilizationData,
  availableContainers = [],
  onContainerChange
}: ContainerVisualizationProps) {
  const [viewMode, setViewMode] = useState<"top" | "side" | "front">("top");
  const [zoom, setZoom] = useState(1);
  const [hoveredCarton, setHoveredCarton] = useState<HoveredCarton | null>(null);
  const [selectedCartonId, setSelectedCartonId] = useState<string | null>(null);
  
  const validProducts = products.filter(p => p.productCode && p.cartons > 0);
  
  if (!selectedContainer) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Container Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Calculate stuffing plan to see container visualization
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Container Visualization
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(2, zoom + 0.2))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Container Selection */}
        {availableContainers.length > 0 && onContainerChange && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Container Type</label>
            <Select 
              value={selectedContainer.type} 
              onValueChange={onContainerChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableContainers.map((container) => (
                  <SelectItem key={container.type} value={container.type}>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span>{container.displayName}</span>
                      <Badge variant="outline" className="ml-auto">
                        PKR {container.costPerContainer.toLocaleString()}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* View Mode Tabs */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as typeof viewMode)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="top" className="flex items-center gap-2">
              <Eye className="h-3 w-3" />
              Top View
            </TabsTrigger>
            <TabsTrigger value="side" className="flex items-center gap-2">
              <Move3D className="h-3 w-3" />
              Side View
            </TabsTrigger>
            <TabsTrigger value="front" className="flex items-center gap-2">
              <RotateCw className="h-3 w-3" />
              Front View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="top" className="space-y-4">
            <Container2D 
              container={selectedContainer} 
              products={validProducts} 
              viewMode="top"
              zoom={zoom}
              onCartonHover={setHoveredCarton}
              onCartonClick={setSelectedCartonId}
            />
          </TabsContent>
          
          <TabsContent value="side" className="space-y-4">
            <Container2D 
              container={selectedContainer} 
              products={validProducts} 
              viewMode="side"
              zoom={zoom}
              onCartonHover={setHoveredCarton}
              onCartonClick={setSelectedCartonId}
            />
          </TabsContent>
          
          <TabsContent value="front" className="space-y-4">
            <Container2D 
              container={selectedContainer} 
              products={validProducts} 
              viewMode="front"
              zoom={zoom}
              onCartonHover={setHoveredCarton}
              onCartonClick={setSelectedCartonId}
            />
          </TabsContent>
        </Tabs>
        
        {/* Container Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Container Details</span>
            <Badge variant="outline">{selectedContainer.displayName}</Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Length</span>
              <p className="font-medium">{selectedContainer.dimensions.length}m</p>
            </div>
            <div>
              <span className="text-muted-foreground">Width</span>
              <p className="font-medium">{selectedContainer.dimensions.width}m</p>
            </div>
            <div>
              <span className="text-muted-foreground">Height</span>
              <p className="font-medium">{selectedContainer.dimensions.height}m</p>
            </div>
          </div>
          
          {utilizationData && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Volume Utilization</span>
                <span className="font-medium">{utilizationData.volume}%</span>
              </div>
              <Progress value={utilizationData.volume} className="h-2" />
              
              <div className="flex items-center justify-between text-sm">
                <span>Weight Utilization</span>
                <span className="font-medium">{utilizationData.weight}%</span>
              </div>
              <Progress value={utilizationData.weight} className="h-2" />
              
              <div className="flex items-center justify-between text-sm">
                <span>Overall Efficiency</span>
                <span className="font-medium">{utilizationData.efficiency}%</span>
              </div>
              <Progress value={utilizationData.efficiency} className="h-2" />
            </div>
          )}
          
          {/* Loading Summary */}
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Products</span>
              <span className="font-medium">{validProducts.length} types</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Cartons</span>
              <span className="font-medium">{validProducts.reduce((sum, p) => sum + p.cartons, 0)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Est. Cost</span>
              <span className="font-medium">PKR {selectedContainer.costPerContainer.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}