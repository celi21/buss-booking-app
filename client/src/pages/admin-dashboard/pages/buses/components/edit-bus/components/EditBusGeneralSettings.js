import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoutes } from "../../../../../../../store/slices/RoutesSlice";
import { fetchBusTypes } from "../../../../../../../store/slices/BusTypeSlice";

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
      setSelectedBusType(fetchBusObject.busType);
      setPeriodOperatingFrom(fetchBusObject.periodStartDate);
      setPeriodOperatingTo(fetchBusObject.periodEndDate);
      setRecurring(fetchBusObject.recurring);
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

  return (
    <Container fluid>
      <div className="mb-3 d-flex justify-content-start align-items-center flex-row gap-2">
        <div className="w-50 fw-semibold">Bus Type:</div>
        <select
          className="form-control"
          onChange={(e) => {
            // handleBusTypeChange(e);
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
    </Container>
  );
};

export default EditBusGeneralSettings;
