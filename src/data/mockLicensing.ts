import { Company, License, PricingPlan, FeatureFlag, Analytics } from '@/types/licensing';

export const mockPricingPlans: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Essential logistics tracking for small businesses',
    price: 99,
    currency: 'USD',
    frequency: 'monthly',
    features: [
      'Up to 5 users',
      'Basic shipment tracking',
      'Standard reporting',
      'Email support',
      'Mobile app access'
    ],
    limits: {
      maxUsers: 5,
      maxShipments: 100,
      maxStorage: 1,
      apiCalls: 1000,
      currentUsage: {
        users: 0,
        shipments: 0,
        storage: 0,
        apiCalls: 0
      }
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Advanced features for growing logistics operations',
    price: 299,
    currency: 'USD',
    frequency: 'monthly',
    features: [
      'Up to 25 users',
      'Advanced shipment tracking',
      'HSE monitoring',
      'Custom reporting',
      'Priority support',
      'API access',
      'Integrations'
    ],
    limits: {
      maxUsers: 25,
      maxShipments: 1000,
      maxStorage: 10,
      apiCalls: 10000,
      currentUsage: {
        users: 0,
        shipments: 0,
        storage: 0,
        apiCalls: 0
      }
    },
    isPopular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Unlimited features for large-scale operations',
    price: 799,
    currency: 'USD',
    frequency: 'monthly',
    features: [
      'Unlimited users',
      'Full feature access',
      'Advanced analytics',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
      'White-label options'
    ],
    limits: {
      maxUsers: -1, // unlimited
      maxShipments: -1,
      maxStorage: -1,
      apiCalls: -1,
      currentUsage: {
        users: 0,
        shipments: 0,
        storage: 0,
        apiCalls: 0
      }
    }
  }
];

export const mockCompanies: Company[] = [
  {
    id: 'shell',
    name: 'Shell Pakistan',
    industry: 'Oil & Gas',
    size: 'enterprise',
    contactEmail: 'admin@shell.pk',
    contactName: 'Ahmed Hassan',
    address: {
      street: '123 Main St',
      city: 'Karachi',
      state: 'Sindh',
      country: 'Pakistan',
      zipCode: '75600'
    },
    phone: '+92-21-1234567',
    website: 'https://shell.pk',
    status: 'active',
    createdAt: '2024-01-15T08:00:00Z',
    lastActivity: '2024-01-10T14:30:00Z'
  },
  {
    id: 'siemens',
    name: 'Siemens Pakistan',
    industry: 'Technology',
    size: 'large',
    contactEmail: 'contact@siemens.pk',
    contactName: 'Maria Schmidt',
    address: {
      street: '456 Tech Avenue',
      city: 'Lahore',
      state: 'Punjab',
      country: 'Pakistan',
      zipCode: '54000'
    },
    phone: '+92-42-9876543',
    website: 'https://siemens.pk',
    status: 'active',
    createdAt: '2024-02-01T10:00:00Z',
    lastActivity: '2024-01-11T09:15:00Z'
  },
  {
    id: 'unilever',
    name: 'Unilever Pakistan',
    industry: 'Consumer Goods',
    size: 'large',
    contactEmail: 'logistics@unilever.pk',
    contactName: 'Sarah Johnson',
    address: {
      street: '789 Industrial Zone',
      city: 'Islamabad',
      state: 'ICT',
      country: 'Pakistan',
      zipCode: '44000'
    },
    phone: '+92-51-2345678',
    status: 'trial',
    createdAt: '2024-01-20T12:00:00Z',
    lastActivity: '2024-01-11T16:45:00Z'
  },
  {
    id: 'ags',
    name: 'AGS Solutions',
    industry: 'IT Services',
    size: 'medium',
    contactEmail: 'info@ags.pk',
    contactName: 'Ali Khan',
    address: {
      street: '321 Business District',
      city: 'Faisalabad',
      state: 'Punjab',
      country: 'Pakistan',
      zipCode: '38000'
    },
    status: 'prospect',
    createdAt: '2024-01-25T09:30:00Z'
  }
];

export const mockLicenses: License[] = [
  {
    id: 'lic-shell-001',
    companyId: 'shell',
    type: 'enterprise',
    status: 'active',
    features: [
      { id: 'dashboard', name: 'Dashboard', enabled: true },
      { id: 'hse', name: 'HSE Monitoring', enabled: true },
      { id: 'shipments', name: 'Shipment Tracking', enabled: true },
      { id: 'invoices', name: 'Invoice Management', enabled: true },
      { id: 'analytics', name: 'Advanced Analytics', enabled: true }
    ],
    usageLimits: {
      maxUsers: -1,
      maxShipments: -1,
      maxStorage: -1,
      apiCalls: -1,
      currentUsage: {
        users: 45,
        shipments: 2840,
        storage: 156,
        apiCalls: 48200
      }
    },
    billing: {
      plan: mockPricingPlans[2],
      amount: 799,
      currency: 'USD',
      frequency: 'monthly',
      nextBillingDate: '2024-02-15T00:00:00Z',
      invoices: []
    },
    startDate: '2024-01-15T00:00:00Z',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'lic-siemens-001',
    companyId: 'siemens',
    type: 'professional',
    status: 'active',
    features: [
      { id: 'dashboard', name: 'Dashboard', enabled: true },
      { id: 'hse', name: 'HSE Monitoring', enabled: false },
      { id: 'shipments', name: 'Shipment Tracking', enabled: true },
      { id: 'invoices', name: 'Invoice Management', enabled: true },
      { id: 'analytics', name: 'Advanced Analytics', enabled: true }
    ],
    usageLimits: {
      maxUsers: 25,
      maxShipments: 1000,
      maxStorage: 10,
      apiCalls: 10000,
      currentUsage: {
        users: 18,
        shipments: 340,
        storage: 4.2,
        apiCalls: 2890
      }
    },
    billing: {
      plan: mockPricingPlans[1],
      amount: 299,
      currency: 'USD',
      frequency: 'monthly',
      nextBillingDate: '2024-02-01T00:00:00Z',
      invoices: []
    },
    startDate: '2024-02-01T00:00:00Z',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z'
  }
];

export const mockFeatureFlags: FeatureFlag[] = [
  {
    id: 'ff-dashboard',
    key: 'dashboard',
    name: 'Dashboard Access',
    description: 'Access to main dashboard with KPIs',
    type: 'boolean',
    category: 'core',
    defaultValue: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'ff-hse',
    key: 'hse_monitoring',
    name: 'HSE Monitoring',
    description: 'Health, Safety & Environmental monitoring features',
    type: 'boolean',
    category: 'safety',
    defaultValue: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'ff-advanced-analytics',
    key: 'advanced_analytics',
    name: 'Advanced Analytics',
    description: 'Advanced reporting and analytics features',
    type: 'boolean',
    category: 'analytics',
    defaultValue: false,
    dependencies: ['dashboard'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'ff-api-access',
    key: 'api_access',
    name: 'API Access',
    description: 'Access to REST API endpoints',
    type: 'boolean',
    category: 'integration',
    defaultValue: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockAnalytics: Analytics = {
  totalCompanies: 4,
  activeSubscriptions: 2,
  monthlyRevenue: 1098,
  averageRevenuePerUser: 549,
  churnRate: 0.05,
  conversionRate: 0.75,
  topFeatures: [
    { featureId: 'dashboard', name: 'Dashboard', usageCount: 12450, companyCount: 4 },
    { featureId: 'shipments', name: 'Shipment Tracking', usageCount: 8920, companyCount: 3 },
    { featureId: 'invoices', name: 'Invoice Management', usageCount: 5680, companyCount: 2 },
    { featureId: 'hse', name: 'HSE Monitoring', usageCount: 3240, companyCount: 1 }
  ],
  revenueByPlan: [
    { planId: 'enterprise', planName: 'Enterprise', revenue: 799, customerCount: 1 },
    { planId: 'professional', planName: 'Professional', revenue: 299, customerCount: 1 },
    { planId: 'basic', planName: 'Basic', revenue: 0, customerCount: 0 }
  ],
  customerGrowth: [
    { month: '2023-10', newCustomers: 0, churnedCustomers: 0, totalCustomers: 0, revenue: 0 },
    { month: '2023-11', newCustomers: 1, churnedCustomers: 0, totalCustomers: 1, revenue: 299 },
    { month: '2023-12', newCustomers: 1, churnedCustomers: 0, totalCustomers: 2, revenue: 1098 },
    { month: '2024-01', newCustomers: 2, churnedCustomers: 0, totalCustomers: 4, revenue: 1098 }
  ]
};