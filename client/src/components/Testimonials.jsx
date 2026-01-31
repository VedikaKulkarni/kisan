import React from "react";
import { useTranslation } from "react-i18next";

const Testimonials = () => {
  const { t } = useTranslation();

  return (
    <section id="reviews" className="py-5 bg-light position-relative overflow-hidden">
      
      {/* Decorative blob (keep your custom CSS) */}
      <div className="blob blob-green position-absolute top-0 end-0 opacity-50"></div>

      <div className="container position-relative">
        <h2 className="text-center fw-bold mb-5 display-6 reveal-on-scroll">
          {t("testimonials.title")}
        </h2>

        <div className="row g-4">
          <div className="col-md-4">
            <ReviewCard
              initial="RP"
              name="Ramesh Patil"
              role={t("testimonials.r1.role")}
              roleColor="text-success"
              quote={t("testimonials.r1.quote")}
            />
          </div>

          <div className="col-md-4">
            <ReviewCard
              initial="AS"
              name="Anita Shah"
              role={t("testimonials.r2.role")}
              roleColor="text-primary"
              quote={t("testimonials.r2.quote")}
              delay="200ms"
            />
          </div>

          <div className="col-md-4">
            <ReviewCard
              initial="RM"
              name="Fresh Mart"
              role={t("testimonials.r3.role")}
              roleColor="text-secondary"
              quote={t("testimonials.r3.quote")}
              delay="400ms"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const ReviewCard = ({
  initial,
  name,
  role,
  roleColor,
  quote,
  delay = "0ms",
}) => (
  <div
    className="card h-100 border-0 shadow-sm reveal-on-scroll"
    style={{ transitionDelay: delay }}
  >
    <div className="card-body p-4">
      <div className="fs-1 text-success mb-3">“</div>

      <p className="text-muted fst-italic fs-5 mb-4">
        {quote}
      </p>

      <div className="d-flex align-items-center gap-3">
        <div
          className="rounded-circle bg-light d-flex align-items-center justify-content-center fw-bold text-secondary"
          style={{ width: "48px", height: "48px" }}
        >
          {initial}
        </div>

        <div>
          <h6 className="mb-0 fw-bold text-dark">{name}</h6>
          <small className={`fw-medium ${roleColor}`}>{role}</small>
        </div>
      </div>
    </div>
  </div>
);

export default Testimonials;
