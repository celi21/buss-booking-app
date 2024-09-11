import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { InfoCircleFill } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import toast from "react-hot-toast";
import {
  checkIfBusAvailable,
  setCurrentBookingStep,
  updateBookingStepStatus,
} from "../../../../store/slices/bookingSlice";

const DatesAndLocations = ({
  selectedDate,
  setSelectedDate,
  selectedFromCity,
  setSelectedFromCity,
  selectedToCity,
  setSelectedToCity,
}) => {
  const getCurrentDate = () => {
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + month + "-" + day;
    return today;
  };
  const [minCurrentDate, setMinCurrentDate] = useState(null);
  const {
    cities,
    isCitiesLoading,
    availableBusError,
    availableBus,
    isBusAvailableLoading,
  } = useSelector((state) => state.booking);
  const dispatch = useDispatch();

  useEffect(() => {
    setMinCurrentDate(getCurrentDate());
    if (!selectedDate) setSelectedDate(getCurrentDate());
  }, []);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    if (new Date(newDate) < new Date(minCurrentDate)) {
      setSelectedDate(minCurrentDate);
    } else {
      setSelectedDate(newDate);
    }
  };

  const handleFromCityChange = (cityId) => {
    setSelectedFromCity(cityId);
    setSelectedToCity(null);
  };

  const handleToCityChange = (cityId) => {
    setSelectedToCity(cityId);
  };

  const checkAvailability = async () => {
    if (!selectedDate) {
      toast.error("Please choose a departing date", {
        duration: 4000,
      });
      return;
    }
    if (!selectedFromCity) {
      toast.error("Please choose From city/stop", {
        duration: 4000,
      });
      return;
    }
    if (!selectedToCity) {
      toast.error("Please choose destination city/stop", {
        duration: 4000,
      });
      return;
    }

    const queryObject = {
      selectedDate,
      selectedFromCity,
      selectedToCity,
    };
    console.log(cities, queryObject);

    // dispatch(checkIfBusAvailable(queryObject));
    const resultAction = await dispatch(checkIfBusAvailable(queryObject));

    // Check if the bus availability was successful
    if (checkIfBusAvailable.fulfilled.match(resultAction)) {
      const availableBus = resultAction.payload;

      // If bus is available, update the state and proceed to the next step
      if (availableBus) {
        dispatch(setCurrentBookingStep("tickets"));
        dispatch(
          updateBookingStepStatus({
            step: "dates-and-locations",
            isCompleted: true,
          })
        );
      }
    } else if (checkIfBusAvailable.rejected.match(resultAction)) {
      // Handle error, if bus is not available or an error occurred
      toast.error(resultAction.payload || "No bus available.", {
        duration: 4000,
      });
    }
  };

  const filteredToCities = cities.filter(
    (city) => city._id !== selectedFromCity
  );

  return (
    <div className="bg-light border p-3 rounded w-100">
      <Row>
        <Col xl={6} lg={6}>
          <Form.Group className="mb-3 w-100">
            <Form.Label>
              <span>Departing:</span>
              <InfoCircleFill
                title="Please Select a Booking Date"
                color="#aaa"
                size={13}
                className="ms-2"
              />
            </Form.Label>
            <Form.Control
              type="date"
              min={minCurrentDate}
              value={selectedDate}
              onChange={handleDateChange}
              defaultValue={selectedDate}
            />
          </Form.Group>
        </Col>
      </Row>

      {isCitiesLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Row>
            <Col xl={6} lg={6}>
              <Row>
                <Col xl={6} lg={6}>
                  <Form.Group className="mb-3 w-100">
                    <Form.Label>
                      <span>From:</span>
                      <InfoCircleFill
                        title="Please Choose your Starting City/Stop"
                        color="#aaa"
                        size={13}
                        className="ms-2"
                      />
                    </Form.Label>
                    <Form.Select
                      defaultValue={null}
                      onChange={(e) => {
                        handleFromCityChange(e.target.value);
                      }}
                    >
                      <option value="" key="">
                        Choose
                      </option>
                      {cities.map((city, index) => {
                        return (
                          city.status == "active" && (
                            <option
                              value={city._id}
                              key={city._id}
                              selected={selectedFromCity === city._id}
                            >
                              {city.name}
                            </option>
                          )
                        );
                      })}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col xl={6} lg={6}>
                  <Form.Group className="mb-3 w-100">
                    <Form.Label>
                      <span>To:</span>
                      <InfoCircleFill
                        title="Please Choose your Destination."
                        color="#aaa"
                        size={13}
                        className="ms-2"
                      />
                    </Form.Label>
                    <Form.Select
                      defaultValue={null}
                      onChange={(e) => {
                        handleToCityChange(e.target.value);
                      }}
                      disabled={selectedFromCity == null}
                    >
                      <option value="" key="">
                        Choose
                      </option>
                      {filteredToCities.map((city, index) => {
                        return (
                          city.status == "active" && (
                            <option
                              value={city._id}
                              key={city._id}
                              selected={selectedToCity === city._id}
                            >
                              {city.name}
                            </option>
                          )
                        );
                      })}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Col>
              {availableBusError && (
                <Alert variant="danger" className="w-auto p-2">
                  {availableBusError}
                </Alert>
              )}
            </Col>
          </Row>

          <Row className="mt-3">
            <Col>
              <Button
                className="px-3 py-2 fw-semibold w-25"
                onClick={(e) => {
                  checkAvailability();
                }}
                disabled={isBusAvailableLoading}
              >
                {isBusAvailableLoading == true ? (
                  <Spinner size="sm" />
                ) : (
                  <span>Check Availability</span>
                )}
              </Button>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default DatesAndLocations;
