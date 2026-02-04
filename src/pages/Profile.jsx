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
        // ✅ Token automatically attached by axios interceptor
        const profileRes = await API.get("/users/profile");
        setUser(profileRes.data);

        const loansRes = await API.get("/users/loans");
        setLoans(loansRes.data);

      } catch (err) {
        // 🔐 Auto logout if token invalid
        if (err?.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        setError(
          err?.response?.data?.message ||
          err?.response?.data ||
          "Failed to fetch profile"
        );
      }
    };

    fetchProfile();
  }, [navigate]);

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
