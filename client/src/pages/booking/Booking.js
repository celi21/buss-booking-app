import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { ArrowRight } from "react-bootstrap-icons";
import DatesAndLocations from "./components/dates-and-locations/DatesAndLocations";
import Tickets from "./components/tickets/Tickets";
import PersonalDetails from "./components/personal-details/PersonalDetails";
import ConfirmBooking from "./components/confirm-booking/ConfirmBooking";
import BookingPayment from "./components/booking-payment/BookingPayment";

const Booking = () => {
  const [currentBookingStep, setCurrentBookingStep] = useState(
    "dates-and-locations"
  );
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeout, setTimeout] = useState("3:00");

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

  return (
    <Container className="my-4">
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
            <Button variant="primary">Dates and Locations</Button>
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
          <Button disabled="true" variant="secondary">
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
          <Button disabled="true" variant="secondary">
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
          <Button disabled="true" variant="secondary">
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
          <Button disabled="true" variant="secondary">
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
        {/* <DatesAndLocations
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        /> */}

        {/* 2. Tickets */}
        {/* <Tickets /> */}

        {/* 3. Details */}
        {/* <PersonalDetails /> */}

        {/* 4. Confirm */}
        {/* <ConfirmBooking /> */}

        {/* We are sorry, but your booking failed. The available seat(s) for the selected bus have finished while you were placing your order. You can start over searching for other buses or dates.
         */}

        {/* 5. Payment */}
        <BookingPayment />
      </div>
    </Container>
  );
};

export default Booking;
