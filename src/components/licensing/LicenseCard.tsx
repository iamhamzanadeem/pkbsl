import { License, Company } from '@/types/licensing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Users, Package, HardDrive, Zap, Settings, Eye } from 'lucide-react';

interface LicenseCardProps {
  license: License;
  company: Company;
  onView?: () => void;
  onEdit?: () => void;
}

export function LicenseCard({ license, company, onView, onEdit }: LicenseCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'trial': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'expired': return 'bg-red-500/10 text-red-700 border-red-500/20';
      case 'suspended': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getUsagePercentage = (current: number, max: number) => {
    if (max === -1) return 0; // Unlimited
    return (current / max) * 100;
  };

  const formatLimit = (limit: number) => {
    return limit === -1 ? 'Unlimited' : limit.toLocaleString();
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{company.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{license.billing.plan.name} Plan</p>
          </div>
          <Badge className={getStatusColor(license.status)}>
            {license.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Billing Info */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Next billing</span>
          </div>
          <span className="text-sm font-medium">
            {license.billing.nextBillingDate 
              ? new Date(license.billing.nextBillingDate).toLocaleDateString()
              : 'N/A'
            }
          </span>
        </div>

        {/* Usage Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Users</span>
            </div>
            <span className="text-sm font-medium">
              {license.usageLimits.currentUsage.users} / {formatLimit(license.usageLimits.maxUsers)}
            </span>
          </div>
          {license.usageLimits.maxUsers !== -1 && (
            <Progress 
              value={getUsagePercentage(license.usageLimits.currentUsage.users, license.usageLimits.maxUsers)} 
              className="h-2"
            />
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Shipments</span>
            </div>
            <span className="text-sm font-medium">
              {license.usageLimits.currentUsage.shipments} / {formatLimit(license.usageLimits.maxShipments)}
            </span>
          </div>
          {license.usageLimits.maxShipments !== -1 && (
            <Progress 
              value={getUsagePercentage(license.usageLimits.currentUsage.shipments, license.usageLimits.maxShipments)} 
              className="h-2"
            />
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Storage</span>
            </div>
            <span className="text-sm font-medium">
              {license.usageLimits.currentUsage.storage}GB / {formatLimit(license.usageLimits.maxStorage)}GB
            </span>
          </div>
          {license.usageLimits.maxStorage !== -1 && (
            <Progress 
              value={getUsagePercentage(license.usageLimits.currentUsage.storage, license.usageLimits.maxStorage)} 
              className="h-2"
            />
          )}
        </div>

        {/* Revenue */}
        <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary">Monthly Revenue</span>
          </div>
          <span className="text-lg font-bold text-primary">
            ${license.billing.amount}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onView} className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
            <Settings className="h-4 w-4 mr-2" />
            Manage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}