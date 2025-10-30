import React, { useState, useEffect } from "react";
import api from "./api"; // your axios instance

const PlacementForm = () => {
  const [placements, setPlacements] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    status: "Accepted",
    package: "",
  });

  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    const res = await api.get("/placements");
    setPlacements(res.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await api.post("/placements", formData);
    setPlacements([...placements, res.data]); // instantly show new entry
    setFormData({ name: "", company: "", status: "Accepted", package: "" });
  };

  return (
    <div>
      <h2>Your Placement Info</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
        />
        <select name="status" value={formData.status} onChange={handleChange}>
          <option>Accepted</option>
          <option>Pending</option>
          <option>Rejected</option>
        </select>
        <input
          name="package"
          placeholder="Package"
          value={formData.package}
          onChange={handleChange}
        />
        <button type="submit">Add Info</button>
      </form>

      <div>
        <h3>Your Entries</h3>
        {placements.length === 0 ? (
          <p>No placement entries yet.</p>
        ) : (
          placements.map((p, i) => (
            <p key={i}>
              {p.name} - {p.company} - {p.status} - {p.package} LPA
            </p>
          ))
        )}
      </div>
    </div>
  );
};

export default PlacementForm;
