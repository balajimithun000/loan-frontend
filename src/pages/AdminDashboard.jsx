import { useEffect, useState } from "react";
import API from "../api/axiosConfig";

export default function AdminDashboard() {

  const [data, setData] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await API.get("/admin/dashboard");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approveLoan = async (loanId) => {
    try {
      await API.post(`/admin/approve/${loanId}`, null, {
        params: {
          remarks: remarks[loanId] || "",
        },
      });
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const rejectLoan = async (loanId) => {
    try {
      await API.post(`/admin/reject/${loanId}`, null, {
        params: {
          remarks: remarks[loanId] || "",
        },
      });
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const getStatusColor = (status) => {
    if (status === "APPROVED") return "green";
    if (status === "REJECTED") return "red";
    return "orange";
  };

  const filtered = data.filter((item) =>
    item.user.name.toLowerCase().includes(search.toLowerCase()) ||
    item.user.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <h2 style={{padding:"30px"}}>Loading Dashboard...</h2>;

  return (
    <div style={{ padding: "30px", fontFamily:"Arial" }}>

      <h1>Admin Loan Dashboard</h1>

      <input
        placeholder="Search user name or email..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        style={{
          padding:"10px",
          width:"300px",
          marginBottom:"20px",
          border:"1px solid gray",
          borderRadius:"5px"
        }}
      />

      {filtered.length===0 && <h3>No Users Found</h3>}

      {filtered.map(item => (

        <div key={item.user.id}
          style={{
            border:"2px solid black",
            marginBottom:"25px",
            padding:"20px",
            borderRadius:"10px",
            background:"#f9f9f9"
          }}>

          <h2>{item.user.name}</h2>
          <p>Email: {item.user.email}</p>
          <p>Phone: {item.user.phone}</p>
          <p>Salary: ₹{item.user.salary}</p>

          {item.pendingLoans.length===0 &&
            <p style={{color:"gray"}}>No Pending Loans</p>
          }

          {item.pendingLoans.map(loan => (

            <div key={loan.id}
              style={{
                border:"1px solid #ccc",
                padding:"15px",
                marginTop:"10px",
                borderRadius:"8px",
                background:"#fff"
              }}>

              <h4>Loan #{loan.id}</h4>

              <p>Type: {loan.loanType}</p>
              <p>Amount: ₹{loan.loanAmount}</p>
              <p>EMI: ₹{loan.emi}</p>
              <p>Interest: {loan.interestRate}%</p>

              <p>
                Status:
                <span style={{
                  marginLeft:"10px",
                  color:"#fff",
                  background:getStatusColor(loan.status),
                  padding:"3px 8px",
                  borderRadius:"5px"
                }}>
                  {loan.status}
                </span>
              </p>

              <textarea
                placeholder="Enter remarks..."
                value={remarks[loan.id] || ""}
                onChange={(e)=>setRemarks({
                  ...remarks,
                  [loan.id]: e.target.value
                })}
                style={{
                  width:"100%",
                  marginTop:"10px",
                  padding:"8px"
                }}
              />

              <div style={{marginTop:"10px"}}>

                <button
                  onClick={()=>approveLoan(loan.id)}
                  style={{
                    background:"green",
                    color:"#fff",
                    padding:"8px 12px",
                    marginRight:"10px",
                    border:"none",
                    borderRadius:"5px"
                  }}>
                  Approve
                </button>

                <button
                  onClick={()=>rejectLoan(loan.id)}
                  style={{
                    background:"red",
                    color:"#fff",
                    padding:"8px 12px",
                    border:"none",
                    borderRadius:"5px"
                  }}>
                  Reject
                </button>

              </div>

            </div>
          ))}

        </div>
      ))}
    </div>
  );
}
