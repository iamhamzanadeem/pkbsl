import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Package, ZoomIn, ZoomOut } from "lucide-react";

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

// Container 2D Visualization Component
function Container2D({ container, products, viewMode, zoom }: { 
  container: ContainerSpec; 
  products: Product[];
  viewMode: "top" | "side" | "front";
  zoom: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up dimensions based on view mode
    const scale = 20 * zoom; // pixels per meter
    let containerWidth = 0;
    let containerHeight = 0;
    let containerDepth = 0;

    switch (viewMode) {
      case "top":
        containerWidth = container.dimensions.length * scale;
        containerHeight = container.dimensions.width * scale;
        containerDepth = container.dimensions.height;
        break;
      case "side":
        containerWidth = container.dimensions.length * scale;
        containerHeight = container.dimensions.height * scale;
        containerDepth = container.dimensions.width;
        break;
      case "front":
        containerWidth = container.dimensions.width * scale;
        containerHeight = container.dimensions.height * scale;
        containerDepth = container.dimensions.length;
        break;
    }

    const offsetX = (canvas.width - containerWidth) / 2;
    const offsetY = (canvas.height - containerHeight) / 2;

    // Draw container outline
    ctx.strokeStyle = 'hsl(var(--border))';
    ctx.lineWidth = 2;
    ctx.strokeRect(offsetX, offsetY, containerWidth, containerHeight);

    // Fill container background
    ctx.fillStyle = 'hsl(var(--muted) / 0.1)';
    ctx.fillRect(offsetX, offsetY, containerWidth, containerHeight);

    // Draw products as boxes
    const validProducts = products.filter(p => p.productCode && p.cartons > 0);
    let currentX = offsetX + 10;
    let currentY = offsetY + 10;
    const maxHeight = containerHeight - 20;
    const maxWidth = containerWidth - 20;

    const colors = [
      'hsl(var(--primary) / 0.7)',
      'hsl(var(--secondary) / 0.7)',
      'hsl(var(--accent) / 0.7)',
      'hsl(221.2 83.2% 53.3% / 0.7)',
      'hsl(142.1 76.2% 36.3% / 0.7)',
      'hsl(38.1 100% 50% / 0.7)'
    ];

    validProducts.forEach((product, productIndex) => {
      const color = colors[productIndex % colors.length];
      ctx.fillStyle = color;
      ctx.strokeStyle = color.replace('0.7', '1');
      ctx.lineWidth = 1;

      let productWidth = 0;
      let productHeight = 0;

      switch (viewMode) {
        case "top":
          productWidth = (product.dimensions.length / 100) * scale;
          productHeight = (product.dimensions.width / 100) * scale;
          break;
        case "side":
          productWidth = (product.dimensions.length / 100) * scale;
          productHeight = (product.dimensions.height / 100) * scale;
          break;
        case "front":
          productWidth = (product.dimensions.width / 100) * scale;
          productHeight = (product.dimensions.height / 100) * scale;
          break;
      }

      // Draw multiple cartons for this product
      let cartonsDrawn = 0;
      const maxCartonsToShow = Math.min(product.cartons, 50); // Limit for performance

      for (let i = 0; i < maxCartonsToShow; i++) {
        // Check if we need to move to next row
        if (currentX + productWidth > offsetX + maxWidth) {
          currentX = offsetX + 10;
          currentY += productHeight + 5;
        }

        // Check if we have enough vertical space
        if (currentY + productHeight > offsetY + maxHeight) {
          break;
        }

        // Draw the carton
        ctx.fillRect(currentX, currentY, productWidth, productHeight);
        ctx.strokeRect(currentX, currentY, productWidth, productHeight);

        // Add product label on first carton
        if (i === 0) {
          ctx.fillStyle = 'hsl(var(--foreground))';
          ctx.font = `${Math.max(8, Math.min(12, productWidth / 6))}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(
            product.productCode.substring(0, 6),
            currentX + productWidth / 2,
            currentY + productHeight / 2 + 4
          );
          ctx.fillStyle = color;
        }

        currentX += productWidth + 5;
        cartonsDrawn++;
      }

      // Move to next row after each product type
      currentX = offsetX + 10;
      currentY += productHeight + 10;
    });

    // Draw dimensions
    ctx.fillStyle = 'hsl(var(--muted-foreground))';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';

    // Container dimensions label
    let dimensionsText = '';
    switch (viewMode) {
      case "top":
        dimensionsText = `${container.dimensions.length}m × ${container.dimensions.width}m`;
        break;
      case "side":
        dimensionsText = `${container.dimensions.length}m × ${container.dimensions.height}m`;
        break;
      case "front":
        dimensionsText = `${container.dimensions.width}m × ${container.dimensions.height}m`;
        break;
    }

    ctx.fillText(
      dimensionsText,
      canvas.width / 2,
      offsetY - 10
    );

  }, [container, products, viewMode, zoom]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={300}
      className="w-full h-64 border rounded-lg bg-background"
    />
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
            <TabsTrigger value="top">Top View</TabsTrigger>
            <TabsTrigger value="side">Side View</TabsTrigger>
            <TabsTrigger value="front">Front View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="top" className="space-y-4">
            <Container2D 
              container={selectedContainer} 
              products={validProducts} 
              viewMode="top"
              zoom={zoom}
            />
          </TabsContent>
          
          <TabsContent value="side" className="space-y-4">
            <Container2D 
              container={selectedContainer} 
              products={validProducts} 
              viewMode="side"
              zoom={zoom}
            />
          </TabsContent>
          
          <TabsContent value="front" className="space-y-4">
            <Container2D 
              container={selectedContainer} 
              products={validProducts} 
              viewMode="front"
              zoom={zoom}
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