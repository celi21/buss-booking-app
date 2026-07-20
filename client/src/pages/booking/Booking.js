import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { ArrowRight } from "react-bootstrap-icons";
import BookingSearch from "../../components/shared/BookingSearch/BookingSearch";
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
  setSelectedDateState,
  setSelectedFromCityState,
  setSelectedToCityState,
} from "../../store/slices/bookingSlice";
import BookingConfirmationModal from "./components/booking-payment/booking-confirmation-modal/BookingConfirmationModal";
import { translateText } from "../../utils/translation";
import { fetchTaxAmount } from "../../store/slices/SettingsSlice";

const Booking = () => {
  const dispatch = useDispatch();
  const { currentBookingStep, bookingStepsStatus } = useSelector(
    (state) => state.booking
  );
  const selectedLanguage = useSelector(
    (state) => state.settings.selectedLanguage
  );

  const reduxSelectedDate = useSelector((state) => state.booking.selectedDate);
  const reduxSelectedFromCity = useSelector((state) => state.booking.selectedFromCity);
  const reduxSelectedToCity = useSelector((state) => state.booking.selectedToCity);

  const [ticketsPrice, setTicketsPrice] = useState(0);
  const [bookingTimeout, setBookingTimeout] = useState("7:00");
  const [selectedDate, setSelectedDate] = useState(reduxSelectedDate);
  const [selectedFromCity, setSelectedFromCity] = useState(reduxSelectedFromCity);
  const [selectedToCity, setSelectedToCity] = useState(reduxSelectedToCity);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalDuration, setTotalDuration] = useState(null);
  const [departureTime, setDepartureTime] = useState(null);
  const [arrivalTime, setArrivalTime] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Sync with Redux changes
  useEffect(() => {
    if (reduxSelectedDate) setSelectedDate(reduxSelectedDate);
    if (reduxSelectedFromCity) setSelectedFromCity(reduxSelectedFromCity);
    if (reduxSelectedToCity) setSelectedToCity(reduxSelectedToCity);
  }, [reduxSelectedDate, reduxSelectedFromCity, reduxSelectedToCity]);

  const handleSetSelectedDate = (val) => {
    setSelectedDate(val);
    dispatch(setSelectedDateState(val));
  };

  const handleSetSelectedFromCity = (val) => {
    setSelectedFromCity(val);
    dispatch(setSelectedFromCityState(val));
  };

  const handleSetSelectedToCity = (val) => {
    setSelectedToCity(val);
    dispatch(setSelectedToCityState(val));
  };

  // ✅ Initialize booking with safe defaults to prevent null errors
  const [booking, SetBooking] = useState({
    locations: [],
    details: {},
  });

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
  const [flexOption, setFlexOption] = useState(false);

  const flexCharge = 5;
  const cheapestLocations = [
    "66da9290114dd9be8eaf8a59",
    "66da9249114dd9be8eaf8a4a",
    "66da9269114dd9be8eaf8a50",
  ];

  const timerRef = useRef(null);

  // Fetch cities + tax once
  useEffect(() => {
    dispatch(fetchCities());
    dispatch(fetchTaxAmount());
  }, [dispatch]);

  // Timer function
  const startTimer = () => {
    let timeLeft = 420; // 7 minutes
    timerRef.current = setInterval(() => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      setBookingTimeout(`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`);

      if (timeLeft <= 0) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        toast.error("Your Booking Timeout has ended!", { duration: 4000 });
        setTimeout(() => window.location.reload(), 4000);
      } else {
        timeLeft -= 1;
      }
    }, 1000);
  };

  useEffect(() => {
    if (currentBookingStep === "details" && timerRef.current == null) {
      startTimer();
    }
  }, [currentBookingStep]);

  // Reset booking form
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
    clearInterval(timerRef.current);
    timerRef.current = null;
    setIsTimerStarted(false);
    setBookingTimeout("");
    setFlexOption(false);

    // ✅ Reset booking safely
    SetBooking({ locations: [], details: {} });
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
      className="position-absolute top-100 start-50 translate-middle mt-1 bi bi-caret-down-fill"
      fill="#0D6EFD"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
    </svg>
  );

  return (
    <Container className="my-4" fluid>
      <Toaster />

      {showConfirmationModal && (
        <BookingConfirmationModal
          booking={booking}
          showModal={showConfirmationModal}
          setShowModal={setShowConfirmationModal}
          resetForm={resetForm}
        />
      )}

      {/* Navigation Steps */}
      <Row className="justify-content-center d-flex align-items-center px-3">
        <Col xl="auto" lg="auto" md="auto" sm="auto" xs="6" className="mb-2 p-0">
          <div className="d-flex flex-row align-items-center">
            <Button
              variant={
                currentBookingStep === "dates-and-locations"
                  ? "primary"
                  : bookingStepsStatus["dates-and-locations"].isCompleted
                  ? "success"
                  : "secondary"
              }
              disabled={
                currentBookingStep !== "dates-and-locations" &&
                bookingStepsStatus["dates-and-locations"].isCompleted === false
              }
              onClick={() => handleTabClick("dates-and-locations")}
              className="position-relative"
            >
              {selectedLanguage &&
                translateText("dates-and-locations", selectedLanguage.code)}
              {currentBookingStep === "dates-and-locations" && currentStepSVG}
            </Button>
            <ArrowRight className="mx-3" size={22} color="#aaa" />
          </div>
        </Col>
        {/* repeat for other steps ... */}
      </Row>

      {/* Timer */}
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
            borderWidth: "5px",
            zIndex: 100,
          }}
        >
          <span className="fw-bold text-primary">
            {selectedLanguage && translateText("Time", selectedLanguage.code)}
          </span>
          <span className="fw-bold text-primary">{bookingTimeout}</span>
        </div>
      )}

      {/* Booking Steps Components */}
      <div className="my-4">
        {currentBookingStep === "dates-and-locations" && (
          <BookingSearch
            selectedDate={selectedDate}
            setSelectedDate={handleSetSelectedDate}
            selectedFromCity={selectedFromCity}
            setSelectedFromCity={handleSetSelectedFromCity}
            selectedToCity={selectedToCity}
            setSelectedToCity={handleSetSelectedToCity}
            cheapestLocations={cheapestLocations}
            personalDetails={personalDetails}
            setPersonalDetails={setPersonalDetails}
            isCheckoutFlow={true}
          />
        )}

        {currentBookingStep === "tickets" && (
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
            cheapestLocations={cheapestLocations}
            flexOption={flexOption}
            setFlexOption={setFlexOption}
            flexCharge={flexCharge}
          />
        )}

        {currentBookingStep === "details" && (
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
            flexOption={flexOption}
            setFlexOption={setFlexOption}
            flexCharge={flexCharge}
          />
        )}

        {currentBookingStep === "confirm" && (
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
            flexOption={flexOption}
            setFlexOption={setFlexOption}
            flexCharge={flexCharge}
          />
        )}
      </div>
    </Container>
  );
};

export default Booking;
