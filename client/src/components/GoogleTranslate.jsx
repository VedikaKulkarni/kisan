import React, { useEffect } from "react";

const GoogleTranslate = () => {
    useEffect(() => {
        if (!document.getElementById("google-translate-script")) {
            const script = document.createElement("script");
            script.id = "google-translate-script";
            script.src =
                "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);

            window.googleTranslateElementInit = () => {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: "en",
                        includedLanguages: "en,hi,mr,gu,ta,te,bn,kn,ml,pa",
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                        autoDisplay: false,
                    },
                    "google_translate_element"
                );
            };
        }
    }, []);

    return (
        <div className="d-inline-block p-2 bg-light rounded shadow-sm">
            <div id="google_translate_element"></div>

            {/* Custom styling for Google Translate widget */}
            <style>{`
                .goog-te-gadget-simple {
                    background-color: transparent !important;
                    border: none !important;
                    padding: 0 !important;
                    font-family: inherit !important;
                }

                .goog-te-gadget-simple .goog-te-menu-value {
                    color: #198754 !important; /* Bootstrap success */
                    font-weight: 600 !important;
                }

                .goog-te-gadget-icon {
                    display: none !important;
                }

                .goog-te-banner-frame {
                    display: none !important;
                }

                body {
                    top: 0px !important;
                }

                /* Hide "Powered by Google" */
                .goog-logo-link {
                    display: none !important;
                }

                .goog-te-gadget {
                    height: 28px !important;
                    overflow: hidden;
                    font-size: 14px !important;
                }
            `}</style>
        </div>
    );
};

export default GoogleTranslate;
