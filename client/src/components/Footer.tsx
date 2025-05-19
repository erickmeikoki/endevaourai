export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="text-gray-600 text-sm mb-2 sm:mb-0">
          &copy; {new Date().getFullYear()} Document Processing System. All rights reserved.
        </div>
        <div className="flex items-center space-x-4">
          <a href="#" className="text-gray-600 hover:text-primary text-sm">Help Center</a>
          <a href="#" className="text-gray-600 hover:text-primary text-sm">Privacy Policy</a>
          <a href="#" className="text-gray-600 hover:text-primary text-sm">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
