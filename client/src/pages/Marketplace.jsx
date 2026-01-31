import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Badge, Spinner, Form } from 'react-bootstrap';
import OrderModal from '../components/OrderModal';

const Marketplace = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    // Search and Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('/products');
                setProducts(res.data);
                setFilteredProducts(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        let result = products;

        if (searchTerm) {
            result = result.filter(product =>
                product.crop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.sell_location?.district.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (maxPrice) {
            result = result.filter(product => product.price <= parseFloat(maxPrice));
        }

        if (category) {
            result = result.filter(product => product.category === category);
        }

        setFilteredProducts(result);
    }, [searchTerm, maxPrice, category, products]);

    const handleOrderClick = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;

    return (
        <Container>
            <h2 className="mb-4 text-center">Fresh from Farms</h2>

            {/* Search and Filter Section */}
            <Row className="mb-4 d-flex justify-content-center">
                <Col md={5} className="mb-2">
                    <Form.Control
                        type="text"
                        placeholder="Search crops or district..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
                <Col md={3} className="mb-2">
                    <Form.Control
                        type="number"
                        placeholder="Max Price (₹)"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </Col>
                <Col md={3} className="mb-2">
                    <Form.Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="Vegetables">Vegetables</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Grains">Grains</option>
                        <option value="Others">Others</option>
                    </Form.Select>
                </Col>
            </Row>

            <Row>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <Col md={4} key={product._id} className="mb-4">
                            <Card className="h-100 shadow-sm">
                                <Card.Img variant="top" src={product.image_url || 'https://via.placeholder.com/300x200?text=Farm+Produce'} style={{ height: '200px', objectFit: 'cover' }} />
                                <Card.Body className="d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <Card.Title>{product.crop_name}</Card.Title>
                                        <Badge bg="success">₹{product.price}/kg</Badge>
                                    </div>
                                    <Card.Text className="text-muted small mb-1 d-flex justify-content-between align-items-center">
                                        <span>From: {product.farmer_id.name}</span>
                                        {product.rating?.count > 0 && (
                                            <span className="text-warning fw-bold">
                                                {product.rating.average} <i className="bi bi-star-fill small"></i>
                                            </span>
                                        )}
                                    </Card.Text>
                                    <Card.Text className="text-muted small">
                                        {product.sell_location.village}, {product.sell_location.district}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Available:</strong> {product.quantity} kg
                                    </Card.Text>

                                    <Button
                                        variant="outline-primary"
                                        className="mt-auto w-100"
                                        onClick={() => navigate(`/product/${product._id}`)}
                                    >
                                        View
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <div className="text-center w-100 mt-5">
                        <h5 className="text-muted">No products found matching your search.</h5>
                    </div>
                )}
            </Row>

            <OrderModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                product={selectedProduct}
            />
        </Container>
    );
};

export default Marketplace;
