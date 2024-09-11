import React from "react";
import { Button, Modal } from "react-bootstrap";
import { Check } from "react-bootstrap-icons";

const ShowRouteDetailsModal = ({
  showRouteModal,
  setShowRouteModal,
  locations,
}) => {
  return (
    <Modal
      show={showRouteModal}
      onHide={() => setShowRouteModal(false)}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Destinations</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul
          className="m-0 p-0"
          style={{
            listStyle: "none",
          }}
        >
          {locations.map((location, index) => {
            return (
              <li
                key={index}
                className="d-flex flex-row align-items-center mb-2"
              >
                <Check size={30} className="text-primary" />
                <div>
                  {location.city.name} -{" "}
                  {index == 0 ? location.departureTime : location.arrivalTime}
                </div>
              </li>
            );
          })}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowRouteModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShowRouteDetailsModal;
