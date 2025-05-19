import { CatalogProduct } from "@shared/schema";

// Sample catalog data - in a real app this would come from an API or database
const sampleCatalogProducts: CatalogProduct[] = [
  {
    id: "HCS1420114G5",
    name: "1/4-20 x 1-1/4 Hex Cap Screw Grade 5",
    description: "Hex cap screw, Grade 5, 1/4-20 thread, 1-1/4\" length, zinc plated",
    category: "screws"
  },
  {
    id: "HCS1420112G5",
    name: "1/4-20 x 1-1/2 Hex Cap Screw Grade 5",
    description: "Hex cap screw, Grade 5, 1/4-20 thread, 1-1/2\" length, zinc plated",
    category: "screws"
  },
  {
    id: "HCS1420100G5",
    name: "1/4-20 x 1 Hex Cap Screw Grade 5",
    description: "Hex cap screw, Grade 5, 1/4-20 thread, 1\" length, zinc plated",
    category: "screws"
  },
  {
    id: "HB381620G8YZ",
    name: "3/8-16 x 2 Hex Bolt Grade 8 Yellow Zinc",
    description: "Hex bolt, Grade 8, 3/8-16 thread, 2\" length, yellow zinc plated",
    category: "bolts"
  },
  {
    id: "HB381620G8",
    name: "3/8-16 x 2 Hex Bolt Grade 8",
    description: "Hex bolt, Grade 8, 3/8-16 thread, 2\" length, plain finish",
    category: "bolts"
  },
  {
    id: "HB381620G5YZ",
    name: "3/8-16 x 2 Hex Bolt Grade 5 Yellow Zinc",
    description: "Hex bolt, Grade 5, 3/8-16 thread, 2\" length, yellow zinc plated",
    category: "bolts"
  },
  {
    id: "LN12130ZP",
    name: "1/2-13 Lock Nut Zinc Plated",
    description: "Lock nut, 1/2-13 thread, zinc plated",
    category: "nuts"
  },
  {
    id: "LN12130",
    name: "1/2-13 Lock Nut",
    description: "Lock nut, 1/2-13 thread, plain finish",
    category: "nuts"
  },
  {
    id: "LN12130SS",
    name: "1/2-13 Lock Nut Stainless Steel",
    description: "Lock nut, 1/2-13 thread, stainless steel",
    category: "nuts"
  }
];

// Function to mimic a search API
export async function searchProductCatalog(query: string): Promise<CatalogProduct[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  
  return sampleCatalogProducts.filter(product => 
    product.id.toLowerCase().includes(lowerQuery) ||
    product.name.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery)
  );
}

// Function to mimic the extraction API
export async function extractDocumentContent(documentName: string) {
  // In a real app this would call the extraction API endpoint
  // For interview purposes, we simulate with mock data based on document name
  
  // Mock response delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock extracted line items based on document name
  if (documentName.includes("Easy")) {
    return {
      lineItems: [
        { lineNumber: 1, description: "1/4-20 x 1-1/4 Hex Cap Screw Grade 5", quantity: 100, unitPrice: "$0.12", total: "$12.00" },
        { lineNumber: 2, description: "3/8-16 x 2 Hex Bolt Grade 8 Yellow Zinc", quantity: 50, unitPrice: "$0.34", total: "$17.00" },
        { lineNumber: 3, description: "1/2-13 Lock Nut Zinc Plated", quantity: 75, unitPrice: "$0.22", total: "$16.50" }
      ]
    };
  } else if (documentName.includes("Medium")) {
    return {
      lineItems: [
        { lineNumber: 1, description: "Hex Cap Screw 1/4-20 x 1-1/4 G5", quantity: 100, unitPrice: "$0.12", total: "$12.00" },
        { lineNumber: 2, description: "Hex Bolt 3/8-16 x 2\" Yellow Zinc G8", quantity: 50, unitPrice: "$0.34", total: "$17.00" },
        { lineNumber: 3, description: "Lock Nut, Zinc 1/2-13", quantity: 75, unitPrice: "$0.22", total: "$16.50" },
        { lineNumber: 4, description: "Flat Washer 3/8\" USS", quantity: 100, unitPrice: "$0.08", total: "$8.00" }
      ]
    };
  } else {
    return {
      lineItems: [
        { lineNumber: 1, description: "G5 Hex Screw 1/4\"-20tpi x 1-1/4\"", quantity: 100, unitPrice: "$0.12", total: "$12.00" },
        { lineNumber: 2, description: "G8 YZ bolt, hex head, 3/8\"-16 x 2\"", quantity: 50, unitPrice: "$0.34", total: "$17.00" },
        { lineNumber: 3, description: "1/2 inch - 13 TPI zinc lock nut", quantity: 75, unitPrice: "$0.22", total: "$16.50" },
        { lineNumber: 4, description: "USS Flat Washer, 3/8\"", quantity: 100, unitPrice: "$0.08", total: "$8.00" },
        { lineNumber: 5, description: "Hex Nut, 1/4\"-20, G5", quantity: 120, unitPrice: "$0.10", total: "$12.00" }
      ]
    };
  }
}

// Function to mimic the matching API
export async function matchLineItems(extractedItems: any[]) {
  // In a real app this would call the matching API endpoint
  // For interview purposes, we simulate with mock data
  
  // Mock response delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Map extracted items to matched products
  return extractedItems.map(item => {
    const description = item.description.toLowerCase();
    
    // Create mock matches based on the description
    let matches = [];
    
    if (description.includes("1/4-20") || description.includes("1/4\"")) {
      matches = [
        { productId: "HCS1420114G5", productName: "1/4-20 x 1-1/4 Hex Cap Screw Grade 5", confidence: 98 },
        { productId: "HCS1420112G5", productName: "1/4-20 x 1-1/2 Hex Cap Screw Grade 5", confidence: 85 },
        { productId: "HCS1420100G5", productName: "1/4-20 x 1 Hex Cap Screw Grade 5", confidence: 80 }
      ];
    } else if (description.includes("3/8-16") || description.includes("3/8\"")) {
      if (description.includes("bolt")) {
        matches = [
          { productId: "HB381620G8YZ", productName: "3/8-16 x 2 Hex Bolt Grade 8 Yellow Zinc", confidence: 95 },
          { productId: "HB381620G8", productName: "3/8-16 x 2 Hex Bolt Grade 8", confidence: 85 },
          { productId: "HB381620G5YZ", productName: "3/8-16 x 2 Hex Bolt Grade 5 Yellow Zinc", confidence: 75 }
        ];
      } else if (description.includes("washer")) {
        matches = [
          { productId: "FW38USS", productName: "3/8 Flat Washer USS", confidence: 90 },
          { productId: "FW38SAE", productName: "3/8 Flat Washer SAE", confidence: 80 }
        ];
      }
    } else if (description.includes("1/2-13") || description.includes("1/2\"") || description.includes("1/2 inch")) {
      if (description.includes("lock") || description.includes("nut")) {
        matches = [
          { productId: "LN12130ZP", productName: "1/2-13 Lock Nut Zinc Plated", confidence: 82 },
          { productId: "LN12130", productName: "1/2-13 Lock Nut", confidence: 75 },
          { productId: "LN12130SS", productName: "1/2-13 Lock Nut Stainless Steel", confidence: 65 }
        ];
      }
    }
    
    // If no specific matches found, provide some general options
    if (matches.length === 0) {
      matches = [
        { productId: "HN1420G5", productName: "1/4-20 Hex Nut Grade 5", confidence: 70 },
        { productId: "HN1420G2", productName: "1/4-20 Hex Nut Grade 2", confidence: 65 }
      ];
    }
    
    return {
      lineNumber: item.lineNumber,
      description: item.description,
      quantity: item.quantity,
      matches
    };
  });
}
