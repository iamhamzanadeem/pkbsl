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
  
  // Extract portal name from URL
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const portalName = pathSegments[0] || null;
  
  const currentPortal = portalName ? getPortalConfig(portalName) : null;
  const isAdminPortal = portalName === 'admin';
  const isCustomerPortal = !isAdminPortal && !!currentPortal;

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