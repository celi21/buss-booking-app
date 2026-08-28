import React, { useEffect } from "react";
import { Container, Card, Row, Col, Table, Badge } from "react-bootstrap";
import { useSelector } from "react-redux";
import { translateText } from "../utils/translation";
import {
  ShieldCheck,
  ClockHistory,
  CheckCircleFill,
  ExclamationTriangleFill,
  InfoCircleFill,
  TelephoneFill,
  FileEarmarkTextFill,
  LockFill,
  BagCheckFill,
  ShieldShaded,
} from "react-bootstrap-icons";

const Terms = () => {
  const selectedLanguage = useSelector(
    (state) => state.settings.selectedLanguage
  );

  const t = (key) => {
    return (
      (selectedLanguage && translateText(key, selectedLanguage.code)) || key
    );
  };

  useEffect(() => {
    document.title = `${t("Privacy Policy and Terms")} | Bueno Express`;
    window.scrollTo(0, 0);
  }, [selectedLanguage]);

  return (
    <Container className="py-5" style={{ maxWidth: "900px" }}>
      {/* HEADER SECTION */}
      <div className="text-center mb-5">
        <div
          className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle bg-primary text-white mb-3 shadow-sm"
          style={{ width: "70px", height: "70px" }}
        >
          <ShieldShaded size={36} />
        </div>
        <h1 className="fw-bold text-dark mb-2">{t("Privacy Policy and Terms")}</h1>
        <p className="text-muted lead mx-auto" style={{ maxWidth: "700px" }}>
          {t(
            "Please review our official customer terms, privacy practices, and transparent refund policies for Bueno Express."
          )}
        </p>
      </div>

      {/* SECTION 1: REFUND POLICY */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-5">
        <Card.Header className="bg-primary text-white py-3 px-4 d-flex align-items-center gap-2">
          <ClockHistory size={22} />
          <h3 className="h5 fw-bold mb-0 text-white">{t("REFUND POLICY")}</h3>
        </Card.Header>
        <Card.Body className="p-4 bg-white" style={{ lineHeight: "1.7" }}>
          <p className="text-secondary mb-4 fs-6">
            {t(
              "Bueno Express is committed to providing a fair and transparent refund policy that balances customer flexibility with operational reliability. Our tiered system ensures clarity and fairness for all travelers."
            )}
          </p>

          {/* 24-HOUR RISK FREE WINDOW */}
          <div
            className="p-4 rounded-4 mb-4 border border-warning"
            style={{ backgroundColor: "#fffdf0" }}
          >
            <div className="d-flex align-items-center gap-2 mb-2">
              <Badge bg="warning" className="text-dark px-3 py-2 fs-6 rounded-pill fw-bold">
                {t("24-Hour Risk-Free Window")}
              </Badge>
            </div>
            <p className="mb-0 fw-semibold text-dark">
              <strong>{t("Full Refund")}:</strong>{" "}
              {t(
                "Cancellations made within 24 hours of purchase qualify for a 100% refund to the original form of payment."
              )}
            </p>
          </div>

          {/* FLEX FARE OPTION */}
          <div
            className="p-4 rounded-4 mb-4 border border-success"
            style={{ backgroundColor: "#f4fbf7" }}
          >
            <div className="d-flex align-items-center gap-2 mb-2">
              <ShieldCheck size={24} className="text-success" />
              <h5 className="fw-bold text-success mb-0">
                {t("Flex Fare Option (Ticket Insurance)")}
              </h5>
            </div>
            <ul className="mb-0 text-secondary ps-3 mt-2 d-flex flex-column gap-2">
              <li>
                <strong>{t("What It Is")}:</strong>{" "}
                {t("Passengers may select the Flex Fare option at checkout for an additional fee.")}
              </li>
              <li>
                <strong>{t("Benefit")}:</strong>{" "}
                {t("This option acts as insurance for your trip, allowing for:")}
                <ul className="mt-1">
                  <li>
                    <CheckCircleFill size={14} className="text-success me-2" />
                    <strong>{t("Free cancellations with a full refund.")}</strong>
                  </li>
                  <li>
                    <CheckCircleFill size={14} className="text-success me-2" />
                    <strong>{t("Free rescheduling with no change fees.")}</strong>
                  </li>
                </ul>
              </li>
              <li>
                <strong>{t("Flexibility")}:</strong>{" "}
                {t("Cancel or reschedule for any reason, subject to terms.")}
              </li>
            </ul>
          </div>

          {/* STANDARD FARE CANCELLATIONS TABLE */}
          <h5 className="fw-bold text-dark mt-4 mb-3">{t("Standard Fare Cancellations")}</h5>
          <div className="table-responsive mb-4">
            <Table bordered hover align="middle" className="rounded-3 overflow-hidden text-center">
              <thead className="table-light">
                <tr>
                  <th className="py-3 text-start ps-3">{t("Cancellation Timing")}</th>
                  <th className="py-3">{t("Refund Amount")}</th>
                  <th className="py-3">{t("Policy Status")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fw-semibold text-start ps-3">{t("24 Hours Before Travel")}</td>
                  <td>
                    <Badge bg="success" className="px-3 py-2 fs-6">100% {t("Refund")}</Badge>
                  </td>
                  <td className="text-muted small">{t("Full refund to payment method")}</td>
                </tr>
                <tr>
                  <td className="fw-semibold text-start ps-3">{t("Less than 24 Hours Before Travel")}</td>
                  <td>
                    <Badge bg="info" className="px-3 py-2 fs-6 text-white">50% {t("Refund")}</Badge>
                  </td>
                  <td className="text-muted small">{t("Partial refund eligible")}</td>
                </tr>
                <tr>
                  <td className="fw-semibold text-start ps-3">{t("Same-Day Cancellation")}</td>
                  <td>
                    <Badge bg="warning" className="px-3 py-2 fs-6 text-dark">30% {t("Refund")}</Badge>
                  </td>
                  <td className="text-muted small">{t("Limited refund credit")}</td>
                </tr>
                <tr>
                  <td className="fw-semibold text-start ps-3">{t("No-Show / Late Arrival")}</td>
                  <td>
                    <Badge bg="danger" className="px-3 py-2 fs-6">0% {t("Refund")} ({t("forfeited")})</Badge>
                  </td>
                  <td className="text-muted small">{t("Ticket forfeited upon departure")}</td>
                </tr>
              </tbody>
            </Table>
          </div>

          {/* DATE CHANGES & RESCHEDULING */}
          <h5 className="fw-bold text-dark mt-4 mb-2">{t("Date Changes & Rescheduling")}</h5>
          <p className="text-secondary mb-0">
            {t(
              "Passengers wishing to reschedule departure times or dates must notify dispatch prior to their scheduled departure. Standard fares may be rescheduled subject to availability and a change fee. Flex Fare ticket holders may reschedule free of charge."
            )}
          </p>
        </Card.Body>
      </Card>

      {/* SECTION 2: PRIVACY POLICY */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-5">
        <Card.Header className="bg-dark text-white py-3 px-4 d-flex align-items-center gap-2">
          <LockFill size={20} />
          <h3 className="h5 fw-bold mb-0 text-white">{t("PRIVACY POLICY")}</h3>
        </Card.Header>
        <Card.Body className="p-4 bg-white" style={{ lineHeight: "1.7" }}>
          <Row className="g-4">
            <Col md={6}>
              <div className="d-flex align-items-start gap-3">
                <div className="p-2 rounded-3 bg-light text-primary">
                  <FileEarmarkTextFill size={22} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">{t("Information We Collect")}</h6>
                  <p className="text-secondary small mb-0">
                    {t(
                      "We collect passenger contact information (name, phone number, email address) and travel preferences strictly for booking reservations, issuing tickets, and providing dispatch updates."
                    )}
                  </p>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-start gap-3">
                <div className="p-2 rounded-3 bg-light text-success">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">{t("Payment Security")}</h6>
                  <p className="text-secondary small mb-0">
                    {t(
                      "All transactions are securely encrypted via SSL and processed through Stripe. Payment card details are never stored on our servers."
                    )}
                  </p>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-start gap-3">
                <div className="p-2 rounded-3 bg-light text-warning">
                  <LockFill size={22} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">{t("Data Privacy & Protection")}</h6>
                  <p className="text-secondary small mb-0">
                    {t(
                      "Bueno Transit respects your privacy. We do not sell, rent, or trade customer personal information to third parties under any circumstances."
                    )}
                  </p>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex align-items-start gap-3">
                <div className="p-2 rounded-3 bg-light text-info">
                  <InfoCircleFill size={22} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-1">{t("Service Communications")}</h6>
                  <p className="text-secondary small mb-0">
                    {t(
                      "By booking with Bueno Transit, you consent to receive SMS notifications or phone communications regarding bus location, departure schedule changes, or dispatch updates."
                    )}
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* SECTION 3: TERMS & CONDITIONS OF CARRIAGE */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-5">
        <Card.Header className="bg-secondary text-white py-3 px-4 d-flex align-items-center gap-2">
          <BagCheckFill size={20} />
          <h3 className="h5 fw-bold mb-0 text-white">{t("TERMS OF CARRIAGE & RULES")}</h3>
        </Card.Header>
        <Card.Body className="p-4 bg-white" style={{ lineHeight: "1.7" }}>
          <Row className="g-4">
            <Col md={6}>
              <Card className="h-100 border-0 bg-light p-3 rounded-3">
                <h6 className="fw-bold text-dark mb-2">🧳 {t("Baggage Policy")}</h6>
                <p className="text-secondary small mb-0">
                  {t(
                    "Each ticket includes 1 personal item (max 25 lbs) and 1 carry-on luggage (max 50 lbs, under 24 inches). Bulky or extra oversized luggage is strictly not permitted."
                  )}
                </p>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100 border-0 bg-light p-3 rounded-3">
                <h6 className="fw-bold text-dark mb-2">⏰ {t("Boarding & Departure")}</h6>
                <p className="text-secondary small mb-0">
                  {t(
                    "Passengers must arrive at their designated departure stop 15–20 minutes prior to schedule. Boarding doors close 5 minutes prior to departure."
                  )}
                </p>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100 border-0 bg-light p-3 rounded-3">
                <h6 className="fw-bold text-dark mb-2">🚫 {t("Prohibited Items & Behavior")}</h6>
                <p className="text-secondary small mb-0">
                  {t(
                    "Smoking, vaping, alcohol consumption, and pets are strictly prohibited on all Bueno Express vehicles."
                  )}
                </p>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100 border-0 bg-light p-3 rounded-3">
                <h6 className="fw-bold text-dark mb-2">📦 {t("Package Shipments")}</h6>
                <p className="text-secondary small mb-0">
                  {t(
                    "Packages are subject to mandatory safety inspection. Bueno Express is not responsible for lost or damaged personal contents."
                  )}
                </p>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* SECTION 4: CONTACT & SUPPORT */}
      <div className="p-4 bg-light rounded-4 text-center border">
        <h5 className="fw-bold text-dark mb-2">{t("Questions about our Terms or Refund Policy?")}</h5>
        <p className="text-muted small mb-3">
          {t("Our dispatch team is available every day to assist you with travel questions, rescheduling, or ticket assistance.")}
        </p>
        <div className="d-flex justify-content-center align-items-center gap-3">
          <a href="tel:3157971010" className="btn btn-primary px-4 py-2 rounded-pill fw-bold">
            <TelephoneFill className="me-2" /> (315) 797-1010
          </a>
        </div>
      </div>
    </Container>
  );
};

export default Terms;
