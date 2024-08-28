import React, { useEffect, useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import LocationsDragDrop from "../locations-drag-drop/LocationsDragDrop";
import {
  editRouteItem,
  fetchCities,
  setEditRouteError,
} from "../../../../../../store/slices/RoutesSlice";

const EditRoute = ({ show, handleClose }) => {
  const { editRouteObject, isEditRouteLoading, editRouteError, cities } =
    useSelector((state) => state.routes);
  const [title, setTitle] = useState(null);
  const [locationsList, setLocationsList] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCities());
  }, []);

  useEffect(() => {
    if (editRouteObject) {
      console.log(editRouteObject);
      setTitle(editRouteObject.name);

      // loop over locations and add routeIndex to each location
      const locations = editRouteObject.locations.map((loc, index) => {
        return {
          ...loc,
          id: `location-${index + 1}`,
          routeIndex: index + 1,
        };
      });
      setLocationsList(locations);
    }
  }, [editRouteObject]);

  const handleSubmit = (e) => {
    if (!title || title.trim() === "") {
      dispatch(setEditRouteError("Please provide title for route"));
      return;
    }

    // check if any location is empty
    for (let i = 0; i < locationsList.length; i++) {
      if (!locationsList[i].name) {
        dispatch(
          setEditRouteError("Please select location for all the fields")
        );
        return;
      } else if (!locationsList[i].routeIndex || !locationsList[i]._id) {
        dispatch(setEditRouteError("Something went wrong"));
        return;
      }
    }

    if (locationsList.length <= 0 || locationsList.length <= 1) {
      dispatch(setEditRouteError("Please add at least two locations"));
      return;
    }

    const fromLocation = locationsList[0]._id;
    const toLocation = locationsList[locationsList.length - 1]._id;
    const locations = locationsList.map((loc) => loc._id);

    console.log(locationsList, toLocation, fromLocation, "submit");

    dispatch(
      editRouteItem({
        ...editRouteObject,
        name: title,
        from: fromLocation,
        to: toLocation,
        locations: locations,
      })
    );
    setTitle(null);
    setLocationsList([
      {
        id: `location-1`,
        name: null,
        routeIndex: 1,
        _id: null,
      },
    ]);

    dispatch(setEditRouteError(null));
    if (!isEditRouteLoading) handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Route</Modal.Title>
      </Modal.Header>
      {editRouteError && <Alert variant="danger">{editRouteError}</Alert>}
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              placeholder="Enter title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>
          <div className="mb-1">
            <label className="form-label mb-0">Locations</label>
            <div>
              <small className="text-muted">
                <b>Note:</b> Only cities with status active will be shown here.
              </small>
              <small className="text-muted">
                {" "}
                Drag and drop the locations vertically to reorder them according
                to the route.
              </small>
            </div>
          </div>

          <div>
            <LocationsDragDrop
              locationsList={locationsList}
              setLocationsList={setLocationsList}
              cities={cities}
              setTitle={setTitle}
              isEditModal={true}
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
          disabled={isEditRouteLoading}
        >
          {isEditRouteLoading ? "loading..." : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditRoute;
