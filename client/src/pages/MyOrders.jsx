import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Badge, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get('/orders/my-orders');
                setOrders(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handlePay = async (orderId, productName, amount) => {
        try {
            const res = await axios.post('/payments/create-checkout-session', {
                order_id: orderId,
                product_name: productName,
                amount: amount
            });
            // Redirect to Stripe Checkout
            window.location.href = res.data.url;
        } catch (err) {
            alert("Payment Initiation Failed: " + (err.response?.data?.msg || err.message));
        }
    };

    // // Dev Helper to Approve Orders (Since we don't have farmer dashboard yet)
    // const devApproveOrder = async (orderId) => {
    //     try {
    //         await axios.put(`/orders/${orderId}/status`, { status: 'approved', final_price: 0 }); // 0 final price means using negotiated price fallback logic in payment if needed or just status update
    //         const updatedOrders = orders.map(o => {
    //             if (o._id === orderId) return { ...o, order_status: 'approved' };
    //             return o;
    //         });
    //         setOrders(updatedOrders);
    //     } catch (err) {
    //         console.error(err);
    //         alert("Dev Approve Failed");
    //     }
    // };

    if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Orders</h2>
                <small className="text-muted">Dev Hint: Use "Force Approve" to test payment flow</small>
            </div>
            <Table striped bordered hover responsive className="align-middle">
                <thead className="bg-light">
                    <tr>
                        <th>Product</th>
                        <th>Farmer</th>
                        <th>Qty</th>
                        <th>Price/kg</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                            <td>
                                <div className="d-flex align-items-center">
                                    <img
                                        src={order.product_id?.image_url || 'https://via.placeholder.com/50'}
                                        alt={order.product_id?.crop_name || 'Product Unavailable'}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', marginRight: '15px' }}
                                    />
                                    <div>
                                        <div className="fw-bold">{order.product_id?.crop_name || 'Unknown Product'}</div>
                                        <small className="text-muted">{new Date(order.order_date).toLocaleDateString()}</small>
                                    </div>
                                </div>
                            </td>
                            <td>{order.farmer_id.name}</td>
                            <td>{order.requested_quantity} kg</td>
                            <td>₹{order.negotiated_price}</td>
                            <td className="fw-bold">₹{order.requested_quantity * order.negotiated_price}</td>
                            <td>
                                {order.payment_method === 'Cash' ? (
                                    <Badge bg="secondary">CASH</Badge>
                                ) : (
                                    <Badge bg="info">ONLINE</Badge>
                                )}
                            </td>
                            <td>
                                <Badge bg={
                                    order.order_status === 'approved' ? 'info' :
                                        order.order_status === 'paid' ? 'success' :
                                            order.order_status === 'rejected' ? 'danger' : 'warning'
                                }>
                                    {order.order_status.toUpperCase()}
                                </Badge>
                            </td>
                            <td>
                                <Link to={`/chat/${order.farmer_id._id}`} className="btn btn-sm btn-outline-primary me-2">
                                    <i className="bi bi-chat-dots-fill"></i> Chat
                                </Link>

                                {/* {order.order_status === 'requested' && (
                                    <Button
                                        size="sm"
                                        variant="outline-secondary"
                                        className="me-2"
                                        onClick={() => devApproveOrder(order._id)}
                                        title="Dev: Force Approve"
                                    >
                                        <i className="bi bi-check-lg"></i> Dev Approve
                                    </Button>
                                )} */}

                                {order.order_status === 'approved' && order.payment_method === 'Online' && (
                                    <Button
                                        size="sm"
                                        className="btn-primary"
                                        onClick={() => handlePay(order._id, order.product_id?.crop_name || 'Product', order.requested_quantity * order.negotiated_price)}
                                    >
                                        <i className="bi bi-credit-card-fill"></i> Pay With Stripe
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default MyOrders;
