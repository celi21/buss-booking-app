import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import busStopImage from "../assets/busstop.png";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import GuestRegisterModal from "./components/GuestRegisterModal";
import { useSelector } from "react-redux";
import { translateText } from "../utils/translation";
import toast, { Toaster } from "react-hot-toast";

function Home() {
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const { user } = useSelector((state) => state.auth);

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
  const selectedLanguage = useSelector(
    (state) => state.settings.selectedLanguage
  );

  return (
    <Container>
      <Toaster />
      {showModal && (
        <GuestRegisterModal showModal={showModal} handleClose={handleClose} />
      )}
      <Row className="mt-4">
        <Col className="col-12 col-lg-6 d-flex flex-column justify-content-center">
          <h1>
            Bueno Express Transportion{" "}
            {selectedLanguage &&
              translateText("Booking Portal", selectedLanguage.code)}
          </h1>
          <h4>
            {selectedLanguage &&
              translateText("Be great", selectedLanguage.code)}
          </h4>
          <div className="mt-3 d-flex flex-row align-items-center gap-2">
            <Button
              variant="primary"
              type="submit"
              className="p-2 px-4 w-auto fw-semibold"
              onClick={() => handleBookNow()}
            >
              {selectedLanguage &&
                translateText("Book Now", selectedLanguage.code)}
            </Button>

            <Button
              type="submit"
              className="p-2 px-4 w-auto text-primary btn btn-outline-primary bg-white fw-semibold"
              style={{
                borderWidth: 2,
              }}
              onClick={() => handleBookingDetails()}
            >
              {selectedLanguage &&
                translateText(
                  "View your Booking Details",
                  selectedLanguage.code
                )}
            </Button>
          </div>
        </Col>
        <Col className="col-12 col-lg-6">
          <img src={busStopImage} alt="Bus Stop" className="w-100"></img>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
