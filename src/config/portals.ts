import { PortalConfig } from '@/types/portal';

export const portalConfigs: { [key: string]: PortalConfig } = {
  admin: {
    id: 'admin',
    name: 'admin',
    displayName: 'PKBSL Admin Portal',
    primaryColor: '210 100% 45%',
    theme: 'light',
    features: {
      dashboard: true,
      hse: true,
      shipments: true,
      invoices: true,
    },
    defaultFilters: {
      clients: ['all'],
      dateRange: '30days',
    },
  },
  shell: {
    id: 'shell',
    name: 'shell',
    displayName: 'Shell Pakistan Portal',
    logo: '/logos/shell-logo.png',
    primaryColor: '210 100% 45%',
    theme: 'light',
    features: {
      dashboard: true,
      hse: true,
      shipments: true,
      invoices: true,
    },
    defaultFilters: {
      clients: ['shell'],
      dateRange: '7days',
    },
  },
  siemens: {
    id: 'siemens',
    name: 'siemens',
    displayName: 'Siemens Portal',
    logo: '/logos/siemens-logo.png',
    primaryColor: '200 100% 40%',
    theme: 'light',
    features: {
      dashboard: true,
      hse: false,
      shipments: true,
      invoices: true,
    },
    defaultFilters: {
      clients: ['siemens'],
      dateRange: '7days',
    },
  },
  unilever: {
    id: 'unilever',
    name: 'unilever',
    displayName: 'UniLever Portal',
    logo: '/logos/unilever-logo.png',
    primaryColor: '220 100% 35%',
    theme: 'light',
    features: {
      dashboard: true,
      hse: true,
      shipments: true,
      invoices: false,
    },
    defaultFilters: {
      clients: ['unilever'],
      dateRange: '7days',
    },
  },
  ags: {
    id: 'ags',
    name: 'ags',
    displayName: 'AGS Portal',
    logo: '/logos/ags-logo.png',
    primaryColor: '180 100% 30%',
    theme: 'light',
    features: {
      dashboard: true,
      hse: false,
      shipments: true,
      invoices: true,
    },
    defaultFilters: {
      clients: ['ags'],
      dateRange: '7days',
    },
  },
  exide: {
    id: 'exide',
    name: 'exide',
    displayName: 'Exide Portal',
    logo: '/logos/exide-logo.png',
    primaryColor: '160 100% 25%',
    theme: 'light',
    features: {
      dashboard: true,
      hse: true,
      shipments: true,
      invoices: true,
    },
    defaultFilters: {
      clients: ['exide'],
      dateRange: '7days',
    },
  },
};

export function getPortalConfig(portalName: string): PortalConfig | null {
  return portalConfigs[portalName] || null;
}

export function getAvailablePortals(): PortalConfig[] {
  return Object.values(portalConfigs);
}