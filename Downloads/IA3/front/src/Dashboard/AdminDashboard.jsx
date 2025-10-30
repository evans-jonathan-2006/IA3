import React, { useEffect, useState } from "react";
import adminApi from "../utils/adminApi";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function AdminDashboard() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all placement data
  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        const res = await adminApi.get("/placements"); // backend route
        setPlacements(res.data);
      } catch (error) {
        console.error("Error fetching placement data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlacements();
  }, []);

  // Calculate stats
  const total = placements.length;
  const accepted = placements.filter((p) => p.placementStatus === "Accepted").length;
  const rejected = placements.filter((p) => p.placementStatus === "Rejected").length;
  const pending = placements.filter((p) => p.placementStatus === "Pending").length;

  const pieData = [
    { name: "Accepted", value: accepted },
    { name: "Rejected", value: rejected },
    { name: "Pending", value: pending },
  ];

  const COLORS = ["#28a745", "#dc3545", "#ffc107"];

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-primary">📊 Admin Dashboard</h2>

      {/* Pie Chart */}
      <div className="card p-4 shadow mb-4">
        <h5 className="mb-3">Placement Summary</h5>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Placement Table */}
      <div className="card p-4 shadow">
        <h5 className="mb-3">All Student Placement Entries</h5>
        {placements.length > 0 ? (
          <table className="table table-striped table-hover">
            <thead className="table-primary">
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Status</th>
                <th>LPA</th>
              </tr>
            </thead>
            <tbody>
              {placements.map((p, index) => (
                <tr key={index}>
                  <td>{p.name}</td>
                  <td>{p.companyName}</td>
                  <td>
                    <span
                      className={`badge ${
                        p.placementStatus === "Accepted"
                          ? "bg-success"
                          : p.placementStatus === "Rejected"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {p.placementStatus}
                    </span>
                  </td>
                  <td>{p.lpa ? `${p.lpa} LPA` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-muted">No placement data available.</p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
