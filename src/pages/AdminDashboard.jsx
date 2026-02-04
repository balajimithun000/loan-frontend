import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import Card from "../components/Card";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import "../styles/ui.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setError("");
      const res = await API.get("/admin/dashboard");
      setDashboard(res.data);
    } catch (err) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError(
        err?.response?.data?.message ||
        err?.response?.data ||
        "Failed to fetch dashboard"
      );
    }
  };

  // 🔍 Search filter
  const filteredDashboard = dashboard.filter((item) => {
    if (!search) return true;
    const name =
      item.user.name?.toLowerCase() ||
      item.user.fullName?.toLowerCase() ||
      "";
    const email = item.user.email?.toLowerCase() || "";
    return (
      name.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase())
    );
  });

  const approveLoan = async (loanId) => {
    try {
      await API.post(`/admin/approve/${loanId}`, null, {
        params: { remarks: "Approved by Admin" },
      });
      fetchDashboard();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
        "Failed to approve loan"
      );
    }
  };

  const rejectLoan = async (loanId) => {
    try {
      await API.post(`/admin/reject/${loanId}`, null, {
        params: { remarks: "Rejected by Admin" },
      });
      fetchDashboard();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
        "Failed to reject loan"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container fade-in">
      <Card>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Admin Dashboard
        </h2>

        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "10px",
              width: "100%",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
            }}
          />

          <Button onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {error && <p className="error">{error}</p>}

        {filteredDashboard.length === 0 ? (
          <p style={{ marginTop: "20px" }}>No users found.</p>
        ) : (
          filteredDashboard.map((item) => (
            <Card key={item.user.id} style={{ marginTop: "20px" }}>
              <p><strong>Name:</strong> {item.user.name || item.user.fullName}</p>
              <p><strong>Email:</strong> {item.user.email}</p>
              <p><strong>Phone:</strong> {item.user.phone || "N/A"}</p>
              <p><strong>Salary:</strong> {item.user.salary || "N/A"}</p>

              <h4 style={{ marginTop: "15px" }}>Pending Loans</h4>

              {item.pendingLoans.length === 0 ? (
                <p>None</p>
              ) : (
                item.pendingLoans.map((loan) => (
                  <Card
                    key={loan.id}
                    style={{ marginTop: "10px", padding: "15px" }}
                  >
                    <p><strong>Type:</strong> {loan.loanType}</p>
                    <p><strong>Amount:</strong> ₹{loan.loanAmount}</p>
                    <p><strong>Tenure:</strong> {loan.tenureMonth} months</p>
                    <p><strong>Status:</strong> {loan.status}</p>
                    <p><strong>Interest Rate:</strong> {loan.interestRate}%</p>
                    <p><strong>EMI:</strong> ₹{loan.emi}</p>

                    <div
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <Button
                        onClick={() => approveLoan(loan.id)}
                        style={{ backgroundColor: "green" }}
                      >
                        Approve
                      </Button>

                      <Button
                        onClick={() => rejectLoan(loan.id)}
                        style={{ backgroundColor: "red" }}
                      >
                        Reject
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </Card>
          ))
        )}
      </Card>
    </div>
  );
}
