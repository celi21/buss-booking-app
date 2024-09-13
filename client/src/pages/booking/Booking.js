import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { ArrowRight } from "react-bootstrap-icons";
import DatesAndLocations from "./components/dates-and-locations/DatesAndLocations";
import Tickets from "./components/tickets/Tickets";
import PersonalDetails from "./components/personal-details/PersonalDetails";
import ConfirmBooking from "./components/confirm-booking/ConfirmBooking";
import BookingPayment from "./components/booking-payment/BookingPayment";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import {
  fetchCities,
  resetBookingForm,
  setCurrentBookingStep,
} from "../../store/slices/bookingSlice";
import BookingConfirmationModal from "./components/booking-payment/booking-confirmation-modal/BookingConfirmationModal";

const Booking = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedFromCity, setSelectedFromCity] = useState(null);
  const [selectedToCity, setSelectedToCity] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketsPrice, setTicketsPrice] = useState(0);
  const [timeout, setTimeout] = useState("3:00");
  const dispatch = useDispatch();
  const { currentBookingStep, bookingStepsStatus } = useSelector(
    (state) => state.booking
  );
  const [totalDuration, setTotalDuration] = useState(null);
  const [departureTime, setDepartureTime] = useState(null);
  const [arrivalTime, setArrivalTime] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [booking, SetBooking] = useState(null);
  const [personalDetails, setPersonalDetails] = useState({
    firstName: null,
    lastName: null,
    phone: null,
    email: null,
    pickupAddress: null,
    dropoffAddress: null,
    notes: null,
    suitcases: 0,
    captcha: null,
  });
  const [paymentDetails, setPaymentDetails] = useState({
    fullName: null,
    cardNumber: null,
    expiryMonth: null,
    expiryYear: null,
    cvv: null,
  });

  useEffect(() => {
    dispatch(fetchCities());
  }, []);

  useEffect(() => {
    let timeLeft = 180; // 3 minutes in seconds

    const interval = setInterval(() => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;

      setTimeout(`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`);

      if (timeLeft <= 0) {
        clearInterval(interval); // Stop the interval after 3 minutes
      } else {
        timeLeft -= 1;
      }
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  const resetForm = () => {
    dispatch(resetBookingForm());
    setSelectedDate(null);
    setSelectedFromCity(null);
    setSelectedToCity(null);
    setSelectedSeats([]);
    setTicketsPrice(0);
    setTotalDuration(null);
    setDepartureTime(null);
    setArrivalTime(null);
    setPersonalDetails({
      firstName: null,
      lastName: null,
      phone: null,
      email: null,
      pickupAddress: null,
      dropoffAddress: null,
      notes: null,
      suitcases: 0,
      captcha: null,
    });
    setPaymentDetails({
      fullName: null,
      cardNumber: null,
      expiryMonth: null,
      expiryYear: null,
      cvv: null,
    });
  };

  const handleTabClick = (tabName) => {
    if (tabName === "payment") {
      dispatch(setCurrentBookingStep(tabName));
      return;
    }

    if (bookingStepsStatus[tabName]?.isCompleted) {
      dispatch(setCurrentBookingStep(tabName));
    }
  };

  return (
    <Container className="my-4">
      <Toaster />

      {showConfirmationModal && (
        <BookingConfirmationModal
          booking={booking}
          showModal={showConfirmationModal}
          setShowModal={setShowConfirmationModal}
        />
      )}

      <Row className="justify-content-center d-flex align-items-center">
        <Col
          xl="auto"
          lg="auto"
          md="auto"
          sm="auto"
          xs="6"
          className="mb-2 p-0"
        >
          <div className="d-flex flex-row align-items-center">
            <Button
              variant={
                currentBookingStep == "dates-and-locations"
                  ? "primary"
                  : bookingStepsStatus["dates-and-locations"].isCompleted
                  ? "success"
                  : "secondary"
              }
              disabled={
                currentBookingStep !== "dates-and-locations" &&
                bookingStepsStatus["dates-and-locations"].isCompleted == false
                  ? true
                  : false
              }
              onClick={() => handleTabClick("dates-and-locations")}
            >
              Dates and Locations
            </Button>
            <ArrowRight className="mx-3" size={22} color="#aaa" />
          </div>
        </Col>

        <Col
          xl="auto"
          lg="auto"
          md="auto"
          sm="auto"
          xs="6"
          className="mb-2 p-0"
        >
          <Button
            variant={
              currentBookingStep == "tickets"
                ? "primary"
                : bookingStepsStatus["tickets"].isCompleted
                ? "success"
                : "secondary"
            }
            disabled={
              currentBookingStep !== "tickets" &&
              bookingStepsStatus["tickets"].isCompleted == false
                ? true
                : false
            }
            onClick={() => handleTabClick("tickets")}
          >
            Tickets
          </Button>
          <ArrowRight className="mx-3" size={22} color="#aaa" />
        </Col>

        <Col
          xl="auto"
          lg="auto"
          md="auto"
          sm="auto"
          xs="6"
          className="mb-2 p-0"
        >
          <Button
            variant={
              currentBookingStep == "details"
                ? "primary"
                : bookingStepsStatus["details"].isCompleted
                ? "success"
                : "secondary"
            }
            disabled={
              currentBookingStep !== "details" &&
              bookingStepsStatus["details"].isCompleted == false
                ? true
                : false
            }
            onClick={() => handleTabClick("details")}
          >
            Details
          </Button>
          <ArrowRight className="mx-3" size={22} color="#aaa" />
        </Col>

        <Col
          xl="auto"
          lg="auto"
          md="auto"
          sm="auto"
          xs="6"
          className="mb-2 p-0"
        >
          <Button
            variant={
              currentBookingStep == "confirm"
                ? "primary"
                : bookingStepsStatus["confirm"].isCompleted
                ? "success"
                : "secondary"
            }
            disabled={
              currentBookingStep !== "confirm" &&
              bookingStepsStatus["confirm"].isCompleted == false
                ? true
                : false
            }
            onClick={() => handleTabClick("confirm")}
          >
            Confirm
          </Button>
          <ArrowRight className="mx-3" size={22} color="#aaa" />
        </Col>

        <Col
          xl="auto"
          lg="auto"
          md="auto"
          sm="auto"
          xs="6"
          className="mb-2 p-0"
        >
          <Button
            variant={
              currentBookingStep == "payment"
                ? "primary"
                : bookingStepsStatus["payment"].isCompleted
                ? "success"
                : "secondary"
            }
            disabled={
              currentBookingStep !== "payment" &&
              bookingStepsStatus["payment"].isCompleted == false
                ? true
                : false
            }
            onClick={() => handleTabClick("payment")}
          >
            Payment
          </Button>
        </Col>
      </Row>

      <div
        className="position-fixed bg-white shadow-sm p-3 rounded-circle d-flex align-items-center justify-content-center flex-column"
        style={{
          right: "0px",
          top: "55px",
          width: "90px",
          height: "90px",
          borderColor: "#0D6EFD",
          borderStyle: "solid",
          borderWidth: "5px!important",
        }}
      >
        <span className="fw-bold text-primary">Time</span>
        <span className="fw-bold text-primary">{timeout}</span>
      </div>

      <div className="my-4">
        {/* 1. Dates and Locations */}
        {currentBookingStep == "dates-and-locations" && (
          <DatesAndLocations
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedFromCity={selectedFromCity}
            setSelectedFromCity={setSelectedFromCity}
            selectedToCity={selectedToCity}
            setSelectedToCity={setSelectedToCity}
          />
        )}

        {/* 2. Tickets */}
        {currentBookingStep == "tickets" && (
          <Tickets
            selectedFromCity={selectedFromCity}
            selectedToCity={selectedToCity}
            selectedDate={selectedDate}
            selectedSeats={selectedSeats}
            setSelectedSeats={setSelectedSeats}
            ticketsPrice={ticketsPrice}
            setTicketsPrice={setTicketsPrice}
            totalDuration={totalDuration}
            setTotalDuration={setTotalDuration}
            departureTime={departureTime}
            setDepartureTime={setDepartureTime}
            arrivalTime={arrivalTime}
            setArrivalTime={setArrivalTime}
            setSelectedDate={setSelectedDate}
          />
        )}

        {/* 3. Details */}
        {currentBookingStep == "details" && (
          <PersonalDetails
            selectedFromCity={selectedFromCity}
            selectedToCity={selectedToCity}
            selectedDate={selectedDate}
            selectedSeats={selectedSeats}
            setSelectedSeats={setSelectedSeats}
            ticketsPrice={ticketsPrice}
            setTicketsPrice={setTicketsPrice}
            totalDuration={totalDuration}
            setTotalDuration={setTotalDuration}
            departureTime={departureTime}
            setDepartureTime={setDepartureTime}
            arrivalTime={arrivalTime}
            setArrivalTime={setArrivalTime}
            personalDetails={personalDetails}
            setPersonalDetails={setPersonalDetails}
          />
        )}

        {/* 4. Confirm */}
        {currentBookingStep == "confirm" && (
          <ConfirmBooking
            selectedFromCity={selectedFromCity}
            selectedToCity={selectedToCity}
            selectedDate={selectedDate}
            selectedSeats={selectedSeats}
            setSelectedSeats={setSelectedSeats}
            ticketsPrice={ticketsPrice}
            setTicketsPrice={setTicketsPrice}
            totalDuration={totalDuration}
            setTotalDuration={setTotalDuration}
            departureTime={departureTime}
            setDepartureTime={setDepartureTime}
            arrivalTime={arrivalTime}
            setArrivalTime={setArrivalTime}
            personalDetails={personalDetails}
            setPersonalDetails={setPersonalDetails}
          />
        )}

        {/* We are sorry, but your booking failed. The available seat(s) for the selected bus have finished while you were placing your order. You can start over searching for other buses or dates.
         */}

        {/* 5. Payment */}
        {currentBookingStep == "payment" && (
          <BookingPayment
            selectedSeats={selectedSeats}
            ticketsPrice={ticketsPrice}
            paymentDetails={paymentDetails}
            setPaymentDetails={setPaymentDetails}
            personalDetails={personalDetails}
            selectedFromCity={selectedFromCity}
            selectedToCity={selectedToCity}
            totalDuration={totalDuration}
            departureTime={departureTime}
            arrivalTime={arrivalTime}
            selectedDate={selectedDate}
            resetForm={resetForm}
            showConfirmationModal={showConfirmationModal}
            setShowConfirmationModal={setShowConfirmationModal}
            booking={booking}
            SetBooking={SetBooking}
          />
        )}
      </div>
    </Container>
  );
};

export default Booking;
