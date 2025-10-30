import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken, getUser } from '../utils/api';
import { Container, Table, Button } from 'react-bootstrap';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const user = getUser();

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await axios.get('http://localhost:5000/api/students', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setStudents(res.data);
    };
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (user.role === 'admin') {
      await axios.delete(`http://localhost:5000/api/students/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setStudents(students.filter((s) => s._id !== id));
    }
  };

  return (
    <Container className="mt-5">
      <h1>Student Placement Tracker</h1>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Company</th>
            {user.role === 'admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.placementStatus}</td>
              <td>{student.company}</td>
              {user.role === 'admin' && (
                <td>
                  <Button variant="danger" onClick={() => handleDelete(student._id)}>Delete</Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Dashboard;