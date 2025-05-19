import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, ArrowRight, CheckCircle } from "lucide-react";

interface UploadStepProps {
  selectedDocument: { name: string } | null;
  onDocumentSelect: (document: { name: string }) => void;
  onNextStep: () => void;
}

export default function UploadStep({ 
  selectedDocument, 
  onDocumentSelect, 
  onNextStep 
}: UploadStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0 && files[0].type === 'application/pdf') {
      onDocumentSelect({ name: files[0].name });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onDocumentSelect({ name: files[0].name });
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const testDocuments = [
    {
      category: "Easy",
      documents: ["Easy - 1.pdf", "Easy - 2.pdf", "Easy - 3.pdf"]
    },
    {
      category: "Medium",
      documents: ["Medium - 1.pdf", "Medium - 2.pdf", "Medium - 3.pdf"]
    },
    {
      category: "Hard",
      documents: ["Hard - 1.pdf", "Hard - 2.pdf", "Hard - 3.pdf"]
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {selectedDocument 
          ? `Upload Purchase Order Document: ${selectedDocument.name}`
          : "Upload Purchase Order Document"}
      </h2>
      <p className="text-gray-600 mb-6">
        Upload a PDF purchase order to begin processing. The system will extract line items and 
        match them to products in your catalog.
      </p>
      
      <div className="grid grid-cols-1 gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* File Uploader */}
          <div 
            className={`dropzone rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer ${
              isDragging ? 'border-primary bg-primary bg-opacity-5' : 'border-2 border-dashed border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
          >
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-center text-gray-500 mb-2">Drag and drop your PDF here</p>
            <p className="text-center text-gray-400 text-sm mb-4">or</p>
            <Button variant="default" className="cursor-pointer">
              <span>Browse Files</span>
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf" 
                ref={fileInputRef}
                onChange={handleFileInput}
              />
            </Button>
            <p className="text-sm text-gray-400 mt-4">Supported format: PDF</p>
          </div>
          
          {/* Instructions */}
          <div className="bg-muted rounded-lg p-6 border border-border">
            <h3 className="font-bold text-lg mb-3 font-mono gradient-text">Automated Document Processing</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="text-success mr-2 h-5 w-5 mt-0.5" />
                <span>Extract line items from purchase orders automatically</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-success mr-2 h-5 w-5 mt-0.5" />
                <span>Match items to your product catalog with precision</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-success mr-2 h-5 w-5 mt-0.5" />
                <span>Verify and adjust matches as needed</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-success mr-2 h-5 w-5 mt-0.5" />
                <span>Export structured data for your systems</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Test Documents */}
        <div>
          <h3 className="font-medium mb-2 font-mono">Test Documents</h3>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">For testing, use one of these sample documents:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {testDocuments.map((category) => (
                <div key={category.category} className="text-sm">
                  <p className="font-medium mb-1">{category.category}:</p>
                  <ul className="list-disc pl-5 text-primary">
                    {category.documents.map((doc) => (
                      <li key={doc}>
                        <button 
                          className="hover:underline text-left text-primary"
                          onClick={() => onDocumentSelect({ name: doc })}
                        >
                          {doc}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-8">
        <Button 
          disabled={!selectedDocument} 
          onClick={onNextStep}
          className="flex items-center"
        >
          <span>Process Document</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
