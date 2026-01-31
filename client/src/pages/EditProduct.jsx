import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        crop_name: '',
        quantity: '',
        price: '',
        image_url: '',
        status: ''
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`/products/${id}`);
                setFormData({
                    crop_name: res.data.crop_name,
                    quantity: res.data.quantity,
                    price: res.data.price,
                    image_url: res.data.image_url,
                    status: res.data.status || 'active'
                });
                setLoading(false);
            } catch (err) {
                console.error(err);
                setMessage({ type: 'danger', text: 'Failed to fetch product details' });
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/products/${id}`, formData);
            setMessage({ type: 'success', text: 'Product updated successfully!' });
            setTimeout(() => navigate('/my-products'), 1500);
        } catch (err) {
            console.error(err);
            setMessage({ type: 'danger', text: 'Failed to update product' });
        }
    };

    if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;

    return (
        <Container className="d-flex justify-content-center mt-5 mb-5">
            <Card className="shadow-lg border-0" style={{ maxWidth: '600px', width: '100%' }}>
                <Card.Header className="bg-warning text-white text-center py-3">
                    <h3 className="mb-0">Edit Product</h3>
                </Card.Header>
                <Card.Body className="p-4">
                    {message.text && <Alert variant={message.type}>{message.text}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Crop Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="crop_name"
                                value={formData.crop_name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <Form.Label>Quantity (kg)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <Form.Label>Price per kg (₹)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control
                                type="text"
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select name="status" value={formData.status} onChange={handleChange}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Form.Select>
                        </Form.Group>

                        <div className="d-grid gap-2 mt-4">
                            <Button variant="primary" size="lg" type="submit">
                                Save Changes
                            </Button>
                            <Button variant="outline-secondary" onClick={() => navigate('/my-products')}>
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EditProduct;
