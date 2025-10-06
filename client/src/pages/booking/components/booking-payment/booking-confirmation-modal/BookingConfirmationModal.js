import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { translateText } from "../../../../../utils/translation";

const BookingConfirmationModal = ({ showModal, setShowModal, booking, resetForm }) => {
  const selectedLanguage = useSelector(
    (state) => state.settings.selectedLanguage
  );

  const handleClose = () => {
    setShowModal(false);
    // Reset form when modal closes to prepare for next booking
    if (resetForm) {
      setTimeout(() => {
        resetForm();
      }, 300);
    }
  };

  // Check if this is a round-trip booking
  const isRoundTrip = booking?.returnBooking;
  const outboundBooking = booking?.booking || booking;

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedLanguage &&
            translateText("Booking Confirmed", selectedLanguage.code)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isRoundTrip ? (
          <>
            <h4 className="mb-3">🎉 Round-Trip Booking Confirmed!</h4>
            <div className="mb-3 p-3 bg-light rounded">
              <h5>Outbound Trip</h5>
              <p className="mb-1">
                <strong>Booking ID:</strong> {outboundBooking?.bookingId || 'Processing...'}
              </p>
              <p className="mb-0">
                <strong>Date:</strong> {outboundBooking?.bookingDate || 'N/A'}
              </p>
            </div>
            <div className="mb-3 p-3 bg-light rounded">
              <h5>Return Trip</h5>
              <p className="mb-1">
                <strong>Booking ID:</strong> {booking?.returnBooking?.bookingId || 'Processing...'}
              </p>
              <p className="mb-0">
                <strong>Date:</strong> {booking?.returnBooking?.bookingDate || 'N/A'}
              </p>
            </div>
          </>
        ) : (
          <h3>
            {selectedLanguage && translateText("booking", selectedLanguage.code)}{" "}
            ID: {outboundBooking?.bookingId || 'Processing...'}
          </h3>
        )}
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
        <Button variant="secondary" onClick={handleClose}>
          {selectedLanguage && translateText("close", selectedLanguage.code)}
        </Button>
        {outboundBooking?.bookingId ? (
          <Link to={`/booking/${outboundBooking.bookingId}`}>
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