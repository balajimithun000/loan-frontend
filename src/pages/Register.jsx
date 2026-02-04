import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import "../styles/ui.css";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const endpoint = isAdmin
        ? "/users/admin/register"
        : "/users/register";

      await API.post(endpoint, {
        name,
        email,
        password,
      });

      setSuccess(
        isAdmin
          ? "Admin registered successfully! Please login."
          : "Registered successfully! Please login."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="container fade-in">
      <Card>
        <h2>
          {isAdmin ? "Admin Register" : "User Register"}
        </h2>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={handleRegister}>
          <Input
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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

          {/* 🔁 ADMIN TOGGLE */}
          <div style={{ marginBottom: "15px" }}>
            <label>
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={() => setIsAdmin(!isAdmin)}
                style={{ marginRight: "8px" }}
              />
              Register as Admin
            </label>
          </div>

          <Button type="submit">
            Register
          </Button>
        </form>

        {/* 👇 LOGIN LINK – GUARANTEED VISIBLE */}
        <p className="auth-footer">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </Card>
    </div>
  );
}
