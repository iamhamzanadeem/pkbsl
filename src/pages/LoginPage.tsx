import { useState } from 'react';
import { Navigate, useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getPortalConfig } from '@/config/portals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import pkbslLogo from '@/assets/pkbsl-logo.png';

export function LoginPage() {
  const { portal } = useParams<{ portal?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPortal, setSelectedPortal] = useState(portal || 'customer-portal');

  const portalConfig = selectedPortal ? getPortalConfig(selectedPortal === 'customer-portal' ? 'shell' : selectedPortal) : null;
  const isAdminLogin = selectedPortal === 'admin';

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || 
      (selectedPortal === 'admin' ? '/admin/dashboard' : '/customer-portal/dashboard');
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const targetPortal = selectedPortal === 'admin' ? 'admin' : 'customer-portal';
      await login({
        ...credentials,
        portal: targetPortal,
      });
      
      // Navigate after successful login without page reload
      const targetPath = selectedPortal === 'admin' ? '/admin/dashboard' : '/customer-portal/dashboard';
      navigate(targetPath, { replace: true });
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

  // If no portal specified in URL, show portal selection
  if (!portal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <img 
                src={pkbslLogo} 
                alt="PKBSL Logo" 
                className="h-16 w-auto object-contain"
              />
            </div>
            
            <div>
              <CardTitle className="text-2xl font-bold">
                PKBSL Portal Login
              </CardTitle>
              <CardDescription>
                Select your portal and sign in
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs value={selectedPortal} onValueChange={setSelectedPortal} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="customer-portal">Customer</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
              
              <TabsContent value="customer-portal" className="mt-4">
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
                      'Sign In to Customer Portal'
                    )}
                  </Button>
                </form>

                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <p>Demo Credentials:</p>
                  <div className="mt-2 space-y-1">
                    <p><strong>Shell:</strong> shell@admin.com / password</p>
                    <p><strong>Siemens:</strong> siemens@admin.com / password</p>
                    <p><strong>UniLever:</strong> unilever@admin.com / password</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="admin" className="mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={credentials.email}
                      onChange={handleInputChange('email')}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="admin-password"
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
                      'Sign In to Admin Portal'
                    )}
                  </Button>
                </form>

                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <p>Demo Credentials:</p>
                  <div className="mt-2 space-y-1">
                    <p><strong>Admin:</strong> admin@pkbsl.com / password</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Portal-specific login (when accessed via /login/admin or /login/customer-portal)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <img 
              src={pkbslLogo} 
              alt="PKBSL Logo" 
              className="h-16 w-auto object-contain"
            />
          </div>
          
          <div>
            <CardTitle className="text-2xl font-bold">
              {portalConfig?.displayName || (isAdminLogin ? 'PKBSL Admin Portal' : 'PKBSL Customer Portal')}
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

          <div className="mt-4 text-center">
            <Link to="/login" className="text-sm text-primary hover:underline">
              ← Back to portal selection
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}