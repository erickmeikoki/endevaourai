import processLogo from "../assets/process-logo.png";

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-primary/10 p-2 rounded-lg mr-3 flex items-center justify-center">
            <img 
              src={processLogo} 
              alt="Document Processing" 
              className="h-6 w-6"
              onError={(e) => {
                e.currentTarget.onerror = null;  // Prevent infinite loops
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">Document Processing System</h1>
            <p className="text-xs text-muted-foreground">Automated trade document analyzer</p>
          </div>
        </div>
        {/* Navigation items removed as they don't have functionality */}
      </div>
    </header>
  );
}
