import jsPDF from 'jspdf';

interface Product {
  id: string;
  productCode: string;
  cartons: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  weightPerCarton: number;
  description: string;
}

interface BiltyData {
  biltyNumber: string;
  formData: {
    products: Product[];
    origin: string;
    destination: string;
    pickupDate: string;
    pickupTime: string;
    specialInstructions: string;
  };
  stuffingPlan: {
    containerType: string;
    utilization: number;
    arrangement: string;
    maxCartons: number;
    estimatedCost: number;
    productBreakdown: {
      productCode: string;
      cartons: number;
      weight: number;
      volume: number;
    }[];
  };
  eta: string;
  qrCodeDataUrl: string;
  clientCode: string;
}

export async function generateBiltyPDF(data: BiltyData) {
  const pdf = new jsPDF();
  
  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(30, 58, 138); // PKBSL Blue
  pdf.text('BSL LOGISTICS', 20, 30);
  
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text('BILL OF LADING (BILTY)', 20, 45);
  
  // Bilty Number
  pdf.setFontSize(12);
  pdf.text(`Bilty No: ${data.biltyNumber}`, 20, 60);
  pdf.text(`Client Code: ${data.clientCode}`, 120, 60);
  pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 70);
  
  // Shipment Details
  pdf.setFontSize(14);
  pdf.setTextColor(30, 58, 138);
  pdf.text('SHIPMENT DETAILS', 20, 90);
  
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  
  let yPos = 105;
  const validProducts = data.formData.products.filter(p => p.productCode && p.cartons > 0);
  
  // Products table header
  pdf.text('Product Code', 20, yPos);
  pdf.text('Cartons', 80, yPos);
  pdf.text('Dimensions (cm)', 110, yPos);
  pdf.text('Weight/Carton', 160, yPos);
  
  yPos += 10;
  pdf.line(20, yPos, 190, yPos); // Header line
  yPos += 5;
  
  // Product details
  validProducts.forEach((product) => {
    pdf.text(product.productCode, 20, yPos);
    pdf.text(product.cartons.toString(), 80, yPos);
    pdf.text(`${product.dimensions.length}×${product.dimensions.width}×${product.dimensions.height}`, 110, yPos);
    pdf.text(`${product.weightPerCarton} kg`, 160, yPos);
    yPos += 12;
  });
  
  // Totals
  yPos += 5;
  pdf.line(20, yPos, 190, yPos);
  yPos += 10;
  
  const totalCartons = validProducts.reduce((sum, p) => sum + p.cartons, 0);
  const totalWeight = validProducts.reduce((sum, p) => sum + (p.cartons * p.weightPerCarton), 0);
  
  pdf.setFontSize(9);
  pdf.text(`Total Products: ${validProducts.length}`, 20, yPos);
  pdf.text(`Total Cartons: ${totalCartons}`, 80, yPos);
  pdf.text(`Total Weight: ${totalWeight.toFixed(2)} kg`, 140, yPos);
  
  // Route Information
  yPos += 25;
  pdf.setFontSize(14);
  pdf.setTextColor(30, 58, 138);
  pdf.text('ROUTE INFORMATION', 20, yPos);
  
  yPos += 15;
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Origin: ${data.formData.origin}`, 20, yPos);
  pdf.text(`Destination: ${data.formData.destination}`, 120, yPos);
  
  yPos += 15;
  if (data.formData.pickupDate) {
    pdf.text(`Pickup Date: ${data.formData.pickupDate}`, 20, yPos);
  }
  if (data.formData.pickupTime) {
    pdf.text(`Pickup Time: ${data.formData.pickupTime}`, 120, yPos);
  }
  
  if (data.eta) {
    yPos += 15;
    pdf.text(`Expected ETA: ${data.eta}`, 20, yPos);
  }
  
  // Container Information
  yPos += 25;
  pdf.setFontSize(14);
  pdf.setTextColor(30, 58, 138);
  pdf.text('CONTAINER INFORMATION', 20, yPos);
  
  yPos += 15;
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Container Type: ${data.stuffingPlan.containerType}`, 20, yPos);
  
  yPos += 15;
  pdf.text(`Space Utilization: ${data.stuffingPlan.utilization}%`, 20, yPos);
  pdf.text(`Arrangement: ${data.stuffingPlan.arrangement}`, 120, yPos);
  
  yPos += 15;
  pdf.text(`Estimated Cost: PKR ${data.stuffingPlan.estimatedCost.toLocaleString()}`, 20, yPos);
  
  // Special Instructions
  if (data.formData.specialInstructions) {
    yPos += 25;
    pdf.setFontSize(14);
    pdf.setTextColor(30, 58, 138);
    pdf.text('SPECIAL INSTRUCTIONS', 20, yPos);
    
    yPos += 15;
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    const splitInstructions = pdf.splitTextToSize(data.formData.specialInstructions, 170);
    pdf.text(splitInstructions, 20, yPos);
  }
  
  // QR Code
  if (data.qrCodeDataUrl) {
    pdf.addImage(data.qrCodeDataUrl, 'PNG', 150, 200, 40, 40);
    pdf.setFontSize(8);
    pdf.text('Scan QR for details', 155, 250);
  }
  
  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(107, 114, 128);
  pdf.text('This is a computer generated document. No signature required.', 20, 280);
  pdf.text('BSL Logistics - Professional Cargo Services', 20, 285);
  
  // Save the PDF
  pdf.save(`Bilty_${data.biltyNumber}.pdf`);
}