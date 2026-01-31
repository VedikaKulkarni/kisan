import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Hero = () => {
    const { t } = useTranslation();

    const slides = [
        "/assets/hero_bg.jpg",
        "/assets/hero_bg_2.jpg",
        "/assets/hero_bg_3.jpg"
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <section className="position-relative vh-100 d-flex align-items-center justify-content-center overflow-hidden">

            {/* Background carousel */}
            <div className="position-absolute top-0 start-0 w-100 h-100 z-0">
                {slides.map((slide, index) => (
                    <img
                        key={index}
                        src={slide}
                        alt={`Hero Slide ${index + 1}`}
                        className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                    />
                ))}

                {/* Dark overlay */}
                <div className="hero-overlay"></div>
            </div>

            {/* Content */}
            <div className="position-relative z-2 container text-center text-white mt-5">
                <span className="badge rounded-pill bg-success bg-opacity-25 border border-success mb-4 px-3 py-2">
                    {t('hero.badge')}
                </span>

                <h1 className="display-3 fw-bold mb-4">
                    {t('hero.title')} <br />
                    <span className="text-success">{t('hero.subtitle')}</span>
                </h1>

                <p className="lead text-light mb-5 mx-auto" style={{ maxWidth: "600px" }}>
                    {t('hero.description')}
                </p>

                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                    <a
                        href="#features"
                        className="btn btn-success btn-lg px-4 shadow"
                    >
                        {t('hero.getStarted')}
                    </a>

                    <a
                        href="#live-prices"
                        className="btn btn-outline-light btn-lg px-4"
                    >
                        {t('hero.viewPrices')}
                    </a>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 text-white opacity-75">
                <i className="fa-solid fa-chevron-down fs-3"></i>
            </div>

            {/* Component CSS */}
            <style>{`
                .hero-slide {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    opacity: 0;
                    transition: opacity 1s ease-in-out;
                }

                .hero-slide.active {
                    opacity: 1;
                    z-index: 1;
                }

                .hero-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        to bottom,
                        rgba(0,0,0,0.6),
                        rgba(0,0,0,0.4),
                        rgba(0,0,0,0.7)
                    );
                    z-index: 2;
                }
            `}</style>
        </section>
    );
};

export default Hero;
