import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoutes } from "../../../../../../../store/slices/RoutesSlice";
import { fetchBusTypes } from "../../../../../../../store/slices/BusTypeSlice";
import { ArrowDown } from "react-bootstrap-icons";

const EditBusGeneralSettings = () => {
  const { fetchBusObject } = useSelector((state) => state.bus);
  const { routes } = useSelector((state) => state.routes);
  const { busTypes } = useSelector((state) => state.busType);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedBusType, setSelectedBusType] = useState(null);
  const [periodOperatingFrom, setPeriodOperatingFrom] = useState(null);
  const [periodOperatingTo, setPeriodOperatingTo] = useState(null);
  const [recurring, setRecurring] = useState([]);

  useEffect(() => {
    if (fetchBusObject) {
      setSelectedBusType(fetchBusObject.busType._id);
      setPeriodOperatingFrom(fetchBusObject.periodStartDate);
      setPeriodOperatingTo(fetchBusObject.periodEndDate);
      setRecurring(fetchBusObject.recurring);
      setSelectedRoute(fetchBusObject);
    }
  }, [fetchBusObject]);

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

  const handleBusTypeChange = (e) => {
    if (!e.target.value) {
      setSelectedBusType(null);
      return;
    }
    setSelectedBusType(e.target.value);
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

  const timeInputDefaultValue = (timeString) => {
    const [time, meridian] = timeString.includes("AM")
      ? timeString.split(":AM")
      : timeString.split(":PM");
    var hours = parseInt(time.split(":")[0]);
    var minutes = time.split(":")[1];
    if (meridian === "PM" && hours !== 12) {
      hours += 12;
    } else if (meridian === "AM" && hours === 12) {
      hours = 0;
    }
    console.log(`${hours.toString().padStart(2, "0")}:${minutes}`);
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  };

  return (
    <Container fluid>
      <div className="mb-3 d-flex justify-content-start align-items-center flex-row gap-2">
        <div className="w-50 fw-semibold">Bus Type:</div>
        <select
          className="form-control"
          defaultValue={selectedBusType}
          onChange={(e) => {
            handleBusTypeChange(e);
          }}
        >
          <option value="" key="">
            Choose a Bus Type
          </option>
          {busTypes.map((busType) => (
            <option
              value={busType._id}
              key={busType._id}
              selected={selectedBusType == busType._id}
            >
              {busType.name}, {busType.seats} seat(s)
            </option>
          ))}
        </select>
      </div>

      <hr />

      <div className="mb-3">
        <div className="fw-semibold">Route Details</div>
      </div>

      {selectedRoute &&
        selectedRoute.locations.map((location, index) => {
          if (index == 0) {
            return (
              <>
                <div className="d-flex justify-content-start align-items-center flex-row gap-2">
                  <div className="w-50">{location.city.name}</div>
                  <div className="w-100 d-flex align-items-center flex-row">
                    <div className="w-50">Departure Time:</div>
                    <input
                      type="time"
                      className="form-control"
                      defaultValue={timeInputDefaultValue(
                        location.departureTime
                      )}
                      onChange={(e) => {
                        handleTimeChange(
                          e,
                          location.city._id,
                          index,
                          "departure"
                        );
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
                <div className="w-50">{location.city.name}</div>
                <div className="w-100 d-flex align-items-center flex-row">
                  <div className="w-50">Arrival Time:</div>
                  <input
                    type="time"
                    className="form-control"
                    defaultValue={timeInputDefaultValue(location.arrivalTime)}
                    onChange={(e) => {
                      handleTimeChange(e, location.city._id, index, "arrival");
                    }}
                  />
                </div>
              </div>
            );
          } else {
            return (
              <>
                <div className="d-flex justify-content-start align-items-center flex-row gap-2">
                  <div className="w-50">{location.city.name}</div>

                  <div className="d-flex flex-column justify-items-center w-100 gap-2">
                    <div className="w-100 d-flex align-items-center flex-row">
                      <div className="w-50">Arrival Time:</div>
                      <input
                        type="time"
                        className="form-control"
                        defaultValue={timeInputDefaultValue(
                          location.arrivalTime
                        )}
                        onChange={(e) => {
                          handleTimeChange(
                            e,
                            location.city._id,
                            index,
                            "arrival"
                          );
                        }}
                      />
                    </div>

                    <div className="w-100 d-flex align-items-center flex-row">
                      <div className="w-50">Departure Time:</div>
                      <input
                        type="time"
                        className="form-control"
                        defaultValue={timeInputDefaultValue(
                          location.departureTime
                        )}
                        onChange={(e) => {
                          handleTimeChange(
                            e,
                            location.city._id,
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
                value={periodOperatingFrom}
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
                value={periodOperatingTo}
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

      <hr />

      <div className="w-100 d-flex flex-row gap-2">
        <Button
          variant="secondary"
          // onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          // onClick={handleSubmit}
          // disabled={addNewBusLoading}
        >
          Update
          {/* {addNewBusLoading ? "loading..." : "Save"} */}
        </Button>
      </div>
    </Container>
  );
};

export default EditBusGeneralSettings;
