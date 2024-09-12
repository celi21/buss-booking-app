import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { ArrowRepeat } from "react-bootstrap-icons";
import BookingDetailsRow from "../booking-details-row/BookingDetailsRow";
import { useDispatch } from "react-redux";
import {
  setCurrentBookingStep,
  updateBookingStepStatus,
} from "../../../../store/slices/bookingSlice";

const ConfirmBooking = ({
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
  personalDetails,
  setPersonalDetails,
}) => {
  const dispatch = useDispatch();
  const handleBackButton = () => {
    dispatch(setCurrentBookingStep("details"));
  };

  const handlePaymentButton = () => {
    dispatch(setCurrentBookingStep("payment"));
    dispatch(
      updateBookingStepStatus({
        step: "confirm",
        isCompleted: true,
      })
    );
  };

  return (
    <div className="bg-light border p-3 rounded w-100">
      <p className="fs-4 fw-semibold text-center border-bottom pb-3">
        Please Confirm your Details.
      </p>
      <p className="fs-4 fw-bold">Booking Details</p>

      <BookingDetailsRow
        selectedDate={selectedDate}
        departureTime={departureTime}
        arrivalTime={arrivalTime}
        selectedSeats={selectedSeats}
        ticketsPrice={ticketsPrice}
        selectedFromCity={selectedFromCity}
        selectedToCity={selectedToCity}
      />

      <div className="mt-4">
        <p className="fs-4 fw-bold">Personal Details</p>
        {personalDetails && (
          <div>
            <Row className="mb-3">
              <Col lg={6} xl={6} md={12} sm={12} xs={12}>
                <div>
                  <Form.Label className="m-0" htmlFor="firstName">
                    First Name:
                  </Form.Label>
                  <div className="fw-semibold">{personalDetails.firstName}</div>
                </div>
              </Col>
              <Col lg={6} xl={6} md={12} sm={12} xs={12}>
                <div>
                  <Form.Label className="m-0" htmlFor="lastName">
                    Last Name:
                  </Form.Label>
                  <div className="fw-semibold">{personalDetails.lastName}</div>
                </div>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col lg={6} xl={6} md={12} sm={12} xs={12}>
                <div>
                  <Form.Label className="m-0" htmlFor="phone">
                    Phone:
                  </Form.Label>
                  <div className="fw-semibold">{personalDetails.phone}</div>
                </div>
              </Col>
              <Col lg={6} xl={6} md={12} sm={12} xs={12}>
                <div>
                  <Form.Label className="m-0" htmlFor="email">
                    Email:
                  </Form.Label>
                  <div className="fw-semibold">{personalDetails.email}</div>
                </div>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col lg={6} xl={6} md={12} sm={12} xs={12}>
                <div>
                  <Form.Label className="m-0" htmlFor="pickup-address">
                    Pickup Address:
                  </Form.Label>
                  <div className="fw-semibold">
                    {personalDetails.pickupAddress}
                  </div>
                </div>
              </Col>
              <Col lg={6} xl={6} md={12} sm={12} xs={12}>
                <div>
                  <Form.Label className="m-0" htmlFor="dropoff-address">
                    Dropoff Address:
                  </Form.Label>
                  <div className="fw-semibold">
                    {personalDetails.dropoffAddress}
                  </div>
                </div>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col lg={6} xl={6} md={12} sm={12} xs={12}>
                <div>
                  <Form.Label className="m-0" htmlFor="notes">
                    Notes:
                  </Form.Label>
                  <p className="fw-semibold">{personalDetails.notes}</p>
                </div>
              </Col>
              <Col lg={6} xl={6} md={12} sm={12} xs={12}>
                <div>
                  <Form.Label className="m-0" htmlFor="suitcases">
                    Suitcases:
                  </Form.Label>
                  <div className="fw-semibold">{personalDetails.suitcases}</div>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </div>

      <Row className="mt-5">
        <Col>
          <Button
            variant="dark"
            className="px-3 py-2 fw-semibold"
            onClick={handleBackButton}
          >
            Back
          </Button>
        </Col>
        <Col className="justify-content-end d-flex">
          <Button
            className="px-3 py-2 fw-semibold"
            onClick={handlePaymentButton}
          >
            Go to Payment
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ConfirmBooking;
