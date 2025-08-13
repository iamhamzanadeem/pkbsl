import React, { createContext, useContext, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { PortalConfig } from '@/types/portal';
import { getPortalConfig } from '@/config/portals';

interface PortalContextType {
  currentPortal: PortalConfig | null;
  portalName: string | null;
  isAdminPortal: boolean;
  isCustomerPortal: boolean;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export function PortalProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  
  // Extract portal name from URL with better handling
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const portalName = pathSegments[0] || null;
  
  // Handle portal routing with fallbacks
  const isAdminPortal = portalName === 'admin';
  const isCustomerPortal = portalName === 'customer-portal';
  
  // Improved portal config with fallbacks
  let currentPortal = null;
  try {
    if (isAdminPortal) {
      currentPortal = getPortalConfig('admin');
    } else if (isCustomerPortal) {
      currentPortal = getPortalConfig('shell'); // Default customer portal config
    } else if (portalName) {
      currentPortal = getPortalConfig(portalName);
    }
  } catch (error) {
    console.warn('Portal config error:', error);
    // Fallback to default behavior
    currentPortal = null;
  }

  return (
    <PortalContext.Provider
      value={{
        currentPortal,
        portalName,
        isAdminPortal,
        isCustomerPortal,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (context === undefined) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
}