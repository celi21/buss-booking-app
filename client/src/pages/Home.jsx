import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import buenoBusHero from "../assets/bueno_bus_hero.png";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import GuestRegisterModal from "./components/GuestRegisterModal";
import { useSelector } from "react-redux";
import { translateText } from "../utils/translation";
import toast, { Toaster } from "react-hot-toast";
import BookingSearch from "../components/shared/BookingSearch/BookingSearch";
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

  // Fallback to original text if translation is undefined in translation.js
  const t = (text) => {
    if (!selectedLanguage) return text;
    const translated = translateText(text, selectedLanguage.code);
    return translated ? translated : text;
  };

  return (
    <div className="homepage-wrapper">
      <Toaster />
      {showModal && (
        <GuestRegisterModal showModal={showModal} handleClose={handleClose} />
      )}

      {/* HERO SECTION */}
      <div 
        className="hero-section position-relative d-flex align-items-center justify-content-center text-white" 
        style={{
          width: "100%",
          minHeight: "80vh",
          backgroundImage: `url(${buenoBusHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "80px 20px"
        }}
      >
        {/* Dark overlay at 55% opacity */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100" 
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.55)",
            zIndex: 1
          }}
        />

        {/* Hero Content */}
        <div className="position-relative text-center d-flex flex-column align-items-center gap-4 w-100" style={{ zIndex: 2 }}>
          <div style={{ maxWidth: "800px" }}>
            <h1 className="display-4 fw-bold mb-3 text-white">
              {t("Reliable Transportation Between Upstate New York & New York City")}
            </h1>
            <p className="lead mb-0 text-white-50" style={{ fontSize: "1.2rem", lineHeight: "1.6" }}>
              {t("For over 18 years, Bueno Transit has provided safe, comfortable, and dependable scheduled transportation connecting Upstate New York, New York City, and regional destinations.")}
            </p>
          </div>

          {/* Reusable Booking Search Widget */}
          <BookingSearch isCheckoutFlow={false} />

          {/* View Booking Details Action */}
          <Button
            variant="link"
            className="text-white mt-1 text-decoration-none fw-semibold"
            onClick={handleBookingDetails}
            style={{ fontSize: "0.95rem" }}
          >
            {t("View your Booking Details")} →
          </Button>
        </div>
      </div>

      <Container className="py-5">

      {/* SERVICE HIGHLIGHTS */}
      <div className="my-5 py-3">
        <div className="text-center mb-4">
          <h3 className="fw-bold homepage-text-black">{t("Why Travel With Us")}</h3>
          <p className="homepage-text-black">{t("Safe, reliable, and convenient regional transit services")}</p>
        </div>
        <Row className="g-3 justify-content-center">
          <Col className="col-12 col-sm-6 col-md-4 col-lg">
            <Card className="h-100 text-center border-0 shadow-sm p-3" style={{ borderRadius: "12px" }}>
              <Card.Body className="d-flex flex-column align-items-center p-2">
                <div className="p-3 rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#e3f2fd", color: "#0d6efd", width: "60px", height: "60px" }}>
                  <Calendar3 size={26} />
                </div>
                <h6 className="fw-bold mb-1 homepage-text-black">{t("Operating 7 Days a Week")}</h6>
                <small className="homepage-text-black">{t("Daily schedule options")}</small>
              </Card.Body>
            </Card>
          </Col>
          <Col className="col-12 col-sm-6 col-md-4 col-lg">
            <Card className="h-100 text-center border-0 shadow-sm p-3" style={{ borderRadius: "12px" }}>
              <Card.Body className="d-flex flex-column align-items-center p-2">
                <div className="p-3 rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#e8f5e9", color: "#2e7d32", width: "60px", height: "60px" }}>
                  <BusFront size={26} />
                </div>
                <h6 className="fw-bold mb-1 homepage-text-black">{t("Scheduled Transportation")}</h6>
                <small className="homepage-text-black">{t("Reliable timetables")}</small>
              </Card.Body>
            </Card>
          </Col>
          <Col className="col-12 col-sm-6 col-md-4 col-lg">
            <Card className="h-100 text-center border-0 shadow-sm p-3" style={{ borderRadius: "12px" }}>
              <Card.Body className="d-flex flex-column align-items-center p-2">
                <div className="p-3 rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#e0f7fa", color: "#00838f", width: "60px", height: "60px" }}>
                  <TicketPerforated size={26} />
                </div>
                <h6 className="fw-bold mb-1 homepage-text-black">{t("Easy Online Booking")}</h6>
                <small className="homepage-text-black">{t("Reserve in seconds")}</small>
              </Card.Body>
            </Card>
          </Col>
          <Col className="col-12 col-sm-6 col-md-4 col-lg">
            <Card className="h-100 text-center border-0 shadow-sm p-3" style={{ borderRadius: "12px" }}>
              <Card.Body className="d-flex flex-column align-items-center p-2">
                <div className="p-3 rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#fff8e1", color: "#ff8f00", width: "60px", height: "60px" }}>
                  <ShieldCheck size={26} />
                </div>
                <h6 className="fw-bold mb-1 homepage-text-black">{t("Secure Online Payments")}</h6>
                <small className="homepage-text-black">{t("Stripe integrated")}</small>
              </Card.Body>
            </Card>
          </Col>
          <Col className="col-12 col-sm-6 col-md-4 col-lg">
            <Card className="h-100 text-center border-0 shadow-sm p-3" style={{ borderRadius: "12px" }}>
              <Card.Body className="d-flex flex-column align-items-center p-2">
                <div className="p-3 rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#ffebee", color: "#c62828", width: "60px", height: "60px" }}>
                  <Airplane size={26} />
                </div>
                <h6 className="fw-bold mb-1 homepage-text-black">{t("Airport Connections Available")}</h6>
                <small className="homepage-text-black">{t("Transit hub transfers")}</small>
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
            <h4 className="fw-bold mb-0 homepage-text-black">{t("Where We Travel")}</h4>
          </div>
          <p className="homepage-text-black">
            {t("We connect key Upstate New York cities directly with the New York metropolitan area.")}
          </p>
          <Card className="border-0 bg-light p-3 rounded-4 mb-4">
            <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
              <li className="d-flex align-items-center gap-2">
                <CheckCircleFill size={16} className="text-success" />
                <span className="homepage-text-black">{t("Upstate NY: Albany, Syracuse, Binghamton, Rochester, Buffalo")}</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <CheckCircleFill size={16} className="text-success" />
                <span className="homepage-text-black">{t("New York City terminals and major regional transit stops")}</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <CheckCircleFill size={16} className="text-success" />
                <span className="homepage-text-black">{t("Regular daily regional and express connections")}</span>
              </li>
            </ul>
          </Card>

          <div className="d-flex align-items-center gap-2 mb-3 mt-4">
            <Airplane size={20} className="text-primary" />
            <h4 className="fw-bold mb-0 homepage-text-black">{t("Available Connections")}</h4>
          </div>
          <p className="mb-0 homepage-text-black">
            {t("Enjoy quick transitions to connecting trains, local subway lines, commuter paths, and regional cities such as Pennsylvania, Massachusetts, Delaware, Ohio, Rhode Island, and Connecticut. In Pennsylvania, the route includes Allentown, Philadelphia, Reading, Harrisburg, York, Hazleton, the Poconos, Lebanon, and Wilkes-Barre. In Massachusetts, it stops in Boston, Lawrence, and Worcester. The itinerary also features Utica in New York, Providence in Rhode Island, Springfield in Massachusetts, and Lancaster in Pennsylvania.")}
          </p>
        </Col>

        <Col md={6}>
          <div className="d-flex align-items-center gap-2 mb-3">
            <TicketPerforated size={20} className="text-primary" />
            <h4 className="fw-bold mb-0 homepage-text-black">{t("How to Book Tickets")}</h4>
          </div>
          <div className="mb-4">
            <div className="d-flex gap-3 mb-3">
              <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold" style={{ width: "30px", height: "30px", flexShrink: 0 }}>1</div>
              <div>
                <h6 className="fw-bold mb-1 homepage-text-black">{t("Select Route & Date")}</h6>
                <small className="homepage-text-black">{t("Enter your starting and destination city to search departure lists.")}</small>
              </div>
            </div>
            <div className="d-flex gap-3 mb-3">
              <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold" style={{ width: "30px", height: "30px", flexShrink: 0 }}>2</div>
              <div>
                <h6 className="fw-bold mb-1 homepage-text-black">{t("Choose Bus & Pick Seats")}</h6>
                <small className="homepage-text-black">{t("Select your preferred timetable and pick seats from the interactive map.")}</small>
              </div>
            </div>
            <div className="d-flex gap-3">
              <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold" style={{ width: "30px", height: "30px", flexShrink: 0 }}>3</div>
              <div>
                <h6 className="fw-bold mb-1 homepage-text-black">{t("Confirm & Pay Securely")}</h6>
                <small className="homepage-text-black">{t("Review booking, add personal details, and pay securely online.")}</small>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 mb-3 mt-4">
            <ClockFill size={20} className="text-primary" />
            <h4 className="fw-bold mb-0 homepage-text-black">{t("Departure Schedules")}</h4>
          </div>
          <p className="mb-0 homepage-text-black">
            {t("Schedules are designed to serve daily commuters and travelers. Check real-time schedules and timings via the online booking portal.")}
          </p>
        </Col>
      </Row>

      <hr className="my-5 text-black-50" />

      {/* TRAVEL RULES SECTION */}
      <div className="mb-4">
        <div className="d-flex align-items-center gap-2 mb-4 justify-content-center">
          <InfoCircleFill size={24} className="text-primary" />
          <h3 className="fw-bold mb-0 homepage-text-black">{t("Important Travel Rules")}</h3>
        </div>
        <Row className="g-3">
          <Col md={3} className="col-12 col-sm-6">
            <Card className="h-100 border-0 bg-light p-3" style={{ borderRadius: "12px" }}>
              <Card.Body className="p-2">
                <h6 className="fw-bold mb-2 homepage-text-black">{t("Arrive Early")}</h6>
                <small className="d-block homepage-text-black">{t("Please arrive at the departure point 15-20 minutes before schedule. Boarding gates close 5 minutes prior to departure.")}</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="col-12 col-sm-6">
            <Card className="h-100 border-0 bg-light p-3" style={{ borderRadius: "12px" }}>
              <Card.Body className="p-2">
                <div className="d-flex align-items-center gap-1 mb-2">
                  <Backpack size={16} className="text-primary" />
                  <h6 className="fw-bold mb-0 homepage-text-black">{t("Baggage Allowance")}</h6>
                </div>
                <small className="d-block homepage-text-black">{t("Tickets include 1 personal carry-on item and 1 standard suitcase loaded in the luggage compartment.")}</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="col-12 col-sm-6">
            <Card className="h-100 border-0 bg-light p-3" style={{ borderRadius: "12px" }}>
              <Card.Body className="p-2">
                <h6 className="fw-bold mb-2 homepage-text-black">{t("Cancellation Policy")}</h6>
                <small className="d-block homepage-text-black">{t("Cancellations are allowed before departure. Receive a 100% refund if 24h+ in advance, or 30% if less than 24h.")}</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="col-12 col-sm-6">
            <Card className="h-100 border-0 bg-light p-3" style={{ borderRadius: "12px" }}>
              <Card.Body className="p-2">
                <h6 className="fw-bold mb-2 homepage-text-black">{t("No Smoking")}</h6>
                <small className="d-block homepage-text-black">{t("Smoking and vaping are strictly prohibited inside all buses. Ensure guide dogs are documented if traveling.")}</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  </div>
);
}

export default Home;
