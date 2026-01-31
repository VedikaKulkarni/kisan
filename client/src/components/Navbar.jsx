import React from "react";
import { useTranslation } from "react-i18next";
import GoogleTranslate from "./GoogleTranslate";

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <nav className="navbar navbar-expand-md fixed-top bg-white shadow-sm glass">
      <div className="container py-2">

        {/* Logo */}
        <a className="navbar-brand d-flex align-items-center gap-2" href="#">
          <i className="fa-solid fa-leaf text-success fs-4"></i>
          <span className="fw-bold fs-4 text-dark">
            Krushi<span className="text-success">Bajaar</span>
          </span>
        </a>

        {/* Toggle button for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav links */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav mx-auto mb-2 mb-md-0 fw-medium">
            <li className="nav-item">
              <a className="nav-link text-secondary" href="#">
                {t("navbar.home")}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-secondary" href="#live-prices">
                {t("navbar.livePrices")}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-secondary" href="#reviews">
                {t("navbar.reviews")}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-secondary" href="#">
                {t("navbar.aboutUs")}
              </a>
            </li>
          </ul>

          {/* Right actions */}
          <div className="d-flex align-items-center gap-3">
            <GoogleTranslate />

            {/* <button className="btn btn-link text-secondary fw-medium d-none d-sm-block">
              {t("navbar.login")}
            </button> */}

            <a
              href="#features"
              className="btn btn-success rounded-pill px-4 fw-semibold shadow"
            >
              {t("navbar.join")}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
