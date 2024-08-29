import React, { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoutes } from "../../../../../../store/slices/RoutesSlice";
import { fetchBusTypes } from "../../../../../../store/slices/BusTypeSlice";
import { ArrowDown } from "react-bootstrap-icons";

const AddNewBus = ({ handleClose, show }) => {
  const handleSubmit = () => {};
  const { routes } = useSelector((state) => state.routes);
  const { busTypes } = useSelector((state) => state.busType);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchRoutes());
    dispatch(fetchBusTypes());
  }, []);

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New Bus</Modal.Title>
      </Modal.Header>
      {/* {newCityError && <Alert variant="danger">{newCityError}</Alert>} */}
      <Modal.Body>
        <div className="mb-3 d-flex justify-content-start align-items-center flex-row gap-2">
          <div className="w-50 fw-semibold">Route:</div>
          <select className="form-control">
            {routes.map((route) => (
              <option value={route._id} key={route._id}>
                {route.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3 d-flex justify-content-start align-items-center flex-row gap-2">
          <div className="w-50 fw-semibold">Bus Type:</div>
          <select className="form-control">
            {busTypes.map((busType) => (
              <option value={busType._id} key={busType._id}>
                {busType.name}, {busType.seats} seat(s)
              </option>
            ))}
          </select>
        </div>

        <div className="d-flex flex-row align-items-center mb-3">
          <div style={{ width: "120px" }} className="fw-semibold">
            Route Details
          </div>
          <div
            className="w-100"
            style={{ height: 1, background: "#ddd" }}
          ></div>
        </div>

        {routes[1].locations.map((location, index) => {
          if (index == 0) {
            return (
              <>
                <div className="d-flex justify-content-start align-items-center flex-row gap-2">
                  <div className="w-50">{location.name}</div>
                  <div className="w-100 d-flex align-items-center flex-row">
                    <div className="w-50">Departure Time:</div>
                    <input type="time" className="form-control" />
                  </div>
                </div>
                <div className="d-flex flex-column align-items-start">
                  <ArrowDown size={30} className="my-2" />
                </div>
              </>
            );
          } else if (index === routes[1].locations.length - 1) {
            return (
              <div className="d-flex justify-content-start align-items-center flex-row gap-2">
                <div className="w-50">{location.name}</div>
                <div className="w-100 d-flex align-items-center flex-row">
                  <div className="w-50">Arrival Time:</div>
                  <input type="time" className="form-control" />
                </div>
              </div>
            );
          } else {
            return (
              <>
                <div className="d-flex justify-content-start align-items-center flex-row gap-2">
                  <div className="w-50">{location.name}</div>

                  <div className="d-flex flex-column justify-items-center w-100 gap-2">
                    <div className="w-100 d-flex align-items-center flex-row">
                      <div className="w-50">Arrival Time:</div>
                      <input type="time" className="form-control" />
                    </div>

                    <div className="w-100 d-flex align-items-center flex-row">
                      <div className="w-50">Departure Time:</div>
                      <input type="time" className="form-control" />
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-column align-items-start">
                  <ArrowDown size={30} className="my-2" />
                </div>
              </>
            );
          }
        })}

        <hr />

        <div className="my-3">
          <div className="d-flex justify-content-start align-items-center flex-row gap-2">
            <div className="w-50 fw-semibold">Period operating:</div>

            <div className="d-flex flex-row justify-items-center w-100 gap-2">
              <div className="w-100 d-flex align-items-center flex-row">
                <div className="w-50">From:</div>
                <input type="date" className="form-control" />
              </div>

              <div className="w-100 d-flex align-items-center flex-row">
                <div className="w-50">To:</div>
                <input type="date" className="form-control" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3 d-flex justify-content-start align-items-start flex-row gap-2">
            <div className="w-50 fw-semibold">Recurring:</div>
            <div className="w-100">
              <div className="d-flex flex-row gap-2 align-items-center">
                <input type="checkbox" checked />
                <span>Every Monday</span>
              </div>

              <div className="d-flex flex-row gap-2 align-items-center">
                <input type="checkbox" checked />
                <span>Every Tuesday</span>
              </div>
              <div className="d-flex flex-row gap-2 align-items-center">
                <input type="checkbox" checked />
                <span>Every Wednesday</span>
              </div>
              <div className="d-flex flex-row gap-2 align-items-center">
                <input type="checkbox" checked />
                <span>Every Thursday</span>
              </div>
              <div className="d-flex flex-row gap-2 align-items-center">
                <input type="checkbox" checked />
                <span>Every Friday</span>
              </div>
              <div className="d-flex flex-row gap-2 align-items-center">
                <input type="checkbox" checked />
                <span>Every Saturday</span>
              </div>
              <div className="d-flex flex-row gap-2 align-items-center">
                <input type="checkbox" checked />
                <span>Every Sunday</span>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          // disabled={isNewCityLoading}
        >
          {/* {isNewCityLoading ? "loading..." : "Save"} */}
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddNewBus;
