import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StepIndicator from "@/components/StepIndicator";
import UploadStep from "@/components/UploadStep";
import ExtractStep from "@/components/ExtractStep";
import VerifyStep from "@/components/VerifyStep";
import ExportStep from "@/components/ExportStep";
import ProductSearchModal from "@/components/ProductSearchModal";
import useDocumentProcessor from "@/hooks/useDocumentProcessor";

export default function Home() {
  const {
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
  } = useDocumentProcessor();

  const steps = [
    { id: 1, title: "Upload" },
    { id: 2, title: "Extract" },
    { id: 3, title: "Verify" },
    { id: 4, title: "Export" }
  ];

  // To avoid unused variable warnings
  const stepsData = {
    steps,
    currentStep,
    setCurrentStep
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="gradient-text mb-2">Document Processing Workflow</h2>
          <p className="text-muted-foreground">Complete these steps to extract and match data from purchase orders</p>
        </div>
        
        <StepIndicator 
          steps={steps} 
          currentStep={currentStep} 
        />
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-border">
          {currentStep === 1 && (
            <UploadStep 
              selectedDocument={selectedDocument}
              onDocumentSelect={handleDocumentSelect}
              onNextStep={() => handleExtract()}
            />
          )}
          
          {currentStep === 2 && (
            <ExtractStep 
              isProcessing={isProcessing}
              processingStatus={processingStatus}
              processingProgress={processingProgress}
              documentName={selectedDocument?.name || ""}
              extractedItems={extractedItems}
              onBackStep={() => setCurrentStep(1)}
              onNextStep={() => setCurrentStep(3)}
            />
          )}
          
          {currentStep === 3 && (
            <VerifyStep 
              extractedItems={extractedItems}
              matchedItems={matchedItems}
              onBackStep={() => setCurrentStep(2)}
              onNextStep={() => handleVerifyMatches()}
              onOpenSearchModal={() => setIsSearchModalOpen(true)}
              updateProductMatch={updateProductMatch}
            />
          )}
          
          {currentStep === 4 && (
            <ExportStep 
              documentName={selectedDocument?.name || ""}
              finalMatchedData={finalMatchedData}
              onBackStep={() => setCurrentStep(3)}
              onProcessNew={resetProcess}
            />
          )}
        </div>
      </main>
      
      <ProductSearchModal 
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={searchProducts}
        onSelectProduct={(product) => {
          // Logic to select a product from search results
          setIsSearchModalOpen(false);
        }}
        selectedItem={selectedProductMatches?.extractedItem}
        productMatches={selectedProductMatches?.matches || []}
      />
      
      <Footer />
    </div>
  );
}
