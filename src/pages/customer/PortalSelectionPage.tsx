import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PortalSelectionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handlePortalSelect = (portalType: string) => {
    if (portalType === 'admin' && user.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (portalType === 'customer' && (user.role === 'customer_admin' || user.role === 'viewer')) {
      navigate('/customer-portal/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Select Portal</CardTitle>
          <CardDescription>
            Choose which portal you'd like to access
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {user.role === 'admin' && (
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Admin Portal</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage customers, users, and system administration
                  </p>
                  <Button 
                    onClick={() => handlePortalSelect('admin')}
                    className="w-full"
                  >
                    Access Admin Portal
                  </Button>
                </CardContent>
              </Card>
            )}

            {(user.role === 'customer_admin' || user.role === 'viewer') && (
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Building2 className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Customer Portal</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Track shipments, view KPIs, and manage logistics operations
                  </p>
                  <Button 
                    onClick={() => handlePortalSelect('customer')}
                    className="w-full"
                  >
                    Access Customer Portal
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Signed in as: <strong>{user.name}</strong> ({user.email})
          </div>
        </CardContent>
      </Card>
    </div>
  );
}