import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ViewEvents from "./pages/ViewEvents";
import CreateEvent from "./pages/Create";
import DeleteEvent from "./pages/Delete";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#0f172a] text-gray-200">
          <Navbar />
          <main className="pt-20">
            <Routes>
              <Route path="/" element={<ViewEvents />} />
              <Route path="/create" element={<CreateEvent />} />
              <Route path="/delete" element={<DeleteEvent />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;