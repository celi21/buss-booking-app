import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateBookingStepStatus } from "../../../../store/slices/bookingSlice";
import { translateText } from "../../../../utils/translation";

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
  flexOption,
  setFlexOption,
  flexCharge,
}) => {
  const { availableBus } = useSelector((state) => state.booking);
  const selectedLanguage = useSelector(
    (state) => state.settings.selectedLanguage
  );

  return (
    <Row className="d-flex align-items-stretch">
      <Col xl={4} lg={4} className="d-flex flex-column">
        <div className="bg-white p-2 rounded shadow-sm h-100">
          <div className="fs-5 fw-semibold mb-3">
            {selectedLanguage &&
              translateText("journey", selectedLanguage.code)}
          </div>
          <Row className="mb-2">
            <Col xl="2" lg="2" md="2" sm="2" xs="2">
              {selectedLanguage && translateText("date", selectedLanguage.code)}
              :
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
                {selectedLanguage &&
                  translateText("change", selectedLanguage.code)}{" "}
                {selectedLanguage &&
                  translateText("details", selectedLanguage.code)}
              </Button>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col>
              {selectedLanguage &&
                translateText("departure-from", selectedLanguage.code)}
              :
            </Col>
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
            <Col>
              {selectedLanguage &&
                translateText("arrive-to", selectedLanguage.code)}
              :
            </Col>
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
              {selectedLanguage && translateText("bus", selectedLanguage.code)}:
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
          <div className="fs-5 fw-semibold mb-3 text-uppercase">
            {selectedLanguage &&
              translateText("tickets", selectedLanguage.code)}
          </div>

          <Row className="mb-2">
            <Col xl="3" lg="3" md="3" sm="3" xs="3">
              {selectedLanguage &&
                translateText("tickets", selectedLanguage.code)}
              :
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
                {selectedLanguage &&
                  translateText("change", selectedLanguage.code)}
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
          <div className="fs-5 fw-semibold mb-3 text-uppercase">
            {selectedLanguage &&
              translateText("payment", selectedLanguage.code)}
          </div>

          <Row className="mb-2">
            <Col xl="6" lg="6" md="6" sm="6" xs="6">
              {selectedLanguage &&
                translateText("Tickets total", selectedLanguage.code)}
            </Col>
            <Col xl="6" lg="6" md="6" sm="6" xs="6">
              <span className="fw-semibold">${ticketsPrice}</span>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col xl="6" lg="6" md="6" sm="6" xs="6">
              {selectedLanguage &&
                translateText("Flex Charges", selectedLanguage.code)}
            </Col>
            <Col xl="6" lg="6" md="6" sm="6" xs="6">
              <span className="fw-semibold">
                ${flexOption == true ? flexCharge : 0}
              </span>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col xl="6" lg="6" md="6" sm="6" xs="6">
              {selectedLanguage && translateText("Tax", selectedLanguage.code)}
            </Col>
            <Col xl="6" lg="6" md="6" sm="6" xs="6">
              <span className="fw-semibold">$0.00</span>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col xl="6" lg="6" md="6" sm="6" xs="6">
              {selectedLanguage &&
                translateText("Total", selectedLanguage.code)}
            </Col>
            <Col xl="6" lg="6" md="6" sm="6" xs="6">
              <span className="fw-semibold">${ticketsPrice}</span>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col xl="6" lg="6" md="6" sm="6" xs="6">
              {selectedLanguage &&
                translateText("Deposit", selectedLanguage.code)}
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
