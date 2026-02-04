import { useState } from "react";
import API from "../api/axiosConfig";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
import "../styles/ui.css";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [salary, setSalary] = useState("");
  const [role, setRole] = useState("USER");
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
          ? { fullName: name, email, password }
          : { name, email, password, phone, age, salary };

      await API.post(endpoint, payload);

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 800);

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
      <Card style={{ maxWidth: "420px", margin: "auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "18px" }}>
          Create Account
        </h2>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={handleRegister} className="form">
          <Input
            label="Full Name"
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

          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {role === "USER" && (
            <>
              <Input
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <Input
                label="Age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />

              <Input
                label="Salary"
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </>
          )}

          {/* ROLE SELECT */}
          <div style={{ marginBottom: "14px" }}>
            <label className="label">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="select"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>

        {/* LOGIN LINK */}
        <p style={{ marginTop: "16px", textAlign: "center" }}>
          Already have an account?{" "}
          <span
            style={{
              color: "var(--primary)",
              cursor: "pointer",
              fontWeight: "600",
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </Card>
    </div>
  );
}
