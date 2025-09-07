import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Truck, Phone, Clock, Weight, Package } from "lucide-react";
import { TruckSelectionResult, TruckOption, formatETA } from "@/utils/truckSelection";
import { cn } from "@/lib/utils";

interface TruckAssignmentProps {
  truckSelection: TruckSelectionResult;
  selectedTruckId: string | null;
  onTruckSelect: (truckId: string) => void;
  onContactDriver: (truck: any) => void;
}

function getTruckStatusBadge(status: string) {
  const variants = {
    'Available': 'default',
    'En Route': 'secondary',
    'In Transit': 'outline',
    'Maintenance': 'destructive',
    'Loading': 'secondary',
    'Unloading': 'secondary'
  } as const;
  
  return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
}

function TruckOptionCard({ 
  option, 
  isSelected, 
  onSelect, 
  onContactDriver, 
  isRecommended = false 
}: {
  option: TruckOption;
  isSelected: boolean;
  onSelect: () => void;
  onContactDriver: () => void;
  isRecommended?: boolean;
}) {
  return (
    <div className={cn(
      "border rounded-lg p-4 space-y-3 cursor-pointer transition-all",
      isSelected 
        ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
        : "border-border hover:border-muted-foreground/50",
      isRecommended && "border-green-500 bg-green-50/50"
    )} onClick={onSelect}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <RadioGroupItem value={option.truck.truckId} checked={isSelected} />
            <Label className="font-medium">{option.truck.truckId}</Label>
            {isRecommended && <Badge variant="outline" className="text-green-600 border-green-600">Recommended</Badge>}
          </div>
          <div className="text-sm text-muted-foreground">
            {option.truck.driverName} • {option.truck.truckType}
          </div>
        </div>
        
        <div className="text-right space-y-1">
          {getTruckStatusBadge(option.truck.status)}
          <div className="text-sm font-medium">Score: {Math.round(option.score)}/100</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            ETA: {formatETA(option.etaHours)}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Package className="h-3 w-3" />
            Utilization: {Math.round(option.utilizationPercentage)}%
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Weight className="h-3 w-3" />
            Capacity: {option.truck.capacity.maxWeight}kg
          </div>
          <div className="text-muted-foreground">
            Location: {option.truck.currentLocation}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-sm font-medium">{option.reasoning}</div>
        
        {option.pros.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs font-medium text-green-600">Advantages:</div>
            <ul className="text-xs text-muted-foreground space-y-0.5">
              {option.pros.map((pro, index) => (
                <li key={index}>• {pro}</li>
              ))}
            </ul>
          </div>
        )}
        
        {option.cons.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs font-medium text-amber-600">Considerations:</div>
            <ul className="text-xs text-muted-foreground space-y-0.5">
              {option.cons.map((con, index) => (
                <li key={index}>• {con}</li>
              ))}
            </ul>
          </div>
        )}
        
        {option.compatibilityIssues.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs font-medium text-red-600">Issues:</div>
            <ul className="text-xs text-muted-foreground space-y-0.5">
              {option.compatibilityIssues.map((issue, index) => (
                <li key={index}>• {issue}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onContactDriver();
          }}
          className="flex items-center gap-1"
        >
          <Phone className="h-3 w-3" />
          Call Driver
        </Button>
        <div className="text-xs text-muted-foreground">
          Plate: {option.truck.plateNumber}
        </div>
      </div>
    </div>
  );
}

export function TruckAssignment({ 
  truckSelection, 
  selectedTruckId, 
  onTruckSelect, 
  onContactDriver 
}: TruckAssignmentProps) {
  if (!truckSelection.recommendedTruck && truckSelection.alternativeOptions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Truck Assignment
          </CardTitle>
          <CardDescription>No suitable trucks available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <div className="text-muted-foreground">
              No trucks found that can handle this container and route.
            </div>
            <div className="text-sm text-muted-foreground">
              Available trucks: {truckSelection.availableTrucks} / {truckSelection.totalTrucks}
            </div>
            <Button variant="outline" className="mx-auto">
              Contact Operations Team
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Truck Assignment
        </CardTitle>
        <CardDescription>
          Select a truck for this shipment ({truckSelection.availableTrucks} available)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={selectedTruckId || ""} onValueChange={onTruckSelect}>
          {/* Recommended Truck */}
          {truckSelection.recommendedTruck && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Recommended Option</div>
              <TruckOptionCard
                option={truckSelection.recommendedTruck}
                isSelected={selectedTruckId === truckSelection.recommendedTruck.truck.truckId}
                onSelect={() => onTruckSelect(truckSelection.recommendedTruck!.truck.truckId)}
                onContactDriver={() => onContactDriver(truckSelection.recommendedTruck!.truck)}
                isRecommended={true}
              />
            </div>
          )}
          
          {/* Alternative Options */}
          {truckSelection.alternativeOptions.length > 0 && (
            <>
              {truckSelection.recommendedTruck && <Separator />}
              <div className="space-y-2">
                <div className="text-sm font-medium">Alternative Options</div>
                <div className="space-y-3">
                  {truckSelection.alternativeOptions.map((option) => (
                    <TruckOptionCard
                      key={option.truck.truckId}
                      option={option}
                      isSelected={selectedTruckId === option.truck.truckId}
                      onSelect={() => onTruckSelect(option.truck.truckId)}
                      onContactDriver={() => onContactDriver(option.truck)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </RadioGroup>
        
        <Separator />
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Total trucks available: {truckSelection.availableTrucks}</span>
          <span>Options shown: {Math.min(4, (truckSelection.recommendedTruck ? 1 : 0) + truckSelection.alternativeOptions.length)}</span>
        </div>
      </CardContent>
    </Card>
  );
}