import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

// Mock authentication for demo
const mockUsers: { [email: string]: User } = {
  'admin@pkbsl.com': {
    id: '1',
    email: 'admin@pkbsl.com',
    name: 'PKBSL Admin',
    role: 'admin',
    portalAccess: ['admin'],
  },
  'shell@admin.com': {
    id: '2',
    email: 'shell@admin.com',
    name: 'Shell Pakistan Admin',
    role: 'customer_admin',
    customerId: 'shell',
    portalAccess: ['customer-portal'],
  },
  'siemens@admin.com': {
    id: '3',
    email: 'siemens@admin.com',
    name: 'Siemens Admin',
    role: 'customer_admin',
    customerId: 'siemens',
    portalAccess: ['customer-portal'],
  },
  'unilever@admin.com': {
    id: '4',
    email: 'unilever@admin.com',
    name: 'UniLever Admin',
    role: 'customer_admin',
    customerId: 'unilever',
    portalAccess: ['customer-portal'],
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers[credentials.email];
    if (user && credentials.password === 'password') {
      // Check if user has access to the requested portal
      if (credentials.portal && !user.portalAccess.includes(credentials.portal)) {
        throw new Error('Access denied to this portal');
      }
      
      localStorage.setItem('auth_token', 'mock_token');
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({ type: 'SET_USER', payload: user });
      } catch {
        logout();
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}