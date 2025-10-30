import React from "react";
import { useNavigate } from "react-router-dom";

function RoleSelect() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate(`/login?role=${role}`); // send role to login page
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "80vh" }}>
      <h2 className="mb-4">Select Your Role</h2>
      <div>
        <button className="btn btn-primary m-2" onClick={() => handleRoleSelect("admin")}>
          Admin
        </button>
        <button className="btn btn-success m-2" onClick={() => handleRoleSelect("user")}>
          Student
        </button>
      </div>
    </div>
  );
}

export default RoleSelect;
