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
      let payload = {};

      // ✅ CORRECT ENDPOINT
      const endpoint =
        role === "ADMIN"
          ? "/users/admin/register"
          : "/users/register";

      if (role === "ADMIN") {
        payload = { fullName: name, email, password };
      } else {
        payload = { name, email, password, phone, age, salary };
      }

      await API.post(endpoint, payload);

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 150);

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
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Register</h2>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={handleRegister}>
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Input label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

          {role === "USER" && (
            <>
              <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Input label="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
              <Input label="Salary" type="number" value={salary} onChange={(e) => setSalary(e.target.value)} />
            </>
          )}

          <label style={{ marginBottom: "15px", display: "block" }}>
            Role:
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>

          <Button type="submit" className="w-full">Register</Button>
        </form>

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Already have an account?{" "}
          <span
            style={{ color: "var(--primary)", cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </Card>
    </div>
  );
}
