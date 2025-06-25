import { Globe } from 'lucide-react'
import logo from "../assets/sitepulse_logo.png";


const Footer = () => {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container flex flex-col items-center justify-between px-4 py-12 md:flex-row">
        <div className="mb-4 flex items-center space-x-2 md:mb-0">
          <img className="h-12 w-12" src={logo} />
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SitePulse
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
