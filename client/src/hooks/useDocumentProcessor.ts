import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  ExtractedLineItem, 
  LineItemMatch, 
  CatalogProduct,
  Document,
  FinalMatchedItem,
  ProductMatch 
} from "@shared/schema";
import { searchProductCatalog } from "@/lib/api";

export default function useDocumentProcessor() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [extractedItems, setExtractedItems] = useState<ExtractedLineItem[]>([]);
  const [matchedItems, setMatchedItems] = useState<LineItemMatch[]>([]);
  const [finalMatchedData, setFinalMatchedData] = useState<FinalMatchedItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState({
    uploaded: false,
    parsing: false,
    extracting: false,
    matching: false
  });
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedProductMatches, setSelectedProductMatches] = useState<{
    extractedItem: ExtractedLineItem;
    matches: ProductMatch[];
  } | null>(null);

  // Handle document selection
  const handleDocumentSelect = (document: { name: string }) => {
    setSelectedDocument({
      id: 1, // Placeholder ID until saved to backend
      name: document.name,
      status: "pending",
      createdAt: new Date().toISOString()
    });
  };

  // Simulate processing progress
  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            
            // Finish processing
            setIsProcessing(false);
            return 100;
          }
          return prev + 5;
        });

        // Update processing status based on progress
        if (processingProgress >= 25 && !processingStatus.parsing) {
          setProcessingStatus(prev => ({ ...prev, parsing: true }));
        }
        if (processingProgress >= 50 && !processingStatus.extracting) {
          setProcessingStatus(prev => ({ ...prev, extracting: true }));
        }
        if (processingProgress >= 75 && !processingStatus.matching) {
          setProcessingStatus(prev => ({ ...prev, matching: true }));
        }
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isProcessing, processingProgress, processingStatus]);

  // Handle document extraction
  const handleExtract = async () => {
    if (!selectedDocument) {
      toast({
        title: "Error",
        description: "Please select a document first",
        variant: "destructive"
      });
      return;
    }

    try {
      // Reset states
      setIsProcessing(true);
      setProcessingProgress(0);
      setProcessingStatus({
        uploaded: true,
        parsing: false,
        extracting: false,
        matching: false
      });
      setCurrentStep(2);

      // Create document in backend
      const docResponse = await apiRequest("POST", "/api/documents", {
        name: selectedDocument.name,
        status: "pending"
      });
      const savedDocument = await docResponse.json() as Document;
      setSelectedDocument(savedDocument);

      // Simulate document extraction
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Call extraction API
      const extractResponse = await apiRequest(
        "POST", 
        `/api/documents/${savedDocument.id}/extract`,
        {}
      );
      const extractionData = await extractResponse.json();
      setExtractedItems(extractionData.lineItems);

      // Call matching API with extracted items
      const matchResponse = await apiRequest(
        "POST",
        `/api/documents/${savedDocument.id}/match`,
        extractionData.lineItems
      );
      const matchedData = await matchResponse.json() as LineItemMatch[];
      setMatchedItems(matchedData);

      // Stop processing simulation
      setIsProcessing(false);
      
    } catch (error) {
      console.error("Error extracting document:", error);
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "Failed to process document. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle verification
  const handleVerifyMatches = async () => {
    if (!selectedDocument) return;

    try {
      // Create a final matched data array
      const finalData: FinalMatchedItem[] = matchedItems.map(item => {
        // Use the first match (highest confidence) by default
        const bestMatch = item.matches[0];
        return {
          lineNumber: item.lineNumber,
          description: item.description,
          productId: bestMatch.productId,
          productName: bestMatch.productName,
          quantity: item.quantity
        };
      });

      // Call the API to mark document as verified
      await apiRequest(
        "POST",
        `/api/documents/${selectedDocument.id}/verify`,
        // In a real app, we'd send verification data for matched items
        []
      );

      setFinalMatchedData(finalData);
      setCurrentStep(4);
    } catch (error) {
      console.error("Error verifying matches:", error);
      toast({
        title: "Error",
        description: "Failed to verify matches. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Update product match
  const updateProductMatch = (extractedItemIndex: number, matchIndex: number) => {
    const updatedItems = [...matchedItems];
    
    // Move the selected match to the top of the array (highest confidence)
    const item = updatedItems[extractedItemIndex];
    if (item && matchIndex < item.matches.length) {
      const match = item.matches[matchIndex];
      const newMatches = [
        match,
        ...item.matches.filter((_, i) => i !== matchIndex)
      ];
      
      updatedItems[extractedItemIndex] = {
        ...item,
        matches: newMatches
      };
      
      setMatchedItems(updatedItems);
    }
  };

  // Search products
  const searchProducts = async (query: string): Promise<CatalogProduct[]> => {
    try {
      return await searchProductCatalog(query);
    } catch (error) {
      console.error("Error searching products:", error);
      toast({
        title: "Error",
        description: "Failed to search products. Please try again.",
        variant: "destructive"
      });
      return [];
    }
  };

  // Reset process
  const resetProcess = () => {
    setCurrentStep(1);
    setSelectedDocument(null);
    setExtractedItems([]);
    setMatchedItems([]);
    setFinalMatchedData([]);
    setIsProcessing(false);
    setProcessingStatus({
      uploaded: false,
      parsing: false,
      extracting: false,
      matching: false
    });
    setProcessingProgress(0);
  };

  return {
    currentStep,
    setCurrentStep,
    selectedDocument,
    extractedItems,
    matchedItems,
    finalMatchedData,
    isProcessing,
    processingStatus,
    processingProgress,
    handleDocumentSelect,
    handleExtract,
    handleVerifyMatches,
    resetProcess,
    searchProducts,
    isSearchModalOpen,
    setIsSearchModalOpen,
    selectedProductMatches,
    updateProductMatch
  };
}
