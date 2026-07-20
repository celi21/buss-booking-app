import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Row, Spinner, Card } from "react-bootstrap";
import { InfoCircleFill, GeoAltFill, Calendar2Date, ArrowLeftRight, Search } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../../loading-spinner/LoadingSpinner";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  checkIfBusAvailable,
  checkIfReturnBusAvailable,
  setCurrentBookingStep,
  updateBookingStepStatus,
  setTripType,
  setReturnDate,
  fetchCities,
  setSelectedDateState,
  setSelectedFromCityState,
  setSelectedToCityState,
} from "../../../store/slices/bookingSlice";
import { translateText } from "../../../utils/translation";

const BookingSearch = ({
  selectedDate,
  setSelectedDate,
  selectedFromCity,
  setSelectedFromCity,
  selectedToCity,
  setSelectedToCity,
  cheapestLocations = [],
  personalDetails,
  setPersonalDetails,
  isCheckoutFlow = false,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedLanguage = useSelector(
    (state) => state.settings.selectedLanguage
  );

  const {
    cities,
    isCitiesLoading,
    availableBusError,
    isBusAvailableLoading,
    tripType,
    returnDate,
    availableReturnBusError,
  } = useSelector((state) => state.booking);

  const reduxSelectedDate = useSelector((state) => state.booking.selectedDate);
  const reduxSelectedFromCity = useSelector((state) => state.booking.selectedFromCity);
  const reduxSelectedToCity = useSelector((state) => state.booking.selectedToCity);

  const getCurrentDate = () => {
    const now = new Date();
    const day = ("0" + now.getDate()).slice(-2);
    const month = ("0" + (now.getMonth() + 1)).slice(-2);
    return now.getFullYear() + "-" + month + "-" + day;
  };

  const [minCurrentDate, setMinCurrentDate] = useState(null);
  const [localFromCity, setLocalFromCity] = useState("");
  const [localToCity, setLocalToCity] = useState("");
  const [localDate, setLocalDate] = useState("");

  // Auto-fetch cities if empty
  useEffect(() => {
    if (cities.length === 0) {
      dispatch(fetchCities());
    }
  }, [dispatch, cities]);

  // Sync state values on mount or Redux updates
  useEffect(() => {
    const today = getCurrentDate();
    setMinCurrentDate(today);

    const initialDate = selectedDate || reduxSelectedDate || today;
    setLocalDate(initialDate);
    if (setSelectedDate) setSelectedDate(initialDate);

    setLocalFromCity(selectedFromCity || reduxSelectedFromCity || "");
    setLocalToCity(selectedToCity || reduxSelectedToCity || "");
  }, [selectedDate, reduxSelectedDate, selectedFromCity, reduxSelectedFromCity, selectedToCity, reduxSelectedToCity]);

  const handleFromCityChange = (cityId) => {
    setLocalFromCity(cityId);
    setLocalToCity("");
    if (setSelectedFromCity) setSelectedFromCity(cityId);
    if (setSelectedToCity) setSelectedToCity(null);

    // If checkout flow, set pickup address if it is in cheapest list
    if (isCheckoutFlow && cheapestLocations.includes(cityId) && setPersonalDetails && personalDetails) {
      const cityName = cities.find((city) => city._id === cityId)?.name;
      setPersonalDetails({
        ...personalDetails,
        pickupAddress: cityName || null,
        dropoffAddress: null,
      });
    }
  };

  const handleToCityChange = (cityId) => {
    setLocalToCity(cityId);
    if (setSelectedToCity) setSelectedToCity(cityId);

    // If checkout flow, set dropoff address if in cheapest list
    if (isCheckoutFlow && cheapestLocations.includes(cityId) && setPersonalDetails && personalDetails) {
      const cityName = cities.find((city) => city._id === cityId)?.name;
      setPersonalDetails({
        ...personalDetails,
        dropoffAddress: cityName || null,
      });
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    const finalDate = new Date(newDate) < new Date(minCurrentDate) ? minCurrentDate : newDate;
    setLocalDate(finalDate);
    if (setSelectedDate) setSelectedDate(finalDate);
  };

  const handleSwapCities = () => {
    if (!localFromCity || !localToCity) return;
    const tempFrom = localFromCity;
    setLocalFromCity(localToCity);
    setLocalToCity(tempFrom);

    if (setSelectedFromCity) setSelectedFromCity(localToCity);
    if (setSelectedToCity) setSelectedToCity(tempFrom);
  };

  const t = (key) => {
    return (selectedLanguage && translateText(key, selectedLanguage.code)) || key;
  };

  const checkAvailability = async () => {
    const fromCity = isCheckoutFlow ? selectedFromCity : localFromCity;
    const toCity = isCheckoutFlow ? selectedToCity : localToCity;
    const travelDate = isCheckoutFlow ? selectedDate : localDate;

    if (!travelDate) {
      toast.error(t("Please choose a departing date"), { duration: 4000 });
      return;
    }
    if (!fromCity) {
      toast.error(t("Please choose From city/stop"), { duration: 4000 });
      return;
    }
    if (!toCity) {
      toast.error(t("Please choose destination city/stop"), { duration: 4000 });
      return;
    }
    if (fromCity === toCity) {
      toast.error(t("From and To locations cannot be the same."), { duration: 4000 });
      return;
    }
    if (tripType === "round-trip" && !returnDate) {
      toast.error(t("Please choose a return date"), { duration: 4000 });
      return;
    }

    const queryObject = {
      selectedDate: travelDate,
      selectedFromCity: fromCity,
      selectedToCity: toCity,
    };

    // Check outbound bus availability
    const resultAction = await dispatch(checkIfBusAvailable(queryObject));

    if (checkIfBusAvailable.fulfilled.match(resultAction)) {
      const availableBus = resultAction.payload.bus;

      if (availableBus) {
        if (tripType === "round-trip") {
          const returnQueryObject = {
            selectedDate: returnDate,
            selectedFromCity: toCity, // Swap for return
            selectedToCity: fromCity,
          };

          const returnResultAction = await dispatch(checkIfReturnBusAvailable(returnQueryObject));

          if (checkIfReturnBusAvailable.fulfilled.match(returnResultAction)) {
            // Save search states to Redux
            dispatch(setSelectedDateState(travelDate));
            dispatch(setSelectedFromCityState(fromCity));
            dispatch(setSelectedToCityState(toCity));

            // Proceed to seat selection
            dispatch(setCurrentBookingStep("tickets"));
            dispatch(
              updateBookingStepStatus({
                step: "dates-and-locations",
                isCompleted: true,
              })
            );

            if (!isCheckoutFlow) {
              navigate("/booking");
            }
          } else if (checkIfReturnBusAvailable.rejected.match(returnResultAction)) {
            toast.error(`Return trip: ${returnResultAction.payload || t("No return bus available.")}`, { duration: 4000 });
          }
        } else {
          // One-way trip success
          dispatch(setSelectedDateState(travelDate));
          dispatch(setSelectedFromCityState(fromCity));
          dispatch(setSelectedToCityState(toCity));

          dispatch(setCurrentBookingStep("tickets"));
          dispatch(
            updateBookingStepStatus({
              step: "dates-and-locations",
              isCompleted: true,
            })
          );

          if (!isCheckoutFlow) {
            navigate("/booking");
          }
        }
      }
    } else if (checkIfBusAvailable.rejected.match(resultAction)) {
      toast.error(resultAction.payload || t("No bus available."), { duration: 4000 });
    }
  };

  const filteredToCities = cities.filter(
    (city) => city._id !== localFromCity
  );

  // --- RENDER FOR CHECKOUT FLOW (Matches original DatesAndLocations style) ---
  if (isCheckoutFlow) {
    return (
      <div className="bg-light border p-3 rounded w-100">
        {/* Trip Type Selector */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label className="fw-semibold">
                {t("Trip Type")}:
              </Form.Label>
              <div className="d-flex gap-4">
                <Form.Check
                  inline
                  type="radio"
                  label={t("One-way")}
                  name="tripType"
                  id="one-way"
                  checked={tripType === "one-way"}
                  onChange={() => dispatch(setTripType("one-way"))}
                />
                <Form.Check
                  inline
                  type="radio"
                  label={t("Round-trip")}
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
                <span>{t("departing")}:</span>
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
                value={localDate}
                onChange={handleDateChange}
              />
            </Form.Group>
          </Col>

          <Col xl={6} lg={6}>
            <Form.Group className="mb-3 w-100">
              <Form.Label>
                <span>{t("returning") || "Returning"}:</span>
                <InfoCircleFill
                  title="Please Select a Return Date"
                  color="#aaa"
                  size={13}
                  className="ms-2"
                />
              </Form.Label>
              <Form.Control
                type="date"
                min={localDate}
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
                        <span>{t("from")}:</span>
                        <InfoCircleFill
                          title="Please Choose your Starting City/Stop"
                          color="#aaa"
                          size={13}
                          className="ms-2"
                        />
                      </Form.Label>
                      <Form.Select
                        value={localFromCity}
                        onChange={(e) => {
                          handleFromCityChange(e.target.value);
                        }}
                      >
                        <option value="" key="">
                          {t("choose")}
                        </option>
                        {cities.map((city) => (
                          city.status === "active" && (
                            <option
                              value={city._id}
                              key={city._id}
                            >
                              {city.name}
                              {cheapestLocations.includes(city._id) ? " (Cheapest)" : ""}
                            </option>
                          )
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col xl={6} lg={6}>
                    <Form.Group className="mb-3 w-100">
                      <Form.Label>
                        <span>{t("to")}:</span>
                        <InfoCircleFill
                          title="Please Choose your Destination."
                          color="#aaa"
                          size={13}
                          className="ms-2"
                        />
                      </Form.Label>
                      <Form.Select
                        value={localToCity}
                        onChange={(e) => {
                          handleToCityChange(e.target.value);
                        }}
                        disabled={!localFromCity}
                      >
                        <option value="" key="">
                          {t("choose")}
                        </option>
                        {filteredToCities.map((city) => (
                          city.status === "active" && (
                            <option
                              value={city._id}
                              key={city._id}
                            >
                              {city.name}
                              {cheapestLocations.includes(city._id) ? " (Cheapest)" : ""}
                            </option>
                          )
                        ))}
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
                  onClick={checkAvailability}
                  disabled={isBusAvailableLoading}
                >
                  {isBusAvailableLoading ? (
                    <Spinner size="sm" />
                  ) : (
                    <span>{t("check-availability")}</span>
                  )}
                </Button>
              </Col>
            </Row>
          </>
        )}
      </div>
    );
  }

  // --- RENDER FOR HOMEPAGE HERO (Premium FlixBus Style) ---
  return (
    <Card className="shadow-lg border-0 rounded-4 bg-white text-dark w-100 p-4" style={{ maxWidth: "1100px" }}>
      {/* Trip Type Selector */}
      <div className="d-flex gap-3 mb-3 border-bottom pb-2">
        <Button
          variant={tripType === "one-way" ? "primary" : "outline-secondary"}
          className="rounded-pill px-4 fw-semibold border-0 btn-sm"
          onClick={() => dispatch(setTripType("one-way"))}
        >
          {t("One-way")}
        </Button>
        <Button
          variant={tripType === "round-trip" ? "primary" : "outline-secondary"}
          className="rounded-pill px-4 fw-semibold border-0 btn-sm"
          onClick={() => dispatch(setTripType("round-trip"))}
        >
          {t("Round-trip")}
        </Button>
      </div>

      {isCitiesLoading ? (
        <div className="py-4 text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Form onSubmit={(e) => { e.preventDefault(); checkAvailability(); }}>
          <Row className="g-3 align-items-end">
            {/* From City Stop */}
            <Col lg={3} md={6} xs={12}>
              <Form.Group>
                <Form.Label className="fw-semibold text-secondary small d-flex align-items-center gap-1">
                  <GeoAltFill className="text-primary" /> {t("from").toUpperCase()}
                </Form.Label>
                <Form.Select
                  className="py-3 px-3 border rounded-3 bg-light"
                  value={localFromCity}
                  onChange={(e) => handleFromCityChange(e.target.value)}
                  style={{ fontSize: "15px", cursor: "pointer", border: "1.5px solid #ced4da" }}
                >
                  <option value="">{t("choose")}</option>
                  {cities.map((city) => (
                    city.status === "active" && (
                      <option value={city._id} key={city._id}>
                        {city.name}
                      </option>
                    )
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Swap Cities Button */}
            <Col lg="auto" className="d-none d-lg-block text-center px-0">
              <Button
                variant="light"
                onClick={handleSwapCities}
                className="shadow-sm border rounded-circle p-2 mt-4 hover-scale"
                style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <ArrowLeftRight size={16} className="text-primary" />
              </Button>
            </Col>

            {/* To City Stop */}
            <Col lg={3} md={6} xs={12}>
              <Form.Group>
                <Form.Label className="fw-semibold text-secondary small d-flex align-items-center gap-1">
                  <GeoAltFill className="text-success" /> {t("to").toUpperCase()}
                </Form.Label>
                <Form.Select
                  className="py-3 px-3 border rounded-3 bg-light"
                  value={localToCity}
                  onChange={(e) => handleToCityChange(e.target.value)}
                  disabled={!localFromCity}
                  style={{ fontSize: "15px", cursor: localFromCity ? "pointer" : "not-allowed", border: "1.5px solid #ced4da" }}
                >
                  <option value="">{t("choose")}</option>
                  {filteredToCities.map((city) => (
                    city.status === "active" && (
                      <option value={city._id} key={city._id}>
                        {city.name}
                      </option>
                    )
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Depart Date */}
            <Col lg={2} md={4} xs={12}>
              <Form.Group>
                <Form.Label className="fw-semibold text-secondary small d-flex align-items-center gap-1">
                  <Calendar2Date className="text-primary" /> {t("departing").toUpperCase()}
                </Form.Label>
                <Form.Control
                  type="date"
                  min={minCurrentDate}
                  value={localDate}
                  onChange={handleDateChange}
                  className="py-3 border rounded-3 bg-light"
                  style={{ fontSize: "15px", border: "1.5px solid #ced4da" }}
                />
              </Form.Group>
            </Col>

            {/* Return Date */}
            <Col lg={2} md={4} xs={12}>
              <Form.Group>
                <Form.Label className="fw-semibold text-secondary small d-flex align-items-center gap-1">
                  <Calendar2Date className="text-secondary" /> {(t("returning") || "Returning").toUpperCase()}
                </Form.Label>
                <Form.Control
                  type="date"
                  min={localDate}
                  value={returnDate || ""}
                  onChange={(e) => dispatch(setReturnDate(e.target.value))}
                  disabled={tripType === "one-way"}
                  className="py-3 border rounded-3 bg-light"
                  style={{
                    fontSize: "15px",
                    border: "1.5px solid #ced4da",
                    backgroundColor: tripType === "one-way" ? "#e9ecef" : "#f8f9fa",
                    cursor: tripType === "one-way" ? "not-allowed" : "pointer"
                  }}
                />
              </Form.Group>
            </Col>

            {/* Search Submit Button */}
            <Col lg={2} md={4} xs={12}>
              <Button
                variant="primary"
                type="submit"
                className="w-100 py-3 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                style={{ fontSize: "16px" }}
                disabled={isBusAvailableLoading}
              >
                {isBusAvailableLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    <Search size={18} />
                    <span>{t("Search")}</span>
                  </>
                )}
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Card>
  );
};

export default BookingSearch;
