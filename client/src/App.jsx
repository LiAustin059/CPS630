import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ViewEvents from "./pages/ViewEvents";
import EventDetails from "./pages/EventDetails";
import EventChat from "./pages/EventChat";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import AmbientBackground from "./components/layout/AmbientBackground";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AmbientBackground>
          <Navbar />
          <main className="pt-24 pb-16 container mx-auto px-4 max-w-7xl">
            <Routes>
              <Route path="/" element={<ViewEvents />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/events/:id/chat" element={<EventChat />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </AmbientBackground>
        <Toaster position="bottom-right" richColors />
      </Router>
    </AuthProvider>
  );
}

export default App;