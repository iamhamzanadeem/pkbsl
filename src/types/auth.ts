export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer_admin' | 'viewer';
  customerId?: string;
  portalAccess: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  portal?: string;
}