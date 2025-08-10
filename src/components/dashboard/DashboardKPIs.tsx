import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TruckIcon, ClockIcon, CheckCircleIcon, AlertTriangleIcon, DollarSignIcon, TimerIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
  subtitle?: string;
}

const KPICard = ({ title, value, icon, variant = "default", subtitle }: KPICardProps) => {
  const variantStyles = {
    default: "bg-card border-border",
    success: "bg-success/5 border-success/20",
    warning: "bg-warning/5 border-warning/20", 
    danger: "bg-destructive/5 border-destructive/20"
  };

  const iconStyles = {
    default: "text-primary",
    success: "text-success",
    warning: "text-warning",
    danger: "text-destructive"
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${variantStyles[variant]}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`h-4 w-4 ${iconStyles[variant]}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
};

export const DashboardKPIs = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <KPICard
        title="Arriving Today"
        value="12"
        icon={<TruckIcon className="h-4 w-4" />}
        variant="default"
      />
      <KPICard
        title="In Transit"
        value="47"
        icon={<ClockIcon className="h-4 w-4" />}
        variant="default"
      />
      <KPICard
        title="Delivered (7 days)"
        value="156"
        icon={<CheckCircleIcon className="h-4 w-4" />}
        variant="success"
      />
      <KPICard
        title="On-time Delivery"
        value="94.2%"
        icon={<TimerIcon className="h-4 w-4" />}
        variant="success"
        subtitle="Last 30 days"
      />
      <KPICard
        title="Avg. ETA Delay"
        value="45 min"
        icon={<AlertTriangleIcon className="h-4 w-4" />}
        variant="warning"
        subtitle="This month"
      />
      <KPICard
        title="Outstanding Invoices"
        value="₨ 2.3M"
        icon={<DollarSignIcon className="h-4 w-4" />}
        variant="default"
        subtitle="8 pending"
      />
    </div>
  );
};