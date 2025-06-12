import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import type { ReactNode } from "react";
import HomePage from "./pages/Home";
import {Routes,Route} from "react-router-dom"
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
interface ProtectedRouteProps {
  children: ReactNode;
}

function App() {

  

  const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    return (
      <>
        <SignedIn>{children}</SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </>
    );
  };
  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <NavBar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
       
      </Routes>
      <Footer/>
    </ThemeProvider>
  );
}

export default App;
