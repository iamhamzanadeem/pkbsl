import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "@/components/shipment/ProductForm";
import { standardProducts } from "@/data/standardProducts";

interface ProductEditModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export function ProductEditModal({ product, isOpen, onClose, onSave }: ProductEditModalProps) {
  const [formData, setFormData] = useState<Product>(
    product || {
      id: crypto.randomUUID(),
      productCode: "",
      cartons: 0,
      dimensions: { length: 0, width: 0, height: 0 },
      weightPerCarton: 0,
      description: ""
    }
  );

  React.useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        id: crypto.randomUUID(),
        productCode: "",
        cartons: 0,
        dimensions: { length: 0, width: 0, height: 0 },
        weightPerCarton: 0,
        description: ""
      });
    }
  }, [product, isOpen]);

  const handleStandardProductSelect = (productCode: string) => {
    const standardProduct = standardProducts.find(p => p.code === productCode);
    if (standardProduct) {
      setFormData(prev => ({
        ...prev,
        productCode: standardProduct.code,
        dimensions: standardProduct.dimensions,
        weightPerCarton: standardProduct.weightPerCarton,
        description: standardProduct.description
      }));
    }
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const isValid = formData.productCode && formData.cartons > 0 && 
                  formData.dimensions.length > 0 && formData.dimensions.width > 0 && 
                  formData.dimensions.height > 0 && formData.weightPerCarton > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Standard Product Selection */}
          <div className="space-y-2">
            <Label>Quick Select (Standard Products)</Label>
            <Select onValueChange={handleStandardProductSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a standard product..." />
              </SelectTrigger>
              <SelectContent>
                {standardProducts.map((product) => (
                  <SelectItem key={product.code} value={product.code}>
                    {product.code} - {product.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Code */}
          <div className="space-y-2">
            <Label htmlFor="productCode">Product Code *</Label>
            <Input
              id="productCode"
              value={formData.productCode}
              onChange={(e) => setFormData(prev => ({ ...prev, productCode: e.target.value }))}
              placeholder="e.g., SH001"
            />
          </div>

          {/* Cartons */}
          <div className="space-y-2">
            <Label htmlFor="cartons">Number of Cartons *</Label>
            <Input
              id="cartons"
              type="number"
              min="1"
              value={formData.cartons || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, cartons: parseInt(e.target.value) || 0 }))}
              placeholder="0"
            />
          </div>

          {/* Dimensions */}
          <div className="space-y-2">
            <Label>Carton Dimensions (cm) *</Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="length" className="text-xs">Length</Label>
                <Input
                  id="length"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.dimensions.length || ""}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    dimensions: { ...prev.dimensions, length: parseFloat(e.target.value) || 0 }
                  }))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="width" className="text-xs">Width</Label>
                <Input
                  id="width"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.dimensions.width || ""}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    dimensions: { ...prev.dimensions, width: parseFloat(e.target.value) || 0 }
                  }))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="height" className="text-xs">Height</Label>
                <Input
                  id="height"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.dimensions.height || ""}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    dimensions: { ...prev.dimensions, height: parseFloat(e.target.value) || 0 }
                  }))}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <Label htmlFor="weight">Weight per Carton (kg) *</Label>
            <Input
              id="weight"
              type="number"
              min="0"
              step="0.1"
              value={formData.weightPerCarton || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, weightPerCarton: parseFloat(e.target.value) || 0 }))}
              placeholder="0"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Product description..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!isValid}>
              {product ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}