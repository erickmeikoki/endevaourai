import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import { z } from "zod";
import { 
  insertDocumentSchema, 
  insertExtractedItemSchema, 
  insertMatchedItemSchema,
  DocumentExtractResponse,
  LineItemMatch
} from "@shared/schema";

const extractionApiURL = "https://extraction-api-endpoint.example.com";
const matchingApiURL = "https://matching-api-endpoint.example.com";

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

      // The real implementation would call the extraction API
      // For interview purposes, we'll simulate with the named test documents
      try {
        // Call the extraction API
        const response = await axios.get(`${extractionApiURL}?document=${document.name}`);
        const extractionData = response.data as DocumentExtractResponse;

        // Update document status
        await storage.updateDocumentStatus(documentId, "extracted");

        return res.json(extractionData);
      } catch (error) {
        console.error("Error calling extraction API:", error);
        return res.status(500).json({ message: "Failed to extract document data" });
      }
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

      // Call the matching API for each extracted item
      try {
        const matchResults: LineItemMatch[] = [];

        for (const item of extractedItems) {
          const response = await axios.post(matchingApiURL, {
            description: item.description
          });

          matchResults.push({
            lineNumber: item.lineNumber,
            description: item.description,
            quantity: item.quantity,
            matches: response.data.matches
          });
        }

        // Save matches to storage
        await storage.saveLineItemMatches(documentId, matchResults);

        // Update document status
        await storage.updateDocumentStatus(documentId, "matched");

        return res.json(matchResults);
      } catch (error) {
        console.error("Error calling matching API:", error);
        return res.status(500).json({ message: "Failed to match document items" });
      }
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
