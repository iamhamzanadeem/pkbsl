import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/components/shipment/ProductForm";
import { Plus, Edit, Copy, Trash2, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDuplicateProduct: (product: Product) => void;
  onRemoveProduct: (productId: string) => void;
  className?: string;
}

export function ProductGrid({
  products,
  onAddProduct,
  onEditProduct,
  onDuplicateProduct,
  onRemoveProduct,
  className
}: ProductGridProps) {
  const validProducts = products.filter(p => p.productCode && p.cartons > 0);
  const incompleteProducts = products.filter(p => !p.productCode || p.cartons === 0);

  const formatVolume = (dimensions: { length: number; width: number; height: number }) => {
    const volume = (dimensions.length * dimensions.width * dimensions.height) / 1000000;
    return volume.toFixed(3);
  };

  const getTotalWeight = (product: Product) => {
    return (product.cartons * product.weightPerCarton).toFixed(1);
  };

  const getTotalVolume = (product: Product) => {
    const singleVolume = parseFloat(formatVolume(product.dimensions));
    return (singleVolume * product.cartons).toFixed(3);
  };

  const getProductStatus = (product: Product) => {
    if (!product.productCode) return { status: "incomplete", label: "Missing Code", variant: "destructive" as const };
    if (product.cartons === 0) return { status: "incomplete", label: "No Cartons", variant: "destructive" as const };
    if (!product.dimensions.length || !product.dimensions.width || !product.dimensions.height) {
      return { status: "incomplete", label: "Missing Dimensions", variant: "destructive" as const };
    }
    if (product.weightPerCarton === 0) return { status: "incomplete", label: "Missing Weight", variant: "destructive" as const };
    return { status: "complete", label: "Complete", variant: "default" as const };
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Products</h3>
          <p className="text-sm text-muted-foreground">
            {validProducts.length} of {products.length} products ready for shipment
          </p>
        </div>
        <Button onClick={onAddProduct} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Product Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const status = getProductStatus(product);
          const isComplete = status.status === "complete";

          return (
            <Card 
              key={product.id} 
              className={cn(
                "relative group hover:shadow-md transition-all cursor-pointer",
                !isComplete && "border-destructive/50 bg-destructive/5"
              )}
              onClick={() => onEditProduct(product)}
            >
              <CardContent className="p-4">
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={status.variant} className="text-xs">
                    {status.label}
                  </Badge>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditProduct(product);
                      }}
                      className="h-7 w-7 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateProduct(product);
                      }}
                      className="h-7 w-7 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    {products.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveProduct(product.id);
                        }}
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-3">
                  {/* Product Code */}
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-sm">
                        {product.productCode || "No Product Code"}
                      </div>
                      {product.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {product.description}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-muted-foreground">Cartons</div>
                      <div className="font-medium">{product.cartons}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Weight</div>
                      <div className="font-medium">{getTotalWeight(product)} kg</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Dimensions</div>
                      <div className="font-medium">
                        {product.dimensions.length}×{product.dimensions.width}×{product.dimensions.height}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Volume</div>
                      <div className="font-medium">{getTotalVolume(product)} m³</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Add Product Card */}
        <Card 
          className="border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
          onClick={onAddProduct}
        >
          <CardContent className="p-4 flex flex-col items-center justify-center h-full min-h-[200px]">
            <Plus className="h-8 w-8 text-muted-foreground mb-2" />
            <div className="text-sm font-medium text-muted-foreground">Add Product</div>
            <div className="text-xs text-muted-foreground text-center mt-1">
              Click to add a new product to this shipment
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      {validProducts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {validProducts.reduce((sum, p) => sum + p.cartons, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Cartons</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {validProducts.reduce((sum, p) => sum + (p.cartons * p.weightPerCarton), 0).toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Total Weight (kg)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {validProducts.reduce((sum, p) => {
                const volume = (p.dimensions.length * p.dimensions.width * p.dimensions.height) / 1000000;
                return sum + (volume * p.cartons);
              }, 0).toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">Total Volume (m³)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{validProducts.length}</div>
            <div className="text-xs text-muted-foreground">Product Types</div>
          </div>
        </div>
      )}
    </div>
  );
}