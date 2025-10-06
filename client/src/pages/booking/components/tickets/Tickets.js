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
} from "react-bootstrap";
import {
  ArrowRightCircleFill,
  ArrowRightShort,
  ChevronDoubleLeft,
  ChevronDoubleRight,
  CurrencyDollar,
  GeoAltFill,
  QuestionCircleFill,
  SignTurnRightFill,
  TicketPerforatedFill,
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
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
  }, [availableBus, busAvailabilityData]);

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

    priceSum = flexOption == true ? (priceSum += 8) : priceSum;

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
        </Card.Header>
        <Card.Body>
          <Row>
            <Col className="col-12 col-md-12 d-flex align-items-center justify-content-between">
              <p>
                {availableBus?.locations.length > 0 && (
                  <span className="h6">
                    <SignTurnRightFill className="me-2" />
                    {selectedLanguage &&
                      translateText("route", selectedLanguage.code)}
                    :&nbsp;
                  </span>
                )}
                {availableBus?.locations.map((loc, index) => (
                  <span key={loc._id}>
                    {loc.city.name}
                    {index !== availableBus.locations.length - 1 && (
                      <ArrowRightShort size={20} className="mx-2" />
                    )}
                  </span>
                ))}
              </p>
            </Col>
          </Row>

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

          <Row>
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

          <Row className="align-items-center mt-4">
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
                  // Determine seat options for each ticket type
                  const seatOptions = Array.from(
                    { length: totalAvailableSeats + 1 },
                    (_, i) => i
                  );
                  let seats = selectedSeats?.find(
                    (seat) => seat.name === ticketInfo.name
                  )?.seats;

                  return (
                    <Col>
                      <div htmlFor={`${ticketInfo.name}-seats`} className="h6">
                        {ticketInfo.name}
                      </div>
                      <InputGroup className="mb-3">
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
                          {/* Render options for each ticket type */}
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

            <Col className="d-flex flex-column align-items-end">
              <h3 className="d-flex align-items-center display-6">
                <CurrencyDollar />
                {ticketsPrice}
              </h3>
            </Col>
          </Row>

          <Row>
            <Col xs={12} sm={12} md={12} lg={6}>
              <h6 className="text-uppercase mb-0">
                {selectedLanguage &&
                  translateText("Flex Option", selectedLanguage.code)}
              </h6>
              <div className="mt-3">
                <Form.Check
                  type={"checkbox"}
                  id={`flex-checkbox`}
                  label={
                    selectedLanguage &&
                    translateText("flexOptionLabel", selectedLanguage.code)
                  }
                  checked={flexOption}
                  onChange={handleFlexChange}
                />
              </div>
              <div>
                <p className="m-0 mt-2">
                  {selectedLanguage &&
                    translateText("whyChooseFlex", selectedLanguage.code)}
                </p>
                <ul>
                  <li>
                    {selectedLanguage &&
                      translateText("flexDescription", selectedLanguage.code)}
                  </li>
                  <li>
                    {selectedLanguage &&
                      translateText("freeCancellations", selectedLanguage.code)}
                  </li>
                  <li>
                    {selectedLanguage &&
                      translateText("dateChange", selectedLanguage.code)}
                  </li>
                </ul>
              </div>
            </Col>

            <Col xs={12} sm={12} md={12} lg={6}>
              <h6 className="text-uppercase mb-0">
                {selectedLanguage &&
                  translateText("Baggage Policy", selectedLanguage.code)}
              </h6>
              <p className="mt-0">
                {selectedLanguage &&
                  translateText("Baggage Message", selectedLanguage.code)}
              </p>
              <div>
                <img
                  src={require("../../../../assets/bags.png")}
                  alt=""
                  className="border border-primary object-contain"
                />
              </div>
            </Col>
          </Row>

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
