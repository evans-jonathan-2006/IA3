import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const UserDashboard = () => {
  const { user } = useAuth();
  return (
    <div>
      <h1>User Dashboard</h1>
      <p>Welcome, {user?.name || user?.email}! Your role is {user?.role}.</p>
      <p>This page will show the list of students you are authorized to view/edit.</p>
    </div>
  );
};

export default UserDashboard;