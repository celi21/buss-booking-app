import React, { useState } from "react";
import { Button, Container, Tab, Tabs } from "react-bootstrap";
import BookingDetailsTab from "./components/BookingDetailsTab";
import ClientDetails from "./components/ClientDetails";

const AddBooking = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedFromCity, setSelectedFromCity] = useState(null);
  const [selectedToCity, setSelectedToCity] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketsPrice, setTicketsPrice] = useState(0);
  const [departureTime, setDepartureTime] = useState(null);
  const [arrivalTime, setArrivalTime] = useState(null);
  const [bookingStatus, SetBookingStatus] = useState(null);

  return (
    <Container fluid>
      <Tabs defaultActiveKey="Booking-Details" className="mb-3 pb-3">
        <Tab eventKey="Booking-Details" title="Booking Details">
          <BookingDetailsTab
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedFromCity={selectedFromCity}
            setSelectedFromCity={setSelectedFromCity}
            selectedToCity={selectedToCity}
            setSelectedToCity={setSelectedToCity}
            selectedSeats={selectedSeats}
            setSelectedSeats={setSelectedSeats}
            departureTime={departureTime}
            setDepartureTime={setDepartureTime}
            arrivalTime={arrivalTime}
            setArrivalTime={setArrivalTime}
            ticketsPrice={ticketsPrice}
            setTicketsPrice={setTicketsPrice}
            bookingStatus={bookingStatus}
            SetBookingStatus={SetBookingStatus}
          />
        </Tab>
        <Tab eventKey="Client-Details" title="Client Details">
          <ClientDetails />
        </Tab>
      </Tabs>

      <div className="w-100 d-flex flex-row gap-2 mb-5">
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Save</Button>
      </div>
    </Container>
  );
};

export default AddBooking;
