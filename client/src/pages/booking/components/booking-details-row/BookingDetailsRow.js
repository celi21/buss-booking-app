import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateBookingStepStatus } from "../../../../store/slices/bookingSlice";

const BookingDetailsRow = ({
  selectedDate,
  departureTime,
  arrivalTime,
  selectedSeats,
  ticketsPrice,
  selectedFromCity,
  selectedToCity,
  handleDateButton,
  handleSeatsButton,
}) => {
  const { availableBus } = useSelector((state) => state.booking);

  return (
    <Row className="d-flex align-items-stretch">
      <Col xl={4} lg={4} className="d-flex flex-column">
        <div className="bg-white p-2 rounded shadow-sm h-100">
          <div className="fs-5 fw-semibold mb-3">JOURNEY</div>
          <Row className="mb-2">
            <Col xl="2" lg="2" md="2" sm="2" xs="2">
              Date:
            </Col>
            <Col
              className="d-flex flex-row justify-content-end align-items-center gap-2"
              xl="10"
              lg="10"
              md="10"
              sm="10"
              xs="10"
            >
              <span className="fw-semibold">{selectedDate}</span>
              <Button
                className="p-0 bg-transparent border-0 outline-none text-primary"
                onClick={() => handleDateButton()}
              >
                Change date
              </Button>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col>Departure from:</Col>
            <div className="fw-semibold">
              {
                availableBus.locations.find(
                  (loc) => loc.city._id === selectedFromCity
                )?.city?.name
              }{" "}
              at {departureTime}
            </div>
          </Row>

          <Row className="mb-2">
            <Col>Arrive to:</Col>
            <div className="fw-semibold">
              {
                availableBus.locations.find(
                  (loc) => loc.city._id === selectedToCity
                )?.city?.name
              }{" "}
              at {arrivalTime}
            </div>
          </Row>

          <Row className="mb-2">
            <Col xl="2" lg="2" md="2" sm="2" xs="2">
              Bus:
            </Col>
            <Col
              className="d-flex flex-row justify-content-end align-items-center gap-2"
              xl="10"
              lg="10"
              md="10"
              sm="10"
              xs="10"
            >
              <p className="fw-semibold">{availableBus?.route?.name}</p>
            </Col>
          </Row>
        </div>
      </Col>

      <Col xl={4} lg={4} className="d-flex flex-column">
        <div className="bg-white p-2 rounded shadow-sm h-100">
          <div className="fs-5 fw-semibold mb-3">Tickets</div>

          <Row className="mb-2">
            <Col xl="3" lg="3" md="3" sm="3" xs="3">
              Tickets:
            </Col>
            <Col
              className="d-flex flex-column justify-content-start align-items-start gap-2"
              xl="9"
              lg="9"
              md="9"
              sm="9"
              xs="9"
            >
              {selectedSeats.map((seat) => {
                return (
                  <span className="fw-semibold">
                    {`${seat.seats} ${seat.name} x $${seat.price}`}
                  </span>
                );
              })}
              <Button
                className="p-0 bg-transparent border-0 outline-none text-primary"
                onClick={() => handleSeatsButton()}
              >
                Change seats
              </Button>
            </Col>
          </Row>

          {/* <Row className="mb-2">
          <Col xl="3" lg="3" md="3" sm="3" xs="3">
            Seats:
          </Col>
          <Col
            className="d-flex flex-column justify-content-start align-items-start gap-2"
            xl="9"
            lg="9"
            md="9"
            sm="9"
            xs="9"
          >
            <span className="fw-semibold">5,6,7</span>
          </Col>
        </Row> */}
        </div>
      </Col>

      <Col xl={4} lg={4} className="d-flex flex-column">
        <div className="bg-white p-2 rounded shadow-sm h-100">
          <div className="fs-5 fw-semibold mb-3">PAYMENT</div>

          <Row className="mb-2">
            <Col xl="6" lg="6" md="6" sm="6" xs="6">
              Tickets total
            </Col>
            <Col xl="6" lg="6" md="6" sm="6" xs="6">
              <span className="fw-semibold">${ticketsPrice}</span>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col xl="6" lg="6" md="6" sm="6" xs="6">
              Tax
            </Col>
            <Col xl="6" lg="6" md="6" sm="6" xs="6">
              <span className="fw-semibold">$0.00</span>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col xl="6" lg="6" md="6" sm="6" xs="6">
              Total
            </Col>
            <Col xl="6" lg="6" md="6" sm="6" xs="6">
              <span className="fw-semibold">${ticketsPrice}</span>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col xl="6" lg="6" md="6" sm="6" xs="6">
              Deposit
            </Col>
            <Col xl="6" lg="6" md="6" sm="6" xs="6">
              <span className="fw-semibold">${ticketsPrice}</span>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  );
};

export default BookingDetailsRow;
