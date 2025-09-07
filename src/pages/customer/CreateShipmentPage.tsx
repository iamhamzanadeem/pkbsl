import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Package, MapPin, Truck, Clock, Download, QrCode } from "lucide-react";
import { toast } from "sonner";
import { ShipmentMap } from "@/components/shipment/ShipmentMap";
import { generateBiltyPDF } from "@/utils/pdfGenerator";
import { generateQRCode } from "@/utils/qrGenerator";

interface ShipmentData {
  productCode: string;
  cartons: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  weightPerCarton: number;
  origin: string;
  destination: string;
  pickupDate: string;
  pickupTime: string;
  specialInstructions: string;
}

interface StuffingPlan {
  containerType: string;
  utilization: number;
  arrangement: string;
  maxCartons: number;
  estimatedCost: number;
}

export function CreateShipmentPage() {
  const [formData, setFormData] = useState<ShipmentData>({
    productCode: "",
    cartons: 0,
    dimensions: { length: 0, width: 0, height: 0 },
    weightPerCarton: 0,
    origin: "",
    destination: "",
    pickupDate: "",
    pickupTime: "",
    specialInstructions: ""
  });

  const [stuffingPlan, setStuffingPlan] = useState<StuffingPlan | null>(null);
  const [eta, setETA] = useState<string>("");
  const [biltyNumber, setBiltyNumber] = useState<string>("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [isCalculating, setIsCalculating] = useState(false);

  // Mock calculation function
  const calculateStuffingPlan = (data: ShipmentData): StuffingPlan => {
    const totalVolume = data.cartons * (data.dimensions.length * data.dimensions.width * data.dimensions.height) / 1000000; // m³
    const totalWeight = data.cartons * data.weightPerCarton;

    // Mock container selection logic
    let containerType = "20ft Standard Container";
    let maxCartons = 1000;
    let estimatedCost = 50000;

    if (totalVolume > 25 || totalWeight > 15000) {
      containerType = "40ft High Cube Container";
      maxCartons = 2000;
      estimatedCost = 85000;
    } else if (totalVolume > 15 || totalWeight > 8000) {
      containerType = "20ft High Cube Container";
      maxCartons = 1200;
      estimatedCost = 65000;
    }

    const utilization = Math.min((totalVolume / (containerType.includes("40ft") ? 67 : 33)) * 100, 100);
    
    return {
      containerType,
      utilization: Math.round(utilization),
      arrangement: `${Math.ceil(Math.sqrt(data.cartons))}x${Math.ceil(Math.sqrt(data.cartons))} grid layout`,
      maxCartons,
      estimatedCost
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

  const handleCalculate = async () => {
    if (!formData.productCode || !formData.cartons || !formData.origin || !formData.destination) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsCalculating(true);
    
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const plan = calculateStuffingPlan(formData);
    setStuffingPlan(plan);
    
    if (formData.pickupDate && formData.pickupTime) {
      const calculatedETA = calculateETA(formData.origin, formData.destination, formData.pickupDate, formData.pickupTime);
      setETA(calculatedETA);
    }
    
    // Generate bilty number
    const biltyNo = `BSL-${Date.now().toString().slice(-6)}`;
    setBiltyNumber(biltyNo);
    
    // Generate QR code
    const qrData = {
      biltyNo,
      clientCode: "SHELL001",
      productCode: formData.productCode,
      cartons: formData.cartons,
      origin: formData.origin,
      destination: formData.destination
    };
    
    const qrCodeUrl = await generateQRCode(JSON.stringify(qrData));
    setQrCodeDataUrl(qrCodeUrl);
    
    setIsCalculating(false);
    toast.success("Stuffing plan calculated successfully!");
  };

  const handleGeneratePDF = async () => {
    if (!stuffingPlan || !biltyNumber) {
      toast.error("Please calculate stuffing plan first");
      return;
    }

    await generateBiltyPDF({
      biltyNumber,
      formData,
      stuffingPlan,
      eta,
      qrCodeDataUrl,
      clientCode: "SHELL001"
    });
    
    toast.success("Bilty PDF generated successfully!");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Shipment</h1>
            <p className="text-muted-foreground">Generate bilty with optimized stuffing plan</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Information
              </CardTitle>
              <CardDescription>Enter product details and specifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productCode">Product Code *</Label>
                  <Input
                    id="productCode"
                    value={formData.productCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, productCode: e.target.value }))}
                    placeholder="e.g., SHELL-OIL-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cartons">Number of Cartons *</Label>
                  <Input
                    id="cartons"
                    type="number"
                    value={formData.cartons || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, cartons: parseInt(e.target.value) || 0 }))}
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
                    value={formData.dimensions.length || ""}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      dimensions: { ...prev.dimensions, length: parseFloat(e.target.value) || 0 }
                    }))}
                  />
                  <Input
                    placeholder="Width"
                    type="number"
                    value={formData.dimensions.width || ""}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      dimensions: { ...prev.dimensions, width: parseFloat(e.target.value) || 0 }
                    }))}
                  />
                  <Input
                    placeholder="Height"
                    type="number"
                    value={formData.dimensions.height || ""}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      dimensions: { ...prev.dimensions, height: parseFloat(e.target.value) || 0 }
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight per Carton (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weightPerCarton || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, weightPerCarton: parseFloat(e.target.value) || 0 }))}
                  placeholder="e.g., 25.5"
                />
              </div>
            </CardContent>
          </Card>

          {/* Route Information */}
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

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button 
              onClick={handleCalculate} 
              disabled={isCalculating}
              className="flex items-center gap-2"
            >
              <Truck className="h-4 w-4" />
              {isCalculating ? "Calculating..." : "Calculate Stuffing Plan"}
            </Button>
            
            {stuffingPlan && (
              <Button 
                onClick={handleGeneratePDF}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Generate PDF
              </Button>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Stuffing Plan Results */}
          {stuffingPlan && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Recommended Container
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Container Type:</span>
                    <Badge variant="secondary">{stuffingPlan.containerType}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Utilization:</span>
                    <span className="font-medium">{stuffingPlan.utilization}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Arrangement:</span>
                    <span className="font-medium text-sm">{stuffingPlan.arrangement}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Estimated Cost:</span>
                    <span className="font-medium">PKR {stuffingPlan.estimatedCost.toLocaleString()}</span>
                  </div>
                </div>
                
                <Separator />
                
                {biltyNumber && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Bilty Number:</span>
                      <Badge>{biltyNumber}</Badge>
                    </div>
                  </div>
                )}
                
                {eta && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-muted-foreground">Expected ETA:</span>
                      <div className="text-right">
                        <div className="font-medium text-sm">{eta}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Estimated
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {qrCodeDataUrl && (
                  <div className="space-y-2">
                    <Separator />
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <QrCode className="h-4 w-4" />
                        <span className="text-sm font-medium">QR Code</span>
                      </div>
                      <img src={qrCodeDataUrl} alt="Bilty QR Code" className="mx-auto w-24 h-24" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Map */}
          <Card>
            <CardHeader>
              <CardTitle>Route Map</CardTitle>
            </CardHeader>
            <CardContent>
              <ShipmentMap 
                origin={formData.origin} 
                destination={formData.destination}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}