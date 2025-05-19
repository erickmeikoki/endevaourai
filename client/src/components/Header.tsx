import { FileText } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="text-primary mr-2" />
          <h1 className="text-xl font-bold text-gray-800">Document Processing System</h1>
        </div>
        <nav>
          <button className="text-gray-600 hover:text-primary flex items-center">
            <span className="mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-help-circle">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
            </span>
            <span className="hidden sm:inline">Help</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
