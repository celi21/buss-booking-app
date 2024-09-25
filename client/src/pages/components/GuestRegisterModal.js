import React from "react";
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { translateText } from "../../utils/translation";
import { useSelector } from "react-redux";

const GuestRegisterModal = ({ showModal, handleClose }) => {
  const selectedLanguage = useSelector(
    (state) => state.settings.selectedLanguage
  );

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedLanguage &&
            translateText("GuestModalTitle", selectedLanguage.code)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          {selectedLanguage &&
            translateText("GuestModalTitleP1", selectedLanguage.code)}
        </p>
        <p>
          {selectedLanguage &&
            translateText("GuestModalTitleP2", selectedLanguage.code)}
        </p>
        <p>
          {selectedLanguage &&
            translateText("GuestModalTitleP3", selectedLanguage.code)}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Link to="/booking">
          <Button variant="secondary">
            {selectedLanguage &&
              translateText("GuestCloseBtn", selectedLanguage.code)}
          </Button>
        </Link>
        <Link to="/signup">
          <Button variant="primary">
            {selectedLanguage &&
              translateText("Register", selectedLanguage.code)}{" "}
            /{" "}
            {selectedLanguage && translateText("Login", selectedLanguage.code)}
          </Button>
        </Link>
      </Modal.Footer>
    </Modal>
  );
};

export default GuestRegisterModal;
