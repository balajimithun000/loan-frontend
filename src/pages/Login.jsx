import { useState, useEffect } from "react";
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

  // 🔐 Already logged in na redirect
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile"); // default user page
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1️⃣ LOGIN API
      const res = await API.post("/users/login", {
        email,
        password,
      });

      const token = res.data;

      // 2️⃣ SAVE TOKEN
      localStorage.setItem("token", token);

      // 3️⃣ GET PROFILE (ROLE CHECK)
      const profileRes = await API.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const role = profileRes.data.role;

      // 4️⃣ ROLE BASED REDIRECT
      if (role === "ADMIN" || role === "ROLE_ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/profile");
      }

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data ||
        "Login failed"
      );
    }
  };

  return (
    <div className="container fade-in">
      <Card>
        <h2>Login</h2>

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

          <Button type="submit">Login</Button>
        </form>

        {/* 👇 REGISTER LINK */}
        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>
            Register
          </span>
        </p>
      </Card>
    </div>
  );
}
