import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle, Info, Loader } from "lucide-react";
import { ExtractedLineItem } from "@shared/schema";

interface ExtractStepProps {
  isProcessing: boolean;
  processingStatus: {
    uploaded: boolean;
    parsing: boolean;
    extracting: boolean;
    matching: boolean;
  };
  processingProgress: number;
  documentName: string;
  extractedItems: ExtractedLineItem[];
  onBackStep: () => void;
  onNextStep: () => void;
}

export default function ExtractStep({
  isProcessing,
  processingStatus,
  processingProgress,
  documentName,
  extractedItems,
  onBackStep,
  onNextStep
}: ExtractStepProps) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Extracting Document Data</h2>
      
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Info className="text-blue-500 mr-2 h-5 w-5" />
          <p className="text-gray-600 text-sm">
            The system is processing your document and extracting line items. This may take a moment.
          </p>
        </div>
        
        {/* Processing Status */}
        {isProcessing && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">{documentName}</h3>
                <p className="text-sm text-gray-500">
                  {processingStatus.matching 
                    ? "Matching to product catalog..." 
                    : processingStatus.extracting 
                      ? "Extracting line items..." 
                      : processingStatus.parsing 
                        ? "Parsing document..." 
                        : "Processing document..."}
                </p>
              </div>
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-l-2 border-primary"></div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-6">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${processingProgress}%` }}
              ></div>
            </div>
            
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <CheckCircle className="text-success mr-2 h-4 w-4" />
                <span>Document uploaded successfully</span>
              </li>
              <li className="flex items-center">
                {processingStatus.parsing ? (
                  <CheckCircle className="text-success mr-2 h-4 w-4" />
                ) : (
                  <Loader className="text-primary animate-spin mr-2 h-4 w-4" />
                )}
                <span>PDF parsing {processingStatus.parsing ? "complete" : "in progress"}</span>
              </li>
              <li className="flex items-center">
                {processingStatus.extracting ? (
                  processingStatus.matching ? (
                    <CheckCircle className="text-success mr-2 h-4 w-4" />
                  ) : (
                    <Loader className="text-primary animate-spin mr-2 h-4 w-4" />
                  )
                ) : (
                  <span className="w-4 h-4 mr-2 flex items-center justify-center text-gray-400">⦿</span>
                )}
                <span className={processingStatus.extracting ? "" : "text-gray-400"}>
                  Extracting line items {processingStatus.matching ? "complete" : ""}
                </span>
              </li>
              <li className="flex items-center">
                {processingStatus.matching ? (
                  <Loader className="text-primary animate-spin mr-2 h-4 w-4" />
                ) : (
                  <span className="w-4 h-4 mr-2 flex items-center justify-center text-gray-400">⦿</span>
                )}
                <span className={processingStatus.matching ? "" : "text-gray-400"}>
                  Matching to product catalog
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>
      
      {/* Extracted Items Table */}
      {!isProcessing && extractedItems.length > 0 && (
        <div>
          <h3 className="font-medium mb-3">Extracted Line Items</h3>
          <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item #</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {extractedItems.map((item) => (
                  <tr key={item.lineNumber}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.lineNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.unitPrice || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.total || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={onBackStep}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span>Back</span>
            </Button>
            <Button 
              onClick={onNextStep}
              className="flex items-center"
            >
              <span>Continue to Verification</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
