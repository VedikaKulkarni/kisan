import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-dark text-secondary pt-5 border-top border-secondary">
            <Container>

                {/* Top section */}
                <Row className="mb-4 gy-4">

                    {/* Brand */}
                    <Col md={3}>
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <i className="fa-solid fa-leaf text-success fs-5"></i>
                            <h5 className="text-white fw-bold mb-0">KrushiBajar</h5>
                        </div>
                        <p className="text-muted small">
                            {t('footer.tagline')}
                        </p>
                    </Col>

                    {/* Platform */}
                    <Col md={3}>
                        <h6 className="text-white fw-semibold mb-3">
                            {t('footer.h_platform')}
                        </h6>
                        <ul className="list-unstyled small">
                            <li className="mb-2 footer-link">{t('footer.browse')}</li>
                            <li className="mb-2 footer-link">{t('footer.rates')}</li>
                            <li className="mb-2 footer-link">{t('footer.farmerLogin')}</li>
                            <li className="mb-2 footer-link">{t('footer.buyerSignup')}</li>
                        </ul>
                    </Col>

                    {/* Company */}
                    <Col md={3}>
                        <h6 className="text-white fw-semibold mb-3">
                            {t('footer.h_company')}
                        </h6>
                        <ul className="list-unstyled small">
                            <li className="mb-2 footer-link">{t('navbar.aboutUs')}</li>
                            <li className="mb-2 footer-link">{t('footer.successStories')}</li>
                            <li className="mb-2 footer-link">{t('footer.contact')}</li>
                            <li className="mb-2 footer-link">{t('footer.privacy')}</li>
                        </ul>
                    </Col>

                    {/* Social */}
                    <Col md={3}>
                        <h6 className="text-white fw-semibold mb-3">
                            {t('footer.h_connect')}
                        </h6>
                        <div className="d-flex gap-3">
                            <a href="#" className="social-icon">
                                <i className="fa-brands fa-facebook-f"></i>
                            </a>
                            <a href="#" className="social-icon">
                                <i className="fa-brands fa-twitter"></i>
                            </a>
                            <a href="#" className="social-icon">
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                        </div>
                    </Col>

                </Row>

                {/* Bottom bar */}
                <Row className="border-top border-secondary pt-3 pb-4 text-muted small align-items-center">
                    <Col md={6} className="text-center text-md-start">
                        © 2026 KrushiBajar. All rights reserved.
                    </Col>
                    <Col md={6} className="text-center text-md-end">
                        VSM Hackathon Project
                    </Col>
                </Row>

            </Container>
        </footer>
    );
};

export default Footer;
