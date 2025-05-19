import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Download, Code, Plus } from "lucide-react";
import { FinalMatchedItem } from "@shared/schema";

interface ExportStepProps {
  documentName: string;
  finalMatchedData: FinalMatchedItem[];
  onBackStep: () => void;
  onProcessNew: () => void;
}

export default function ExportStep({ 
  documentName, 
  finalMatchedData, 
  onBackStep, 
  onProcessNew 
}: ExportStepProps) {
  const [copiedJson, setCopiedJson] = useState(false);

  const handleDownloadCSV = () => {
    // Convert data to CSV
    const headers = ["Item #", "Document Description", "Product ID", "Product Name", "Quantity"];
    const csvContent = [
      headers.join(","),
      ...finalMatchedData.map(item => [
        item.lineNumber,
        `"${item.description.replace(/"/g, '""')}"`,
        item.productId,
        `"${item.productName.replace(/"/g, '""')}"`,
        item.quantity
      ].join(","))
    ].join("\n");
    
    // Create a blob and download it
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${documentName.replace(/\.\w+$/, "")}_matched_items.csv`);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Excel download function removed as it's not needed

  const handleCopyJSON = () => {
    const jsonData = JSON.stringify(finalMatchedData, null, 2);
    navigator.clipboard.writeText(jsonData)
      .then(() => {
        setCopiedJson(true);
        setTimeout(() => setCopiedJson(false), 2000);
      })
      .catch(err => {
        console.error("Failed to copy JSON: ", err);
      });
  };

  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div>
      <div className="text-center mb-8">
        <CheckCircle className="text-success text-5xl mx-auto" />
        <h2 className="text-xl font-bold mt-4 mb-2">Processing Complete</h2>
        <p className="text-gray-600">
          Your document has been processed successfully. You can now download the matched data or process another document.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-medium mb-4">Document Summary</h3>
          <ul className="space-y-3">
            <li className="flex justify-between">
              <span className="text-gray-600">Document Name:</span>
              <span className="font-medium">{documentName}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Items Processed:</span>
              <span className="font-medium">{finalMatchedData.length}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Processed Date:</span>
              <span className="font-medium">{formattedDate}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-success">Completed</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-medium mb-4">Export Options</h3>
          <div className="space-y-4">
            <div>
              <Button 
                className="w-full flex items-center justify-center"
                onClick={handleDownloadCSV}
              >
                <Download className="mr-2 h-4 w-4" />
                <span>Download CSV</span>
              </Button>
            </div>
            {/* Excel download removed as it duplicates CSV functionality */}
            <div>
              <Button 
                variant="outline"
                className="w-full flex items-center justify-center"
                onClick={handleCopyJSON}
              >
                <Code className="mr-2 h-4 w-4" />
                <span>{copiedJson ? "Copied!" : "Copy as JSON"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Final Matched Data Table */}
      <h3 className="font-medium mb-3">Final Matched Data</h3>
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item #</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Description</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {finalMatchedData.map((item) => (
              <tr key={item.lineNumber}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.lineNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{item.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.productId}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{item.productName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onBackStep}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Back to Verification</span>
        </Button>
        <Button 
          variant="default"
          onClick={onProcessNew}
          className="bg-secondary hover:bg-secondary-dark text-white flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          <span>Process New Document</span>
        </Button>
      </div>
    </div>
  );
}
