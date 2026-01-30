import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import "../styles/ui.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/api/users/login", { email, password });
      const token = res.data; // JWT from backend
      localStorage.setItem("token", token);

      // Decode JWT payload to get role
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userRole = payload.role; // "USER" or "ADMIN"
      localStorage.setItem("role", userRole);

      // Redirect based on role
      if (userRole === "USER") {
        navigate("/profile"); // USER dashboard/profile
      } else if (userRole === "ADMIN") {
        navigate("/admin/dashboard"); // ADMIN dashboard
      } else {
        setError("Invalid role in token");
      }
    } catch (err) {
      setError(
        err?.response?.data ||
        err?.response?.data?.error ||
        "Login failed"
      );
    }
  };

  return (
    <div className="container fade-in">
      <Card>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleLogin}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" className="w-full">Login</Button>
        </form>

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Don't have an account?{" "}
          <span
            style={{ color: "var(--primary)", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </Card>
    </div>
  );
}
