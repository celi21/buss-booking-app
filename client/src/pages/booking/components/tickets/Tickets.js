import React, { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Row,
  Table,
  Collapse,
} from "react-bootstrap";
import {
  ArrowRightCircleFill,
  ArrowRightShort,
  ChevronDoubleLeft,
  ChevronDoubleRight,
  CurrencyDollar,
  GeoAltFill,
  QuestionCircleFill,
  TicketPerforatedFill,
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  checkIfBusAvailable,
  setCurrentBookingStep,
  updateBookingStepStatus,
} from "../../../../store/slices/bookingSlice";
import ShowRouteDetailsModal from "./components/ShowRouteDetailsModal";
import toast from "react-hot-toast";
import { translateText } from "../../../../utils/translation";

const Tickets = ({
  selectedFromCity,
  selectedToCity,
  selectedDate,
  selectedSeats,
  setSelectedSeats,
  ticketsPrice,
  setTicketsPrice,
  totalDuration,
  setTotalDuration,
  departureTime,
  setDepartureTime,
  arrivalTime,
  setArrivalTime,
  setSelectedDate,
  cheapestLocations,
  flexOption,
  setFlexOption,
  flexCharge,
}) => {
  const { 
    availableBus, 
    isBusAvailableLoading, 
    busAvailabilityData,
    tripType, 
  } = useSelector((state) => state.booking);
  const dispatch = useDispatch();
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [isRouteOpen, setIsRouteOpen] = useState(false);

  const handleFlexChange = (e) => {
    setFlexOption(e.target.checked);
    setTicketsPrice(
      e.target.checked ? ticketsPrice + flexCharge : ticketsPrice - flexCharge
    );
  };

  function calculateTimeDifference(departureTime, arrivalTime) {
    // Helper function to convert time to Date object
    const formatTime = (timeStr) => {
      let [hours, minutes, modifier] = timeStr.split(":");
      hours = Number(hours);
      minutes = Number(minutes);

      // Convert hours to 24-hour format based on AM/PM
      if (modifier === "PM" && hours !== 12) {
        hours += 12;
      }
      if (modifier === "AM" && hours === 12) {
        hours = 0;
      }

      return new Date(1970, 0, 1, hours, minutes); // A date object with arbitrary date
    };

    const departure = formatTime(departureTime);
    const arrival = formatTime(arrivalTime);

    // Calculate the difference in milliseconds
    const diffInMilliseconds = arrival - departure;

    // Convert milliseconds to hours and minutes
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(
      (diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
    );

    return { hours: diffInHours, minutes: diffInMinutes };
  }

  useEffect(() => {
    if (busAvailabilityData?.availableSeats <= 0) {
      setTicketsPrice(0);
    }

    availableBus?.ticketPrices.map((price) => {
      let ticketInfo = availableBus.ticketTypes.find(
        (t) => t._id === price.ticketType
      );
      let fromLocationCity = availableBus.locations.find(
        (loc) => loc.city._id === selectedFromCity
      );
      let toLocationCity = availableBus.locations.find(
        (loc) => loc.city._id === selectedToCity
      );
      let ticketPriceInfo = price.prices.find(
        (p) =>
          fromLocationCity?.city._id === selectedFromCity &&
          toLocationCity?.city._id === selectedToCity &&
          fromLocationCity?._id === p.fromLocationId &&
          toLocationCity?._id === p.toLocationId
      );

      if (!ticketInfo || !ticketPriceInfo) {
        setTicketsPrice(0);
        setSelectedSeats([]);
        const stepsToUpdate = ["details", "confirm", "payment"]; // Example steps
        stepsToUpdate.forEach((step) => {
          dispatch(
            updateBookingStepStatus({
              step: step,
              isCompleted: false,
            })
          );
        });
      }
    });

    if (availableBus) {
      if (selectedSeats.length <= 0) {
        let ticketTypes = availableBus.ticketTypes.map((t) => {
          return { name: t.name, _id: t._id, seats: 0, price: 0 };
        });
        setSelectedSeats(ticketTypes);
      }

      let departureCity = availableBus.locations.find(
        (loc) => loc.city._id === selectedFromCity
      );
      let arrivalCity = availableBus.locations.find(
        (loc) => loc.city._id === selectedToCity
      );

      if (departureCity && arrivalCity) {
        let { hours, minutes } = calculateTimeDifference(
          departureCity.departureTime,
          arrivalCity.arrivalTime
        );

        setTotalDuration(
          // `${hours} ${hours > 1 ? "hours" : "hour"} ${minutes} minutes`
          `${hours}${hours > 1 ? "h" : "h"} ${minutes}m`
        );

        setDepartureTime(departureCity.departureTime);
        setArrivalTime(arrivalCity.arrivalTime);
      }
    }
  }, [availableBus, busAvailabilityData, selectedFromCity, selectedToCity]);

  const handleBackButton = () => {
    dispatch(setCurrentBookingStep("dates-and-locations"));
    setSelectedSeats([]);
  };

  const handleProceedButton = () => {
    // console.log(selectedSeats);
    if (selectedSeats.length <= 0) {
      toast.error(
        selectedLanguage &&
          translateText(
            "You need to select at least one ticket.",
            selectedLanguage.code
          ),
        {
          duration: 4000,
        }
      );
      setLocalError(
        selectedLanguage &&
          translateText(
            "You need to select at least one ticket.",
            selectedLanguage.code
          )
      );
      return;
    }

    var hasAnySeatSelected = false;
    for (let i = 0; i < selectedSeats.length; i++) {
      if (selectedSeats[i].seats > 0) {
        hasAnySeatSelected = true;
        break;
      }
    }

    if (hasAnySeatSelected == false) {
      toast.error(
        selectedLanguage &&
          translateText(
            "You need to select at least one ticket.",
            selectedLanguage.code
          ),
        {
          duration: 4000,
        }
      );
      setLocalError(
        selectedLanguage &&
          translateText(
            "You need to select at least one ticket.",
            selectedLanguage.code
          )
      );
      setTicketsPrice(0);
      const stepsToUpdate = ["details", "confirm", "payment"]; // Example steps
      stepsToUpdate.forEach((step) => {
        dispatch(
          updateBookingStepStatus({
            step: step,
            isCompleted: false,
          })
        );
      });
      return;
    }

    dispatch(setCurrentBookingStep("details"));
    dispatch(
      updateBookingStepStatus({
        step: "tickets",
        isCompleted: true,
      })
    );
    setLocalError(null);
  };

  const handleSeatSelection = (ticketTypeId, event, price) => {
    const newSeats = parseInt(event.target.value);
    let updatedSelectedSeats = selectedSeats?.map((s) => {
      if (s._id === ticketTypeId) {
        return {
          ...s,
          seats: newSeats,
          price: price,
        };
      } else {
        return s;
      }
    });
    setSelectedSeats(updatedSelectedSeats);

    let priceSum = updatedSelectedSeats.reduce(
      (total, ticketType) =>
        total + parseFloat(ticketType.price) * parseInt(ticketType.seats),
      0
    );

    // Double the price for round-trip bookings
    if (tripType === "round-trip") {
      priceSum = priceSum * 2;
    }

    priceSum = flexOption == true ? (priceSum += flexCharge) : priceSum;

    setTicketsPrice(priceSum);
  };

  const handleNextButtonClick = async () => {
    if (!selectedDate || !selectedFromCity || !selectedToCity) {
      return;
    }

    const date = new Date(selectedDate);
    let nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);
    // let "2024-09-13"
    nextDate = `${nextDate.getFullYear()}-${(nextDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${nextDate.getDate().toString().padStart(2, "0")}`;

    setSelectedDate(nextDate);

    const queryObject = {
      selectedDate: nextDate,
      selectedFromCity,
      selectedToCity,
    };
    const resultAction = await dispatch(checkIfBusAvailable(queryObject));
    // Check if the bus availability was successful
    if (checkIfBusAvailable.fulfilled.match(resultAction)) {
      const availableBus = resultAction.payload;
      // If bus is available, update the state and proceed to the next step
      if (availableBus) {
        setLocalError(null);
      }
    } else if (checkIfBusAvailable.rejected.match(resultAction)) {
      toast.error(resultAction.payload || "No bus available.", {
        duration: 4000,
      });
      setLocalError(resultAction.payload || "No bus available.");
    }
  };
  const handlePrevButtonClick = async () => {
    if (!selectedDate || !selectedFromCity || !selectedToCity) {
      return;
    }

    const date = new Date(selectedDate);
    let nextDate = new Date(date);
    nextDate.setDate(date.getDate() - 1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (nextDate < today) {
      toast.error("You cannot choose a past date.", {
        duration: 4000,
      });
      return;
    }

    nextDate = `${nextDate.getFullYear()}-${(nextDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${nextDate.getDate().toString().padStart(2, "0")}`;

    setSelectedDate(nextDate);

    const queryObject = {
      selectedDate: nextDate,
      selectedFromCity,
      selectedToCity,
    };
    const resultAction = await dispatch(checkIfBusAvailable(queryObject));
    // Check if the bus availability was successful
    if (checkIfBusAvailable.fulfilled.match(resultAction)) {
      const availableBus = resultAction.payload;
      // If bus is available, update the state and proceed to the next step
      if (availableBus) {
        setLocalError(null);
      }
    } else if (checkIfBusAvailable.rejected.match(resultAction)) {
      toast.error(resultAction.payload || "No bus available.", {
        duration: 4000,
      });
      setLocalError(resultAction.payload || "No bus available.");
    }
  };

  const selectedLanguage = useSelector(
    (state) => state.settings.selectedLanguage
  );

  // Calculate remaining available seats
  const totalAvailableSeats = busAvailabilityData?.availableSeats || 0;
  const seatsTaken = selectedSeats?.reduce(
    (total, seatType) => (total += seatType.seats),
    0
  );

  return (
    <div className="bg-light border p-3 rounded w-100">
      {/* new layout */}
      <Card
        border={"primary"}
        // key={bus._id}
        className={`p-0 bg-light text-dark w-100`}
        style={{ borderWidth: "2px" }}
      >
        <Card.Header as="h5" className="d-flex align-items-center">
          {availableBus?.route?.name}
          <Badge bg="danger" className="ms-2">
            {(cheapestLocations.includes(selectedFromCity) ||
              cheapestLocations.includes(selectedToCity)) && (
              <span>
                {selectedLanguage &&
                  translateText("cheapest", selectedLanguage.code)}
              </span>
            )}
          </Badge>
          {tripType === "round-trip" && (
            <Badge bg="info" className="ms-2">
              Round-Trip (2x Price)
            </Badge>
          )}
        </Card.Header>
        <Card.Body>
          {/* Collapsible Route Section */}
          <div className="mb-4">
            <button
              type="button"
              className="bg-transparent border-0 p-0 text-primary fw-bold d-inline-flex align-items-center gap-1 hover-scale"
              style={{ outline: "none", fontSize: "0.95rem" }}
              onClick={() => setIsRouteOpen(!isRouteOpen)}
              aria-expanded={isRouteOpen}
              aria-controls="route-collapse-stops"
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  setIsRouteOpen(!isRouteOpen);
                }
              }}
            >
              <span>{(selectedLanguage && translateText("Route", selectedLanguage.code)) || "Route (Click to View)"}</span>
              <span
                style={{
                  display: "inline-block",
                  transform: isRouteOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                  fontSize: "0.8rem",
                }}
              >
                ▼
              </span>
            </button>
            
            <Collapse in={isRouteOpen}>
              <div id="route-collapse-stops" className="bg-white p-3 rounded border mt-2">
                <div className="d-flex flex-column align-items-center gap-2">
                  {availableBus?.locations.map((loc, index) => (
                    <React.Fragment key={loc._id}>
                      <div className="fw-semibold text-dark p-2 rounded bg-light border w-100 text-center" style={{ maxWidth: "300px" }}>
                        {loc.city.name}
                      </div>
                      {index !== availableBus.locations.length - 1 && (
                        <div className="text-secondary fw-bold" style={{ fontSize: "1.1rem", lineHeight: "1" }}>↓</div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </Collapse>
          </div>

          <Row className="mb-4">
            <Col className="col-12 col-md-6">
              <span className="h6">
                <TicketPerforatedFill className="me-2" />
                {selectedLanguage &&
                  translateText("seats-left", selectedLanguage.code)}
                :{" "}
              </span>
              <span>
                {busAvailabilityData?.availableSeats} /{" "}
                {busAvailabilityData?.totalSeats}
              </span>
            </Col>

            <Col className="col-12 col-md-6">
              {availableBus.locations.length > 0 && (
                <>
                  <span className="h6">
                    <GeoAltFill className="me-2" />
                    {selectedLanguage &&
                      translateText("boarding-at", selectedLanguage.code)}
                    :{" "}
                  </span>
                  <span>
                    {
                      availableBus?.locations.find(
                        (loc) => loc.city._id === selectedFromCity
                      )?.city?.name
                    }
                  </span>
                </>
              )}
            </Col>
          </Row>

          <Row className="mb-4">
            <Col className="d-flex flex-column justify-content-center align-items-center">
              <p className="h4 text-center">
                {availableBus?.locations
                  .find((loc) => loc.city._id === selectedFromCity)
                  ?.city?.name.toUpperCase()}
              </p>
              <p className="h5 text-center">
                {new Date(selectedDate).toDateString()} {departureTime}
              </p>
            </Col>

            <Col className="d-flex flex-column justify-content-center align-items-center">
              <ArrowRightCircleFill className="m-2" />
              <p className="h5 text-center">{totalDuration}</p>
            </Col>

            <Col className="d-flex flex-column justify-content-center align-items-center">
              <p className="h4 text-center">
                {availableBus?.locations
                  .find((loc) => loc.city._id === selectedToCity)
                  ?.city?.name.toUpperCase()}
              </p>
              <p className="h5 text-center">
                {new Date(selectedDate).toDateString()}, {arrivalTime}
              </p>
            </Col>
          </Row>

          {/* Section 1: Passenger Selection */}
          <div className="mb-4 p-3 bg-white rounded shadow-sm border">
            <h5 className="fw-bold mb-3 text-secondary text-uppercase" style={{ fontSize: "0.9rem", letterSpacing: "1px" }}>
              {(selectedLanguage && translateText("Passenger Selection", selectedLanguage.code)) || "Passenger Selection"}
            </h5>
            <Row className="align-items-center">
              {busAvailabilityData &&
                totalAvailableSeats > 0 &&
                availableBus.ticketPrices.map((price) => {
                  let ticketInfo = availableBus.ticketTypes.find(
                    (t) => t._id === price.ticketType
                  );
                  let fromLocationCity = availableBus.locations.find(
                    (loc) => loc.city._id === selectedFromCity
                  );
                  let toLocationCity = availableBus.locations.find(
                    (loc) => loc.city._id === selectedToCity
                  );
                  let ticketPriceInfo = price.prices.find(
                    (p) =>
                      fromLocationCity?.city._id === selectedFromCity &&
                      toLocationCity?.city._id === selectedToCity &&
                      fromLocationCity?._id === p.fromLocationId &&
                      toLocationCity?._id === p.toLocationId
                  );

                  if (ticketInfo && ticketPriceInfo) {
                    const seatOptions = Array.from(
                      { length: totalAvailableSeats + 1 },
                      (_, i) => i
                    );
                    let seats = selectedSeats?.find(
                      (seat) => seat.name === ticketInfo.name
                    )?.seats;

                    return (
                      <Col key={ticketInfo._id} xs={12} md={6} className="mb-2">
                        <div htmlFor={`${ticketInfo.name}-seats`} className="h6 mb-1">
                          {ticketInfo.name}
                        </div>
                        <InputGroup>
                          <Form.Select
                            id={`${ticketInfo.name}-seats`}
                            value={seats || 0}
                            onChange={(e) =>
                              handleSeatSelection(
                                ticketInfo._id,
                                e,
                                ticketPriceInfo.price
                              )
                            }
                          >
                            {seatOptions
                              .slice(
                                0,
                                totalAvailableSeats -
                                  seatsTaken +
                                  (seats || 0) +
                                  1
                              )
                              .map((option) => (
                                <option
                                  key={option}
                                  value={option}
                                  selected={seats === option}
                                >
                                  {option}
                                </option>
                              ))}
                          </Form.Select>
                          <InputGroup.Text className="fw-semibold">
                            x ${ticketPriceInfo.price}
                          </InputGroup.Text>
                        </InputGroup>
                      </Col>
                    );
                  }
                })}

              <Col xs={12} className="d-flex justify-content-end align-items-center mt-3">
                <span className="text-muted me-2" style={{ fontSize: "0.95rem" }}>Total:</span>
                <h3 className="d-flex align-items-center display-6 mb-0 text-primary fw-bold">
                  <CurrencyDollar size={32} />
                  {ticketsPrice}
                </h3>
              </Col>
            </Row>
          </div>

          {/* Section 2: Flex Option */}
          <Card className="border shadow-sm p-4 mb-4 rounded-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-dark mb-0">
                {(selectedLanguage && translateText("Flex Option", selectedLanguage.code)) || "Flex Option"} (+${flexCharge})
              </h5>
              <Form.Check
                type="switch"
                id="flex-switch"
                checked={flexOption}
                onChange={handleFlexChange}
                style={{ transform: "scale(1.25)", cursor: "pointer" }}
              />
            </div>
            <p className="text-secondary mb-3" style={{ fontSize: "0.95rem" }}>
              {(selectedLanguage && translateText("flexOptionDescriptionShort", selectedLanguage.code)) || `Add Flex Option for +$${flexCharge} and enjoy more flexibility.`}
            </p>
            
            <div className="d-flex flex-column gap-3 text-secondary" style={{ fontSize: "0.9rem" }}>
              <div>
                <span className="fw-bold text-success">✅ {(selectedLanguage && translateText("Free Cancellation", selectedLanguage.code)) || "Free Cancellation"}</span>
                <div className="ms-4 text-muted">{(selectedLanguage && translateText("flexFreeCancelDesc", selectedLanguage.code)) || "Cancel up to 24 hours before departure at no extra cost."}</div>
              </div>
              <div>
                <span className="fw-bold text-success">✅ {(selectedLanguage && translateText("Free Rescheduling", selectedLanguage.code)) || "Free Rescheduling"}</span>
                <div className="ms-4 text-muted">{(selectedLanguage && translateText("flexFreeRescheduleDesc", selectedLanguage.code)) || "Change your travel date at no extra charge by contacting Dispatch."}</div>
              </div>
            </div>
          </Card>

          {/* Section 3: Baggage Policy */}
          <Card className="border shadow-sm p-4 mb-4 rounded-4 bg-white">
            <h5 className="fw-bold text-dark mb-3">
              {(selectedLanguage && translateText("Baggage Policy", selectedLanguage.code)) || "Baggage Policy"}
            </h5>
            
            <Row className="g-4 align-items-stretch">
              {/* Included Section */}
              <Col md={6}>
                <div className="p-3 bg-light rounded-4 border border-success h-100" style={{ borderWidth: "1.5px" }}>
                  <div className="d-flex align-items-center gap-2 mb-3 text-success fw-bold">
                    <span style={{ fontSize: "1.2rem" }}>✅</span>
                    <span>{(selectedLanguage && translateText("INCLUDED", selectedLanguage.code)) || "INCLUDED"}</span>
                  </div>
                  
                  <div className="d-flex flex-column gap-3 text-secondary" style={{ fontSize: "0.9rem" }}>
                    {/* Carry-On Luggage SVG */}
                    <div className="d-flex align-items-center gap-3">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <rect x="5" y="7" width="14" height="13" rx="2" />
                        <path d="M9 7V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3" />
                        <circle cx="8" cy="20" r="1" />
                        <circle cx="16" cy="20" r="1" />
                      </svg>
                      <div>
                        <strong className="text-dark">{(selectedLanguage && translateText("1 Carry-On Luggage", selectedLanguage.code)) || "1 Carry-On Luggage"}</strong>
                        <div className="small text-muted">{(selectedLanguage && translateText("carryOnDesc", selectedLanguage.code)) || "Fits in overhead bin/compartment"}</div>
                      </div>
                    </div>
                    
                    {/* Personal Item SVG */}
                    <div className="d-flex align-items-center gap-3">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <path d="M4 20V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
                        <path d="M9 4v18" />
                        <path d="M15 4v18" />
                        <path d="M4 10h16" />
                        <path d="M4 16h16" />
                      </svg>
                      <div>
                        <strong className="text-dark">{(selectedLanguage && translateText("1 Personal Item", selectedLanguage.code)) || "1 Personal Item"}</strong>
                        <div className="small text-muted">{(selectedLanguage && translateText("personalItemDesc", selectedLanguage.code)) || "Backpack, purse, laptop bag, small tote"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              
              {/* Not Allowed Section */}
              <Col md={6}>
                <div className="p-3 bg-light rounded-4 border border-danger h-100" style={{ borderWidth: "1.5px" }}>
                  <div className="d-flex align-items-center gap-2 mb-3 text-danger fw-bold">
                    <span style={{ fontSize: "1.2rem" }}>❌</span>
                    <span>{(selectedLanguage && translateText("NOT ALLOWED", selectedLanguage.code)) || "NOT ALLOWED"}</span>
                  </div>
                  
                  <div className="d-flex flex-column gap-3 text-secondary" style={{ fontSize: "0.9rem" }}>
                    {/* Large Suitcase with red diagonal bar SVG */}
                    <div className="d-flex align-items-center gap-3">
                      <div className="position-relative" style={{ width: "40px", height: "40px", flexShrink: 0 }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c62828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="5" y="7" width="14" height="13" rx="2" />
                          <path d="M9 7V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3" />
                          <circle cx="8" cy="20" r="1" />
                          <circle cx="16" cy="20" r="1" />
                          <line x1="2" y1="2" x2="22" y2="22" stroke="#c62828" strokeWidth="2.5" />
                        </svg>
                      </div>
                      <div>
                        <strong className="text-dark">{(selectedLanguage && translateText("NO BULKY OR OVERSIZED ITEMS", selectedLanguage.code)) || "NO BULKY OR OVERSIZED ITEMS"}</strong>
                      </div>
                    </div>
                    
                    {/* Large Package Box with red diagonal bar SVG */}
                    <div className="d-flex align-items-center gap-3">
                      <div className="position-relative" style={{ width: "40px", height: "40px", flexShrink: 0 }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c62828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                          <line x1="12" y1="22.08" x2="12" y2="12" />
                          <line x1="2" y1="2" x2="22" y2="22" stroke="#c62828" strokeWidth="2.5" />
                        </svg>
                      </div>
                      <div>
                        <strong className="text-dark">{(selectedLanguage && translateText("NO LARGE PACKAGES", selectedLanguage.code)) || "NO LARGE PACKAGES"}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {localError && (
            <Alert variant="danger" className="mt-3">
              {localError}
            </Alert>
          )}

          <Row className="mt-3 border-top pt-3">
            <Col>
              <Button
                variant="dark"
                className="px-3 py-2 fw-semibold"
                onClick={(e) => {
                  handleBackButton();
                }}
              >
                {selectedLanguage &&
                  translateText("back", selectedLanguage.code)}
              </Button>
            </Col>
            <Col className="justify-content-end d-flex">
              <Button
                className="px-3 py-2 fw-semibold"
                onClick={(e) => {
                  handleProceedButton();
                }}
                style={{
                  cursor:
                    !busAvailabilityData || totalAvailableSeats <= 0
                      ? "not-allowed"
                      : "pointer",
                }}
                disabled={!busAvailabilityData || totalAvailableSeats <= 0}
              >
                {selectedLanguage &&
                  translateText("proceed-to-details", selectedLanguage.code)}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {/* new layout */}

      {showRouteModal && (
        <ShowRouteDetailsModal
          showRouteModal={showRouteModal}
          setShowRouteModal={setShowRouteModal}
          locations={availableBus.locations}
        />
      )}
    </div>
  );
};

export default Tickets;
