import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import Card from "../components/Card";
import Button from "../components/Button";
import "../styles/ui.css";

export default function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("USER");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // USER only fields
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [salary, setSalary] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const endpoint =
        role === "ADMIN"
          ? "/users/admin/register"
          : "/users/register";

      const payload =
        role === "ADMIN"
          ? {
              fullName: name,
              email,
              password,
            }
          : {
              name,
              email,
              password,
              phone,
              age,
              salary,
            };

      await API.post(endpoint, payload);

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1000);

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
        <h2>Register</h2>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={handleRegister}>
          {/* ROLE */}
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>

          {/* COMMON */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {/* USER ONLY */}
          {role === "USER" && (
            <>
              <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />

              <input
                type="number"
                placeholder="Salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </>
          )}

          <Button type="submit">Register</Button>
        </form>

        {/* ✅ LOGIN LINK (VISIBLE) */}
        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </Card>
    </div>
  );
}
