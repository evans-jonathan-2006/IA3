    // src/Auth/Signup.jsx
    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Form, Button, Container, Alert } from 'react-bootstrap';
    import api from '../utils/api'; // Use your configured API instance

    const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // default to 'user'
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
        await api.post('/auth/signup', { name, email, password, role });
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
        setError(err.response?.data?.msg || 'Registration failed. Please try again.');
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
            />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
            />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
            />
            </Form.Group>

            <Form.Group className="mb-4">
            <Form.Label>Role</Form.Label>
            <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="user">Student</option>
                <option value="admin">Admin</option>
            </Form.Select>
            </Form.Group>

            <Button variant="success" type="submit" className="w-100">
            Register
            </Button>
        </Form>
        </Container>
    );
    };

    export default Signup;
