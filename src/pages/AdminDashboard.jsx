import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/admin/dashboard");
      setDashboard(res.data);
    } catch (err) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      setError("Failed to load dashboard");
    }
  };

  const approveLoan = async (loanId) => {
    const remarks = prompt("Enter approval remarks");
    if (!remarks) return;

    try {
      await API.post(`/admin/approve/${loanId}`, null, {
        params: { remarks },
      });
      fetchDashboard();
    } catch {
      alert("Approve failed");
    }
  };

  const rejectLoan = async (loanId) => {
    const remarks = prompt("Enter rejection remarks");
    if (!remarks) return;

    try {
      await API.post(`/admin/reject/${loanId}`, null, {
        params: { remarks },
      });
      fetchDashboard();
    } catch {
      alert("Reject failed");
    }
  };

  const filtered = dashboard.filter((item) => {
    if (!search) return true;
    const name = item.user.name?.toLowerCase() || "";
    const email = item.user.email?.toLowerCase() || "";
    return (
      name.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase())
    );
  });

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1000px", margin: "auto" }}>
      <h2>🔥 Admin Dashboard</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "10px", flex: 1 }}
        />
        <button onClick={logout}>Logout</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {filtered.map((item) => (
        <div
          key={item.user.id}
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>{item.user.name}</h3>
          <p>Email: {item.user.email}</p>
          <p>Phone: {item.user.phone}</p>
          <p>Salary: ₹{item.user.salary}</p>

          <h4>Pending Loans</h4>

          {item.pendingLoans.length === 0 ? (
            <p>None</p>
          ) : (
            item.pendingLoans.map((loan) => (
              <div
                key={loan.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "15px",
                  marginTop: "10px",
                  borderRadius: "8px",
                }}
              >
                <p>Type: {loan.loanType}</p>
                <p>Amount: ₹{loan.loanAmount}</p>
                <p>Tenure: {loan.tenureMonth} months</p>
                <p>Status: {loan.status}</p>
                <p>Interest Rate: {loan.interestRate}%</p>
                <p>EMI: ₹{loan.emi}</p>
                <p>Remarks: {loan.remarks || "N/A"}</p>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => approveLoan(loan.id)}
                    style={{ background: "green", color: "white" }}
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => rejectLoan(loan.id)}
                    style={{ background: "red", color: "white" }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
}
