import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { translateText } from "../../../../../utils/translation";

const BookingConfirmationModal = ({ showModal, setShowModal, booking }) => {
  const selectedLanguage = useSelector(
    (state) => state.settings.selectedLanguage
  );

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedLanguage &&
            translateText("Booking Confirmed", selectedLanguage.code)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h3>
          {selectedLanguage && translateText("booking", selectedLanguage.code)}{" "}
          ID: {booking?.bookingId || 'Processing...'}
        </h3>
        <p>
          {selectedLanguage &&
            translateText("booking-modal-p1", selectedLanguage.code)}
        </p>
        <p>
          {selectedLanguage &&
            translateText("booking-modal-p2", selectedLanguage.code)}
        </p>
        <p>
          {selectedLanguage &&
            translateText("booking-modal-p3", selectedLanguage.code)}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          {selectedLanguage && translateText("close", selectedLanguage.code)}
        </Button>
        {booking?.bookingId ? (
          <Link to={`/booking/${booking.bookingId}`}>
            <Button variant="primary">
              {selectedLanguage &&
                translateText("view-booking-details", selectedLanguage.code)}
            </Button>
          </Link>
        ) : (
          <Button variant="primary" disabled>
            {selectedLanguage &&
              translateText("view-booking-details", selectedLanguage.code)}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default BookingConfirmationModal;