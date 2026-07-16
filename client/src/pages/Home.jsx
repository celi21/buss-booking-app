import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import busStopImage from "../assets/busstop.png";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import GuestRegisterModal from "./components/GuestRegisterModal";
import { useSelector } from "react-redux";
import { translateText } from "../utils/translation";
import toast, { Toaster } from "react-hot-toast";
import {
  Calendar3,
  BusFront,
  TicketPerforated,
  ShieldCheck,
  Airplane,
  GeoAltFill,
  ClockFill,
  CheckCircleFill,
  InfoCircleFill,
  Backpack,
} from "react-bootstrap-icons";

function Home() {
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const { user } = useSelector((state) => state.auth);
  const selectedLanguage = useSelector(
    (state) => state.settings.selectedLanguage
  );

  const navigate = useNavigate();
  const handleBookNow = () => {
    if (user) {
      navigate("/booking");
      return;
    }
    setShowModal(true);
  };

  const handleBookingDetails = () => {
    let bookingId = window.prompt("Please enter your Booking ID:");
    if (!bookingId) {
      toast.error(
        selectedLanguage &&
          translateText(
            "You did not provided any Booking ID",
            selectedLanguage.code
          ),
        {
          duration: 2000,
          position: "top-right",
        }
      );
    } else {
      navigate(`/booking/${bookingId}`);
    }
  };

  const t = (text) => {
    return selectedLanguage ? translateText(text, selectedLanguage.code) : text;
  };

  return (
    <Container className="py-5">
      <Toaster />
      {showModal && (
        <GuestRegisterModal showModal={showModal} handleClose={handleClose} />
      )}

      {/* HERO SECTION */}
      <Row className="align-items-center mb-5 gy-4">
        <Col lg={6} className="d-flex flex-column justify-content-center">
          <h1 className="display-5 fw-bold text-dark mb-3">
            {t("Reliable Transportation Between Upstate New York & New York City")}
          </h1>
          <p className="lead text-secondary mb-4" style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
            {t("For over 18 years, Bueno Transit has provided safe, comfortable, and dependable scheduled transportation connecting Upstate New York, New York City, and regional destinations.")}
          </p>
          <div className="d-flex flex-wrap gap-3">
            <Button
              variant="primary"
              className="p-3 px-5 fw-bold shadow-sm"
              style={{ fontSize: "1.05rem", borderRadius: "8px" }}
              onClick={() => handleBookNow()}
            >
              {t("Book Now")}
            </Button>
            <Button
              variant="outline-primary"
              className="p-3 px-4 fw-bold bg-white"
              style={{ fontSize: "1.05rem", borderRadius: "8px", borderWidth: "2px" }}
              onClick={() => handleBookingDetails()}
            >
              {t("View your Booking Details")}
            </Button>
          </div>
        </Col>
        <Col lg={6}>
          <div className="position-relative">
            <img src={busStopImage} alt="Bus Stop" className="w-100 rounded-4 shadow" style={{ objectFit: "cover" }} />
          </div>
        </Col>
      </Row>

      {/* SERVICE HIGHLIGHTS */}
      <div className="my-5 py-3">
        <div className="text-center mb-4">
          <h3 className="fw-bold">{t("Why Travel With Us")}</h3>
          <p className="text-muted">{t("Safe, reliable, and convenient regional transit services")}</p>
        </div>
        <Row className="g-3 justify-content-center">
          <Col className="col-12 col-sm-6 col-md-4 col-lg">
            <Card className="h-100 text-center border-0 shadow-sm p-3" style={{ borderRadius: "12px" }}>
              <Card.Body className="d-flex flex-column align-items-center p-2">
                <div className="bg-primary-subtle text-primary p-3 rounded-circle mb-3">
                  <Calendar3 size={24} />
                </div>
                <h6 className="fw-bold mb-1">{t("Operating 7 Days a Week")}</h6>
                <small className="text-muted">{t("Daily schedule options")}</small>
              </Card.Body>
            </Card>
          </Col>
          <Col className="col-12 col-sm-6 col-md-4 col-lg">
            <Card className="h-100 text-center border-0 shadow-sm p-3" style={{ borderRadius: "12px" }}>
              <Card.Body className="d-flex flex-column align-items-center p-2">
                <div className="bg-success-subtle text-success p-3 rounded-circle mb-3">
                  <BusFront size={24} />
                </div>
                <h6 className="fw-bold mb-1">{t("Scheduled Transportation")}</h6>
                <small className="text-muted">{t("Reliable timetables")}</small>
              </Card.Body>
            </Card>
          </Col>
          <Col className="col-12 col-sm-6 col-md-4 col-lg">
            <Card className="h-100 text-center border-0 shadow-sm p-3" style={{ borderRadius: "12px" }}>
              <Card.Body className="d-flex flex-column align-items-center p-2">
                <div className="bg-info-subtle text-info p-3 rounded-circle mb-3">
                  <TicketPerforated size={24} />
                </div>
                <h6 className="fw-bold mb-1">{t("Easy Online Booking")}</h6>
                <small className="text-muted">{t("Reserve in seconds")}</small>
              </Card.Body>
            </Card>
          </Col>
          <Col className="col-12 col-sm-6 col-md-4 col-lg">
            <Card className="h-100 text-center border-0 shadow-sm p-3" style={{ borderRadius: "12px" }}>
              <Card.Body className="d-flex flex-column align-items-center p-2">
                <div className="bg-warning-subtle text-warning p-3 rounded-circle mb-3">
                  <ShieldCheck size={24} />
                </div>
                <h6 className="fw-bold mb-1">{t("Secure Online Payments")}</h6>
                <small className="text-muted">{t("Stripe integrated")}</small>
              </Card.Body>
            </Card>
          </Col>
          <Col className="col-12 col-sm-6 col-md-4 col-lg">
            <Card className="h-100 text-center border-0 shadow-sm p-3" style={{ borderRadius: "12px" }}>
              <Card.Body className="d-flex flex-column align-items-center p-2">
                <div className="bg-danger-subtle text-danger p-3 rounded-circle mb-3">
                  <Airplane size={24} />
                </div>
                <h6 className="fw-bold mb-1">{t("Airport Connections Available")}</h6>
                <small className="text-muted">{t("Transit hub transfers")}</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      <hr className="my-5 text-black-50" />

      {/* TRAVEL & CONNECTIONS & HOW TO BOOK */}
      <Row className="gy-5">
        <Col md={6}>
          <div className="d-flex align-items-center gap-2 mb-3">
            <GeoAltFill size={20} className="text-primary" />
            <h4 className="fw-bold mb-0">{t("Where We Travel")}</h4>
          </div>
          <p className="text-muted">
            {t("We connect key Upstate New York cities directly with the New York metropolitan area.")}
          </p>
          <Card className="border-0 bg-light p-3 rounded-4 mb-4">
            <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
              <li className="d-flex align-items-center gap-2">
                <CheckCircleFill size={16} className="text-success" />
                <span>{t("Upstate NY: Albany, Syracuse, Binghamton, Rochester, Buffalo")}</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <CheckCircleFill size={16} className="text-success" />
                <span>{t("New York City terminals and major regional transit stops")}</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <CheckCircleFill size={16} className="text-success" />
                <span>{t("Regular daily regional and express connections")}</span>
              </li>
            </ul>
          </Card>
          
          <div className="d-flex align-items-center gap-2 mb-3 mt-4">
            <Airplane size={20} className="text-primary" />
            <h4 className="fw-bold mb-0">{t("Available Connections")}</h4>
          </div>
          <p className="text-muted mb-0">
            {t("Enjoy quick transitions to connecting trains, local subway lines, commuter paths, and regional airports near each stop.")}
          </p>
        </Col>

        <Col md={6}>
          <div className="d-flex align-items-center gap-2 mb-3">
            <TicketPerforated size={20} className="text-primary" />
            <h4 className="fw-bold mb-0">{t("How to Book Tickets")}</h4>
          </div>
          <div className="mb-4">
            <div className="d-flex gap-3 mb-3">
              <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold" style={{ width: "30px", height: "30px", flexShrink: 0 }}>1</div>
              <div>
                <h6 className="fw-bold mb-1">{t("Select Route & Date")}</h6>
                <small className="text-muted">{t("Enter your starting and destination city to search departure lists.")}</small>
              </div>
            </div>
            <div className="d-flex gap-3 mb-3">
              <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold" style={{ width: "30px", height: "30px", flexShrink: 0 }}>2</div>
              <div>
                <h6 className="fw-bold mb-1">{t("Choose Bus & Pick Seats")}</h6>
                <small className="text-muted">{t("Select your preferred timetable and pick seats from the interactive map.")}</small>
              </div>
            </div>
            <div className="d-flex gap-3">
              <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold" style={{ width: "30px", height: "30px", flexShrink: 0 }}>3</div>
              <div>
                <h6 className="fw-bold mb-1">{t("Confirm & Pay Securely")}</h6>
                <small className="text-muted">{t("Review booking, add personal details, and pay securely online.")}</small>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 mb-3 mt-4">
            <ClockFill size={20} className="text-primary" />
            <h4 className="fw-bold mb-0">{t("Departure Schedules")}</h4>
          </div>
          <p className="text-muted mb-0">
            {t("Schedules are designed to serve daily commuters and travelers. Check real-time schedules and timings via the online booking portal.")}
          </p>
        </Col>
      </Row>

      <hr className="my-5 text-black-50" />

      {/* TRAVEL RULES SECTION */}
      <div className="mb-4">
        <div className="d-flex align-items-center gap-2 mb-4 justify-content-center">
          <InfoCircleFill size={24} className="text-primary" />
          <h3 className="fw-bold mb-0">{t("Important Travel Rules")}</h3>
        </div>
        <Row className="g-3">
          <Col md={3} className="col-12 col-sm-6">
            <Card className="h-100 border-0 bg-light p-3" style={{ borderRadius: "12px" }}>
              <Card.Body className="p-2">
                <h6 className="fw-bold text-dark mb-2">{t("Arrive Early")}</h6>
                <small className="text-muted d-block">{t("Please arrive at the departure point 15-20 minutes before schedule. Boarding gates close 5 minutes prior to departure.")}</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="col-12 col-sm-6">
            <Card className="h-100 border-0 bg-light p-3" style={{ borderRadius: "12px" }}>
              <Card.Body className="p-2">
                <div className="d-flex align-items-center gap-1 mb-2">
                  <Backpack size={16} className="text-primary" />
                  <h6 className="fw-bold text-dark mb-0">{t("Baggage Allowance")}</h6>
                </div>
                <small className="text-muted d-block">{t("Tickets include 1 personal carry-on item and 1 standard suitcase loaded in the luggage compartment.")}</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="col-12 col-sm-6">
            <Card className="h-100 border-0 bg-light p-3" style={{ borderRadius: "12px" }}>
              <Card.Body className="p-2">
                <h6 className="fw-bold text-dark mb-2">{t("Cancellation Policy")}</h6>
                <small className="text-muted d-block">{t("Cancellations are allowed before departure. Receive a 100% refund if 24h+ in advance, or 30% if less than 24h.")}</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="col-12 col-sm-6">
            <Card className="h-100 border-0 bg-light p-3" style={{ borderRadius: "12px" }}>
              <Card.Body className="p-2">
                <h6 className="fw-bold text-dark mb-2">{t("No Smoking")}</h6>
                <small className="text-muted d-block">{t("Smoking and vaping are strictly prohibited inside all buses. Ensure guide dogs are documented if traveling.")}</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default Home;
