import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { InfoCircleFill } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import toast from "react-hot-toast";
import {
  checkIfBusAvailable,
  checkIfReturnBusAvailable,
  setCurrentBookingStep,
  updateBookingStepStatus,
  setTripType,
  setReturnDate,
} from "../../../../store/slices/bookingSlice";
import { translateText } from "../../../../utils/translation";

const DatesAndLocations = ({
  selectedDate,
  setSelectedDate,
  selectedFromCity,
  setSelectedFromCity,
  selectedToCity,
  setSelectedToCity,
  cheapestLocations = [],
  personalDetails,
  setPersonalDetails,
}) => {
  const selectedLanguage = useSelector(
    (state) => state.settings.selectedLanguage
  );
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
    tripType,
    returnDate,
    availableReturnBus,
    isReturnBusAvailableLoading,
    availableReturnBusError,
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
    if (cheapestLocations.includes(cityId)) {
      let updatedPersonalDetails = {
        ...personalDetails,
      };
      let cityName = cities.find((city) => city._id === cityId).name;
      updatedPersonalDetails["pickupAddress"] = cityName;
      setPersonalDetails(updatedPersonalDetails);
    }
  };

  const handleToCityChange = (cityId) => {
    setSelectedToCity(cityId);
    if (cheapestLocations.includes(cityId)) {
      let updatedPersonalDetails = {
        ...personalDetails,
      };
      let cityName = cities.find((city) => city._id === cityId).name;
      updatedPersonalDetails["dropoffAddress"] = cityName;
      setPersonalDetails(updatedPersonalDetails);
    }
  };

  const checkAvailability = async () => {
    if (!selectedDate) {
      toast.error(
        selectedLanguage &&
          translateText(
            "Please choose a departing date",
            selectedLanguage.code
          ),
        {
          duration: 4000,
        }
      );
      return;
    }
    if (!selectedFromCity) {
      toast.error(
        selectedLanguage &&
          translateText("Please choose From city/stop", selectedLanguage.code),
        {
          duration: 4000,
        }
      );
      return;
    }
    if (!selectedToCity) {
      toast.error(
        selectedLanguage &&
          translateText(
            "Please choose destination city/stop",
            selectedLanguage.code
          ),
        {
          duration: 4000,
        }
      );
      return;
    }

    // Check return date for round-trip
    if (tripType === "round-trip" && !returnDate) {
      toast.error("Please choose a return date", {
        duration: 4000,
      });
      return;
    }

    const queryObject = {
      selectedDate,
      selectedFromCity,
      selectedToCity,
    };

    // Check outbound bus availability
    const resultAction = await dispatch(checkIfBusAvailable(queryObject));

    // Check if the bus availability was successful
    if (checkIfBusAvailable.fulfilled.match(resultAction)) {
      const availableBus = resultAction.payload;

      // If bus is available, check return bus for round-trip
      if (availableBus) {
        if (tripType === "round-trip") {
          // Check return bus availability
          const returnQueryObject = {
            selectedDate: returnDate,
            selectedFromCity: selectedToCity, // Swap for return trip
            selectedToCity: selectedFromCity,
          };
          
          const returnResultAction = await dispatch(checkIfReturnBusAvailable(returnQueryObject));
          
          if (checkIfReturnBusAvailable.fulfilled.match(returnResultAction)) {
            // Both buses available, proceed
            dispatch(setCurrentBookingStep("tickets"));
            dispatch(
              updateBookingStepStatus({
                step: "dates-and-locations",
                isCompleted: true,
              })
            );
          } else if (checkIfReturnBusAvailable.rejected.match(returnResultAction)) {
            let updatedPersonalDetails = {
              ...personalDetails,
            };
            updatedPersonalDetails["dropoffAddress"] = null;
            updatedPersonalDetails["pickupAddress"] = null;
            setPersonalDetails(updatedPersonalDetails);
            toast.error(
              `Return trip: ${returnResultAction.payload}` ||
                "No return bus available.",
              {
                duration: 4000,
              }
            );
          }
        } else {
          // One-way trip, proceed
          dispatch(setCurrentBookingStep("tickets"));
          dispatch(
            updateBookingStepStatus({
              step: "dates-and-locations",
              isCompleted: true,
            })
          );
        }
      }
    } else if (checkIfBusAvailable.rejected.match(resultAction)) {
      let updatedPersonalDetails = {
        ...personalDetails,
      };
      updatedPersonalDetails["dropoffAddress"] = null;
      updatedPersonalDetails["pickupAddress"] = null;
      setPersonalDetails(updatedPersonalDetails);
      // Handle error, if bus is not available or an error occurred
      toast.error(
        resultAction.payload ||
          (selectedLanguage &&
            translateText("No bus available.", selectedLanguage.code)),
        {
          duration: 4000,
        }
      );
    }
  };

  const filteredToCities = cities.filter(
    (city) => city._id !== selectedFromCity
  );

  return (
    <div className="bg-light border p-3 rounded w-100">
      {/* Trip Type Selector */}
      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label className="fw-semibold">
              {selectedLanguage &&
                translateText("Trip Type", selectedLanguage.code)}
              :
            </Form.Label>
            <div className="d-flex gap-4">
              <Form.Check
                inline
                type="radio"
                label={selectedLanguage && translateText("One-way", selectedLanguage.code) || "One-way"}
                name="tripType"
                id="one-way"
                checked={tripType === "one-way"}
                onChange={() => dispatch(setTripType("one-way"))}
              />
              <Form.Check
                inline
                type="radio"
                label={selectedLanguage && translateText("Round-trip", selectedLanguage.code) || "Round-trip"}
                name="tripType"
                id="round-trip"
                checked={tripType === "round-trip"}
                onChange={() => dispatch(setTripType("round-trip"))}
              />
            </div>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col xl={6} lg={6}>
          <Form.Group className="mb-3 w-100">
            <Form.Label>
              <span>
                {selectedLanguage &&
                  translateText("departing", selectedLanguage.code)}
                :
              </span>
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
        
        {/* Return Date Picker - Conditional */}
        <Col xl={6} lg={6}>
          <Form.Group className="mb-3 w-100">
            <Form.Label>
              <span>
                {selectedLanguage &&
                  translateText("returning", selectedLanguage.code) || "Returning"}
                :
              </span>
              <InfoCircleFill
                title="Please Select a Return Date"
                color="#aaa"
                size={13}
                className="ms-2"
              />
            </Form.Label>
            <Form.Control
              type="date"
              min={selectedDate}
              value={returnDate || ""}
              onChange={(e) => dispatch(setReturnDate(e.target.value))}
              disabled={tripType === "one-way"}
              style={tripType === "one-way" ? { backgroundColor: "#e9ecef", cursor: "not-allowed" } : {}}
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
                      <span>
                        {selectedLanguage &&
                          translateText("from", selectedLanguage.code)}
                        :
                      </span>
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
                        {selectedLanguage &&
                          translateText("choose", selectedLanguage.code)}
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
                              {cheapestLocations.includes(city._id)
                                ? " (Cheapest)"
                                : ""}
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
                      <span>
                        {selectedLanguage &&
                          translateText("to", selectedLanguage.code)}
                        :
                      </span>
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
                        {selectedLanguage &&
                          translateText("choose", selectedLanguage.code)}
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
                              {cheapestLocations.includes(city._id)
                                ? " (Cheapest)"
                                : ""}
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
                  <strong>Outbound:</strong> {availableBusError}
                </Alert>
              )}
              {availableReturnBusError && tripType === "round-trip" && (
                <Alert variant="danger" className="w-auto p-2">
                  <strong>Return:</strong> {availableReturnBusError}
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
                  <span>
                    {selectedLanguage &&
                      translateText(
                        "check-availability",
                        selectedLanguage.code
                      )}
                  </span>
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
