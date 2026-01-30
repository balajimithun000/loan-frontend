import { useState } from "react";
import API from "../api/axiosConfig";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function UploadDocument({ loanId }) {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("loanId", loanId);
      formData.append("documentType", documentType);
      formData.append("file", file);

      await API.post("/api/users/documents/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Document uploaded successfully!");

      // ⭐ redirect to profile
      setTimeout(() => navigate("/profile"), 800);

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data ||
        "Upload failed"
      );
    }
  };

  return (
    <div style={{ marginTop: "15px" }}>
      <h3>Upload Required Documents</h3>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <form onSubmit={handleUpload}>
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          required
        >
          <option value="">Select Document</option>
          <option value="AADHAAR">Aadhaar</option>
          <option value="PAN">PAN</option>
          <option value="BANK_STATEMENT">Bank Statement</option>
          <option value="SALARY_SLIP">Salary Slip</option>
        </select>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />

        <Button type="submit">Upload</Button>
      </form>
    </div>
  );
}
