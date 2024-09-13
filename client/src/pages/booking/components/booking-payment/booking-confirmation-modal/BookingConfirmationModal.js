import React from "react";
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

const BookingConfirmationModal = ({ showModal, setShowModal, booking }) => {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Booking Confirmed!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h3>Booking ID: {booking?.bookingId}</h3>
        <p>Your booking has been successfully completed! 🎉</p>
        <p>
          We’re excited to have you on board! Please keep your booking details
          handy. You can always view and manage your booking at any time using
          the link below.
        </p>
        <p>
          If you need assistance or want to make changes to your booking, feel
          free to contact our support team.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
        <Link to={`/booking/${booking?.bookingId}`}>
          <Button variant="primary">View Your Booking Details</Button>
        </Link>
      </Modal.Footer>
    </Modal>
  );
};

export default BookingConfirmationModal;
