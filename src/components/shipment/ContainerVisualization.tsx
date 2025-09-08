import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Box, Text } from "@react-three/drei";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Eye, RotateCcw, ZoomIn } from "lucide-react";
import * as THREE from "three";

interface ContainerSpec {
  type: string;
  displayName: string;
  dimensions: { length: number; width: number; height: number };
  maxWeight: number;
  costPerContainer: number;
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
}

// Container 3D Model Component
function Container3D({ container, products }: { 
  container: ContainerSpec; 
  products: Product[];
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  // Calculate cargo boxes based on products
  const cargoBoxes = products.flatMap((product, productIndex) => {
    const boxes = [];
    const cartonDimensions: [number, number, number] = [
      product.dimensions.length / 100, // Convert cm to meters for 3D
      product.dimensions.width / 100,
      product.dimensions.height / 100
    ];
    
    for (let i = 0; i < Math.min(product.cartons, 20); i++) { // Limit display for performance
      const x = (i % 4) * cartonDimensions[0] * 1.1 - 1.5;
      const z = Math.floor(i / 4) * cartonDimensions[2] * 1.1 - 1.5;
      const y = -container.dimensions.height / 200 + cartonDimensions[1] / 2;
      
      boxes.push(
        <Box
          key={`${product.id}-${i}`}
          position={[x, y, z]}
          args={cartonDimensions}
        >
          <meshPhongMaterial 
            color={productIndex % 2 === 0 ? "#3b82f6" : "#10b981"} 
            transparent
            opacity={0.8}
          />
        </Box>
      );
    }
    return boxes;
  });

  const containerDimensions: [number, number, number] = [
    container.dimensions.length / 100,
    container.dimensions.height / 100,
    container.dimensions.width / 100
  ];

  return (
    <group>
      {/* Container Frame */}
      <group ref={groupRef}>
        {/* Floor */}
        <Box position={[0, -containerDimensions[1]/2, 0]} args={[containerDimensions[0], 0.05, containerDimensions[2]]}>
          <meshPhongMaterial color="#64748b" transparent opacity={0.3} />
        </Box>
        
        {/* Walls */}
        <Box position={[-containerDimensions[0]/2, 0, 0]} args={[0.05, containerDimensions[1], containerDimensions[2]]}>
          <meshPhongMaterial color="#64748b" transparent opacity={0.2} />
        </Box>
        <Box position={[containerDimensions[0]/2, 0, 0]} args={[0.05, containerDimensions[1], containerDimensions[2]]}>
          <meshPhongMaterial color="#64748b" transparent opacity={0.2} />
        </Box>
        <Box position={[0, 0, -containerDimensions[2]/2]} args={[containerDimensions[0], containerDimensions[1], 0.05]}>
          <meshPhongMaterial color="#64748b" transparent opacity={0.2} />
        </Box>
        <Box position={[0, 0, containerDimensions[2]/2]} args={[containerDimensions[0], containerDimensions[1], 0.05]}>
          <meshPhongMaterial color="#64748b" transparent opacity={0.2} />
        </Box>
        
        {/* Cargo */}
        {cargoBoxes}
        
        {/* Container Label */}
        <Text
          position={[0, containerDimensions[1]/2 + 0.2, 0]}
          fontSize={0.2}
          color="#1e40af"
          anchorX="center"
          anchorY="middle"
        >
          {container.displayName}
        </Text>
      </group>
    </group>
  );
}

// Main Visualization Component
export function ContainerVisualization({ 
  selectedContainer, 
  products, 
  utilizationData 
}: ContainerVisualizationProps) {
  const [viewMode, setViewMode] = useState<"3d" | "top" | "side">("3d");
  const [autoRotate, setAutoRotate] = useState(true);
  
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
              onClick={() => setAutoRotate(!autoRotate)}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* View Mode Tabs */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as typeof viewMode)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="3d">3D View</TabsTrigger>
            <TabsTrigger value="top">Top View</TabsTrigger>
            <TabsTrigger value="side">Side View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="3d" className="space-y-4">
            <div className="h-64 bg-gradient-to-b from-sky-50 to-slate-100 rounded-lg border overflow-hidden">
              <Canvas camera={{ position: [5, 3, 5], fov: 60 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -10, -5]} intensity={0.5} />
                
                <Container3D container={selectedContainer} products={validProducts} />
                
                <OrbitControls 
                  enablePan={true} 
                  enableZoom={true} 
                  enableRotate={true}
                  autoRotate={autoRotate}
                  autoRotateSpeed={2}
                />
              </Canvas>
            </div>
          </TabsContent>
          
          <TabsContent value="top" className="space-y-4">
            <div className="h-64 bg-gradient-to-b from-sky-50 to-slate-100 rounded-lg border overflow-hidden">
              <Canvas camera={{ position: [0, 8, 0], fov: 60 }}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[0, 10, 0]} intensity={1} />
                
                <Container3D container={selectedContainer} products={validProducts} />
                
                <OrbitControls 
                  enableRotate={false}
                  enableZoom={true}
                  enablePan={true}
                />
              </Canvas>
            </div>
          </TabsContent>
          
          <TabsContent value="side" className="space-y-4">
            <div className="h-64 bg-gradient-to-b from-sky-50 to-slate-100 rounded-lg border overflow-hidden">
              <Canvas camera={{ position: [8, 0, 0], fov: 60 }}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 0, 0]} intensity={1} />
                
                <Container3D container={selectedContainer} products={validProducts} />
                
                <OrbitControls 
                  enableRotate={false}
                  enableZoom={true}
                  enablePan={true}
                />
              </Canvas>
            </div>
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
              <p className="font-medium">{selectedContainer.dimensions.length} cm</p>
            </div>
            <div>
              <span className="text-muted-foreground">Width</span>
              <p className="font-medium">{selectedContainer.dimensions.width} cm</p>
            </div>
            <div>
              <span className="text-muted-foreground">Height</span>
              <p className="font-medium">{selectedContainer.dimensions.height} cm</p>
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