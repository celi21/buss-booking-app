import React, { useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewCity,
  setNewCityError,
} from "../../../../../../store/slices/RoutesSlice";
import toast from "react-hot-toast";

const AddCity = ({ show, handleClose }) => {
  const [name, setName] = useState(null);
  const { isNewCityLoading, newCityError } = useSelector(
    (state) => state.routes
  );
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || name.trim() === "") {
      dispatch(setNewCityError("Please fill all the fields"));
      toast.error("Please fill all the fields", {
        duration: 4000,
      });
      return;
    }

    dispatch(addNewCity({ name }));
    setName(null);
    dispatch(setNewCityError(null));
    if (!isNewCityLoading) {
      handleClose();
      toast.success("City Added Successfully", {
        duration: 4000,
      });
    }
  };
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New City</Modal.Title>
      </Modal.Header>
      {/* {newCityError && <Alert variant="danger">{newCityError}</Alert>} */}
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
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isNewCityLoading}
        >
          {isNewCityLoading ? "loading..." : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddCity;
