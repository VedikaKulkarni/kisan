import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';

const BuyPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        quantity: '',
        negotiated_price: '',
        payment_method: 'Online' // Default to Online
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`/products/${id}`);
                setProduct(res.data);
                // Pre-fill quantity with 1 if available
                if (res.data.quantity > 0) {
                    setFormData(prev => ({ ...prev, quantity: 1 }));
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load product details.');
            } finally {
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
        setError(null);
        setSubmitting(true);

        const qty = parseFloat(formData.quantity);
        if (qty <= 0 || qty > product.quantity) {
            setError(`Please enter a valid quantity between 1 and ${product.quantity}.`);
            setSubmitting(false);
            return;
        }

        try {
            const payload = {
                product_id: product._id,
                farmer_id: product.farmer_id._id,
                requested_quantity: qty,
                original_price: product.price,
                negotiated_price: formData.negotiated_price ? parseFloat(formData.negotiated_price) : null,
                payment_method: formData.payment_method
            };

            await axios.post('/orders', payload);
            navigate('/my-orders');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || 'Failed to place order. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;
    if (!product) return <Container className="text-center mt-5">Product not found.</Container>;

    return (
        <Container className="mt-5 d-flex justify-content-center">
            <Card className="shadow p-4" style={{ maxWidth: '600px', width: '100%' }}>
                <h3 className="text-center mb-4">Complete Your Purchase</h3>

                <div className="mb-4 text-center">
                    <h5>{product.crop_name}</h5>
                    <p className="text-muted">Price: ₹{product.price}/kg | Available: {product.quantity} kg</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Quantity (kg)</Form.Label>
                        <Form.Control
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            min="1"
                            max={product.quantity}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Offer Your Price (₹/kg) <span className="text-muted">(Optional)</span></Form.Label>
                        <Form.Control
                            type="number"
                            name="negotiated_price"
                            value={formData.negotiated_price}
                            onChange={handleChange}
                            placeholder={`Leave blank to buy at ₹${product.price}`}
                        />
                        <Form.Text className="text-muted">
                            If left blank, the farmer's price (₹{product.price}) will be applied.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Payment Method</Form.Label>
                        <Form.Select
                            name="payment_method"
                            value={formData.payment_method}
                            onChange={handleChange}
                        >
                            <option value="Online">Online Payment</option>
                            <option value="Cash">Cash on Order</option>
                        </Form.Select>
                    </Form.Group>

                    <div className="d-grid gap-2">
                        <Button variant="success" type="submit" disabled={submitting}>
                            {submitting ? 'Processing...' : 'Place Order'}
                        </Button>
                        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
};

export default BuyPage;
