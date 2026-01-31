import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelection = ({ onSelect }) => {
    const { i18n } = useTranslation();

    const handleLanguageSelect = (lang) => {
        // Google Translate cookie
        document.cookie = `googtrans=/en/${lang}; path=/; domain=${window.location.hostname}`;

        // i18n internal translations
        i18n.changeLanguage(lang);
        onSelect();
    };

    return (
        <div
            className="vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden"
            style={{
                backgroundImage: "url('/assets/hero_bg.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* Dark overlay */}
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-75"></div>

            {/* Card */}
            <div className="position-relative z-2 container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className="card shadow-lg border-0 text-center p-4 p-md-5">

                            <div className="mb-4">
                                <i className="fa-solid fa-leaf text-success fs-1 mb-3"></i>
                                <h1 className="fw-bold mb-2">
                                    Welcome to <span className="text-success">KrushiBajar</span>
                                </h1>
                                <p className="text-muted mb-1">
                                    Select your preferred language to continue
                                </p>
                                <p className="text-muted small">
                                    जारी रखने के लिए अपनी पसंदीदा भाषा चुनें / पुढे जाण्यासाठी तुमची पसंतीची भाषा निवडा
                                </p>
                            </div>

                            <div className="d-grid gap-3">
                                <button
                                    onClick={() => handleLanguageSelect('en')}
                                    className="btn btn-light border d-flex justify-content-between align-items-center py-3 px-4 fw-semibold"
                                >
                                    <span className="fs-5">English</span>
                                    <i className="fa-solid fa-arrow-right text-secondary"></i>
                                </button>

                                <button
                                    onClick={() => handleLanguageSelect('hi')}
                                    className="btn btn-light border d-flex justify-content-between align-items-center py-3 px-4 fw-semibold"
                                >
                                    <span className="fs-5">हिंदी (Hindi)</span>
                                    <i className="fa-solid fa-arrow-right text-secondary"></i>
                                </button>

                                <button
                                    onClick={() => handleLanguageSelect('mr')}
                                    className="btn btn-light border d-flex justify-content-between align-items-center py-3 px-4 fw-semibold"
                                >
                                    <span className="fs-5">मराठी (Marathi)</span>
                                    <i className="fa-solid fa-arrow-right text-secondary"></i>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Footer text */}
            <div className="position-absolute bottom-0 mb-3 text-white opacity-75 small">
                KrushiBajar © 2026
            </div>
        </div>
    );
};

export default LanguageSelection;
