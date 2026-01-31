import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'consumer',
        village: '',
        district: '',
        state: ''
    });
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const { name, phone, email, password, confirmPassword, village, district, state } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        const result = await register({ ...formData });
        if (result.success) {
            if (result.user.role === 'farmer') {
                navigate('/farmer-dashboard');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError(result.msg);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center my-5">
            <Row className="w-100 justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow-lg p-4">
                        <Card.Body>
                            <h2 className="text-center mb-4 text-primary">Register</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={onSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Full Name</Form.Label>
                                            <Form.Control type="text" name="name" value={name} onChange={onChange} required />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Phone</Form.Label>
                                            <Form.Control type="text" name="phone" value={phone} onChange={onChange} required />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control type="email" name="email" value={email} onChange={onChange} required />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control type="password" name="password" value={password} onChange={onChange} required />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Confirm Password</Form.Label>
                                            <Form.Control type="password" name="confirmPassword" value={confirmPassword} onChange={onChange} required />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3 d-flex align-items-center">
                                    <Form.Check
                                        type="switch"
                                        id="role-switch"
                                        label="Register as Farmer"
                                        checked={formData.role === 'farmer'}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.checked ? 'farmer' : 'consumer' })}
                                        className="fw-bold text-success"
                                    />
                                </Form.Group>

                                <h5 className="mt-3 text-muted">Location Details</h5>
                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Village</Form.Label>
                                            <Form.Control type="text" name="village" value={village} onChange={onChange} required />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>District</Form.Label>
                                            <Form.Control type="text" name="district" value={district} onChange={onChange} required />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>State</Form.Label>
                                            <Form.Control type="text" name="state" value={state} onChange={onChange} required />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button variant="success" type="submit" className="w-100 mt-3 mb-3">
                                    Register
                                </Button>
                            </Form>
                            <div className="text-center">
                                Already have an account? <Link to="/login">Login Here</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
