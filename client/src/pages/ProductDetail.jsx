import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Image, Button, Card, Badge, Spinner } from 'react-bootstrap';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [ratingStats, setRatingStats] = useState({ average: 0, count: 0 });

    useEffect(() => {
        const fetchProductAndRating = async () => {
            try {
                const res = await axios.get(`/products/${id}`);
                setProduct(res.data);

                if (res.data.farmer_id?._id) {
                    try {
                        const [rateRes, reviewRes] = await Promise.all([
                            axios.get(`/reviews/stats/${res.data.farmer_id._id}`),
                            axios.get(`/reviews/farmer/${res.data.farmer_id._id}`)
                        ]);
                        setRatingStats(rateRes.data);
                        setReviews(reviewRes.data);
                    } catch (ignore) {
                        // ignore rating fetch fail
                    }
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load product details.');
            } finally {
                setLoading(false);
            }
        };
        fetchProductAndRating();
    }, [id]);

    if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;
    if (error) return <Container className="text-center mt-5 text-danger">{error}</Container>;
    if (!product) return <Container className="text-center mt-5">Product not found.</Container>;

    return (
        <Container className="mt-5">
            <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-3">
                &larr; Back
            </Button>
            <Card className="shadow-lg border-0">
                <Row className="g-0">
                    <Col md={6}>
                        <Image
                            src={product.image_url || 'https://via.placeholder.com/600x400?text=Farm+Produce'}
                            fluid
                            roundedStart
                            style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '400px' }}
                        />
                    </Col>
                    <Col md={6}>
                        <Card.Body className="p-4 d-flex flex-column h-100">
                            <div className="d-flex justify-content-between align-items-start">
                                <Card.Title as="h2" className="display-6 fw-bold">{product.crop_name}</Card.Title>
                                <Badge bg="success" className="fs-5">₹{product.price}/kg</Badge>
                            </div>

                            <hr />

                            <div className="mb-4">
                                <h5 className="text-muted mb-3">Farmer Details</h5>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <p className="mb-0 fs-5"><strong>{product.farmer_id?.name || 'Unknown'}</strong></p>
                                    <div className="text-warning">
                                        <span className="fw-bold me-1">{ratingStats.average}</span>
                                        <i className="bi bi-star-fill"></i>
                                        <span className="text-muted small ms-1">({ratingStats.count} reviews)</span>
                                    </div>
                                </div>
                                <p className="mb-1">
                                    <strong>Location:</strong> {product.sell_location?.village}, {product.sell_location?.district}
                                </p>
                            </div>

                            <div className="mb-4">
                                <h5 className="text-muted mb-3">Product Info</h5>
                                <p className="mb-1"><strong>Available Quantity:</strong> {product.quantity} kg</p>
                                {/* Description could be added here if it existed in the schema */}
                            </div>

                            <div className="mt-auto">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-100"
                                    onClick={() => navigate(`/buy/${product._id}`)}
                                >
                                    Buy Now
                                </Button>
                            </div>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>

            {/* Reviews Section */}
            <div className="mt-5">
                <h3 className="mb-4">Farmer Reviews</h3>
                <Row>
                    <Col md={8}>
                        {reviews.length > 0 ? (
                            reviews.map(review => (
                                <Card key={review._id} className="mb-3 border-0 shadow-sm">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="mb-0 fw-bold">{review.consumer_id?.name}</h6>
                                            <div className="text-warning">
                                                {Array(review.rating).fill().map((_, i) => <i key={i} className="bi bi-star-fill small"></i>)}
                                            </div>
                                        </div>
                                        <p className="text-muted mb-1 small">
                                            Reviewed for: <strong>{review.product_id?.crop_name}</strong>
                                        </p>
                                        <p className="mb-0 text-dark">"{review.comment}"</p>
                                    </Card.Body>
                                </Card>
                            ))
                        ) : (
                            <Card className="p-5 text-center text-muted border-0 bg-light">
                                <p className="mb-0">No reviews yet for this farmer. Be the first to buy and share your experience!</p>
                            </Card>
                        )}
                    </Col>
                    <Col md={4}>
                        <Card className="border-0 shadow-sm bg-success text-white">
                            <Card.Body className="text-center py-4">
                                <h1>{ratingStats.average}</h1>
                                <div>
                                    {Array(Math.round(ratingStats.average)).fill().map((_, i) => <i key={i} className="bi bi-star-fill fs-5"></i>)}
                                </div>
                                <p className="mb-0 mt-2">Overall Farmer Rating</p>
                                <small className="opacity-75">Based on {ratingStats.count} reviews</small>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Container>
    );
};

export default ProductDetail;
