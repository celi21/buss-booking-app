import React, { useEffect, useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoutes } from "../../../../../../store/slices/RoutesSlice";
import { fetchBusTypes } from "../../../../../../store/slices/BusTypeSlice";
import { ArrowDown } from "react-bootstrap-icons";
import LoadingSpinner from "../../../../../../components/loading-spinner/LoadingSpinner";
import {
  addNewBus,
  setAddNewBusError,
} from "../../../../../../store/slices/BusSlice";
import toast from "react-hot-toast";

const AddNewBus = ({ handleClose, show }) => {
  const { routes, isRoutesLoading } = useSelector((state) => state.routes);
  const { addNewBusError, addNewBusLoading } = useSelector(
    (state) => state.bus
  );
  const { busTypes } = useSelector((state) => state.busType);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedBusType, setSelectedBusType] = useState(null);
  const [periodOperatingFrom, setPeriodOperatingFrom] = useState(null);
  const [periodOperatingTo, setPeriodOperatingTo] = useState(null);
  const [recurring, setRecurring] = useState([
    { id: 1, name: "Monday", checked: false },
    { id: 2, name: "Tuesday", checked: false },
    { id: 3, name: "Wednesday", checked: false },
    { id: 4, name: "Thursday", checked: false },
    { id: 5, name: "Friday", checked: false },
    { id: 6, name: "Saturday", checked: false },
    { id: 7, name: "Sunday", checked: false },
  ]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchRoutes());
    dispatch(fetchBusTypes());
  }, []);

  const handleRouteChange = (e) => {
    if (e.target.value) {
      let findRoute = routes.find((r) => r._id == e.target.value);
      if (findRoute) {
        // map over locations and add arrival and departure time to null
        let updatedLocations = findRoute.locations.map((location, index) => {
          if (index == 0) {
            return {
              ...location,
              departureTime: null,
            };
          } else if (index == findRoute.locations.length - 1) {
            return {
              ...location,
              arrivalTime: null,
            };
          } else {
            return {
              ...location,
              arrivalTime: null,
              departureTime: null,
            };
          }
        });

        setSelectedRoute({
          ...findRoute,
          locations: updatedLocations,
        });
      }
    } else {
      setSelectedRoute(null);
    }
  };

  const formatTime = (time) => {
    let timeSplit = time.split(":"); // hours:minutes
    let hours = timeSplit[0];
    let minutes = timeSplit[1];
    let meridian = "";
    if (hours > 12) {
      meridian = "PM";
      hours -= 12;
    } else if (hours < 12) {
      meridian = "AM";
      if (hours == 0) {
        hours = 12;
      }
    } else {
      meridian = "PM";
    }
    return `${hours}:${minutes}:${meridian}`;
  };

  const handleTimeChange = (e, locId, index, type) => {
    if (!e.target.value || !selectedRoute || !locId) {
      console.log("object");
      return;
    }
    let time = formatTime(e.target.value);

    let updatedLocations = selectedRoute.locations.map((loc, index) => {
      if (loc._id === locId) {
        if (type == "departure") {
          return {
            ...loc,
            departureTime: time,
          };
        } else if (type == "arrival") {
          return {
            ...loc,
            arrivalTime: time,
          };
        }
      } else {
        return loc;
      }
    });
    setSelectedRoute({
      ...selectedRoute,
      locations: updatedLocations,
    });
  };

  const handleBusTypeChange = (e) => {
    if (!e.target.value) {
      setSelectedBusType(null);
      return;
    }
    setSelectedBusType(e.target.value);
  };

  const handleRecurringCheckbox = (e, day) => {
    if (!day) return;
    let updatedRecurring = recurring.map((d) => {
      if (d.id == day.id) {
        return {
          ...d,
          checked: !d.checked,
        };
      }
      return d;
    });

    setRecurring(updatedRecurring);
  };

  const handleSubmit = () => {
    if (!selectedRoute) {
      dispatch(setAddNewBusError("Please choose a route"));
      toast.error("Please choose a route", {
        duration: 4000,
      });
      return;
    }
    if (!selectedBusType) {
      toast.error("Please choose a bus type", {
        duration: 4000,
      });
      dispatch(setAddNewBusError("Please choose a bus type"));
      return;
    }

    for (let i = 0; i < selectedRoute.locations.length; i++) {
      let loc = selectedRoute.locations[i];
      if (i == 0) {
        if (loc.departureTime == null || loc.departureTime == "") {
          toast.error("Please select departure time for starting location", {
            duration: 4000,
          });
          dispatch(
            setAddNewBusError(
              "Please select departure time for starting location"
            )
          );
          return;
        }
      } else if (i == selectedRoute.locations.length - 1) {
        if (loc.arrivalTime == null || loc.arrivalTime == "") {
          toast.error("Please select arrival time for the destination", {
            duration: 4000,
          });
          dispatch(
            setAddNewBusError("Please select arrival time for the destination")
          );
          return;
        }
      } else {
        if (
          loc.arrivalTime == null ||
          loc.arrivalTime == "" ||
          loc.departureTime == null ||
          loc.departureTime == ""
        ) {
          toast.error(
            "Please select arrival and departure time for all locations",
            {
              duration: 4000,
            }
          );
          dispatch(
            setAddNewBusError(
              "Please select arrival and departure time for all locations"
            )
          );
          return;
        }
      }
    }

    if (
      !periodOperatingFrom ||
      periodOperatingFrom.trim() == "" ||
      periodOperatingFrom == null
    ) {
      toast.error("Please select period operating from date", {
        duration: 4000,
      });
      dispatch(setAddNewBusError("Please select period operating from date"));
      return;
    }

    if (
      !periodOperatingTo ||
      periodOperatingTo.trim() == "" ||
      periodOperatingTo == null
    ) {
      toast.error("Please select period operating to date", {
        duration: 4000,
      });
      dispatch(setAddNewBusError("Please select period operating to date"));
      return;
    }

    const busObject = {
      routeId: selectedRoute._id,
      busTypeId: selectedBusType,
      locations: selectedRoute.locations,
      periodOperatingFrom,
      periodOperatingTo,
      recurring,
    };

    dispatch(addNewBus(busObject));
    dispatch(setAddNewBusError(null));
    setSelectedRoute(null);
    setSelectedBusType(null);
    setPeriodOperatingFrom(null);
    setPeriodOperatingTo(null);
    setRecurring([
      { id: 1, name: "Monday", checked: false },
      { id: 2, name: "Tuesday", checked: false },
      { id: 3, name: "Wednesday", checked: false },
      { id: 4, name: "Thursday", checked: false },
      { id: 5, name: "Friday", checked: false },
      { id: 6, name: "Saturday", checked: false },
      { id: 7, name: "Sunday", checked: false },
    ]);
    if (!addNewBusLoading) {
      toast.success("New Bus Added Successfully", {
        duration: 4000,
      });
      handleClose();
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        setSelectedRoute(null);
        setSelectedBusType(null);
        dispatch(setAddNewBusError(null));
        handleClose();
        setPeriodOperatingFrom(null);
        setPeriodOperatingTo(null);
      }}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Add New Bus</Modal.Title>
      </Modal.Header>
      {/* {addNewBusError && <Alert variant="danger">{addNewBusError}</Alert>} */}
      <Modal.Body>
        <div className="mb-3 d-flex justify-content-start align-items-center flex-row gap-2">
          <div className="w-50 fw-semibold">Route:</div>
          <select
            className="form-control"
            onChange={(e) => handleRouteChange(e)}
          >
            <option value="" key="">
              Choose a Route
            </option>
            {routes.map((route) => (
              <option value={route._id} key={route._id}>
                {route.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3 d-flex justify-content-start align-items-center flex-row gap-2">
          <div className="w-50 fw-semibold">Bus Type:</div>
          <select
            className="form-control"
            onChange={(e) => {
              handleBusTypeChange(e);
            }}
          >
            <option value="" key="">
              Choose a Bus Type
            </option>
            {busTypes.map((busType) => (
              <option value={busType._id} key={busType._id}>
                {busType.name}, {busType.seats} seat(s)
              </option>
            ))}
          </select>
        </div>

        <hr />

        <div className="mb-3">
          <div className="fw-semibold">Route Details</div>
          <div className="d-flex justify-content-center">
            <small>
              <i>{selectedRoute == null && "Please Choose a Route"}</i>
            </small>
          </div>
        </div>

        {selectedRoute &&
          selectedRoute.locations.map((location, index) => {
            if (index == 0) {
              return (
                <>
                  <div className="d-flex justify-content-start align-items-center flex-row gap-2">
                    <div className="w-50">{location.name}</div>
                    <div className="w-100 d-flex align-items-center flex-row">
                      <div className="w-50">Departure Time:</div>
                      <input
                        type="time"
                        className="form-control"
                        onChange={(e) => {
                          handleTimeChange(e, location._id, index, "departure");
                        }}
                      />
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-start">
                    <ArrowDown size={30} className="my-2" />
                  </div>
                </>
              );
            } else if (index === selectedRoute.locations.length - 1) {
              return (
                <div className="d-flex justify-content-start align-items-center flex-row gap-2">
                  <div className="w-50">{location.name}</div>
                  <div className="w-100 d-flex align-items-center flex-row">
                    <div className="w-50">Arrival Time:</div>
                    <input
                      type="time"
                      className="form-control"
                      onChange={(e) => {
                        handleTimeChange(e, location._id, index, "arrival");
                      }}
                    />
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
                        <input
                          type="time"
                          className="form-control"
                          onChange={(e) => {
                            handleTimeChange(e, location._id, index, "arrival");
                          }}
                        />
                      </div>

                      <div className="w-100 d-flex align-items-center flex-row">
                        <div className="w-50">Departure Time:</div>
                        <input
                          type="time"
                          className="form-control"
                          onChange={(e) => {
                            handleTimeChange(
                              e,
                              location._id,
                              index,
                              "departure"
                            );
                          }}
                        />
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
                <input
                  type="date"
                  className="form-control"
                  onChange={(e) => {
                    if (!e.target.value) {
                      setPeriodOperatingFrom(null);
                      return;
                    }
                    setPeriodOperatingFrom(e.target.value);
                  }}
                />
              </div>

              <div className="w-100 d-flex align-items-center flex-row">
                <div className="w-50">To:</div>
                <input
                  type="date"
                  className="form-control"
                  onChange={(e) => {
                    if (!e.target.value) {
                      setPeriodOperatingTo(null);
                      return;
                    }
                    setPeriodOperatingTo(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3 d-flex justify-content-start align-items-start flex-row gap-2">
            <div className="w-50 fw-semibold">Recurring:</div>
            <div className="w-100">
              {recurring.map((day, index) => {
                return (
                  <div
                    className="d-flex flex-row gap-2 align-items-center"
                    key={day.id}
                  >
                    <input
                      type="checkbox"
                      checked={day.checked}
                      onChange={(e) => {
                        handleRecurringCheckbox(e.target.value, day);
                      }}
                    />
                    <span>Every {day.name}</span>
                  </div>
                );
              })}
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
          disabled={addNewBusLoading}
        >
          {addNewBusLoading ? "loading..." : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddNewBus;
