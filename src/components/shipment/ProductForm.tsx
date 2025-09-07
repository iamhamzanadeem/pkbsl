import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Package, Trash2, Copy, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { standardProducts, getProductByCode, searchProducts } from "@/data/standardProducts";


export interface Product {
  id: string;
  productCode: string;
  cartons: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  weightPerCarton: number;
  description: string;
}

interface ProductFormProps {
  product: Product;
  index: number;
  onUpdate: (product: Product) => void;
  onRemove: (id: string) => void;
  onDuplicate: (product: Product) => void;
  canRemove: boolean;
}

export function ProductForm({ product, index, onUpdate, onRemove, onDuplicate, canRemove }: ProductFormProps) {
  const [open, setOpen] = useState(false);
  const updateProduct = (field: keyof Product, value: any) => {
    onUpdate({ ...product, [field]: value });
  };

  const handleProductSelect = (productCode: string) => {
    const standardProduct = getProductByCode(productCode);
    if (standardProduct) {
      onUpdate({
        ...product,
        productCode: standardProduct.code,
        dimensions: standardProduct.dimensions,
        weightPerCarton: standardProduct.weightPerCarton,
        description: standardProduct.description
      });
    }
    setOpen(false);
  };

  const updateDimension = (dimension: keyof Product['dimensions'], value: number) => {
    onUpdate({
      ...product,
      dimensions: { ...product.dimensions, [dimension]: value }
    });
  };

  const totalWeight = product.cartons * product.weightPerCarton;
  const totalVolume = product.cartons * (product.dimensions.length * product.dimensions.width * product.dimensions.height) / 1000000;

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="h-5 w-5" />
            Product {index + 1}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDuplicate(product)}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
            {canRemove && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onRemove(product.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <CardDescription>Enter details for this product</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`productCode-${product.id}`}>Product Code *</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {product.productCode || "Select product code..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 z-50 bg-background border shadow-lg">
                <Command>
                  <CommandInput placeholder="Search products..." />
                  <CommandList>
                    <CommandEmpty>No product found.</CommandEmpty>
                    <CommandGroup>
                      {standardProducts.map((standardProduct) => (
                        <CommandItem
                          key={standardProduct.code}
                          value={standardProduct.code}
                          onSelect={() => handleProductSelect(standardProduct.code)}
                          className="cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              product.productCode === standardProduct.code ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium">{standardProduct.code}</span>
                            <span className="text-sm text-muted-foreground">{standardProduct.name}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`cartons-${product.id}`}>Number of Cartons *</Label>
            <Input
              id={`cartons-${product.id}`}
              type="number"
              value={product.cartons || ""}
              onChange={(e) => updateProduct('cartons', parseInt(e.target.value) || 0)}
              placeholder="e.g., 100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Dimensions per Carton (cm) *</Label>
          <div className="grid grid-cols-3 gap-2">
            <Input
              placeholder="Length"
              type="number"
              value={product.dimensions.length || ""}
              onChange={(e) => updateDimension('length', parseFloat(e.target.value) || 0)}
              disabled={!!getProductByCode(product.productCode)}
            />
            <Input
              placeholder="Width"
              type="number"
              value={product.dimensions.width || ""}
              onChange={(e) => updateDimension('width', parseFloat(e.target.value) || 0)}
              disabled={!!getProductByCode(product.productCode)}
            />
            <Input
              placeholder="Height"
              type="number"
              value={product.dimensions.height || ""}
              onChange={(e) => updateDimension('height', parseFloat(e.target.value) || 0)}
              disabled={!!getProductByCode(product.productCode)}
            />
          </div>
          {getProductByCode(product.productCode) && (
            <p className="text-xs text-muted-foreground">
              Dimensions are auto-filled from standard product catalog
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`weight-${product.id}`}>Weight per Carton (kg) *</Label>
            <Input
              id={`weight-${product.id}`}
              type="number"
              value={product.weightPerCarton || ""}
              onChange={(e) => updateProduct('weightPerCarton', parseFloat(e.target.value) || 0)}
              placeholder="e.g., 25.5"
              disabled={!!getProductByCode(product.productCode)}
            />
            {getProductByCode(product.productCode) && (
              <p className="text-xs text-muted-foreground">
                Weight is auto-filled from standard product catalog
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor={`description-${product.id}`}>Description</Label>
            <Input
              id={`description-${product.id}`}
              value={product.description}
              onChange={(e) => updateProduct('description', e.target.value)}
              placeholder="Product description"
              disabled={!!getProductByCode(product.productCode)}
            />
            {getProductByCode(product.productCode) && (
              <p className="text-xs text-muted-foreground">
                Description is auto-filled from standard product catalog
              </p>
            )}
          </div>
        </div>

        {/* Product Summary */}
        {product.cartons > 0 && product.weightPerCarton > 0 && (
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Weight:</span>
              <Badge variant="secondary">{totalWeight.toFixed(2)} kg</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Volume:</span>
              <Badge variant="secondary">{totalVolume.toFixed(3)} m³</Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}