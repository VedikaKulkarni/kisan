import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Badge, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const FarmerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionMsg, setActionMsg] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('/orders/farmer-orders');
            setOrders(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, status) => {
        try {
            await axios.put(`/orders/${orderId}/status`, { status });
            setActionMsg(`Order ${status} successfully!`);
            fetchOrders(); // Refresh list
            setTimeout(() => setActionMsg(''), 3000);
        } catch (err) {
            console.error(err);
            alert('Failed to update status');
        }
    };

    if (loading) return <Container className="text-center mt-5"><Spinner animation="border" variant="success" /></Container>;

    return (
        <Container className="mt-4 pb-5">
            <h2 className="mb-4 text-success fw-bold">Farmer's Order Book 📜</h2>
            {actionMsg && <Alert variant="success" className="shadow-sm">{actionMsg}</Alert>}

            {orders.length === 0 ? (
                <div className="text-center py-5 text-muted bg-light rounded shadow-sm">
                    <h4>No active orders found.</h4>
                    <p>When consumers buy your products, they will appear here.</p>
                </div>
            ) : (
                <Row>
                    {orders.map(order => (
                        <Col key={order._id} md={6} lg={4} className="mb-4">
                            <Card className="h-100 shadow-sm border-0 border-top border-success border-4">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <Badge bg={
                                            order.order_status === 'paid' || order.order_status === 'completed' ? 'success' :
                                                order.order_status === 'rejected' ? 'danger' :
                                                    order.order_status === 'approved' ? 'info' : 'warning'
                                        } className="p-2">
                                            {order.order_status.toUpperCase()}
                                        </Badge>
                                        <small className="text-muted">{new Date(order.order_date).toLocaleDateString()}</small>
                                    </div>

                                    <div className="d-flex align-items-center mb-4">
                                        <img
                                            src={order.product_id?.image_url || 'https://via.placeholder.com/60px'}
                                            alt=""
                                            className="rounded"
                                            style={{ width: '60px', height: '60px', objectFit: 'cover', border: '1px solid #eee' }}
                                        />
                                        <div className="ms-3">
                                            <h5 className="mb-0 fw-bold text-dark">{order.product_id?.crop_name}</h5>
                                            <p className="mb-0 text-muted small">{order.requested_quantity} kg requested</p>
                                        </div>
                                    </div>

                                    <div className="bg-light p-3 rounded mb-4">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted small">Offer Price:</span>
                                            <span className="fw-bold text-success">₹{order.negotiated_price || order.original_price}/kg</span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span className="text-muted small text-uppercase fw-bold">Total Amount:</span>
                                            <span className="fw-bold fs-5 text-primary">₹{(order.negotiated_price || order.original_price) * order.requested_quantity}</span>
                                        </div>
                                    </div>

                                    <hr />

                                    <div className="mb-4">
                                        <p className="mb-1 small text-muted text-uppercase fw-bold">Buyer Details</p>
                                        <h6 className="mb-0 fw-bold">{order.consumer_id?.name || 'Valued Customer'}</h6>
                                        <p className="text-muted small mb-0">{order.consumer_id?.phone}</p>
                                    </div>

                                    <div className="d-grid gap-2">
                                        {order.order_status === 'requested' && (
                                            <>
                                                <Row className="g-2">
                                                    <Col xs={6}>
                                                        <Button
                                                            variant="success"
                                                            className="w-100"
                                                            onClick={() => handleStatusUpdate(order._id, 'approved')}
                                                        >
                                                            Accept
                                                        </Button>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <Button
                                                            variant="outline-danger"
                                                            className="w-100"
                                                            onClick={() => handleStatusUpdate(order._id, 'rejected')}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </>
                                        )}
                                        {order.order_status === 'paid' && (
                                            <Button
                                                variant="primary"
                                                onClick={() => handleStatusUpdate(order._id, 'completed')}
                                            >
                                                🚚 Mark as Delivered
                                            </Button>
                                        )}

                                        {/* REAL-TIME CHAT BUTTON */}
                                        <Button
                                            variant="outline-primary"
                                            className="d-flex align-items-center justify-content-center"
                                            onClick={() => navigate(`/chat/${order.consumer_id?._id}`)}
                                        >
                                            <i className="bi bi-chat-dots-fill me-2"></i> Chat with Buyer
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default FarmerOrders;
