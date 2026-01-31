import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Badge, Spinner, Button, Tabs, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [key, setKey] = useState('active');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('/products/my-products');
                setProducts(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`/products/${id}`);
                setProducts(products.filter(p => p._id !== id));
            } catch (err) {
                console.error("Failed to delete product", err);
                alert("Failed to delete product");
            }
        }
    };

    if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeProducts = products.filter(p => new Date(p.sell_date) >= today);
    const pastProducts = products.filter(p => new Date(p.sell_date) < today);

    const getImageUrl = (url) => {
        if (!url) return 'https://via.placeholder.com/300x200';
        if (url.startsWith('http')) return url;
        // If it's a relative path starting with 'uploads', prepend server URL
        if (url.startsWith('uploads') || url.startsWith('/uploads')) {
            return `/${url.replace(/^\//, '')}`;
        }
        // Fallback assuming it's just a filename in uploads
        return `/uploads/${url}`;
    };

    const renderProductList = (productList, emptyMsg) => {
        if (productList.length === 0) {
            return (
                <div className="text-center py-5 bg-light rounded">
                    <h4 className="text-muted">{emptyMsg}</h4>
                </div>
            );
        }
        return (
            <Row className="g-4">
                {productList.map(product => (
                    <Col xs={12} sm={6} md={4} key={product._id}>
                        <Card className="h-100 shadow-sm border-0">
                            <div style={{ height: '200px', overflow: 'hidden' }}>
                                <Card.Img
                                    variant="top"
                                    src={getImageUrl(product.image_url)}
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300x200?text=Image+Error"; }}
                                    style={{ height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <Card.Title className="mb-0 text-truncate" style={{ title: product.crop_name }}>{product.crop_name}</Card.Title>
                                    <Badge bg={product.status === 'active' ? 'success' : 'secondary'}>{product.status}</Badge>
                                </div>
                                <Card.Text className="text-muted small mb-3">
                                    Sell Date: {product.sell_date ? new Date(product.sell_date).toLocaleDateString() : 'N/A'}
                                </Card.Text>
                                <div className="d-flex justify-content-between fw-bold mb-3">
                                    <span className="text-success">₹{product.price}/kg</span>
                                    <span>{product.quantity} kg</span>
                                </div>
                                <div className="d-grid gap-2 d-md-flex">
                                    <Button variant="outline-primary" size="sm" className="flex-grow-1" onClick={() => navigate(`/edit-product/${product._id}`)}>
                                        <i className="bi bi-pencil me-1"></i> Edit
                                    </Button>
                                    <Button variant="outline-danger" size="sm" className="flex-grow-1" onClick={() => handleDelete(product._id)}>
                                        <i className="bi bi-trash me-1"></i> Delete
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        );
    };

    return (
        <Container>
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-4 mt-4 gap-3">
                <h2 className="text-success fw-bold mb-0">My Products</h2>
                <Button variant="success" className="w-100 w-sm-auto" onClick={() => navigate('/add-product')}>
                    + List New Product
                </Button>
            </div>

            <Tabs
                id="product-tabs"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-4"
            >
                <Tab eventKey="active" title={`Active Listings (${activeProducts.length})`}>
                    {renderProductList(activeProducts, "No active listings found.")}
                </Tab>
                <Tab eventKey="past" title={`Past Listings (${pastProducts.length})`}>
                    {renderProductList(pastProducts, "No past listings found.")}
                </Tab>
            </Tabs>
        </Container>
    );
};

export default MyProducts;
