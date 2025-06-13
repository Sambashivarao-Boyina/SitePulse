import { ThemeProvider } from "./components/theme-provider";
import {
  RedirectToSignIn,
  useAuth,
} from "@clerk/clerk-react";
import type { ReactNode } from "react";
import HomePage from "./pages/Home";
import {Routes,Route} from "react-router-dom"
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import AddSite from "./pages/AddSite";
import { Toaster } from "@/components/ui/sonner";
import WebsitesList from "./pages/WebsiesList/WebstiesList";

interface ProtectedRouteProps {
  children: ReactNode;
}

function App() {

  

  const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) return null; // or a loader

    return isSignedIn ? children : <RedirectToSignIn/>;
  };
  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <NavBar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/add-website"
              element={
                <ProtectedRoute>
                  <AddSite />
                </ProtectedRoute>
              }
            />
            <Route
              path="/websites"
              element={
                <ProtectedRoute>
                  <WebsitesList />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
        <Toaster position="top-center" />
      </div>
    </ThemeProvider>
  );
}

export default App;
