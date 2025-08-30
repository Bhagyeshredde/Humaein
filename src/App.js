import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Claims from "./pages/Claims";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors"; // ✅ Doctors page

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 text-white p-4">
          <h2 className="text-xl font-bold mb-6">Humaein RCM</h2>
          <nav className="flex flex-col gap-3">
            <Link to="/">Dashboard</Link>
            <Link to="/claims">Claims</Link>
            <Link to="/patients">Patients</Link>
            <Link to="/doctors">Doctors</Link>
            
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/claims" element={<Claims />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/doctors" element={<Doctors />} />
            </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
