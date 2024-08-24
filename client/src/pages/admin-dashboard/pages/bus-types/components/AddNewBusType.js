import React, { useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewBusType,
  clearNewBusTypeError,
  setNewBusTypeError,
} from "../../../../../store/slices/BusTypeSlice";

const AddNewBusType = ({ show, handleClose }) => {
  const [name, setName] = useState(null);
  const [seats, setSeats] = useState(0);
  const { isNewBusTypeLoading, newBusTypeError } = useSelector(
    (state) => state.busType
  );
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !seats || name.trim() === "") {
      dispatch(setNewBusTypeError("Please fill all the fields"));
      return;
    }

    if (parseInt(seats) <= 0) {
      dispatch(setNewBusTypeError("Seats must be greater than 0"));
      return;
    }
    dispatch(addNewBusType({ name, seats }));
    setName(null);
    setSeats(0);
    dispatch(clearNewBusTypeError());
    if (!isNewBusTypeLoading) handleClose();
  };
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Bus Type</Modal.Title>
      </Modal.Header>
      {newBusTypeError && <Alert variant="danger">{newBusTypeError}</Alert>}
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="bus-type-name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="bus-type-name"
              placeholder="Enter name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="bus-type-seats" className="form-label">
              Number of Seats
            </label>
            <input
              type="number"
              className="form-control"
              id="bus-type-seats"
              placeholder="Enter number of seats"
              onChange={(e) => setSeats(e.target.value)}
              value={seats}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isNewBusTypeLoading}
        >
          {isNewBusTypeLoading ? "loading..." : "Add"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddNewBusType;
