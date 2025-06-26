import { ThemeProvider } from "./components/theme-provider";
import { RedirectToSignIn, useAuth } from "@clerk/clerk-react";
import { useEffect, type ReactNode } from "react";
import HomePage from "./pages/Home";
import { Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import AddSite from "./pages/AddSite";
import { Toaster } from "@/components/ui/sonner";
import WebsitesList from "./pages/WebsiesList/WebstiesList";
import WebsiteDashBoard from "./pages/WebsiteDashBoard/WebsiteDashBoard";
import Docs from "./pages/Docs";
import { initSocket, disconnectSocket } from "./hooks/socket";

interface ProtectedRouteProps {
  children: ReactNode;
}
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null; // or a loader

  return isSignedIn ? children : <RedirectToSignIn />;
};

function App() {
  const location = useLocation();

  const { isSignedIn, userId } = useAuth();

  useEffect(() => {
    const setup = async () => {
      if (isSignedIn) {
        if (userId) {
          initSocket(userId);
        }
      } else {
        disconnectSocket();
      }
    };

    setup();
  }, [isSignedIn]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="max-h-screen h-full bg-background text-foreground flex flex-col">
        <NavBar />
        <div className="flex-1 w-full">
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

            <Route
              path="/websites/:id/*"
              element={
                <ProtectedRoute>
                  <WebsiteDashBoard />
                </ProtectedRoute>
              }
            />

            <Route path="/docs" element={<Docs />} />
          </Routes>
        </div>
        {!location.pathname.includes("/websites/") && <Footer />}
        <Toaster position="top-center" />
      </div>
    </ThemeProvider>
  );
}

export default App;
