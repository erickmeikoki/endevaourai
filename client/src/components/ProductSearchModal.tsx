import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Search } from "lucide-react";
import { ExtractedLineItem, ProductMatch, CatalogProduct } from "@shared/schema";

interface ProductSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => Promise<CatalogProduct[]>;
  onSelectProduct: (product: CatalogProduct) => void;
  selectedItem?: ExtractedLineItem;
  productMatches: ProductMatch[];
}

export default function ProductSearchModal({
  isOpen,
  onClose,
  onSearch,
  onSelectProduct,
  selectedItem,
  productMatches
}: ProductSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CatalogProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await onSearch(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectProduct = (product: CatalogProduct) => {
    onSelectProduct(product);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-medium">Search Product Catalog</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4 border-b">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by keyword, product ID, or description..."
              className="w-full py-3 pl-4 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={handleSearch}
              disabled={isSearching}
            >
              <Search className="h-5 w-5 text-gray-400" />
            </Button>
          </div>
          
          {/* Advanced search options will be implemented in future versions */}
        </div>
        
        <div className="overflow-y-auto flex-grow p-4">
          {isSearching ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-l-2 border-primary"></div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {searchResults.map((result) => (
                <div 
                  key={result.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary cursor-pointer"
                  onClick={() => handleSelectProduct(result)}
                >
                  <div className="flex items-start">
                    <div className="flex-grow">
                      <h4 className="font-medium">{result.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">Product ID: {result.id}</p>
                      <p className="text-sm mt-2">{result.description}</p>
                    </div>
                    <div className="ml-4">
                      <Button 
                        variant="ghost"
                        className="text-primary hover:text-primary-dark font-medium text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectProduct(result);
                        }}
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery && !isSearching ? (
            <div className="text-center py-8 text-gray-500">
              No products found matching your search.
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Search for products to display results.
            </div>
          )}
        </div>
        
        <div className="border-t p-4 flex justify-end">
          <Button 
            variant="outline"
            onClick={onClose}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button 
            disabled={searchResults.length === 0}
            onClick={() => {
              if (searchResults.length > 0) {
                handleSelectProduct(searchResults[0]);
              }
            }}
          >
            Apply Selection
          </Button>
        </div>
      </div>
    </div>
  );
}
