import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ApplyLoan from "./pages/ApplyLoan";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import UploadDocument from "./pages/UploadDocument";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/apply-loan" element={<ApplyLoan/>}/>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/UploadDocument" element={<UploadDocument />} />

      </Routes>
    </Router>
  );
}

export default App;

