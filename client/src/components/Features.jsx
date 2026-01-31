import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Features = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleAuth = () => {
        navigate(`/login`);
    };

    return (
        <section id="features" className="py-5 bg-light">
            <Container>
                <Row className="g-4">

                    {/* Farmers */}
                    <Col md={6}>
                        <Card className="h-100 shadow border-0 rounded-4 position-relative">
                            <Card.Body className="p-4 d-flex flex-column">

                                <div className="mb-4 text-success fs-1">
                                    <i className="fa-solid fa-seedling"></i>
                                </div>

                                <h2 className="fw-bold mb-3">
                                    {t('features.farmers.title')}
                                </h2>

                                <p className="text-muted mb-4">
                                    {t('features.farmers.description')}
                                </p>

                                <ul className="list-unstyled mb-4">
                                    <li className="mb-2">
                                        <i className="fa-solid fa-check-circle text-success me-2"></i>
                                        {t('features.farmers.f1')}
                                    </li>
                                    <li className="mb-2">
                                        <i className="fa-solid fa-check-circle text-success me-2"></i>
                                        {t('features.farmers.f2')}
                                    </li>
                                    <li className="mb-2">
                                        <i className="fa-solid fa-check-circle text-success me-2"></i>
                                        {t('features.farmers.f3')}
                                    </li>
                                </ul>

                                <Button
                                    variant="success"
                                    size="lg"
                                    className="mt-auto"
                                    onClick={() => handleAuth()}
                                >
                                    {t('navbar.login')} / Register as Farmer
                                </Button>

                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Buyers */}
                    <Col md={6}>
                        <Card className="h-100 shadow border-0 rounded-4">
                            <Card.Body className="p-4 d-flex flex-column">

                                <div className="mb-4 text-primary fs-1">
                                    <i className="fa-solid fa-store"></i>
                                </div>

                                <h2 className="fw-bold mb-3">
                                    {t('features.buyers.title')}
                                </h2>

                                <p className="text-muted mb-4">
                                    {t('features.buyers.description')}
                                </p>

                                <ul className="list-unstyled mb-4">
                                    <li className="mb-2">
                                        <i className="fa-solid fa-check-circle text-primary me-2"></i>
                                        {t('features.buyers.f1')}
                                    </li>
                                    <li className="mb-2">
                                        <i className="fa-solid fa-check-circle text-primary me-2"></i>
                                        {t('features.buyers.f2')}
                                    </li>
                                    <li className="mb-2">
                                        <i className="fa-solid fa-check-circle text-primary me-2"></i>
                                        {t('features.buyers.f3')}
                                    </li>
                                </ul>

                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="mt-auto"
                                    onClick={() => handleAuth()}
                                >
                                    {t('navbar.login')} / Register as Buyer
                                </Button>

                            </Card.Body>
                        </Card>
                    </Col>

                </Row>
            </Container>
        </section>
    );
};

export default Features;
