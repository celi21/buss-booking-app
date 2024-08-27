import React, { useEffect, useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import LocationsDragDrop from "../locations-drag-drop/LocationsDragDrop";
import {
  addNewRoute,
  fetchCities,
  setNewRouteError,
} from "../../../../../../store/slices/RoutesSlice";

const AddRoute = ({ show, handleClose }) => {
  const [title, setTitle] = useState(null);
  const [locationsList, setLocationsList] = useState([
    {
      id: `location-1`,
      name: null,
      routeIndex: 1,
      cityId: null,
    },
  ]);
  const { newRouteError, cities, isNewRouteLoading } = useSelector(
    (state) => state.routes
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCities());
  }, []);

  const handleSubmit = (e) => {
    if (!title || title.trim() === "") {
      dispatch(setNewRouteError("Please provide title for route"));
      return;
    }

    // check if any location is empty
    for (let i = 0; i < locationsList.length; i++) {
      if (!locationsList[i].name) {
        dispatch(setNewRouteError("Please select location for all the fields"));
        return;
      } else if (!locationsList[i].routeIndex || !locationsList[i].cityId) {
        dispatch(setNewRouteError("Something went wrong"));
        return;
      }
    }

    if (locationsList.length <= 0 || locationsList.length <= 1) {
      dispatch(setNewRouteError("Please add at least two locations"));
      return;
    }
    console.log(locationsList, "submit");

    const fromLocation = locationsList[0].cityId;
    const toLocation = locationsList[locationsList.length - 1].cityId;
    const locations = locationsList.map((loc) => loc.cityId);

    dispatch(
      addNewRoute({
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
        cityId: null,
      },
    ]);

    dispatch(setNewRouteError(null));
    if (!isNewRouteLoading) handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New Route</Modal.Title>
      </Modal.Header>
      {newRouteError && <Alert variant="danger">{newRouteError}</Alert>}
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
          disabled={isNewRouteLoading}
        >
          {isNewRouteLoading ? "loading..." : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddRoute;
