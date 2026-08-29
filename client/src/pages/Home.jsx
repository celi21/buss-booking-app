import React, { useState, useEffect } from "react";
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
import api from "../utils/api";
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
  BoxSeam,
  ArrowRight,
  ShieldLock,
  CursorFill,
  QuestionCircleFill,
} from "react-bootstrap-icons";

import buenoLogo from "../assets/bueno_logo.png";

function Home() {
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const { user } = useSelector((state) => state.auth);
  const selectedLanguage = useSelector(
    (state) => state.settings.selectedLanguage
  );

  const [liveSchedules, setLiveSchedules] = useState([]);
  const navigate = useNavigate();

  // Load today's live schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await api.post("/booking/public-trip-statuses");
        if (res.data && res.data.success) {
          setLiveSchedules(res.data.data.schedules);
        }
      } catch (err) {
        console.error("Error loading trip statuses:", err);
      }
    };
    fetchSchedules();
  }, []);

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
          minHeight: "85vh",
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
          <img src={buenoLogo} alt="Bueno Express Logo" style={{ maxHeight: "160px", width: "auto", objectFit: "contain", marginBottom: "-10px" }} />

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

          {/* Manage Booking Action Button */}
          <Button
            variant="primary"
            className="px-5 py-3 fw-bold rounded-pill text-white shadow hover-scale"
            onClick={handleBookingDetails}
            style={{
              backgroundColor: "#0d6efd",
              borderColor: "#0d6efd",
              fontSize: "1.05rem",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            {t("Manage Booking")}
          </Button>
        </div>
      </div>

      <Container className="py-5">
        {/* WHY TRAVEL WITH US (SERVICE HIGHLIGHTS) */}
        <div className="my-5 py-3">
          <div className="text-center mb-4">
            <h3 className="fw-bold homepage-text-black">{t("Why Travel With Us")}</h3>
            <p className="homepage-text-black">{t("Safe, reliable, and convenient regional transit services")}</p>
          </div>
          <Row className="g-3 justify-content-center">
            <Col className="col-12 col-sm-6 col-md-4 col-lg-2">
              <Card className="h-100 text-center border-0 shadow-sm p-3" style={{ borderRadius: "12px" }}>
                <Card.Body className="d-flex flex-column align-items-center p-2">
                  <div className="p-3 rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#e3f2fd", color: "#0d6efd", width: "60px", height: "60px" }}>
                    <Calendar3 size={26} />
                  </div>
                  <h6 className="fw-bold mb-1 homepage-text-black" style={{ fontSize: "0.95rem" }}>{t("Operating 7 Days a Week")}</h6>
                  <small className="homepage-text-black">{t("Daily schedule options")}</small>
                </Card.Body>
              </Card>
            </Col>
            <Col className="col-12 col-sm-6 col-md-4 col-lg-2">
              <Card className="h-100 text-center border-0 shadow-sm p-3" style={{ borderRadius: "12px" }}>
                <Card.Body className="d-flex flex-column align-items-center p-2">
                  <div className="p-3 rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#e8f5e9", color: "#2e7d32", width: "60px", height: "60px" }}>
                    <BusFront size={26} />
                  </div>
                  <h6 className="fw-bold mb-1 homepage-text-black" style={{ fontSize: "0.95rem" }}>{t("Scheduled Transportation")}</h6>
                  <small className="homepage-text-black">{t("Reliable timetables")}</small>
                </Card.Body>
              </Card>
            </Col>
            <Col className="col-12 col-sm-6 col-md-4 col-lg-2">
              <Card className="h-100 text-center border-0 shadow-sm p-3" style={{ borderRadius: "12px" }}>
                <Card.Body className="d-flex flex-column align-items-center p-2">
                  <div className="p-3 rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#e0f7fa", color: "#00838f", width: "60px", height: "60px" }}>
                    <TicketPerforated size={26} />
                  </div>
                  <h6 className="fw-bold mb-1 homepage-text-black" style={{ fontSize: "0.95rem" }}>{t("Easy Online Booking")}</h6>
                  <small className="homepage-text-black">{t("Reserve in seconds")}</small>
                </Card.Body>
              </Card>
            </Col>
            <Col className="col-12 col-sm-6 col-md-4 col-lg-2">
              <Card className="h-100 text-center border-0 shadow-sm p-3" style={{ borderRadius: "12px" }}>
                <Card.Body className="d-flex flex-column align-items-center p-2">
                  <div className="p-3 rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#fff8e1", color: "#ff8f00", width: "60px", height: "60px" }}>
                    <ShieldCheck size={26} />
                  </div>
                  <h6 className="fw-bold mb-1 homepage-text-black" style={{ fontSize: "0.95rem" }}>{t("Secure Online Payments")}</h6>
                  <small className="homepage-text-black">{t("Stripe integrated")}</small>
                </Card.Body>
              </Card>
            </Col>
            <Col className="col-12 col-sm-6 col-md-4 col-lg-2">
              <Card className="h-100 text-center border-0 shadow-sm p-3" style={{ borderRadius: "12px" }}>
                <Card.Body className="d-flex flex-column align-items-center p-2">
                  <div className="p-3 rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#ffebee", color: "#c62828", width: "60px", height: "60px" }}>
                    <Airplane size={26} />
                  </div>
                  <h6 className="fw-bold mb-1 homepage-text-black" style={{ fontSize: "0.95rem" }}>{t("Airport Connections Available")}</h6>
                  <small className="homepage-text-black">{t("Transit hub transfers")}</small>
                </Card.Body>
              </Card>
            </Col>
            {/* Added Package Delivery Available Highlight */}
            <Col className="col-12 col-sm-6 col-md-4 col-lg-2">
              <Card className="h-100 text-center border-0 shadow-sm p-3" style={{ borderRadius: "12px" }}>
                <Card.Body className="d-flex flex-column align-items-center p-2">
                  <div className="p-3 rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: "#f3e5f5", color: "#8e24aa", width: "60px", height: "60px" }}>
                    <BoxSeam size={26} />
                  </div>
                  <h6 className="fw-bold mb-1 homepage-text-black" style={{ fontSize: "0.95rem" }}>{t("Package Delivery Available")}</h6>
                  <small className="homepage-text-black">{t("Fast parcel shipping")}</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        <hr className="my-5 text-black-50" />

        {/* HOW TO BOOK TICKETS (Redesigned Step flow with big circular step badges) */}
        <div className="my-5">
          <div className="text-center mb-5">
            <h3 className="fw-bold homepage-text-black">{t("How to Book Tickets")}</h3>
            <p className="homepage-text-black">{t("Three simple steps to secure your seats online")}</p>
          </div>
          <Row className="g-4 text-center">
            <Col md={4}>
              <div className="d-flex flex-column align-items-center">
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mb-3 shadow hover-scale" style={{ width: "80px", height: "80px" }}>
                  <GeoAltFill size={36} />
                </div>
                <h5 className="fw-bold homepage-text-black">{t("1. Select Route & Date")}</h5>
                <p className="text-muted px-3" style={{ fontSize: "0.95rem" }}>
                  {t("Enter your starting and destination city to search departure lists.")}
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="d-flex flex-column align-items-center">
                <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center mb-3 shadow hover-scale" style={{ width: "80px", height: "80px" }}>
                  <BusFront size={36} />
                </div>
                <h5 className="fw-bold homepage-text-black">{t("2. Choose Bus & Pick Seats")}</h5>
                <p className="text-muted px-3" style={{ fontSize: "0.95rem" }}>
                  {t("Select your preferred timetable and pick seats from the interactive map.")}
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="d-flex flex-column align-items-center">
                <div className="rounded-circle bg-warning text-white d-flex align-items-center justify-content-center mb-3 shadow hover-scale" style={{ width: "80px", height: "80px" }}>
                  <ShieldCheck size={36} />
                </div>
                <h5 className="fw-bold homepage-text-black">{t("3. Confirm & Pay Securely")}</h5>
                <p className="text-muted px-3" style={{ fontSize: "0.95rem" }}>
                  {t("Review booking, add personal details, and pay securely online.")}
                </p>
              </div>
            </Col>
          </Row>
        </div>

        <hr className="my-5 text-black-50" />

        {/* WHERE WE TRAVEL & CONNECTIONS */}
        <Row className="gy-5">
          <Col lg={7}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <GeoAltFill size={20} className="text-primary" />
              <h4 className="fw-bold mb-0 homepage-text-black">{t("Where We Travel")}</h4>
            </div>
            
            <Row className="g-3">
              <Col md={6}>
                <Card className="border-0 bg-light p-3 rounded-4 h-100">
                  <h6 className="fw-bold text-primary mb-2">{t("Upstate New York pickup locations")}</h6>
                  <ul className="list-unstyled mb-0 d-flex flex-column gap-1 text-secondary" style={{ fontSize: "0.95rem" }}>
                    <li><CheckCircleFill size={12} className="text-success me-2" /> {t("Utica")}</li>
                    <li><CheckCircleFill size={12} className="text-success me-2" /> {t("Frankfort")}</li>
                    <li><CheckCircleFill size={12} className="text-success me-2" /> {t("Ilion")}</li>
                    <li><CheckCircleFill size={12} className="text-success me-2" /> {t("Herkimer")}</li>
                    <li><CheckCircleFill size={12} className="text-success me-2" /> {t("Albany (Guilderland Travel Plaza, Schenectady)")}</li>
                  </ul>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="border-0 bg-light p-3 rounded-4 h-100">
                  <h6 className="fw-bold text-success mb-2">{t("New York City / Downstate pickup locations")}</h6>
                  <ul className="list-unstyled mb-0 d-flex flex-column gap-1 text-secondary" style={{ fontSize: "0.95rem" }}>
                    <li><CheckCircleFill size={12} className="text-success me-2" /> <strong>{t("Main stop: Pablo Express")}</strong></li>
                    <li className="ms-4 text-muted">{t("1218 St. Nicholas Ave, Manhattan")}</li>
                    <li><CheckCircleFill size={12} className="text-success me-2" /> {t("Fort Lee, New Jersey (near the George Washington Bridge)")}</li>
                    <li><CheckCircleFill size={12} className="text-success me-2" /> {t("Route 4, Paramus, New Jersey")}</li>
                    <li><CheckCircleFill size={12} className="text-success me-2" /> {t("Manhattan (third-party transfer/drop-off)")}</li>
                    <li><CheckCircleFill size={12} className="text-success me-2" /> {t("Bronx (third-party transfer/drop-off)")}</li>
                  </ul>
                </Card>
              </Col>
            </Row>

            <Card className="border-0 bg-light p-3 rounded-4 mt-3">
              <h6 className="fw-bold text-info mb-2">{t("Airport connections")}</h6>
              <p className="mb-2 text-secondary" style={{ fontSize: "0.95rem" }}>
                {t("The website also advertises connections to:")}
              </p>
              <ul className="list-unstyled mb-2 d-flex flex-wrap gap-3 text-secondary fw-semibold" style={{ fontSize: "0.9rem" }}>
                <li>✈️ {t("JFK Airport")}</li>
                <li>✈️ {t("LaGuardia Airport")}</li>
                <li>✈️ {t("Newark Liberty International Airport")}</li>
              </ul>
              <small className="text-muted d-block" style={{ fontSize: "0.85rem", lineHeight: "1.4" }}>
                {t("These airport transfers are provided through a third-party service for an additional fee.")}
              </small>
            </Card>

            <div className="alert alert-info mt-3 border-0 rounded-4 p-3 d-flex align-items-start gap-2" style={{ fontSize: "0.9rem" }}>
              <InfoCircleFill className="text-info mt-1" size={18} style={{ flexShrink: 0 }} />
              <span>
                <strong>{t("Package Shipping Note")}:</strong> {t("Packages can only travel to and from 1218 St Nicholas Avenue and Picked up or Droped off Door to Door in Utica, New York .")}
              </span>
            </div>
          </Col>

          <Col lg={5}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <Airplane size={20} className="text-primary" />
              <h4 className="fw-bold mb-0 homepage-text-black">{t("Available Connections")}</h4>
            </div>
            <Card className="border-0 bg-light p-3 rounded-4 h-100">
              <p className="mb-0 text-secondary" style={{ fontSize: "0.98rem", lineHeight: "1.6" }}>
                {t("Enjoy quick transitions to connecting trains, local subway lines, commuter paths, and regional cities such as Pennsylvania, Massachusetts, Delaware, Ohio, Rhode Island, and Connecticut. In Pennsylvania, the route includes Allentown, Philadelphia, Reading, Harrisburg, York, Hazleton, the Poconos, Lebanon, and Wilkes-Barre. In Massachusetts, it stops in Boston, Lawrence, and Worcester. The itinerary also features Utica in New York, Providence in Rhode Island, Springfield in Massachusetts, and Lancaster in Pennsylvania.")}
              </p>
            </Card>
          </Col>
        </Row>

        <hr className="my-5 text-black-50" />

        {/* DEPARTURE SCHEDULES & LIVE TRIP STATUS */}
        <div className="my-5">
          <Row className="align-items-center mb-4">
            <Col md={8} className="d-flex align-items-center gap-2">
              <ClockFill size={22} className="text-primary" />
              <h4 className="fw-bold mb-0 homepage-text-black">{t("Departure Schedules & Live Status")}</h4>
            </Col>
            <Col md={4} className="text-md-end mt-2 mt-md-0">
              <small className="text-muted">🕒 {t("Showing today's departures")}</small>
            </Col>
          </Row>
          
          <p className="homepage-text-black mb-4">
            {t("Schedules are designed to serve daily commuters and travelers. Check real-time schedules and timings via the online booking portal.")}
          </p>

          <Row className="g-3">
            {liveSchedules.length > 0 ? (
              liveSchedules.map((sched, idx) => (
                <Col md={6} lg={3} key={idx}>
                  <Card className="border shadow-sm rounded-4 p-3 h-100">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="fw-bold text-dark h5 mb-0">{sched.departureTime}</span>
                      {sched.status === "Delayed" ? (
                        <span className="badge bg-danger d-flex align-items-center gap-1 py-2 px-3 rounded-pill text-white">
                          <span className="spinner-grow spinner-grow-sm text-white" style={{ width: "8px", height: "8px" }} />
                          {t("Delayed")}
                        </span>
                      ) : (
                        <span className="badge bg-success d-flex align-items-center gap-1 py-2 px-3 rounded-pill text-white">
                          <CheckCircleFill size={10} />
                          {t("On Time")}
                        </span>
                      )}
                    </div>
                    <div className="text-muted small mb-1">{sched.routeName}</div>
                    <div className="fw-semibold text-secondary d-flex align-items-center gap-1">
                      <span>{sched.fromCity}</span>
                      <ArrowRight size={12} />
                      <span>{sched.toCity}</span>
                    </div>
                  </Card>
                </Col>
              ))
            ) : (
              // Default Fallback schedules if no dynamic bookings on DB yet
              <>
                <Col md={6} lg={3}>
                  <Card className="border shadow-sm rounded-4 p-3 h-100">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="fw-bold text-dark h5 mb-0">5:00 AM</span>
                      <span className="badge bg-success d-flex align-items-center gap-1 py-2 px-3 rounded-pill text-white">
                        <CheckCircleFill size={10} />
                        {t("On Time")}
                      </span>
                    </div>
                    <div className="text-muted small mb-1">{t("Upstate NY to NYC")}</div>
                    <div className="fw-semibold text-secondary d-flex align-items-center gap-1">
                      <span>Utica</span> <ArrowRight size={12} /> <span>Manhattan</span>
                    </div>
                  </Card>
                </Col>
                <Col md={6} lg={3}>
                  <Card className="border shadow-sm rounded-4 p-3 h-100">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="fw-bold text-dark h5 mb-0">7:30 AM</span>
                      <span className="badge bg-success d-flex align-items-center gap-1 py-2 px-3 rounded-pill text-white">
                        <CheckCircleFill size={10} />
                        {t("On Time")}
                      </span>
                    </div>
                    <div className="text-muted small mb-1">{t("Albany to NYC")}</div>
                    <div className="fw-semibold text-secondary d-flex align-items-center gap-1">
                      <span>Albany</span> <ArrowRight size={12} /> <span>Manhattan</span>
                    </div>
                  </Card>
                </Col>
                <Col md={6} lg={3}>
                  <Card className="border shadow-sm rounded-4 p-3 h-100">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="fw-bold text-dark h5 mb-0">11:20 AM</span>
                      <span className="badge bg-success d-flex align-items-center gap-1 py-2 px-3 rounded-pill text-white">
                        <CheckCircleFill size={10} />
                        {t("On Time")}
                      </span>
                    </div>
                    <div className="text-muted small mb-1">{t("NYC to Upstate NY")}</div>
                    <div className="fw-semibold text-secondary d-flex align-items-center gap-1">
                      <span>Manhattan stop</span> <ArrowRight size={12} /> <span>Utica</span>
                    </div>
                  </Card>
                </Col>
                <Col md={6} lg={3}>
                  <Card className="border shadow-sm rounded-4 p-3 h-100">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="fw-bold text-dark h5 mb-0">11:25 AM</span>
                      <span className="badge bg-success d-flex align-items-center gap-1 py-2 px-3 rounded-pill text-white">
                        <CheckCircleFill size={10} />
                        {t("On Time")}
                      </span>
                    </div>
                    <div className="text-muted small mb-1">{t("NYC/NJ to Upstate NY")}</div>
                    <div className="fw-semibold text-secondary d-flex align-items-center gap-1">
                      <span>Fort Lee / Paramus</span> <ArrowRight size={12} /> <span>Utica</span>
                    </div>
                  </Card>
                </Col>
              </>
            )}
          </Row>
        </div>

        <hr className="my-5 text-black-50" />

        {/* TRAVEL RULES SECTION */}
        <div className="mb-5">
          <div className="d-flex align-items-center gap-2 mb-4 justify-content-center">
            <InfoCircleFill size={24} className="text-primary" />
            <h3 className="fw-bold mb-0 homepage-text-black">{t("Important Travel Rules")}</h3>
          </div>
          <Row className="g-3">
            <Col md={3} className="col-12 col-sm-6">
              <Card className="h-100 border-0 bg-light p-3" style={{ borderRadius: "12px" }}>
                <Card.Body className="p-2">
                  <h6 className="fw-bold mb-2 homepage-text-black">{t("Arrive Early")}</h6>
                  <small className="d-block homepage-text-black">{t("Please arrive at the departure point 15-20 minutes before schedule. Boarding doors close 5 minutes prior to departure.")}</small>
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
                  <small className="d-block homepage-text-black">{t("Tickets include 1 personal carry-on Luggage and 1 Personal Item. Large Bulky Luggage is NOT allowed.")}</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="col-12 col-sm-6">
              <Card className="h-100 border-0 bg-light p-3" style={{ borderRadius: "12px" }}>
                <Card.Body className="p-2">
                  <h6 className="fw-bold mb-2 homepage-text-black">{t("Cancellation & Refund Policy")}</h6>
                  <small className="d-block homepage-text-black">{t("Cancellations are allowed before departure. Receive a 100% refund with flex option. 50% if 24h+ in advance, 30% if less than 24h. Same-day or no-show: ticket is forfeited.")}</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="col-12 col-sm-6">
              <Card className="h-100 border-0 bg-light p-3" style={{ borderRadius: "12px" }}>
                <Card.Body className="p-2">
                  <h6 className="fw-bold mb-2 homepage-text-black">{t("No Pets, No Smoking")}</h6>
                  <small className="d-block homepage-text-black">{t("Smoking and vaping are strictly prohibited inside all buses. Pets are not allowed on any routes.")}</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        <hr className="my-5 text-black-50" />

        {/* FAQ PREVIEW SECTION */}
        <div className="my-5 text-center">
          <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
            <QuestionCircleFill size={24} className="text-primary" />
            <h3 className="fw-bold mb-0 homepage-text-black">{t("Frequently Asked Questions")}</h3>
          </div>
          <p className="text-muted mb-4 mx-auto" style={{ maxWidth: "600px" }}>
            {t("Find quick answers about ticket pricing, schedules, luggage restrictions, and cancellation rules.")}
          </p>

          <Row className="g-4 text-start justify-content-center mb-4" style={{ maxWidth: "900px", margin: "0 auto" }}>
            <Col md={4}>
              <Card className="h-100 border-0 bg-white shadow-sm p-3" style={{ borderRadius: "12px" }}>
                <Card.Body>
                  <h6 className="fw-bold text-dark">{t("How much does a ticket cost?")}</h6>
                  <p className="text-secondary small mb-0">
                    {t("Adult / Standard fares are $60 + tax. Infants 1 year & under are $40 + tax.")}
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 bg-white shadow-sm p-3" style={{ borderRadius: "12px" }}>
                <Card.Body>
                  <h6 className="fw-bold text-dark">{t("What is the luggage allowance?")}</h6>
                  <p className="text-secondary small mb-0">
                    {t("1 personal item (max 25 lbs) and 1 carry-on suitcase (max 50 lbs, under 24 in). Large bulky bags are not allowed.")}
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0 bg-white shadow-sm p-3" style={{ borderRadius: "12px" }}>
                <Card.Body>
                  <h6 className="fw-bold text-dark">{t("What is the refund policy?")}</h6>
                  <p className="text-secondary small mb-0">
                    {t("100% refund with Flex Option. 50% refund at least 24h prior to travel. 30% same-day or no-show.")}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="d-flex flex-column align-items-center justify-content-center gap-2 mt-4">
            <span className="text-secondary" style={{ fontSize: "0.95rem" }}>
              {t("Please read Frequently asked questions for more")}
            </span>
            <Button
              variant="outline-primary"
              className="fw-bold px-4 py-2 hover-scale bg-white"
              onClick={() => navigate("/faq")}
              style={{ borderRadius: "8px", borderWidth: "2px" }}
            >
              {t("View All FAQs")}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Home;
