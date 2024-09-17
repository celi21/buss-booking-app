import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { ArrowRight, ChevronUp } from "react-bootstrap-icons";
import DatesAndLocations from "./components/dates-and-locations/DatesAndLocations";
import Tickets from "./components/tickets/Tickets";
import PersonalDetails from "./components/personal-details/PersonalDetails";
import ConfirmBooking from "./components/confirm-booking/ConfirmBooking";
import BookingPayment from "./components/booking-payment/BookingPayment";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
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
  const [bookingTimeout, setBookingTimeout] = useState("3:00");
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
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const cheapestLocations = [
    "66da9290114dd9be8eaf8a59",
    "66da9249114dd9be8eaf8a4a",
    "66da9269114dd9be8eaf8a50",
  ];

  useEffect(() => {
    dispatch(fetchCities());
  }, []);

  // toast.custom("Pl")

  const timerRef = useRef(null);
  const startTimer = () => {
    let timeLeft = 240; // 3 minutes in seconds

    const interval = setInterval(() => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;

      setBookingTimeout(`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`);

      if (timeLeft <= 0) {
        clearInterval(interval); // Stop the interval after 3 minutes
        timerRef.current = null; // Reset the timer reference
        toast.error("Your Booking Timeout has been ended!", {
          duration: 4000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 4000);
      } else {
        timeLeft -= 1;
      }
    }, 1000);

    timerRef.current = interval; // Store the interval ID
  };

  useEffect(() => {
    if (currentBookingStep === "details" && !timerRef.current) {
      startTimer();
    }
  }, [currentBookingStep]);

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

  let currentStepSVG = (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      class="position-absolute top-100 start-50 translate-middle mt-1 bi bi-caret-down-fill"
      fill="#0D6EFD"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
    </svg>
  );

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
              className="position-relative"
            >
              Dates and Locations
              {currentBookingStep == "dates-and-locations" && currentStepSVG}
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
            className="position-relative"
          >
            Tickets
            {currentBookingStep == "tickets" && currentStepSVG}
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
            className="position-relative"
          >
            Details
            {currentBookingStep == "details" && currentStepSVG}
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
            className="position-relative"
          >
            Confirm
            {currentBookingStep == "confirm" && currentStepSVG}
          </Button>
        </Col>

        {/* <Col
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
        </Col> */}
      </Row>

      {isTimerStarted && (
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
          <span className="fw-bold text-primary">{bookingTimeout}</span>
        </div>
      )}

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
            cheapestLocations={cheapestLocations}
            personalDetails={personalDetails}
            setPersonalDetails={setPersonalDetails}
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
            paymentDetails={paymentDetails}
            setPaymentDetails={setPaymentDetails}
            resetForm={resetForm}
            showConfirmationModal={showConfirmationModal}
            setShowConfirmationModal={setShowConfirmationModal}
            booking={booking}
            SetBooking={SetBooking}
            isTimerStarted={isTimerStarted}
            setIsTimerStarted={setIsTimerStarted}
          />
        )}

        {/* We are sorry, but your booking failed. The available seat(s) for the selected bus have finished while you were placing your order. You can start over searching for other buses or dates.
         */}

        {/* 5. Payment */}
        {/* {currentBookingStep == "payment" && (
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
        )} */}

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
            paymentDetails={paymentDetails}
            showConfirmationModal={showConfirmationModal}
            setShowConfirmationModal={setShowConfirmationModal}
            booking={booking}
            SetBooking={SetBooking}
            resetForm={resetForm}
          />
        )}
      </div>
    </Container>
  );
};

export default Booking;
