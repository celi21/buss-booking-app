import React, { useEffect, useState } from "react";
import { Alert, Button, Container, Tab, Tabs } from "react-bootstrap";
import EditBookingDetailsTab from "./components/EditBookingDetailsTab";
import EditClientDetails from "./components/EditClientDetails";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  checkIfBusAvailable,
  resetBusAvailabilityData,
} from "../../../../store/slices/bookingSlice";
import toast from "react-hot-toast";
import axios from "axios";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";

const EditBooking = () => {
  const { bookingId } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedFromCity, setSelectedFromCity] = useState(null);
  const [selectedToCity, setSelectedToCity] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketsPrice, setTicketsPrice] = useState(0);
  const [departureTime, setDepartureTime] = useState(null);
  const [arrivalTime, setArrivalTime] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [email, setEmail] = useState(null);
  const [pickupAddress, setPickupAddress] = useState(null);
  const [dropoffAddress, setDropoffAddress] = useState(null);
  const [suitcases, setSuitcases] = useState(null);
  const [notes, setNotes] = useState(null);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const { availableBus, busAvailabilityData } = useSelector(
    (state) => state.booking
  );
  const { isAdmin, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleToCityChange = async (toCityId, fromCityId, date) => {
    setSelectedToCity(toCityId);

    if (!date || !fromCityId || !toCityId) {
      return;
    }

    const queryObject = {
      selectedDate: date,
      selectedFromCity: fromCityId,
      selectedToCity: toCityId,
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
      dispatch(resetBusAvailabilityData());
      setSelectedSeats([]);
    }
  };

  const resetState = () => {
    setSelectedDate(null);
    setSelectedFromCity(null);
    setSelectedToCity(null);
    setSelectedSeats([]);
    setTicketsPrice(0);
    setDepartureTime(null);
    setArrivalTime(null);
    setFirstName(null);
    setLastName(null);
    setPhone(null);
    setEmail(null);
    setPickupAddress(null);
    setDropoffAddress(null);
    setSuitcases(null);
    setNotes(null);
    dispatch(resetBusAvailabilityData());
  };

  const searchBooking = async (id) => {
    setLoading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      let response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/booking/search-booking/${id}`,
        config
      );
      if (
        response.data &&
        response.data.success &&
        response.data.success === true
      ) {
        setError(null);
        let booking = response.data.booking;
        setSelectedDate(booking.bookingDate);
        setSelectedFromCity(booking.from._id);
        setSelectedToCity(booking.to._id);
        setSelectedSeats(booking.seatDetails);
        setDepartureTime(
          booking.bus && booking.bus.locations && booking.bus.locations.length > 0
            ? booking.bus.locations[0].departureTime
            : 'N/A'
        );
        setArrivalTime(
          booking.bus && booking.bus.locations && booking.bus.locations.length > 0
            ? booking.bus.locations[booking.bus.locations.length - 1].arrivalTime
            : 'N/A'
        );
        setTicketsPrice(booking.payment.amount);
        setFirstName(booking.personalDetails.firstName);
        setLastName(booking.personalDetails.lastName);
        setPhone(booking.personalDetails.phone);
        setEmail(booking.personalDetails.email);
        setPickupAddress(booking.personalDetails.pickupAddress);
        setDropoffAddress(booking.personalDetails.dropoffAddress);
        setSuitcases(booking.personalDetails.suitcases);
        setNotes(booking.personalDetails.notes);
        await handleToCityChange(
          booking.to._id,
          booking.from._id,
          booking.bookingDate
        );
      } else if (response.data && response.data.success === false) {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) {
      searchBooking(bookingId);
    }
  }, [bookingId]);

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
        setError(response.data.message);
        return false;
      }
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  const updateBooking = async (bookingData) => {
    if (!isAdmin || !token) {
      toast.error("Unauthorized");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/booking/update-booking`,
        bookingData,
        config
      );
      if (
        response.data &&
        response.data.success &&
        response.data.success == true
      ) {
        toast.success(response.data.message, {
          duration: 4000,
        });
        return true;
      } else {
        setError(response.data.message);
        toast.error(response.data.message, {
          duration: 4000,
        });
        return false;
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message, {
        duration: 4000,
      });
      return false;
    }
  };

  const navigate = useNavigate();
  const submitForm = async () => {
    if (!selectedDate) {
      toast.error(
        "Please select a departure/booking date in Booking Details.",
        {
          duration: 4000,
        }
      );
      setError("Please select a departure/booking date in Booking Details.");
      return;
    }

    if (!selectedFromCity) {
      toast.error("Please select a 'From' city in Booking Details.", {
        duration: 4000,
      });
      setError("Please select a 'From' city in Booking Details.");
      return;
    }

    if (!selectedToCity) {
      toast.error("Please select a 'To' city in Booking Details.", {
        duration: 4000,
      });
      setError("Please select a 'To' city in Booking Details.");
      return;
    }

    var hasAnySeatSelected = false;
    for (let i = 0; i < selectedSeats.length; i++) {
      if (selectedSeats[i].seats > 0) {
        hasAnySeatSelected = true;
        break;
      }
    }

    if (hasAnySeatSelected == false) {
      toast.error(
        "You need to select at least one ticket in Booking Details.",
        {
          duration: 4000,
        }
      );
      setError("You need to select at least one ticket in Booking Details.");
      setTicketsPrice(0);
      return;
    }

    if (!firstName || firstName.trim() == "") {
      toast.error("Please enter the first name in Client Details.", {
        duration: 4000,
      });
      setError("Please enter the first name in Client Details.");
      return;
    }

    if (!phone || phone.trim() == "") {
      toast.error("Please enter a phone number in Client Details.", {
        duration: 4000,
      });
      setError("Please enter a phone number in Client Details.");
      return;
    }

    if (!email || email.trim() == "") {
      toast.error("Please enter an email address in Client Details.", {
        duration: 4000,
      });
      setError("Please enter an email address in Client Details.");
      return;
    }

    if (!pickupAddress || pickupAddress.trim() == "") {
      toast.error("Please enter a pickup address in Client Details.", {
        duration: 4000,
      });
      setError("Please enter a pickup address in Client Details.");
      return;
    }

    if (!dropoffAddress || dropoffAddress.trim() == "") {
      toast.error("Please enter a dropoff address in Client Details.", {
        duration: 4000,
      });
      setError("Please enter a dropoff address in Client Details.");
      return;
    }
    setLoading(true);
    setError(null);

    // Your form submission logic here...

    const requestedSeats = selectedSeats.reduce(
      (total, seat) => total + seat.seats
    );
    try {
      const queryObject = {
        selectedDate,
        busId: availableBus?._id,
        requestedSeats: requestedSeats,
      };
      const doesBusSeatsExists = await confirmBusAvailable(queryObject);

      if (doesBusSeatsExists === true) {
        let bookingData = {
          bookingId: bookingId,
          bus: availableBus._id,
          busType: availableBus.busType._id,
          route: availableBus.route._id,
          from: selectedFromCity,
          to: selectedToCity,
          selectedDate: selectedDate,
          personalDetails: {
            firstName,
            lastName,
            phone,
            email,
            pickupAddress,
            dropoffAddress,
            suitcases,
            notes,
          },
          selectedSeats: selectedSeats,
          requestedSeats: requestedSeats,
        };

        const confirm = await updateBooking(bookingData);
        if (confirm === true) {
          resetState();
          // setShowConfirmationModal(true);
          toast.success("Booking has been updated Successfully.", {
            duration: 4000,
            position: "top-right",
          });
          navigate("/admin/bookings");
        }
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid>
      <Tabs defaultActiveKey="Booking-Details" className="mb-3 pb-3">
        <Tab eventKey="Booking-Details" title="Booking Details">
          <EditBookingDetailsTab
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
            handleToCityChange={handleToCityChange}
          />
        </Tab>
        <Tab eventKey="Client-Details" title="Client Details">
          <EditClientDetails
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            phone={phone}
            setPhone={setPhone}
            email={email}
            setEmail={setEmail}
            pickupAddress={pickupAddress}
            setPickupAddress={setPickupAddress}
            dropoffAddress={dropoffAddress}
            setDropoffAddress={setDropoffAddress}
            suitcases={suitcases}
            setSuitcases={setSuitcases}
            notes={notes}
            setNotes={setNotes}
          />
        </Tab>
      </Tabs>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="w-100 d-flex flex-row gap-2 mb-5">
        <Link
          to="/admin/bookings"
          className="btn btn-secondary"
          onClick={() => resetState()}
        >
          Cancel
        </Link>
        <Button variant="primary" onClick={submitForm} disabled={loading}>
          {loading ? <LoadingSpinner /> : "Save"}
        </Button>
      </div>
    </Container>
  );
};

export default EditBooking;
