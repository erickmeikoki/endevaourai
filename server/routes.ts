import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// Axios import removed - currently not needed
import { z } from "zod";
import { 
  insertDocumentSchema,
  LineItemMatch,
  ExtractedLineItem
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/health", (_, res) => {
    res.json({ status: "ok" });
  });

  // Document routes
  app.post("/api/documents", async (req: Request, res: Response) => {
    try {
      const documentData = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(documentData);
      return res.status(201).json(document);
    } catch (error) {
      console.error("Error creating document:", error);
      return res.status(400).json({ message: "Invalid document data" });
    }
  });

  app.get("/api/documents", async (_, res: Response) => {
    try {
      const documents = await storage.getAllDocuments();
      return res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      return res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.get("/api/documents/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid document ID" });
      }

      const document = await storage.getDocument(id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      return res.json(document);
    } catch (error) {
      console.error("Error fetching document:", error);
      return res.status(500).json({ message: "Failed to fetch document" });
    }
  });

  // Document processing routes
  app.post("/api/documents/:id/extract", async (req: Request, res: Response) => {
    try {
      const documentId = parseInt(req.params.id);
      if (isNaN(documentId)) {
        return res.status(400).json({ message: "Invalid document ID" });
      }

      const document = await storage.getDocument(documentId);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Create mock extraction data based on document name
      let extractedLineItems: ExtractedLineItem[] = [];
      
      if (document.name.includes("Easy")) {
        extractedLineItems = [
          { lineNumber: 1, description: "1/4-20 x 1-1/4 Hex Cap Screw Grade 5", quantity: 100, unitPrice: "$0.12", total: "$12.00" },
          { lineNumber: 2, description: "3/8-16 x 2 Hex Bolt Grade 8 Yellow Zinc", quantity: 50, unitPrice: "$0.34", total: "$17.00" },
          { lineNumber: 3, description: "1/2-13 Lock Nut Zinc Plated", quantity: 75, unitPrice: "$0.22", total: "$16.50" }
        ];
      } else if (document.name.includes("Medium")) {
        extractedLineItems = [
          { lineNumber: 1, description: "Hex Cap Screw 1/4-20 x 1-1/4 G5", quantity: 100, unitPrice: "$0.12", total: "$12.00" },
          { lineNumber: 2, description: "Hex Bolt 3/8-16 x 2\" Yellow Zinc G8", quantity: 50, unitPrice: "$0.34", total: "$17.00" },
          { lineNumber: 3, description: "Lock Nut, Zinc 1/2-13", quantity: 75, unitPrice: "$0.22", total: "$16.50" },
          { lineNumber: 4, description: "Flat Washer 3/8\" USS", quantity: 100, unitPrice: "$0.08", total: "$8.00" }
        ];
      } else {
        extractedLineItems = [
          { lineNumber: 1, description: "G5 Hex Screw 1/4\"-20tpi x 1-1/4\"", quantity: 100, unitPrice: "$0.12", total: "$12.00" },
          { lineNumber: 2, description: "G8 YZ bolt, hex head, 3/8\"-16 x 2\"", quantity: 50, unitPrice: "$0.34", total: "$17.00" },
          { lineNumber: 3, description: "1/2 inch - 13 TPI zinc lock nut", quantity: 75, unitPrice: "$0.22", total: "$16.50" },
          { lineNumber: 4, description: "USS Flat Washer, 3/8\"", quantity: 100, unitPrice: "$0.08", total: "$8.00" },
          { lineNumber: 5, description: "Hex Nut, 1/4\"-20, G5", quantity: 120, unitPrice: "$0.10", total: "$12.00" }
        ];
      }

      // Update document status
      await storage.updateDocumentStatus(documentId, "extracted");

      return res.json({ lineItems: extractedLineItems });
    } catch (error) {
      console.error("Error extracting document:", error);
      return res.status(500).json({ message: "Failed to process document extraction" });
    }
  });

  app.post("/api/documents/:id/match", async (req: Request, res: Response) => {
    try {
      const documentId = parseInt(req.params.id);
      if (isNaN(documentId)) {
        return res.status(400).json({ message: "Invalid document ID" });
      }

      const document = await storage.getDocument(documentId);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      const extractedItemsSchema = z.array(z.object({
        lineNumber: z.number(),
        description: z.string(),
        quantity: z.number()
      }));

      const extractedItems = extractedItemsSchema.parse(req.body);

      // Generate mock matches based on extracted items
      const matchResults: LineItemMatch[] = [];

      for (const item of extractedItems) {
        const description = item.description.toLowerCase();
        let matches: { productId: string; productName: string; confidence: number }[] = [];
        
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

        matchResults.push({
          lineNumber: item.lineNumber,
          description: item.description,
          quantity: item.quantity,
          matches
        });
      }

      // Save matches to storage
      await storage.saveLineItemMatches(documentId, matchResults);

      // Update document status
      await storage.updateDocumentStatus(documentId, "matched");

      return res.json(matchResults);
    } catch (error) {
      console.error("Error matching document:", error);
      return res.status(500).json({ message: "Failed to process document matching" });
    }
  });

  app.post("/api/documents/:id/verify", async (req: Request, res: Response) => {
    try {
      const documentId = parseInt(req.params.id);
      if (isNaN(documentId)) {
        return res.status(400).json({ message: "Invalid document ID" });
      }

      const document = await storage.getDocument(documentId);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      const verificationSchema = z.array(z.object({
        extractedItemId: z.number(),
        matchedItemId: z.number(),
        verified: z.boolean()
      }));

      const verifications = verificationSchema.parse(req.body);

      // Update matched items with verification status
      for (const v of verifications) {
        await storage.updateMatchedItem(v.matchedItemId, {
          extractedItemId: v.extractedItemId,
          isVerified: v.verified
        });
      }

      // Update document status
      await storage.updateDocumentStatus(documentId, "verified");

      return res.json({ message: "Verification completed" });
    } catch (error) {
      console.error("Error verifying document:", error);
      return res.status(500).json({ message: "Failed to verify document" });
    }
  });

  app.get("/api/documents/:id/matched-items", async (req: Request, res: Response) => {
    try {
      const documentId = parseInt(req.params.id);
      if (isNaN(documentId)) {
        return res.status(400).json({ message: "Invalid document ID" });
      }

      const document = await storage.getDocument(documentId);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      const finalMatches = await storage.getFinalMatchedItems(documentId);
      return res.json(finalMatches);
    } catch (error) {
      console.error("Error getting matched items:", error);
      return res.status(500).json({ message: "Failed to get matched items" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
