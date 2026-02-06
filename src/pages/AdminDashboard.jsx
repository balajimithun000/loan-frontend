import { useEffect, useState } from "react";
import API from "../api/axiosConfig";

export default function AdminDashboard() {

  const [data,setData]=useState([]);

  useEffect(()=>{
    API.get("/admin/dashboard")
      .then(res=>setData(res.data));
  },[]);

  const approve=async(id)=>{
    const remarks=prompt("Enter approval remarks");
    await API.post(`/admin/approve/${id}`,null,{
      params:{remarks}
    });
    window.location.reload();
  };

  const reject=async(id)=>{
    const remarks=prompt("Enter reject remarks");
    await API.post(`/admin/reject/${id}`,null,{
      params:{remarks}
    });
    window.location.reload();
  };

  return(
    <div style={{padding:"30px"}}>
      <h2>Admin Dashboard</h2>

      {data.map(item=>(
        <div key={item.user.id}
          style={{
            border:"1px solid gray",
            margin:"20px",
            padding:"20px"
          }}>

          <h3>{item.user.name}</h3>
          <p>{item.user.email}</p>
          <p>{item.user.phone}</p>
          <p>Salary ₹{item.user.salary}</p>

          {item.pendingLoans.map(loan=>(
            <div key={loan.id}
              style={{
                border:"1px solid #ccc",
                marginTop:"10px",
                padding:"10px"
              }}>

              <p>Loan Type: {loan.loanType}</p>
              <p>Amount: ₹{loan.loanAmount}</p>
              <p>EMI: ₹{loan.emi}</p>
              <p>Interest: {loan.interestRate}%</p>
              <p>Status: {loan.status}</p>
              <p>Remarks: {loan.remarks}</p>

              <button onClick={()=>approve(loan.id)}>
                Approve
              </button>

              <button onClick={()=>reject(loan.id)}>
                Reject
              </button>

            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
