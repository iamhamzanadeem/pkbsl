import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LicenseCard } from '@/components/licensing/LicenseCard';
import { CompanyTable } from '@/components/licensing/CompanyTable';
import { mockCompanies, mockLicenses, mockAnalytics } from '@/data/mockLicensing';
import { Building2, DollarSign, Users, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export function LicensingDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const analytics = mockAnalytics;
  const companies = mockCompanies;
  const licenses = mockLicenses;

  // Calculate stats
  const trialCompanies = companies.filter(c => c.status === 'trial').length;
  const activeCompanies = companies.filter(c => c.status === 'active').length;
  const prospectCompanies = companies.filter(c => c.status === 'prospect').length;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Licensing Dashboard</h1>
        <p className="text-muted-foreground">
          Manage customer licenses, subscriptions, and revenue
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCompanies}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-green-600">
                +{prospectCompanies} prospects
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeSubscriptions}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-blue-600">
                +{trialCompanies} trials
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(analytics.conversionRate * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Trial to paid conversion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="licenses">Active Licenses</TabsTrigger>
          <TabsTrigger value="companies">All Companies</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium">Shell Pakistan upgraded to Enterprise</p>
                    <p className="text-sm text-muted-foreground">2 days ago</p>
                  </div>
                  <Badge className="bg-green-500/10 text-green-700">
                    +$500 MRR
                  </Badge>
                </div>
                
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div className="flex-1">
                    <p className="font-medium">Unilever trial expiring in 3 days</p>
                    <p className="text-sm text-muted-foreground">Requires follow-up</p>
                  </div>
                  <Badge variant="outline" className="text-yellow-600">
                    Action needed
                  </Badge>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium">AGS Solutions requested demo</p>
                    <p className="text-sm text-muted-foreground">1 week ago</p>
                  </div>
                  <Badge variant="outline" className="text-blue-600">
                    Prospect
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Plans */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.revenueByPlan.map((plan) => (
                  <div key={plan.planId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{plan.planName}</p>
                      <p className="text-sm text-muted-foreground">{plan.customerCount} customers</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${plan.revenue}</p>
                      <p className="text-sm text-muted-foreground">monthly</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="licenses" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {licenses.map((license) => {
              const company = companies.find(c => c.id === license.companyId);
              if (!company) return null;
              
              return (
                <LicenseCard
                  key={license.id}
                  license={license}
                  company={company}
                  onView={() => console.log('View license:', license.id)}
                  onEdit={() => console.log('Edit license:', license.id)}
                />
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="companies" className="space-y-4">
          <CompanyTable
            companies={companies}
            onViewCompany={(company) => console.log('View company:', company.id)}
            onEditCompany={(company) => console.log('Edit company:', company.id)}
            onCreateLicense={(company) => console.log('Create license for:', company.id)}
            onViewLicense={(company) => console.log('View license for:', company.id)}
          />
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Recurring Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  ${analytics.monthlyRevenue.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Average Revenue Per User: ${analytics.averageRevenuePerUser}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Churn Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {(analytics.churnRate * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Monthly customer churn rate
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.customerGrowth.slice(-6).map((metric) => (
                  <div key={metric.month} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{new Date(metric.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                      <p className="text-sm text-muted-foreground">
                        +{metric.newCustomers} new, -{metric.churnedCustomers} churned
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{metric.totalCustomers} customers</p>
                      <p className="text-sm text-muted-foreground">${metric.revenue} revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}