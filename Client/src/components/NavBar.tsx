import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BarChart3, BookOpen, Eye, Globe, Menu, Plus } from "lucide-react";
import { NavLink } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const NavBar = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const navItems = [
    { name: "Add Website", href: "/add-website", icon: Plus },
    { name: "Show Websites", href: "/websites", icon: Eye },
    { name: "Docs", href: "/docs", icon: BookOpen },
  ];
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 px-2 md:px-5">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <NavLink to={"/"}>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SitePulse
            </span>
          </div>
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink to={item.href}>
                <Button
                  key={item.name}
                  variant="ghost"
                  className="flex items-center space-x-2"
                  asChild
                >
                  <span>
                    <IconComponent className="h-4 w-4" />
                    <span>{item.name}</span>
                  </span>
                </Button>
              </NavLink>
            );
          })}
          <ModeToggle />
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <div className="flex felx-row gap-1">
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SheetTrigger asChild>
                <div className="flex gap-2 items-center">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </div>
              </SheetTrigger>
            </div>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center justify-between space-x-2 mt-6">
                  <div className="flex flex-row items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                      <Globe className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      SitePulse
                    </span>
                  </div>
                  <ModeToggle />
                </SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 pb-6">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Button
                      key={item.name}
                      variant="ghost"
                      className="justify-start"
                      asChild
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <a
                        href={item.href}
                        className="flex items-center space-x-3"
                      >
                        <IconComponent className="h-5 w-5" />
                        <span>{item.name}</span>
                      </a>
                    </Button>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
