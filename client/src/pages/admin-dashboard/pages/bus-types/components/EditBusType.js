import React, { useEffect, useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  editBusType,
  clearEditBusTypeError,
  setEditBusTypeError,
  setEditBusTypeObject,
} from "../../../../../store/slices/BusTypeSlice";

const EditBusType = ({ show, handleClose }) => {
  const { editBusTypeObject } = useSelector((state) => state.busType);
  const [name, setName] = useState(null);
  const [seats, setSeats] = useState(0);
  const { isEditBusTypeLoading, editBusTypeError } = useSelector(
    (state) => state.busType
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (editBusTypeObject) {
      setName(editBusTypeObject.name);
      setSeats(editBusTypeObject.seats);
    }
  }, [editBusTypeObject]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !seats || name.trim() === "") {
      dispatch(setEditBusTypeError("Please fill all the fields"));
      return;
    }

    if (parseInt(seats) <= 0) {
      dispatch(setEditBusTypeError("Seats must be greater than 0"));
      return;
    }
    dispatch(
      editBusType({
        ...editBusTypeObject,
        name,
        seats,
      })
    );
    setName(null);
    setSeats(0);
    dispatch(clearEditBusTypeError());
    if (!isEditBusTypeLoading) handleClose();
  };
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Bus Type</Modal.Title>
      </Modal.Header>
      {editBusTypeError && <Alert variant="danger">{editBusTypeError}</Alert>}
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
          disabled={isEditBusTypeLoading}
        >
          {isEditBusTypeLoading ? "loading..." : "Update"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditBusType;
