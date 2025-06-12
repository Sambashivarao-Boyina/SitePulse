import { Globe } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container flex flex-col items-center justify-between px-4 py-12 md:flex-row">
        <div className="mb-4 flex items-center space-x-2 md:mb-0">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            WebTracker
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          © 2025 WebTracker. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer
