import React, { useEffect, useState } from "react";
import { Alert, Button, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ArrowDown } from "react-bootstrap-icons";
import {
  editBus,
  fetchBusById,
  setEditBusError,
} from "../../../../../../../store/slices/BusSlice";
import toast, { Toaster } from "react-hot-toast";

const EditBusGeneralSettings = ({ handleCancel }) => {
  const { fetchBusObject, editBusLoading, editBusError } = useSelector(
    (state) => state.bus
  );
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
    if (!time) return "";
    let timeSplit = time.split(":"); // hours:minutes
    let hours = parseInt(timeSplit[0], 10);
    let minutes = timeSplit[1];
    let meridian = "AM";
    if (hours >= 12) {
      meridian = "PM";
      if (hours > 12) hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }
    return `${hours}:${minutes} ${meridian}`;
  };

  const handleTimeChange = (e, locId, index, type) => {
    if (!e.target.value || !selectedRoute || !locId) {
      return;
    }
    let time = formatTime(e.target.value);

    let updatedLocations = selectedRoute.locations.map((loc) => {
      const currentLocCityId = loc.city?._id || loc.city;
      if (String(currentLocCityId) === String(locId)) {
        if (type === "departure") {
          return {
            ...loc,
            departureTime: time,
          };
        } else if (type === "arrival") {
          return {
            ...loc,
            arrivalTime: time,
          };
        }
      }
      return loc;
    });
    setSelectedRoute({
      ...selectedRoute,
      locations: updatedLocations,
    });
  };

  const timeInputDefaultValue = (timeString) => {
    if (!timeString || typeof timeString !== "string") return "";
    const clean = timeString.trim().toUpperCase();

    if (/^\d{1,2}:\d{2}$/.test(clean)) {
      const [h, m] = clean.split(":");
      return `${h.padStart(2, "0")}:${m}`;
    }

    const match = clean.match(/^(\d{1,2}):(\d{2})(?::|\s*)([AP]M)?$/);
    if (!match) return "";

    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const meridian = match[3];

    if (meridian === "PM" && hours < 12) {
      hours += 12;
    } else if (meridian === "AM" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  };

  const dispatch = useDispatch();
  const handleSubmit = async () => {
    if (!selectedRoute) {
      dispatch(setEditBusError("This route does not exist!"));
      toast.error("This route does not exist!", {
        duration: 4000,
      });
      return;
    }

    if (!selectedBusType) {
      dispatch(setEditBusError("Please choose a bus type"));
      toast.error("Please choose a bus type", {
        duration: 4000,
      });
      return;
    }

    for (let i = 0; i < selectedRoute.locations.length; i++) {
      let loc = selectedRoute.locations[i];
      if (i == 0) {
        if (loc.departureTime == null || loc.departureTime == "") {
          dispatch(
            setEditBusError(
              "Please select departure time for starting location"
            )
          );
          toast.error("Please select departure time for starting location", {
            duration: 4000,
          });
          return;
        }
      } else if (i == selectedRoute.locations.length - 1) {
        if (loc.arrivalTime == null || loc.arrivalTime == "") {
          dispatch(
            setEditBusError("Please select arrival time for the destination")
          );
          toast.error("Please select arrival time for the destination", {
            duration: 4000,
          });
          return;
        }
      } else {
        if (
          loc.arrivalTime == null ||
          loc.arrivalTime == "" ||
          loc.departureTime == null ||
          loc.departureTime == ""
        ) {
          dispatch(
            setEditBusError(
              "Please select arrival and departure time for all locations"
            )
          );
          toast.error(
            "Please select arrival and departure time for all locations",
            {
              duration: 4000,
            }
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
      dispatch(setEditBusError("Please select period operating from date"));
      toast.error("Please select period operating from date", {
        duration: 4000,
      });
      return;
    }

    if (
      !periodOperatingTo ||
      periodOperatingTo.trim() == "" ||
      periodOperatingTo == null
    ) {
      dispatch(setEditBusError("Please select period operating to date"));
      toast.error("Please select period operating to date", {
        duration: 4000,
      });
      return;
    }

    const busObject = {
      busId: selectedRoute._id,
      routeId: selectedRoute.route?._id || selectedRoute.route,
      busTypeId: selectedBusType,
      locations: selectedRoute.locations,
      periodOperatingFrom,
      periodOperatingTo,
      recurring,
      tab: "general-settings",
    };

    try {
      await dispatch(editBus(busObject)).unwrap();
      toast.success("Bus General Settings Updated Successfully", {
        duration: 4000,
      });
      dispatch(setEditBusError(null));
    } catch (err) {
      toast.error(err || "Failed to update bus settings", {
        duration: 4000,
      });
    }
  };

  return (
    <Container fluid>
      <div className="mb-3 d-flex justify-content-start align-items-center flex-row gap-2">
        <div className="w-50 fw-semibold">Bus Type:</div>
        <select
          className="form-select"
          value={selectedBusType || ""}
          onChange={(e) => {
            handleBusTypeChange(e);
          }}
        >
          <option value="" key="">
            Choose a Bus Type
          </option>
          {busTypes?.map((busType) => (
            <option
              value={busType._id}
              key={busType._id}
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
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={editBusLoading}
        >
          {editBusLoading ? "loading..." : "Update General Settings"}
        </Button>
      </div>
    </Container>
  );
};

export default EditBusGeneralSettings;
