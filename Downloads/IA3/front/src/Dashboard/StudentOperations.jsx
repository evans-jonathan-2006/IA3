import React, { useState, useEffect } from "react";
import api from "../utils/api";

function StudentOperations() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    name: "",
    companyName: "",
    placementStatus: "Pending",
    lpa: "",
  });

  // ✅ Fetch all placements from backend
  const fetchEntries = async () => {
    try {
      const res = await api.get("/placements"); // 🔹 Changed endpoint
      setEntries(res.data);
    } catch (err) {
      console.error("Error fetching placements:", err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/placements", form); // 🔹 Changed endpoint
      setForm({ name: "", companyName: "", placementStatus: "Pending", lpa: "" });
      fetchEntries();
    } catch (err) {
      console.error(err);
      alert("Error adding placement info");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center text-primary">Your Placement Info</h2>

      {/* Add Placement Info Card */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-success text-white">Add Placement Info</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={form.companyName}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <select
                name="placementStatus"
                value={form.placementStatus}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="mb-3">
              <input
                type="number"
                name="lpa"
                placeholder="LPA"
                value={form.lpa}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-success w-100">
              Add Info
            </button>
          </form>
        </div>
      </div>

      {/* Entries Table */}
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">Your Entries</div>
        <div className="card-body table-responsive">
          {entries.length > 0 ? (
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>LPA</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.name}</td>
                    <td>{entry.companyName}</td>
                    <td>
                      <span
                        className={
                          entry.placementStatus === "Accepted"
                            ? "badge bg-success"
                            : entry.placementStatus === "Rejected"
                            ? "badge bg-danger"
                            : "badge bg-warning text-dark"
                        }
                      >
                        {entry.placementStatus}
                      </span>
                    </td>
                    <td>{entry.lpa || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-muted text-center mb-0">
              No placement entries yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentOperations;
