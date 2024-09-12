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
          `${hours} ${hours > 1 ? "hours" : "hour"} ${minutes} minutes`
        );

        setDepartureTime(departureCity.departureTime);
        setArrivalTime(arrivalCity.arrivalTime);
      }
    }
  }, [availableBus]);

  const handleBackButton = () => {
    dispatch(setCurrentBookingStep("dates-and-locations"));
  };

  const handleCheckoutButton = () => {
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

    console.log(priceSum);
    setTicketsPrice(priceSum);
  };

  // Calculate remaining available seats
  const totalAvailableSeats = busAvailabilityData?.availableSeats || 0;
  const seatsTaken = selectedSeats?.reduce(
    (total, seatType) => (total += seatType.seats),
    0
  );
  const remainingSeats = totalAvailableSeats - seatsTaken;

  return (
    <div className="bg-light border p-3 rounded w-100">
      {showRouteModal && (
        <ShowRouteDetailsModal
          showRouteModal={showRouteModal}
          setShowRouteModal={setShowRouteModal}
          locations={availableBus.locations}
        />
      )}

      {isBusAvailableLoading ? (
        <LoadingSpinner />
      ) : (
        availableBus && (
          <>
            <Row className="m-0 p-0">
              <div>
                <p>
                  Journey from{" "}
                  <span className="fw-bold text-primary">
                    {
                      availableBus.locations.find(
                        (loc) => loc.city._id === selectedFromCity
                      )?.city?.name
                    }
                  </span>{" "}
                  to{" "}
                  <span className="fw-bold text-primary">
                    {
                      availableBus.locations.find(
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
                <Button className="p-0 bg-transparent border-0 outline-none text-primary">
                  <ChevronDoubleLeft className="p-0 m-0" size={12} />
                  prev
                </Button>
                <div className="fw-bold">{selectedDate}</div>
                <Button className="p-0 bg-transparent border-0 outline-none text-primary">
                  next
                  <ChevronDoubleRight className="p-0 m-0" size={12} />
                </Button>
              </div>
            </Row>
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
                    handleCheckoutButton();
                  }}
                  style={{
                    cursor:
                      !busAvailabilityData || totalAvailableSeats <= 0
                        ? "not-allowed"
                        : "pointer",
                  }}
                  disabled={!busAvailabilityData || totalAvailableSeats <= 0}
                >
                  Checkout
                </Button>
              </Col>
            </Row>
          </>
        )
      )}
    </div>
  );
};

export default Tickets;
