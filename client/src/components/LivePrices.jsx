import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from 'axios';
import { Table, Badge } from 'react-bootstrap';

const LivePrices = () => {
  const { t } = useTranslation();
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPrices = async (query = "") => {
    setLoading(true);
    try {
      // If query exists, search specific commodity. Else fetch default bulk list.
      const url = query ? `/mandi?commodity=${encodeURIComponent(query)}` : '/mandi';
      const res = await axios.get(url);
      if (res.data.records) {
        setPrices(res.data.records);
      } else {
        setPrices([]);
      }
    } catch (err) {
      console.error("Failed to fetch prices", err);
      setPrices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      fetchPrices(searchTerm);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleViewAll = () => {
    setSearchTerm("");
    fetchPrices();
  };

  const getCropIcon = (name) => {
    if (!name) return '🌱';
    const n = name.toLowerCase();
    if (n.includes('wheat')) return '🌾';
    if (n.includes('rice')) return '🍚';
    if (n.includes('onion')) return '🧅';
    if (n.includes('potato')) return '🥔';
    if (n.includes('tomato')) return '🍅';
    if (n.includes('maize')) return '🌽';
    if (n.includes('apple')) return '🍎';
    if (n.includes('banana')) return '🍌';
    if (n.includes('cotton')) return '🌿';
    if (n.includes('soybean')) return '🫘';
    return '🥬';
  };

  // Convert prices to kg and find highlights
  const processedPrices = prices.map(p => ({
    ...p,
    pricePerKg: parseFloat((parseFloat(p.modal_price) / 100).toFixed(2))
  }));

  const maxPrice = processedPrices.length > 0 ? Math.max(...processedPrices.map(p => p.pricePerKg)) : null;
  const minPrice = processedPrices.length > 0 ? Math.min(...processedPrices.map(p => p.pricePerKg)) : null;

  return (
    <section id="live-prices" className="py-5 bg-white">
      <div className="container">

        {/* Header */}
        <div className="row align-items-end mb-4">
          <div className="col-md-6">
            <h2 className="fw-bold text-dark mb-2">
              {t("livePrices.title")}
            </h2>
            <p className="text-muted">
              {t("livePrices.subtitle")} - Maharashtra Markets
            </p>
          </div>

          <div className="col-md-6 d-flex gap-3 justify-content-md-end mt-3 mt-md-0">
            {/* Search Bar */}
            <div className="position-relative w-100 w-md-auto" style={{ maxWidth: "260px" }}>
              <i
                className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                style={{ cursor: 'pointer' }}
                onClick={handleSearch}
              ></i>
              <input
                type="text"
                className="form-control ps-5 rounded-pill"
                placeholder={t("livePrices.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>
            <button
              className="btn btn-link fw-semibold text-success d-none d-md-inline"
              onClick={handleViewAll}
            >
              {t("livePrices.viewAll")} <i className="bi bi-arrow-right ms-1"></i>
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="border rounded-4 overflow-hidden shadow-sm">
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Table striped bordered hover size="sm" responsive className="mb-0 align-middle text-center">
              <thead className="table-light sticky-top" style={{ zIndex: 1 }}>
                <tr>
                  <th className="py-3">Crop</th>
                  <th className="py-3">Market Location</th>
                  <th className="py-3">Price (₹/kg)</th>
                  <th className="py-3">Analysis</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="py-5 text-center text-muted">
                      <div className="spinner-border text-success spinner-border-sm me-2"></div>
                      Loading live market rates...
                    </td>
                  </tr>
                ) : processedPrices.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-5 text-center text-muted">
                      No live market data found.
                    </td>
                  </tr>
                ) : (
                  processedPrices.map((crop, i) => {
                    const isHigh = crop.pricePerKg === maxPrice && processedPrices.length > 1;
                    const isLow = crop.pricePerKg === minPrice && processedPrices.length > 1;
                    return (
                      <tr key={i} className={isHigh ? "table-success-soft" : ""}>
                        <td className="fw-bold text-start ps-4">
                          <span className="me-2 fs-5">{getCropIcon(crop.commodity)}</span>
                          {crop.commodity}
                        </td>
                        <td className="text-muted">
                          {crop.market}, {crop.district}
                        </td>
                        <td className="fw-bold text-dark fs-5">
                          ₹{crop.pricePerKg}
                        </td>
                        <td>
                          {isHigh && <Badge bg="success" pill>Highest <i className="bi bi-caret-up-fill"></i></Badge>}
                          {isLow && <Badge bg="danger" pill>Lowest <i className="bi bi-caret-down-fill"></i></Badge>}
                          {!isHigh && !isLow && <span className="text-muted small">-</span>}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </div>
        </div>

      </div>

      {/* Custom Soft Highlight Style */}
      <style>{`
        .table-success-soft {
            background-color: rgba(25, 135, 84, 0.05) !important;
        }
`}</style>
    </section>
  );
};

export default LivePrices;
