export interface License {
  id: string;
  companyId: string;
  type: LicenseType;
  status: LicenseStatus;
  features: LicenseFeature[];
  usageLimits: UsageLimits;
  billing: BillingInfo;
  startDate: string;
  endDate?: string;
  trialEndDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: CompanySize;
  contactEmail: string;
  contactName: string;
  address: Address;
  phone?: string;
  website?: string;
  status: CompanyStatus;
  license?: License;
  createdAt: string;
  lastActivity?: string;
  notes?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface LicenseFeature {
  id: string;
  name: string;
  enabled: boolean;
  config?: Record<string, any>;
}

export interface UsageLimits {
  maxUsers: number;
  maxShipments: number;
  maxStorage: number; // in GB
  apiCalls: number;
  currentUsage: UsageStats;
}

export interface UsageStats {
  users: number;
  shipments: number;
  storage: number;
  apiCalls: number;
}

export interface BillingInfo {
  plan: PricingPlan;
  amount: number;
  currency: string;
  frequency: BillingFrequency;
  nextBillingDate?: string;
  paymentMethod?: PaymentMethod;
  invoices: Invoice[];
}

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  dueDate: string;
  paidDate?: string;
  items: InvoiceItem[];
  createdAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PaymentMethod {
  type: 'card' | 'bank_transfer' | 'check';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  frequency: BillingFrequency;
  features: string[];
  limits: UsageLimits;
  isPopular?: boolean;
}

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  type: FeatureFlagType;
  category: string;
  defaultValue: boolean;
  allowedValues?: string[];
  dependencies?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  totalCompanies: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  averageRevenuePerUser: number;
  churnRate: number;
  conversionRate: number;
  topFeatures: FeatureUsage[];
  revenueByPlan: RevenueByPlan[];
  customerGrowth: GrowthMetric[];
}

export interface FeatureUsage {
  featureId: string;
  name: string;
  usageCount: number;
  companyCount: number;
}

export interface RevenueByPlan {
  planId: string;
  planName: string;
  revenue: number;
  customerCount: number;
}

export interface GrowthMetric {
  month: string;
  newCustomers: number;
  churnedCustomers: number;
  totalCustomers: number;
  revenue: number;
}

// Enums
export type LicenseType = 'trial' | 'basic' | 'professional' | 'enterprise' | 'custom';
export type LicenseStatus = 'active' | 'expired' | 'suspended' | 'cancelled' | 'pending';
export type CompanyStatus = 'active' | 'inactive' | 'trial' | 'suspended' | 'prospect';
export type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
export type BillingFrequency = 'monthly' | 'quarterly' | 'yearly';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type FeatureFlagType = 'boolean' | 'string' | 'number' | 'json';