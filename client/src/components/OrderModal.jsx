import React, { useState } from 'react';
import { Modal, Button, Form, Image, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const OrderModal = ({ show, handleClose, product }) => {
    const [quantity, setQuantity] = useState(1);
    const [negotiatedPrice, setNegotiatedPrice] = useState(product?.price || 0);

    const handleSubmit = async () => {
        try {
            await axios.post('/orders', {
                product_id: product._id,
                farmer_id: product.farmer_id._id,
                requested_quantity: quantity,
                original_price: product.price,
                negotiated_price: negotiatedPrice
            });
            alert('Order Request Sent Successfully!');
            handleClose();
        } catch (err) {
            alert(err.response?.data?.msg || 'Error putting order');
        }
    };

    if (!product) return null;

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Place Order: {product.crop_name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={6}>
                        <Image src={product.image_url} fluid rounded className="mb-3" />
                        <h5>Farmer: {product.farmer_id.name}</h5>
                        <p>Location: {product.sell_location.village}, {product.sell_location.district}</p>
                        <p><strong>Available Qty:</strong> {product.quantity} kg</p>
                        <p><strong>Asked Price:</strong> ₹{product.price} / kg</p>
                    </Col>
                    <Col md={6}>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Quantity (kg)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    min="1"
                                    max={product.quantity}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Your Offer Price (₹ / kg)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={negotiatedPrice}
                                    onChange={(e) => setNegotiatedPrice(e.target.value)}
                                />
                                <Form.Text className="text-muted">
                                    Farmer asked for ₹{product.price}
                                </Form.Text>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Send Order Request
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderModal;
