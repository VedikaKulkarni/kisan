import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';

const Cancel = () => {
    const navigate = useNavigate();

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <Card className="text-center p-5 shadow border-0">
                <Card.Body>
                    <div className="mb-3">
                        <i className="bi bi-exclamation-circle-fill text-warning" style={{ fontSize: '4rem' }}></i>
                    </div>
                    <h2 className="mb-3 text-dark">Payment Cancelled</h2>
                    <p className="text-muted">You have cancelled the payment process. No charges were made.</p>
                    <Button variant="outline-primary" onClick={() => navigate('/my-orders')}>
                        Return to Orders
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Cancel;
