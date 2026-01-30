
import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import Card from "../components/Card";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch user profile
        const profileRes = await API.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(profileRes.data);

        // Fetch user loans
        const loansRes = await API.get("/api/users/loans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoans(loansRes.data);

      } catch (err) {
        setError(
          err?.response?.data ||
          err?.response?.data?.message ||
          "Failed to fetch profile" 
        );
      }
    };

    fetchProfile();
  }, []);

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="container fade-in">
      <Card>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Welcome, {user.name}
        </h2>

        {error && <p className="error">{error}</p>}

        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
        <p><strong>Age:</strong> {user.age || "N/A"}</p>
        <p><strong>Salary:</strong> {user.salary || "N/A"}</p>

        <div style={{ margin: "20px 0" }}>
          <Button onClick={() => navigate("/apply-loan")}>
            Apply New Loan
          </Button>
        </div>

        <h3>Your Loans:</h3>
        {loans.length === 0 ? (
          <p>No loans applied yet.</p>
        ) : (
          loans.map((loan) => (
            <Card key={loan.id} style={{ marginBottom: "15px" }}>
              <p><strong>Type:</strong> {loan.loanType}</p>
              <p><strong>Amount:</strong> ₹{loan.loanAmount}</p>
              <p><strong>Term:</strong> {loan.tenureMonth} months</p>
              <p><strong>Status:</strong> {loan.status}</p>
              <p><strong>Interest Rate:</strong> {loan.interestRate}%</p>
              <p><strong>EMI:</strong> ₹{loan.emi}</p>
            </Card>
          ))
        )}
      </Card>
    </div>
  );
}