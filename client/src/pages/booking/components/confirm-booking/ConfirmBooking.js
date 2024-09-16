import React, { useState } from "react";
import { Alert, Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { ArrowRepeat } from "react-bootstrap-icons";
import BookingDetailsRow from "../booking-details-row/BookingDetailsRow";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentBookingStep,
  updateBookingStepStatus,
} from "../../../../store/slices/bookingSlice";
import axios from "axios";
import toast from "react-hot-toast";

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
  paymentDetails,
  booking,
  SetBooking,
  showConfirmationModal,
  setShowConfirmationModal,
  resetForm,
}) => {
  const [localError, setLocalError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleBackButton = () => {
    dispatch(setCurrentBookingStep("details"));
    dispatch(
      updateBookingStepStatus({
        step: "confirm",
        isCompleted: false,
      })
    );
  };

  const handleDateButton = () => {
    const stepsToUpdate = ["details", "confirm", "tickets"];
    dispatch(setCurrentBookingStep("dates-and-locations"));
    stepsToUpdate.forEach((step) => {
      dispatch(
        updateBookingStepStatus({
          step: step,
          isCompleted: false,
        })
      );
    });
  };

  const handleSeatsButton = () => {
    const stepsToUpdate = ["details", "confirm", "tickets"];
    dispatch(setCurrentBookingStep("tickets"));
    stepsToUpdate.forEach((step) => {
      dispatch(
        updateBookingStepStatus({
          step: step,
          isCompleted: false,
        })
      );
    });
  };

  const { availableBus, busAvailabilityData } = useSelector(
    (state) => state.booking
  );

  const confirmBusAvailable = async (queryObject) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/booking/confirm-bus-seats-availability`,
        queryObject,
        config
      );
      if (
        response.data &&
        response.data.success &&
        response.data.success == true
      ) {
        return true;
      } else {
        setLocalError(response.data.message);
        return false;
      }
    } catch (error) {
      setLocalError(error.message);
      return false;
    }
  };

  const confirmBooking = async (bookingData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/booking/confirm-booking`,
        bookingData,
        config
      );
      if (
        response.data &&
        response.data.success &&
        response.data.success == true
      ) {
        SetBooking(response.data.booking);
        return true;
      } else {
        setLocalError(response.data.message);
        return false;
      }
    } catch (error) {
      setLocalError(error.message);
      return false;
    }
  };

  const handleConfirmButton = async () => {
    setLoading(true);
    try {
      const requestedSeats = selectedSeats.reduce(
        (total, seat) => total + seat.seats
      );

      const queryObject = {
        selectedDate,
        busId: availableBus?._id,
        requestedSeats: requestedSeats,
      };
      // confirm if bus/seats is still available
      const doesBusSeatsExists = await confirmBusAvailable(queryObject);

      if (doesBusSeatsExists === true) {
        let bookingData = {
          bus: availableBus._id,
          busType: availableBus.busType._id,
          route: availableBus.route._id,
          from: selectedFromCity,
          to: selectedToCity,
          selectedDate: selectedDate,
          paymentDetails: paymentDetails,
          personalDetails: personalDetails,
          selectedSeats: selectedSeats,
          requestedSeats: requestedSeats,
          user: user,
        };

        const confirm = await confirmBooking(bookingData);
        if (confirm === true) {
          resetForm();
          setShowConfirmationModal(true);
          toast.success("Your booking has been completed Successfully.", {
            duration: 4000,
            position: "top-right",
          });
        }
      }
    } catch (error) {
      setLocalError(error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
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
        handleSeatsButton={handleSeatsButton}
        handleDateButton={handleDateButton}
      />

      <div className="my-4">
        <div className="d-flex flex-row align-items-center gap-2 mb-4">
          <p className="fs-4 fw-bold m-0 p-0">Personal Details</p>
          <Button
            className="p-0 m-0 bg-transparent border-0 outline-none text-primary"
            onClick={() => handleBackButton()}
          >
            Change details
          </Button>
        </div>

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

      <div className="my-4">
        <div className="d-flex flex-row align-items-center gap-2 mb-4">
          <p className="fs-4 fw-bold m-0 p-0">Payment Details</p>
          <Button
            className="p-0 m-0 bg-transparent border-0 outline-none text-primary"
            onClick={() => handleBackButton()}
          >
            Change details
          </Button>
        </div>
        {paymentDetails && (
          <div>
            <Row className="mb-3">
              <Col lg={6} xl={6} md={12} sm={12} xs={12}>
                <div>
                  <Form.Label className="m-0" htmlFor="firstName">
                    Full Name on Card:
                  </Form.Label>
                  <div className="fw-semibold">{paymentDetails.fullName}</div>
                </div>
              </Col>
              <Col lg={6} xl={6} md={12} sm={12} xs={12}>
                <div>
                  <Form.Label className="m-0" htmlFor="lastName">
                    Card Number:
                  </Form.Label>
                  <div className="fw-semibold">{paymentDetails.cardNumber}</div>
                </div>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col lg={6} xl={6} md={12} sm={12} xs={12}>
                <div>
                  <Form.Label className="m-0" htmlFor="phone">
                    Card Expiry (MM/YY):
                  </Form.Label>
                  <div className="fw-semibold">
                    {paymentDetails.expiryMonth}/{paymentDetails.expiryYear}
                  </div>
                </div>
              </Col>
              <Col lg={6} xl={6} md={12} sm={12} xs={12}>
                <div>
                  <Form.Label className="m-0" htmlFor="email">
                    CVV/CVC Number:
                  </Form.Label>
                  <div className="fw-semibold">{paymentDetails.cvv}</div>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </div>

      {localError && <Alert variant="danger">{localError}</Alert>}

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
            variant="primary"
            className="fw-bold py-2"
            style={{
              fontSize: "18px",
            }}
            onClick={handleConfirmButton}
            disabled={loading}
          >
            {loading ? (
              <div className="d-flex align-items-center justify-content-center">
                <Spinner size="small" />
              </div>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ConfirmBooking;
