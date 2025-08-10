export interface PortalConfig {
  id: string;
  name: string;
  displayName: string;
  logo?: string;
  primaryColor: string;
  theme: 'light' | 'dark' | 'auto';
  features: {
    dashboard: boolean;
    hse: boolean;
    shipments: boolean;
    invoices: boolean;
  };
  defaultFilters: {
    clients: string[];
    dateRange: string;
  };
}

export type PortalType = 'admin' | 'customer';

export interface Portal {
  type: PortalType;
  config: PortalConfig;
}