import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './Layout/Navbar.jsx';
import Login from './Auth/Login.jsx';
import Signup from './Auth/Signup.jsx';
import ChangePassword from './Auth/ChangePassword.jsx';
import AdminDashboard from './Dashboard/AdminDashboard.jsx';
import UserDashboard from './Dashboard/UserDashboard.jsx';
import UserManagement from './Dashboard/UserManagement.jsx';
import StudentOperations from './Dashboard/StudentOperations.jsx';
import ProtectedRoute from './Layout/ProtectedRoute.jsx';
import RoleSelect from './Auth/RoleSelect.jsx'; // ✅ Import this

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<RoleSelect />} /> {/* ✅ New role selection page */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route 
            path="/change-password" 
            element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} 
          />
          <Route 
            path="/admin" 
            element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/user" 
            element={<ProtectedRoute roles={['user']}><StudentOperations/></ProtectedRoute>} 
          />
          <Route 
            path="/admin" 
            element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} 
          />
          
          <Route 
            path="/admin/students" 
            element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
