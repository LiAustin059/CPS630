import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ViewEvents from "./pages/ViewEvents";
import CreateEvent from "./pages/Create";
import DeleteEvent from "./pages/Delete";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0f172a] text-gray-200">
        <Navbar />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<ViewEvents />} />
            <Route path="/create" element={<CreateEvent />} />
            <Route path="/delete" element={<DeleteEvent />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;