import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { mockFeatureFlags, mockCompanies, mockLicenses } from '@/data/mockLicensing';
import { FeatureFlag } from '@/types/licensing';
import { Flag, Plus, Settings, Users, Eye } from 'lucide-react';

export function FeatureManagementPage() {
  const [features, setFeatures] = useState(mockFeatureFlags);
  const [selectedFeature, setSelectedFeature] = useState<FeatureFlag | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'boolean': return 'bg-green-500/10 text-green-700';
      case 'string': return 'bg-blue-500/10 text-blue-700';
      case 'number': return 'bg-purple-500/10 text-purple-700';
      case 'json': return 'bg-orange-500/10 text-orange-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'safety': return 'bg-red-500/10 text-red-700 border-red-500/20';
      case 'analytics': return 'bg-purple-500/10 text-purple-700 border-purple-500/20';
      case 'integration': return 'bg-green-500/10 text-green-700 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getFeatureUsageByCompany = (featureKey: string) => {
    let enabledCount = 0;
    let totalCount = 0;

    mockLicenses.forEach(license => {
      totalCount++;
      const feature = license.features.find(f => f.id === featureKey);
      if (feature?.enabled) enabledCount++;
    });

    return { enabled: enabledCount, total: totalCount };
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Feature Management</h1>
          <p className="text-muted-foreground">
            Manage feature flags and customer access controls
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Feature Flag
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Feature Flag</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Feature Name</Label>
                <Input id="name" placeholder="e.g., Advanced Analytics" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="key">Feature Key</Label>
                <Input id="key" placeholder="e.g., advanced_analytics" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe what this feature does..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boolean">Boolean</SelectItem>
                    <SelectItem value="string">String</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="core">Core</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="integration">Integration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="default-enabled" />
                <Label htmlFor="default-enabled">Enabled by default</Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setIsCreateDialogOpen(false)} className="flex-1">
                  Create Feature
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="features" className="space-y-4">
        <TabsList>
          <TabsTrigger value="features">Feature Flags</TabsTrigger>
          <TabsTrigger value="usage">Usage by Company</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead>Dependencies</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {features.map((feature) => {
                  const usage = getFeatureUsageByCompany(feature.key);
                  return (
                    <TableRow key={feature.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Flag className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{feature.name}</div>
                            <div className="text-sm text-muted-foreground">{feature.key}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getTypeColor(feature.type)}>
                          {feature.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(feature.category)}>
                          {feature.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{usage.enabled}/{usage.total}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={feature.defaultValue} 
                          disabled
                        />
                      </TableCell>
                      <TableCell>
                        {feature.dependencies?.length ? (
                          <div className="flex flex-wrap gap-1">
                            {feature.dependencies.map(dep => (
                              <Badge key={dep} variant="outline" className="text-xs">
                                {dep}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <div className="grid gap-4">
            {mockCompanies.map((company) => {
              const license = mockLicenses.find(l => l.companyId === company.id);
              return (
                <Card key={company.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <Badge className={company.status === 'active' ? 'bg-green-500/10 text-green-700' : 'bg-blue-500/10 text-blue-700'}>
                        {company.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {license ? (
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                        {license.features.map((feature) => (
                          <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="text-sm font-medium">{feature.name}</span>
                            <Switch checked={feature.enabled} disabled />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No license assigned</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role-based Feature Access</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure which features are available to different user roles
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {['super_admin', 'admin', 'customer_admin', 'viewer'].map((role) => (
                  <div key={role} className="space-y-3">
                    <h4 className="font-medium capitalize">{role.replace('_', ' ')}</h4>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                      {features.map((feature) => (
                        <div key={feature.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">{feature.name}</span>
                          <Switch 
                            defaultChecked={role === 'super_admin' || (role === 'admin' && feature.category === 'core')}
                          />
                        </div>
                      ))}
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