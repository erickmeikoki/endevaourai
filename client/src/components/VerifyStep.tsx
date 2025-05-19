import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineItemMatch, ProductMatch, ExtractedLineItem } from "@shared/schema";

interface VerifyStepProps {
  extractedItems: ExtractedLineItem[];
  matchedItems: LineItemMatch[];
  onBackStep: () => void;
  onNextStep: () => void;
  onOpenSearchModal: () => void;
  updateProductMatch: (extractedItemIndex: number, matchIndex: number) => void;
}

export default function VerifyStep({
  extractedItems,
  matchedItems,
  onBackStep,
  onNextStep,
  onOpenSearchModal,
  updateProductMatch
}: VerifyStepProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "bg-green-100 text-green-800";
    if (confidence >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Verify Product Matches</h2>
      <p className="text-gray-600 mb-6">
        Review and verify the matched products for each line item. Use the dropdown to select the correct product if needed.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Preview */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium mb-3">Document Preview</h3>
          <img 
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
            alt="Document with line items" 
            className="rounded-lg shadow w-full h-auto"
          />
        </div>
        
        {/* Product Catalog Preview */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium mb-3">Product Catalog</h3>
          <img 
            src="https://images.unsplash.com/photo-1539786774582-0707555f1f72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
            alt="Industrial fasteners catalog" 
            className="rounded-lg shadow w-full h-auto"
          />
        </div>
      </div>
      
      {/* Matching Table */}
      <div className="mt-6">
        <h3 className="font-medium mb-3">Line Item Matching</h3>
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item #</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Description</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matched Product</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {matchedItems.map((item, itemIndex) => (
                <tr key={item.lineNumber}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.lineNumber}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{item.description}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                  <td className="px-4 py-4 text-sm">
                    <Select 
                      defaultValue={item.matches[0]?.productId || ""}
                      onValueChange={(value) => {
                        const matchIndex = item.matches.findIndex(m => m.productId === value);
                        if (matchIndex >= 0) {
                          updateProductMatch(itemIndex, matchIndex);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select product match" />
                      </SelectTrigger>
                      <SelectContent>
                        {item.matches.map((match, index) => (
                          <SelectItem key={match.productId} value={match.productId}>
                            {match.productId} - {match.productName}
                          </SelectItem>
                        ))}
                        <SelectItem value="search">Search for a different product...</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      getConfidenceColor(item.matches[0]?.confidence || 0)
                    }`}>
                      {item.matches[0]?.confidence || 0}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Product Search Button */}
        <div className="mt-4">
          <Button 
            variant="ghost" 
            onClick={onOpenSearchModal}
            className="text-primary hover:text-primary-dark font-medium py-2 flex items-center"
          >
            <Search className="mr-2 h-4 w-4" />
            <span>Search Product Catalog</span>
          </Button>
        </div>
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
          <span>Confirm & Export</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
