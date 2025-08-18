import { useState } from 'react';
import { Navigate, useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getPortalConfig } from '@/config/portals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Shield, Eye, EyeOff } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
const truckImage = '/lovable-uploads/70717859-65c2-4617-b813-9968185c3392.png';

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
      <div className="liquid-login-bg min-h-screen relative overflow-hidden">
        {/* Animated liquid background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="liquid-blob liquid-blob-1"></div>
          <div className="liquid-blob liquid-blob-2"></div>
          <div className="liquid-blob liquid-blob-3"></div>
        </div>
        
        {/* Desktop split-screen layout */}
        <div className="hidden lg:flex min-h-screen">
          {/* Left side - Login form */}
          <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-background/95 via-background/90 to-primary/5 backdrop-blur-sm">
            <Card className="w-full max-w-md glass-card">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <Building2 className="h-12 w-12 text-primary" />
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
          
          {/* Right side - Truck background */}
          <div className="flex-1 relative bg-gradient-to-bl from-primary/10 to-primary/20">
            <div className="absolute inset-0 bg-gradient-to-l from-primary/5 to-transparent"></div>
            <img 
              src={truckImage} 
              alt="BSL Logistics Truck" 
              className="absolute right-0 top-1/2 -translate-y-1/2 h-auto max-h-[80vh] w-auto object-contain opacity-90"
            />
            <div className="absolute bottom-8 left-8 text-primary/80">
              <h2 className="text-3xl font-bold mb-2">PKBSL Logistics</h2>
              <p className="text-lg">Delivering Excellence Across Pakistan</p>
            </div>
          </div>
        </div>
        
        {/* Mobile layout */}
        <div className="lg:hidden min-h-screen flex items-center justify-center p-4 relative">
          <div className="absolute inset-0 opacity-10">
            <img 
              src={truckImage} 
              alt="BSL Logistics Truck" 
              className="w-full h-full object-cover"
            />
          </div>
          <Card className="w-full max-w-md glass-card relative z-10">
            {/* ... keep existing card content ... */}
            <CardHeader className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <Building2 className="h-12 w-12 text-primary" />
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
      </div>
    );
  }

  // Portal-specific login (when accessed via /login/admin or /login/customer-portal)
  return (
    <div className="liquid-login-bg min-h-screen relative overflow-hidden">
      {/* Animated liquid background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="liquid-blob liquid-blob-1"></div>
        <div className="liquid-blob liquid-blob-2"></div>
        <div className="liquid-blob liquid-blob-3"></div>
      </div>
      
      {/* Desktop split-screen layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left side - Login form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-background/95 via-background/90 to-primary/5 backdrop-blur-sm">
          <Card className="w-full max-w-md glass-card">
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
        
        {/* Right side - Truck background */}
        <div className="flex-1 relative bg-gradient-to-bl from-primary/10 to-primary/20">
          <div className="absolute inset-0 bg-gradient-to-l from-primary/5 to-transparent"></div>
          <img 
            src={truckImage} 
            alt="BSL Logistics Truck" 
            className="absolute right-0 top-1/2 -translate-y-1/2 h-auto max-h-[80vh] w-auto object-contain opacity-90"
          />
          <div className="absolute bottom-8 left-8 text-primary/80">
            <h2 className="text-3xl font-bold mb-2">PKBSL Logistics</h2>
            <p className="text-lg">Delivering Excellence Across Pakistan</p>
          </div>
        </div>
      </div>
      
      {/* Mobile layout */}
      <div className="lg:hidden min-h-screen flex items-center justify-center p-4 relative">
        <div className="absolute inset-0 opacity-10">
          <img 
            src={truckImage} 
            alt="BSL Logistics Truck" 
            className="w-full h-full object-cover"
          />
        </div>
        <Card className="w-full max-w-md glass-card relative z-10">
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
    </div>
  );
}