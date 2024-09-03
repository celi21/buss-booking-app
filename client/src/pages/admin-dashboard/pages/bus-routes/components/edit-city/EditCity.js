import React, { useEffect, useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  editCityItem,
  setEditCityError,
} from "../../../../../../store/slices/RoutesSlice";
import toast from "react-hot-toast";

const EditCity = ({ show, handleClose }) => {
  const { editCityObject, isEditCityLoading, editCityError } = useSelector(
    (state) => state.routes
  );
  const [name, setName] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (editCityObject) {
      setName(editCityObject.name);
    }
  }, [editCityObject]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || name.trim() === "") {
      dispatch(setEditCityError("Please fill all the fields"));
      toast.error("Please fill all the fields", {
        duration: 4000,
      });
      return;
    }

    dispatch(
      editCityItem({
        ...editCityObject,
        name,
      })
    );
    setName(null);
    dispatch(setEditCityError(null));
    if (!isEditCityLoading) {
      handleClose();
      toast.success("City Updated Successfully", {
        duration: 4000,
      });
    }
  };
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit City</Modal.Title>
      </Modal.Header>
      {/* {editCityError && <Alert variant="danger">{editCityError}</Alert>} */}
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="city-name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="city-name"
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
          disabled={isEditCityLoading}
        >
          {isEditCityLoading ? "loading..." : "Update"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditCity;
