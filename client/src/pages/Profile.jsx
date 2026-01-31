import React, { useContext, useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
    const { user, setUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        village: '',
        district: '',
        state: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                email: user.email || '', // Email is typically read-only
                village: user.village || '',
                district: user.district || '',
                state: user.state || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put('/auth/profile', formData);
            setStatus({ type: 'success', msg: 'Profile updated successfully!' });
            setEditMode(false);
            // Update context user
            const updatedUser = { ...user, ...res.data };
            // Note: In a real app we might want a proper way to update context without full reload or weird state merge
            // But since 'setUser' is from context provider... we rely on how that provider is built.
            // Our AuthContext 'setUser' is just a useState setter, so this works locally.
            // However, we need to ensure the token remains if it was there.
            setUser(updatedUser);

        } catch (err) {
            console.error(err);
            setStatus({ type: 'danger', msg: 'Failed to update profile.' });
        }
    };

    return (
        <Container className="mt-4" style={{ maxWidth: '800px' }}>
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
                    <h4 className="mb-0 fw-bold">My Profile</h4>
                    <Button
                        variant={editMode ? "secondary" : "primary"}
                        onClick={() => {
                            setEditMode(!editMode);
                            setStatus({ type: '', msg: '' });
                        }}
                    >
                        {editMode ? 'Cancel Edit' : 'Edit Profile'}
                    </Button>
                </Card.Header>
                <Card.Body className="p-4">
                    {status.msg && <Alert variant={status.type}>{status.msg}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        disabled={true} // Email usually not editable
                                    />
                                    <Form.Text className="text-muted">Email cannot be changed.</Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Role</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={user?.role?.toUpperCase() || ''}
                                        disabled={true}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <h5 className="mt-4 mb-3 text-muted">Location Details</h5>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Village</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="village"
                                        value={formData.village}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>District</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>State</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {editMode && (
                            <div className="d-grid gap-2 mt-4">
                                <Button variant="success" type="submit" size="lg">
                                    Save Changes
                                </Button>
                            </div>
                        )}
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Profile;
