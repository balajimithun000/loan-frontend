import { useState } from "react";
import API from "../api/axiosConfig";
import Button from "../components/Button";
import Card from "../components/Card";
import UploadDocument from "./UploadDocument";

export default function ApplyLoan() {
  const [loanType, setLoanType] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [tenureMonth, setTenureMonth] = useState("");
  const [income, setIncome] = useState("");
  const [creditScore, setCreditScore] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [createdLoan, setCreatedLoan] = useState(null); // 👈 saved loan

  const handleApply = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const dto = {
        loanType,
        loanAmount,
        tenureMonth,
        income,
        creditScore
      };

      const res = await API.post("/users/loans/apply", dto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCreatedLoan(res.data); // 👈 store loan
      setMessage("Loan applied successfully! Now upload your documents.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data ||
        "Failed to apply loan"
      );
    }
  };

  return (
    <div className="container fade-in">
      <Card>
        <h2>Apply Loan</h2>

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        {!createdLoan && (
          <form onSubmit={handleApply}>
            <select value={loanType} onChange={(e) => setLoanType(e.target.value)} required>
              <option value="">Select Loan Type</option>
              <option value="HOME">Home Loan</option>
              <option value="PERSONAL">Personal Loan</option>
              <option value="EDUCATION">Education Loan</option>
              <option value="VECHILE">Vechile Loan</option>
              <option value="BUSINESS">Business Loan</option>
              <option value="GOLD">Gold Loan</option>
            </select>

            <input
              type="number"
              placeholder="Loan Amount"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Tenure (Months)"
              value={tenureMonth}
              onChange={(e) => setTenureMonth(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Monthly Income"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Credit Score"
              value={creditScore}
              onChange={(e) => setCreditScore(e.target.value)}
              required
            />

            <Button type="submit">Apply</Button>
          </form>
        )}

        {/* ✔ show upload box only after loan created */}
        {createdLoan && (
          <UploadDocument loanId={createdLoan.id} />
        )}
      </Card>
    </div>
  );
}

