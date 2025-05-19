import { 
  Document, 
  InsertDocument, 
  ExtractedItem, 
  InsertExtractedItem, 
  MatchedItem, 
  InsertMatchedItem,
  documents,
  extractedItems,
  matchedItems,
  FinalMatchedItem,
  ExtractedLineItem,
  LineItemMatch
} from "@shared/schema";

export interface IStorage {
  // Documents
  createDocument(document: InsertDocument): Promise<Document>;
  getDocument(id: number): Promise<Document | undefined>;
  getAllDocuments(): Promise<Document[]>;
  updateDocumentStatus(id: number, status: string): Promise<Document | undefined>;
  
  // Extracted Items
  createExtractedItem(item: InsertExtractedItem): Promise<ExtractedItem>;
  getExtractedItemsByDocumentId(documentId: number): Promise<ExtractedItem[]>;
  
  // Matched Items
  createMatchedItem(item: InsertMatchedItem): Promise<MatchedItem>;
  getMatchedItemsByExtractedItemId(extractedItemId: number): Promise<MatchedItem[]>;
  updateMatchedItem(id: number, updates: Partial<InsertMatchedItem>): Promise<MatchedItem | undefined>;
  
  // Combined operations
  getFinalMatchedItems(documentId: number): Promise<FinalMatchedItem[]>;
  saveLineItemMatches(documentId: number, matches: LineItemMatch[]): Promise<void>;
}

export class MemStorage implements IStorage {
  private documents: Map<number, Document>;
  private extractedItems: Map<number, ExtractedItem>;
  private matchedItems: Map<number, MatchedItem>;
  private docCurrentId: number;
  private extractedItemCurrentId: number;
  private matchedItemCurrentId: number;

  constructor() {
    this.documents = new Map();
    this.extractedItems = new Map();
    this.matchedItems = new Map();
    this.docCurrentId = 1;
    this.extractedItemCurrentId = 1;
    this.matchedItemCurrentId = 1;
  }

  // Document operations
  async createDocument(document: InsertDocument): Promise<Document> {
    const id = this.docCurrentId++;
    const newDoc: Document = { ...document, id };
    this.documents.set(id, newDoc);
    return newDoc;
  }

  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getAllDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }

  async updateDocumentStatus(id: number, status: string): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (!document) return undefined;
    
    const updatedDocument = { ...document, status };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }

  // Extracted Items operations
  async createExtractedItem(item: InsertExtractedItem): Promise<ExtractedItem> {
    const id = this.extractedItemCurrentId++;
    const newItem: ExtractedItem = { ...item, id };
    this.extractedItems.set(id, newItem);
    return newItem;
  }

  async getExtractedItemsByDocumentId(documentId: number): Promise<ExtractedItem[]> {
    return Array.from(this.extractedItems.values())
      .filter(item => item.documentId === documentId);
  }

  // Matched Items operations
  async createMatchedItem(item: InsertMatchedItem): Promise<MatchedItem> {
    const id = this.matchedItemCurrentId++;
    const newItem: MatchedItem = { ...item, id };
    this.matchedItems.set(id, newItem);
    return newItem;
  }

  async getMatchedItemsByExtractedItemId(extractedItemId: number): Promise<MatchedItem[]> {
    return Array.from(this.matchedItems.values())
      .filter(item => item.extractedItemId === extractedItemId);
  }

  async updateMatchedItem(id: number, updates: Partial<InsertMatchedItem>): Promise<MatchedItem | undefined> {
    const item = this.matchedItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...updates };
    this.matchedItems.set(id, updatedItem);
    return updatedItem;
  }

  // Combined operations
  async getFinalMatchedItems(documentId: number): Promise<FinalMatchedItem[]> {
    const extractedItems = await this.getExtractedItemsByDocumentId(documentId);
    
    const finalItems: FinalMatchedItem[] = [];
    
    for (const item of extractedItems) {
      const matchedItems = await this.getMatchedItemsByExtractedItemId(item.id);
      // Find the verified match or the one with highest confidence
      const verifiedMatch = matchedItems.find(m => m.isVerified);
      const bestMatch = verifiedMatch || 
        matchedItems.reduce((best, current) => 
          !best || current.confidence > best.confidence ? current : best, 
          undefined as MatchedItem | undefined
        );
      
      if (bestMatch) {
        finalItems.push({
          lineNumber: item.lineNumber,
          description: item.description,
          productId: bestMatch.productId,
          productName: bestMatch.productName,
          quantity: item.quantity
        });
      }
    }
    
    return finalItems;
  }

  async saveLineItemMatches(documentId: number, matches: LineItemMatch[]): Promise<void> {
    // First, create extracted items
    for (const match of matches) {
      const extractedItem = await this.createExtractedItem({
        documentId,
        lineNumber: match.lineNumber,
        description: match.description,
        quantity: match.quantity,
        unitPrice: "",
        total: ""
      });
      
      // Then create matched items for each product match
      for (const productMatch of match.matches) {
        await this.createMatchedItem({
          extractedItemId: extractedItem.id,
          productId: productMatch.productId,
          productName: productMatch.productName,
          confidence: productMatch.confidence,
          isVerified: productMatch.confidence === 100 // Auto-verify 100% matches
        });
      }
    }
  }
}

export const storage = new MemStorage();
