import { useState } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getPortalConfig } from '@/config/portals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Shield, Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
  const { portal } = useParams<{ portal?: string }>();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuth();
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const portalConfig = portal ? getPortalConfig(portal) : null;
  const isAdminLogin = portal === 'admin';

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || 
      (portal === 'admin' ? '/admin/dashboard' : '/customer-portal/dashboard');
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const targetPortal = portal === 'admin' ? 'admin' : 'customer-portal';
      await login({
        ...credentials,
        portal: targetPortal,
      });
      
      // Redirect after successful login
      if (portal === 'admin') {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/customer-portal/dashboard';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof typeof credentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials(prev => ({ ...prev, [field]: e.target.value }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center">
            {isAdminLogin ? (
              <Shield className="h-12 w-12 text-primary" />
            ) : (
              <Building2 className="h-12 w-12 text-primary" />
            )}
          </div>
          
          <div>
            <CardTitle className="text-2xl font-bold">
              {portalConfig?.displayName || 'PKBSL Admin Portal'}
            </CardTitle>
            <CardDescription>
              Sign in to access your logistics dashboard
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={credentials.email}
                onChange={handleInputChange('email')}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={handleInputChange('password')}
                  required
                  disabled={isSubmitting}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Demo Credentials:</p>
            <div className="mt-2 space-y-1">
              {isAdminLogin ? (
                <p><strong>Admin:</strong> admin@pkbsl.com / password</p>
              ) : (
                <>
                  <p><strong>Shell:</strong> shell@admin.com / password</p>
                  <p><strong>Siemens:</strong> siemens@admin.com / password</p>
                  <p><strong>UniLever:</strong> unilever@admin.com / password</p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}