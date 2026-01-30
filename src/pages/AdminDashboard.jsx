import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import Card from "../components/Card";
import Button from "../components/Button";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setError("");
      const token = localStorage.getItem("adminToken"); // admin JWT
      const res = await API.get("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboard(res.data);
    } catch (err) {
      console.error(err);
      // Convert any object to string safely
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        JSON.stringify(err?.response?.data) ||
        "Failed to fetch dashboard";
      setError(msg);
    }
  };

  // Filter users by name/email
  const filteredDashboard = dashboard.filter((item) => {
    if (!search) return true;
    const name = item.user.name?.toLowerCase() || "";
    const email = item.user.email?.toLowerCase() || "";
    return name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
  });

  return (
    <div className="container fade-in">
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Admin Dashboard</h2>

      {error && <p className="error">{error}</p>}

      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          maxWidth: "400px",
          marginBottom: "20px",
          borderRadius: "10px",
          border: "1px solid #d1d5db",
        }}
      />

      {filteredDashboard.length === 0 ? (
        <p>No users found.</p>
      ) : (
        filteredDashboard.map((item) => (
          <Card key={item.user.id} style={{ marginBottom: "15px" }}>
            <p><strong>Name:</strong> {item.user.name}</p>
            <p><strong>Email:</strong> {item.user.email}</p>
            <p><strong>Phone:</strong> {item.user.phone || "N/A"}</p>
            <p><strong>Salary:</strong> {item.user.salary || "N/A"}</p>

            <h4>Pending Loans:</h4>
            {item.pendingLoans.length === 0 ? (
              <p>None</p>
            ) : (
              item.pendingLoans.map((loan) => (
                <Card key={loan.id} style={{ marginBottom: "10px", padding: "10px" }}>
                  <p><strong>Type:</strong> {loan.loanType}</p>
                  <p><strong>Amount:</strong> ₹{loan.loanAmount}</p>
                  <p><strong>Tenure:</strong> {loan.tenureMonth} months</p>
                  <p><strong>Status:</strong> {loan.status}</p>
                  <p><strong>Interest Rate:</strong> {loan.interestRate}%</p>
                  <p><strong>EMI:</strong> ₹{loan.emi}</p>

                  <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
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
    </div>
  );

  // ---------------- Approve / Reject handlers ----------------
  async function approveLoan(loanId) {
    try {
      const token = localStorage.getItem("token");
      await API.post(`/api/admin/approve/${loanId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
        params: { remarks: "Approved by Admin" },
      });
      fetchDashboard(); // refresh after update
    } catch (err) {
      alert("Failed to approve loan: " + JSON.stringify(err?.response?.data));
    }
  }

  async function rejectLoan(loanId) {
    try {
      const token = localStorage.getItem("token");
      await API.post(`/api/admin/reject/${loanId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
        params: { remarks: "Rejected by Admin" },
      });
      fetchDashboard(); // refresh after update
    } catch (err) {
      alert("Failed to reject loan: " + JSON.stringify(err?.response?.data));
    }
  }
}
