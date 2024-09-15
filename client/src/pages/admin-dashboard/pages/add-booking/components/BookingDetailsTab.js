import React, { useEffect, useState } from "react";
import { Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { CurrencyDollar } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  checkIfBusAvailable,
  fetchCities,
  resetBusAvailabilityData,
} from "../../../../../store/slices/bookingSlice";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../../../components/loading-spinner/LoadingSpinner";

const BookingDetailsTab = ({
  selectedDate,
  setSelectedDate,
  selectedFromCity,
  setSelectedFromCity,
  selectedToCity,
  setSelectedToCity,
  selectedSeats,
  setSelectedSeats,
  departureTime,
  setDepartureTime,
  arrivalTime,
  setArrivalTime,
  ticketsPrice,
  setTicketsPrice,
  bookingStatus,
  SetBookingStatus,
}) => {
  const getCurrentDate = () => {
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + month + "-" + day;
    return today;
  };
  const {
    cities,
    isCitiesLoading,
    availableBusError,
    availableBus,
    isBusAvailableLoading,
    busAvailabilityData,
  } = useSelector((state) => state.booking);
  const dispatch = useDispatch();
  const [minCurrentDate, setMinCurrentDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (busAvailabilityData?.availableSeats <= 0) {
      setTicketsPrice(0);
    }

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
        setDepartureTime(departureCity.departureTime);
        setArrivalTime(arrivalCity.arrivalTime);
      }
    }
  }, [availableBus, busAvailabilityData]);

  useEffect(() => {
    setMinCurrentDate(getCurrentDate());
    if (!selectedDate) setSelectedDate(getCurrentDate());
  }, []);

  useEffect(() => {
    dispatch(fetchCities());
  }, []);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    if (new Date(newDate) < new Date(minCurrentDate)) {
      setSelectedDate(minCurrentDate);
    } else {
      setSelectedDate(newDate);
    }
  };

  const handleFromCityChange = async (cityId) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSelectedFromCity(cityId);
    setSelectedToCity(null);
    setIsLoading(false);
    setDepartureTime(null);
    setArrivalTime(null);
    setTicketsPrice(0);
    setSelectedSeats([]);
    dispatch(resetBusAvailabilityData());
  };
  const handleToCityChange = async (cityId) => {
    setSelectedToCity(cityId);

    if (!selectedDate || !selectedFromCity || !cityId) {
      return;
    }

    const queryObject = {
      selectedDate,
      selectedFromCity,
      selectedToCity: cityId,
    };
    const resultAction = await dispatch(checkIfBusAvailable(queryObject));

    // Check if the bus availability was successful
    if (checkIfBusAvailable.fulfilled.match(resultAction)) {
      const availableBus = resultAction.payload;

      // If bus is available, update the state and proceed to the next step
      if (availableBus) {
      }
    } else if (checkIfBusAvailable.rejected.match(resultAction)) {
      toast.error(resultAction.payload || "No bus available.", {
        duration: 4000,
      });
      setTicketsPrice(0);
    }
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

  const filteredToCities = cities.filter(
    (city) => city._id !== selectedFromCity
  );

  const totalAvailableSeats = busAvailabilityData?.availableSeats || 0;
  const seatsTaken = selectedSeats?.reduce(
    (total, seatType) => (total += seatType.seats),
    0
  );

  return (
    <Container fluid className="position-relative">
      {(isCitiesLoading || isBusAvailableLoading || isLoading) && (
        <div
          className="position-absolute top-0 left-0 h-100 w-100 bg-white bg-opacity-75"
          style={{
            zIndex: 10,
          }}
        >
          <LoadingSpinner />
        </div>
      )}

      <Row className="mb-4">
        <Col lg={3} md={6} sm={6}>
          Date:
        </Col>
        <Col lg={4} md={6} sm={6}>
          <Form.Control
            type="date"
            min={minCurrentDate}
            value={selectedDate}
            onChange={handleDateChange}
            defaultValue={selectedDate}
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={3} md={6} sm={6}>
          From:
        </Col>
        <Col lg={4} md={6} sm={6}>
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
          {departureTime && <div>Departure Time: {departureTime}</div>}
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={3} md={6} sm={6}>
          To:
        </Col>
        <Col lg={4} md={6} sm={6}>
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
          {arrivalTime && <div>Arrival Time: {arrivalTime}</div>}
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={3} md={6} sm={6}>
          Bus:
        </Col>
        <Col lg={4} md={6} sm={6}>
          <Form.Select>
            {availableBus?.route?.name && (
              <option
                value={availableBus?.route?.name}
                key={availableBus?.route?.name}
                selected={availableBus?.route?.name ? true : false}
              >
                {availableBus?.route?.name}
              </option>
            )}
          </Form.Select>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={3} md={6} sm={6}>
          Available Seats:
        </Col>
        <Col lg={4} md={6} sm={6}>
          <b>{totalAvailableSeats}</b>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={3} md={6} sm={6}>
          Ticket Types:
        </Col>
        <Col lg={4} md={6} sm={6}>
          <div className="d-flex flex-column align-items-start gap-2">
            {busAvailabilityData && totalAvailableSeats > 0 && (
              <>
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

                    return (
                      <div className="d-flex flex-row gap-2 align-items-center">
                        <div>{ticketInfo.name}</div>
                        <select
                          className="p-3 py-1 outline-none"
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
                        </select>
                        <div>x ${ticketPriceInfo.price}</div>
                      </div>
                    );
                  }
                })}
              </>
            )}
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={3} md={6} sm={6}>
          Sub-total:
        </Col>
        <Col lg={4} md={6} sm={6}>
          <div class="input-group input-group-md">
            <span class="input-group-text">
              <CurrencyDollar size={16} />
            </span>
            <Form.Control
              type="text"
              disabled
              className="bg-white"
              value={ticketsPrice}
            />
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={3} md={6} sm={6}>
          Tax:
        </Col>
        <Col lg={4} md={6} sm={6}>
          <div class="input-group input-group-md">
            <span class="input-group-text">
              <CurrencyDollar size={16} />
            </span>
            <Form.Control type="text" disabled className="bg-white" value={0} />
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={3} md={6} sm={6}>
          Total:
        </Col>
        <Col lg={4} md={6} sm={6}>
          <div class="input-group input-group-md">
            <span class="input-group-text">
              <CurrencyDollar size={16} />
            </span>
            <Form.Control
              type="text"
              disabled
              className="bg-white"
              value={ticketsPrice}
            />
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={3} md={6} sm={6}>
          Deposit:
        </Col>
        <Col lg={4} md={6} sm={6}>
          <div class="input-group input-group-md">
            <span class="input-group-text">
              <CurrencyDollar size={16} />
            </span>
            <Form.Control
              type="text"
              disabled
              className="bg-white"
              value={ticketsPrice}
            />
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={3} md={6} sm={6}>
          Status:
        </Col>
        <Col lg={4} md={6} sm={6}>
          <Form.Select
            defaultValue={null}
            value={bookingStatus}
            onChange={(e) => {
              SetBookingStatus(e.target.value);
            }}
          >
            <option value="" key="">
              Choose
            </option>
            <option value="cancelled" key="cancelled">
              Cancelled
            </option>
            <option value="confirmed" key="confirmed">
              Confirmed
            </option>
            <option value="pending" key="pending">
              Pending
            </option>
          </Form.Select>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingDetailsTab;
