import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ViewEvents from "./pages/ViewEvents";
import CreateEvent from "./pages/Create";
import DeleteEvent from "./pages/Delete";

function App() {
  return (
    <Router>
      <Routes>
      
        
        
    
        <Route path="/view-events" element={<ViewEvents />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/delete" element={<DeleteEvent />} />
        
    
       
      </Routes>
    </Router>
  );
}

export default App;