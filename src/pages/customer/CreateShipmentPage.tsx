import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CalendarDays, Package, MapPin, Truck, Clock, Download, QrCode, ChevronLeft, ChevronRight, Phone } from "lucide-react";
import { toast } from "sonner";
import { ShipmentMap } from "@/components/shipment/ShipmentMap";
import { Product } from "@/components/shipment/ProductForm";
import { ProductSummary } from "@/components/shipment/ProductSummary";
import { TruckAssignment } from "@/components/shipment/TruckAssignment";
import { ContainerVisualization } from "@/components/shipment/ContainerVisualization";
import { StepProgress, Step } from "@/components/shipment/StepProgress";
import { ProductGrid } from "@/components/shipment/ProductGrid";
import { ProductEditModal } from "@/components/shipment/ProductEditModal";
import { generateBiltyPDF } from "@/utils/pdfGenerator";
import { generateQRCode } from "@/utils/qrGenerator";
import { selectOptimalContainer, ContainerSelectionResult, CONTAINER_SPECS } from "@/utils/containerSelection";
import { selectOptimalTruck, TruckSelectionResult } from "@/utils/truckSelection";
import { mockTrucks } from "@/data/mockTrucks";
import { Truck as TruckType } from "@/types/truck";

interface ShipmentData {
  products: Product[];
  origin: string;
  destination: string;
  pickupDate: string;
  pickupTime: string;
  specialInstructions: string;
}

interface StuffingPlan {
  recommended: ContainerSelectionResult;
  arrangement: string;
  productBreakdown: {
    productCode: string;
    cartons: number;
    weight: number;
    volume: number;
  }[];
}

const createEmptyProduct = (): Product => ({
  id: crypto.randomUUID(),
  productCode: "",
  cartons: 0,
  dimensions: { length: 0, width: 0, height: 0 },
  weightPerCarton: 0,
  description: ""
});

export function CreateShipmentPage() {
  // Wizard steps configuration
  const steps: Step[] = [
    { id: "products", title: "Products", description: "Add products to shipment" },
    { id: "route", title: "Route & Pickup", description: "Set pickup details" },
    { id: "container", title: "Container Selection", description: "Optimize container usage" },
    { id: "truck", title: "Truck Assignment", description: "Assign delivery truck" },
    { id: "review", title: "Review & Generate", description: "Complete shipment" }
  ];

  // State management
  const [currentStep, setCurrentStep] = useState("products");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const [formData, setFormData] = useState<ShipmentData>({
    products: [createEmptyProduct()],
    origin: "",
    destination: "",
    pickupDate: "",
    pickupTime: "",
    specialInstructions: ""
  });

  const [stuffingPlan, setStuffingPlan] = useState<StuffingPlan | null>(null);
  const [selectedContainerType, setSelectedContainerType] = useState<string | null>(null);
  const [truckSelection, setTruckSelection] = useState<TruckSelectionResult | null>(null);
  const [selectedTruck, setSelectedTruck] = useState<TruckType | null>(null);
  const [eta, setETA] = useState<string>("");
  const [biltyNumber, setBiltyNumber] = useState<string>("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [isCalculating, setIsCalculating] = useState(false);

  // Enhanced calculation function with optimal container selection
  const calculateStuffingPlan = (data: ShipmentData, containerType?: string): StuffingPlan => {
    const validProducts = data.products.filter(p => p.productCode && p.cartons > 0);
    
    if (validProducts.length === 0) {
      throw new Error("No valid products found");
    }

    let containerSelection: ContainerSelectionResult;
    
    if (containerType) {
      const specificContainer = CONTAINER_SPECS.find(c => c.type === containerType);
      if (specificContainer) {
        containerSelection = selectOptimalContainer(validProducts);
        const specificOption = containerSelection.allOptions.find(opt => opt.container.type === containerType);
        if (specificOption) {
          containerSelection.recommendedOption = specificOption;
        }
      } else {
        containerSelection = selectOptimalContainer(validProducts);
      }
    } else {
      containerSelection = selectOptimalContainer(validProducts);
    }
    
    const totalCartons = validProducts.reduce((sum, product) => sum + product.cartons, 0);
    
    const productBreakdown = validProducts.map(product => ({
      productCode: product.productCode,
      cartons: product.cartons,
      weight: product.cartons * product.weightPerCarton,
      volume: product.cartons * (product.dimensions.length * product.dimensions.width * product.dimensions.height) / 1000000
    }));
    
    return {
      recommended: containerSelection,
      arrangement: validProducts.length > 1 
        ? `Mixed loading: ${validProducts.length} product types`
        : `${Math.ceil(Math.sqrt(totalCartons))}x${Math.ceil(Math.sqrt(totalCartons))} grid layout`,
      productBreakdown
    };
  };

  // Mock ETA calculation
  const calculateETA = (origin: string, destination: string, pickupDate: string, pickupTime: string): string => {
    const routes = {
      "Karachi-Lahore": 20,
      "Karachi-Islamabad": 24,
      "Lahore-Islamabad": 6,
      "Karachi-Peshawar": 28,
      "Lahore-Karachi": 20
    };
    
    const routeKey = `${origin}-${destination}` as keyof typeof routes;
    const hours = routes[routeKey] || 12;
    
    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
    const etaDateTime = new Date(pickupDateTime.getTime() + hours * 60 * 60 * 1000);
    
    return etaDateTime.toLocaleString();
  };

  // Product management functions
  const updateProduct = (updatedProduct: Product) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    }));
  };

  const removeProduct = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== productId)
    }));
  };

  const duplicateProduct = (product: Product) => {
    const newProduct = { ...product, id: crypto.randomUUID() };
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, newProduct]
    }));
  };

  // Wizard navigation functions
  const canAdvanceFromStep = (stepId: string): boolean => {
    switch (stepId) {
      case "products":
        return formData.products.some(p => p.productCode && p.cartons > 0);
      case "route":
        return !!(formData.origin && formData.destination);
      case "container":
        return stuffingPlan !== null;
      case "truck":
        return selectedTruck !== null;
      default:
        return true;
    }
  };

  const goToNextStep = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex < steps.length - 1 && canAdvanceFromStep(currentStep)) {
      const nextStep = steps[currentIndex + 1];
      setCurrentStep(nextStep.id);
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const goToStep = (stepId: string) => {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (completedSteps.includes(stepId) || Math.abs(stepIndex - currentIndex) <= 1) {
      setCurrentStep(stepId);
    }
  };

  // Product modal handlers
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (product: Product) => {
    if (editingProduct) {
      updateProduct(product);
    } else {
      setFormData(prev => ({ ...prev, products: [...prev.products, product] }));
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleCalculate = async () => {
    const validProducts = formData.products.filter(p => p.productCode && p.cartons > 0);
    
    if (validProducts.length === 0 || !formData.origin || !formData.destination) {
      toast.error("Please add at least one product and select origin/destination");
      return;
    }

    setIsCalculating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const plan = calculateStuffingPlan(formData, selectedContainerType || undefined);
      setStuffingPlan(plan);
      
      const truckOptions = selectOptimalTruck(
        mockTrucks,
        plan.recommended,
        formData.origin,
        formData.pickupDate,
        formData.pickupTime
      );
      setTruckSelection(truckOptions);
      
      if (truckOptions.recommendedTruck) {
        setSelectedTruck(truckOptions.recommendedTruck.truck);
      }
      
      if (formData.pickupDate && formData.pickupTime) {
        const calculatedETA = calculateETA(formData.origin, formData.destination, formData.pickupDate, formData.pickupTime);
        setETA(calculatedETA);
      }
      
      const biltyNo = `BSL-${Date.now().toString().slice(-6)}`;
      setBiltyNumber(biltyNo);
      
      const qrData = {
        biltyNo,
        clientCode: "SHELL001",
        products: validProducts.map(p => ({
          code: p.productCode,
          cartons: p.cartons,
          weight: p.cartons * p.weightPerCarton
        })),
        origin: formData.origin,
        destination: formData.destination
      };
      
      const qrCodeUrl = await generateQRCode(JSON.stringify(qrData));
      setQrCodeDataUrl(qrCodeUrl);
      
      toast.success("Stuffing plan calculated successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Calculation failed");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleTruckSelect = (truckId: string) => {
    const truck = mockTrucks.find(t => t.truckId === truckId);
    if (truck) {
      setSelectedTruck(truck);
      toast.success(`Truck ${truckId} assigned to shipment`);
    }
  };

  const handleContainerChange = async (containerType: string) => {
    setSelectedContainerType(containerType);
    
    if (formData.products.some(p => p.productCode && p.cartons > 0)) {
      try {
        const plan = calculateStuffingPlan(formData, containerType);
        setStuffingPlan(plan);
        
        if (plan) {
          const truckOptions = selectOptimalTruck(
            mockTrucks,
            plan.recommended,
            formData.origin,
            formData.pickupDate,
            formData.pickupTime
          );
          setTruckSelection(truckOptions);
          
          if (truckOptions.recommendedTruck) {
            setSelectedTruck(truckOptions.recommendedTruck.truck);
          }
        }
        
        toast.success("Container type updated successfully");
      } catch (error) {
        toast.error("Error updating container type");
      }
    }
  };

  const handleContactDriver = (truck: TruckType) => {
    toast.info(`Calling ${truck.driverName} at ${truck.driverContact}`);
  };

  const handleGeneratePDF = async () => {
    if (!stuffingPlan || !biltyNumber) {
      toast.error("Please calculate stuffing plan first");
      return;
    }

    const pdfData = {
      biltyNumber,
      formData,
      stuffingPlan: {
        containerType: stuffingPlan.recommended.recommendedOption.container.displayName,
        utilization: stuffingPlan.recommended.recommendedOption.utilization.volume,
        arrangement: stuffingPlan.arrangement,
        maxCartons: 1000,
        estimatedCost: stuffingPlan.recommended.recommendedOption.container.costPerContainer,
        productBreakdown: stuffingPlan.productBreakdown
      },
      eta,
      qrCodeDataUrl,
      clientCode: "SHELL001",
      ...(selectedTruck && {
        truck: {
          truckId: selectedTruck.truckId,
          driverName: selectedTruck.driverName,
          driverContact: selectedTruck.driverContact,
          plateNumber: selectedTruck.plateNumber,
          truckType: selectedTruck.truckType
        }
      })
    };

    await generateBiltyPDF(pdfData);
    toast.success("Bilty PDF generated successfully!");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "products":
        return (
          <ProductGrid
            products={formData.products}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onDuplicateProduct={duplicateProduct}
            onRemoveProduct={removeProduct}
          />
        );

      case "route":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Route Information
              </CardTitle>
              <CardDescription>Select origin and destination for delivery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">Origin *</Label>
                  <Select value={formData.origin} onValueChange={(value) => setFormData(prev => ({ ...prev, origin: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select origin city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Karachi">Karachi</SelectItem>
                      <SelectItem value="Lahore">Lahore</SelectItem>
                      <SelectItem value="Islamabad">Islamabad</SelectItem>
                      <SelectItem value="Peshawar">Peshawar</SelectItem>
                      <SelectItem value="Quetta">Quetta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination *</Label>
                  <Select value={formData.destination} onValueChange={(value) => setFormData(prev => ({ ...prev, destination: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Karachi">Karachi</SelectItem>
                      <SelectItem value="Lahore">Lahore</SelectItem>
                      <SelectItem value="Islamabad">Islamabad</SelectItem>
                      <SelectItem value="Peshawar">Peshawar</SelectItem>
                      <SelectItem value="Quetta">Quetta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pickupDate">Pickup Date</Label>
                  <Input
                    id="pickupDate"
                    type="date"
                    value={formData.pickupDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, pickupDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickupTime">Pickup Time</Label>
                  <Input
                    id="pickupTime"
                    type="time"
                    value={formData.pickupTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, pickupTime: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructions">Special Instructions</Label>
                <Textarea
                  id="instructions"
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                  placeholder="Any special handling requirements..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        );

      case "container":
        return (
          <div className="space-y-6">
            {!stuffingPlan ? (
              <Card>
                <CardHeader>
                  <CardTitle>Calculate Container Selection</CardTitle>
                  <CardDescription>Calculate the optimal container and stuffing plan for your products</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handleCalculate} 
                    disabled={isCalculating}
                    className="flex items-center gap-2"
                  >
                    <Truck className="h-4 w-4" />
                    {isCalculating ? "Calculating..." : "Calculate Stuffing Plan"}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                <ContainerVisualization
                  products={formData.products}
                  selectedContainer={stuffingPlan.recommended.recommendedOption.container}
                  utilizationData={{
                    ...stuffingPlan.recommended.recommendedOption.utilization,
                    efficiency: (stuffingPlan.recommended.recommendedOption.utilization.volume * stuffingPlan.recommended.recommendedOption.utilization.weight) / 2
                  }}
                  onContainerChange={handleContainerChange}
                />
                <Card>
                  <CardHeader>
                    <CardTitle>Container Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProductSummary products={formData.products} />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        );

      case "truck":
        return truckSelection ? (
          <TruckAssignment
            truckSelection={truckSelection}
            selectedTruckId={selectedTruck?.truckId || null}
            onTruckSelect={handleTruckSelect}
            onContactDriver={handleContactDriver}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Truck Options Available</CardTitle>
              <CardDescription>Please complete the container selection step first</CardDescription>
            </CardHeader>
          </Card>
        );

      case "review":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipment Summary</CardTitle>
                <CardDescription>Review your shipment details before generating the bilty</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Origin</Label>
                    <p>{formData.origin}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Destination</Label>
                    <p>{formData.destination}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Pickup Date</Label>
                    <p>{formData.pickupDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Pickup Time</Label>
                    <p>{formData.pickupTime}</p>
                  </div>
                </div>
                
                {stuffingPlan && (
                  <div>
                    <Label className="text-sm font-medium">Container Type</Label>
                    <p>{stuffingPlan.recommended.recommendedOption.container.displayName}</p>
                  </div>
                )}
                
                {selectedTruck && (
                  <div>
                    <Label className="text-sm font-medium">Assigned Truck</Label>
                    <p>{selectedTruck.truckId} - {selectedTruck.driverName}</p>
                  </div>
                )}
                
                {eta && (
                  <div>
                    <Label className="text-sm font-medium">Estimated Arrival</Label>
                    <p>{eta}</p>
                  </div>
                )}
                
                {biltyNumber && (
                  <div>
                    <Label className="text-sm font-medium">Bilty Number</Label>
                    <p>{biltyNumber}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="flex gap-4">
              <Button 
                onClick={handleGeneratePDF}
                disabled={!stuffingPlan || !biltyNumber}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Generate PDF
              </Button>
              
              {selectedTruck && (
                <Button 
                  onClick={() => handleContactDriver(selectedTruck)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Contact Driver
                </Button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Shipment</h1>
            <p className="text-muted-foreground">Generate bilty with optimized stuffing plan</p>
          </div>
        </div>
      </div>

      <StepProgress
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={goToStep}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {renderStepContent()}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStep === "products"}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <Button
              onClick={goToNextStep}
              disabled={!canAdvanceFromStep(currentStep) || currentStep === "review"}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {formData.origin && formData.destination && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Route Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ShipmentMap origin={formData.origin} destination={formData.destination} />
              </CardContent>
            </Card>
          )}

          {stuffingPlan && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Shipment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Total Cartons:</span>
                    <p>{formData.products.reduce((sum, p) => sum + p.cartons, 0)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Total Weight:</span>
                    <p>{formData.products.reduce((sum, p) => sum + (p.cartons * p.weightPerCarton), 0).toFixed(1)} kg</p>
                  </div>
                  <div>
                    <span className="font-medium">Container:</span>
                    <p>{stuffingPlan.recommended.recommendedOption.container.displayName}</p>
                  </div>
                  <div>
                    <span className="font-medium">Efficiency:</span>
                    <p>{(stuffingPlan.recommended.recommendedOption.utilization.volume * 100).toFixed(1)}%</p>
                  </div>
                </div>
                
                {eta && (
                  <div>
                    <span className="font-medium text-sm">Estimated Arrival:</span>
                    <p className="text-sm">{eta}</p>
                  </div>
                )}
                
                {biltyNumber && (
                  <div className="flex items-center gap-2">
                    <QrCode className="h-4 w-4" />
                    <div>
                      <span className="font-medium text-sm">Bilty Number:</span>
                      <p className="text-sm">{biltyNumber}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <ProductEditModal
        product={editingProduct}
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
      />
    </div>
  );
}