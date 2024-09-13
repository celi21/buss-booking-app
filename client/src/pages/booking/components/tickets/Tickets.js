import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Form,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import {
  ChevronDoubleLeft,
  ChevronDoubleRight,
  QuestionCircleFill,
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
}) => {
  const { availableBus, isBusAvailableLoading, busAvailabilityData } =
    useSelector((state) => state.booking);
  const dispatch = useDispatch();
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [localError, setLocalError] = useState(null);

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
        console.log("Seting selecetdseats");
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
          `${hours} ${hours > 1 ? "hours" : "hour"} ${minutes} minutes`
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
      toast.error("You need to select at least one ticket.", {
        duration: 4000,
      });
      setLocalError("You need to select at least one ticket.");
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
      toast.error("You need to select at least one ticket.", {
        duration: 4000,
      });
      setLocalError("You need to select at least one ticket.");
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

  // Calculate remaining available seats
  const totalAvailableSeats = busAvailabilityData?.availableSeats || 0;
  const seatsTaken = selectedSeats?.reduce(
    (total, seatType) => (total += seatType.seats),
    0
  );

  return (
    <div className="bg-light border p-3 rounded w-100">
      {showRouteModal && (
        <ShowRouteDetailsModal
          showRouteModal={showRouteModal}
          setShowRouteModal={setShowRouteModal}
          locations={availableBus.locations}
        />
      )}

      <Row className="m-0 p-0">
        <div>
          <p>
            Journey from{" "}
            <span className="fw-bold text-primary">
              {
                availableBus?.locations.find(
                  (loc) => loc.city._id === selectedFromCity
                )?.city?.name
              }
            </span>{" "}
            to{" "}
            <span className="fw-bold text-primary">
              {
                availableBus?.locations.find(
                  (loc) => loc.city._id === selectedToCity
                )?.city?.name
              }
            </span>
          </p>
        </div>
      </Row>
      <Row className="m-0 p-0">
        <div className="d-flex justify-content-end flex-row align-items-center gap-1">
          <div>Date of Departure:</div>
          <Button
            className="p-0 bg-transparent border-0 outline-none text-primary"
            onClick={() => handlePrevButtonClick()}
          >
            <ChevronDoubleLeft className="p-0 m-0" size={12} />
            prev
          </Button>
          <div className="fw-bold">{selectedDate}</div>
          <Button
            className="p-0 bg-transparent border-0 outline-none text-primary"
            onClick={() => handleNextButtonClick()}
          >
            next
            <ChevronDoubleRight className="p-0 m-0" size={12} />
          </Button>
        </div>
      </Row>

      {isBusAvailableLoading ? (
        <LoadingSpinner />
      ) : (
        availableBus && (
          <>
            <Row className="mt-3">
              <Table responsive className="shadow-sm bg-white">
                <thead className="bg-dark text-white">
                  <tr>
                    <th>Bus</th>
                    <th>Available Seats</th>
                    <th>Departure time</th>
                    <th>Arrival time</th>
                    <th>Duration</th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="bg-white">
                    <td className="pb-4 pt-4">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="fw-bold">
                          {availableBus?.route?.name}
                        </div>
                        <Button
                          className="p-0 bg-transparent border-0 outline-none text-primary"
                          onClick={() => setShowRouteModal(true)}
                        >
                          <QuestionCircleFill />
                        </Button>
                      </div>
                    </td>
                    <td className="pb-4 pt-4">{totalAvailableSeats}</td>
                    <td className="pb-4 pt-4">
                      {selectedDate}, {departureTime}
                    </td>
                    <td className="pb-4 pt-4">
                      {selectedDate}, {arrivalTime}
                    </td>
                    <td className="pb-4 pt-4">{totalDuration}</td>
                  </tr>

                  {busAvailabilityData && totalAvailableSeats > 0 && (
                    <tr key="" className="bg-white w-100">
                      <td></td>
                      {availableBus.ticketPrices.map((price) => {
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
                          console.log(seats);

                          return (
                            <td>
                              <Form.Label
                                htmlFor={`${ticketInfo.name}-seats`}
                                className="fw-bold"
                              >
                                {ticketInfo.name}
                              </Form.Label>
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
                            </td>
                          );
                        }
                      })}
                    </tr>
                  )}
                </tbody>
              </Table>
            </Row>

            {(!busAvailabilityData || totalAvailableSeats <= 0) && (
              <Alert variant="danger">All Seats are booked/reserved.</Alert>
            )}
            {localError && <Alert variant="danger">{localError}</Alert>}

            <Row>
              <div className="d-flex justify-content-end flex-row align-items-center gap-1">
                <div className="fs-4 fw-semibold">
                  Total Price: ${ticketsPrice}
                </div>
              </div>
            </Row>
          </>
        )
      )}
      <Row className="mt-3">
        <Col>
          <Button
            variant="dark"
            className="px-3 py-2 fw-semibold"
            onClick={(e) => {
              handleBackButton();
            }}
          >
            Back
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
            Proceed to Details
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Tickets;
