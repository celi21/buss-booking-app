import React from "react";
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

const GuestRegisterModal = ({ showModal, handleClose }) => {
  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Continue as Guest or Register</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          You can proceed with booking without creating an account, but you
          won't be able to view your booking history or manage your bookings
          later.
        </p>
        <p>
          If you register, you can track your bookings and have a more
          personalized experience.
        </p>
        <p>Choose the option that works best for you!</p>
      </Modal.Body>
      <Modal.Footer>
        <Link to="/booking">
          <Button variant="secondary">Continue as Guest</Button>
        </Link>
        <Link to="/signup">
          <Button variant="primary">Register / Login</Button>
        </Link>
      </Modal.Footer>
    </Modal>
  );
};

export default GuestRegisterModal;
