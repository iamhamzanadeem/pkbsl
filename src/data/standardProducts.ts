export interface StandardProduct {
  code: string;
  name: string;
  description: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  weightPerCarton: number;
  category: string;
}

export const standardProducts: StandardProduct[] = [
  // Shell Products
  {
    code: "SHELL-OIL-001",
    name: "Shell Helix Ultra 5W-30",
    description: "Premium synthetic motor oil 4L bottles",
    dimensions: { length: 25, width: 15, height: 28 },
    weightPerCarton: 4.2,
    category: "Motor Oil"
  },
  {
    code: "SHELL-OIL-002", 
    name: "Shell Rimula R4 X 15W-40",
    description: "Heavy duty diesel engine oil 20L containers",
    dimensions: { length: 35, width: 25, height: 40 },
    weightPerCarton: 18.5,
    category: "Motor Oil"
  },
  {
    code: "SHELL-FUEL-001",
    name: "Shell V-Power Racing Fuel",
    description: "High octane gasoline additives 500ml",
    dimensions: { length: 20, width: 12, height: 25 },
    weightPerCarton: 0.8,
    category: "Fuel Additives"
  },
  {
    code: "SHELL-LUB-001",
    name: "Shell Gadus S2 V220 2",
    description: "Multi-purpose lithium grease 400g cartridges",
    dimensions: { length: 22, width: 8, height: 35 },
    weightPerCarton: 0.45,
    category: "Lubricants"
  },
  {
    code: "SHELL-IND-001",
    name: "Shell Tellus S2 M 46",
    description: "Industrial hydraulic fluid 208L drums",
    dimensions: { length: 60, width: 60, height: 90 },
    weightPerCarton: 185,
    category: "Industrial Fluids"
  },
  
  // General Products
  {
    code: "CHEM-CLEAN-001",
    name: "Industrial Degreaser",
    description: "Heavy duty cleaning solution 5L containers",
    dimensions: { length: 30, width: 20, height: 32 },
    weightPerCarton: 5.5,
    category: "Chemicals"
  },
  {
    code: "AUTO-PART-001",
    name: "Air Filter Elements",
    description: "Automotive air filter replacements",
    dimensions: { length: 25, width: 20, height: 8 },
    weightPerCarton: 0.8,
    category: "Auto Parts"
  },
  {
    code: "AUTO-PART-002",
    name: "Brake Fluid DOT 4",
    description: "High performance brake fluid 1L bottles",
    dimensions: { length: 18, width: 12, height: 22 },
    weightPerCarton: 1.1,
    category: "Auto Parts"
  },
  {
    code: "TOOL-IND-001",
    name: "Socket Wrench Set",
    description: "Professional grade socket set with case",
    dimensions: { length: 45, width: 35, height: 12 },
    weightPerCarton: 3.2,
    category: "Tools"
  },
  {
    code: "ELEC-COMP-001",
    name: "Electrical Cables",
    description: "Industrial grade copper cables 100m coils",
    dimensions: { length: 40, width: 40, height: 25 },
    weightPerCarton: 15.8,
    category: "Electrical"
  }
];

export const getProductByCode = (code: string): StandardProduct | undefined => {
  return standardProducts.find(product => product.code === code);
};

export const searchProducts = (query: string): StandardProduct[] => {
  if (!query) return standardProducts;
  
  const lowercaseQuery = query.toLowerCase();
  return standardProducts.filter(product => 
    product.code.toLowerCase().includes(lowercaseQuery) ||
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery)
  );
};