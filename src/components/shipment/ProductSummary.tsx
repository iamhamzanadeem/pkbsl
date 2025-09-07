import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BarChart3, Package, Weight, Box } from "lucide-react";
import { Product } from "./ProductForm";

interface ProductSummaryProps {
  products: Product[];
}

export function ProductSummary({ products }: ProductSummaryProps) {
  const totalCartons = products.reduce((sum, product) => sum + product.cartons, 0);
  const totalWeight = products.reduce((sum, product) => sum + (product.cartons * product.weightPerCarton), 0);
  const totalVolume = products.reduce((sum, product) => {
    return sum + (product.cartons * (product.dimensions.length * product.dimensions.width * product.dimensions.height) / 1000000);
  }, 0);

  const validProducts = products.filter(p => p.productCode && p.cartons > 0);

  if (validProducts.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Shipment Summary
        </CardTitle>
        <CardDescription>
          Total summary across all {validProducts.length} product{validProducts.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center">
              <Package className="h-4 w-4 text-muted-foreground mr-1" />
            </div>
            <div className="text-2xl font-bold">{totalCartons}</div>
            <div className="text-xs text-muted-foreground">Total Cartons</div>
          </div>
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center">
              <Weight className="h-4 w-4 text-muted-foreground mr-1" />
            </div>
            <div className="text-2xl font-bold">{totalWeight.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">Total Weight (kg)</div>
          </div>
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center">
              <Box className="h-4 w-4 text-muted-foreground mr-1" />
            </div>
            <div className="text-2xl font-bold">{totalVolume.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">Total Volume (m³)</div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="text-sm font-medium">Product Breakdown:</div>
          {validProducts.map((product, index) => (
            <div key={product.id} className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                {product.productCode || `Product ${index + 1}`}
              </span>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  {product.cartons} cartons
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {(product.cartons * product.weightPerCarton).toFixed(1)} kg
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}