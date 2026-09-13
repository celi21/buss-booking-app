import React, { useState, useEffect, useMemo } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import {
  CalendarEvent,
  GeoAlt,
  Person,
  Telephone,
  Envelope,
  Suitcase2,
  Clock,
  CurrencyDollar,
  CheckCircle,
  ExclamationCircle,
  ShieldCheck,
  JournalText,
  ArrowRight,
} from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  checkIfBusAvailable,
  fetchCities,
  resetBusAvailabilityData,
} from "../../../../store/slices/bookingSlice";
import { fetchTaxAmount } from "../../../../store/slices/SettingsSlice";
import toast from "react-hot-toast";
import axios from "axios";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import "./AddBooking.css";

const AddBooking = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const {
    cities,
    isCitiesLoading,
    availableBus,
    isBusAvailableLoading,
    busAvailabilityData,
  } = useSelector((state) => state.booking);
  const { tax, isTaxLoading } = useSelector((state) => state.settings);
  const { isAdmin, token } = useSelector((state) => state.auth);

  // Helper for current date
  const getCurrentDate = () => {
    const now = new Date();
    const day = ("0" + now.getDate()).slice(-2);
    const month = ("0" + (now.getMonth() + 1)).slice(-2);
    return `${now.getFullYear()}-${month}-${day}`;
  };

  const minCurrentDate = useMemo(() => getCurrentDate(), []);

  // Section 1: Trip Information State
  const [tripType, setTripType] = useState("one-way"); // "one-way" | "round-trip"
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [returnDate, setReturnDate] = useState("");
  const [selectedFromCity, setSelectedFromCity] = useState("");
  const [selectedToCity, setSelectedToCity] = useState("");
  const [departureTime, setDepartureTime] = useState(null);
  const [arrivalTime, setArrivalTime] = useState(null);

  // Section 2: Passenger Details State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Section 3: Pickup & Drop-off State
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [suitcases, setSuitcases] = useState(0);

  // Section 4: Passengers & Seats State
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketsPrice, setTicketsPrice] = useState(0);

  // Section 5: Pricing State
  const [flexOption, setFlexOption] = useState(false);
  const flexCharge = 5;

  // Section 6: Booking Status & Notes State
  const [bookingStatus, setBookingStatus] = useState("confirmed");
  const [notes, setNotes] = useState("");

  // UI / Submission state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Initial data loading
  useEffect(() => {
    dispatch(fetchCities());
    dispatch(fetchTaxAmount());
  }, [dispatch]);

  // Handle bus availability update when bus data changes
  useEffect(() => {
    if (availableBus) {
      if (selectedSeats.length === 0 && availableBus.ticketTypes) {
        const ticketTypes = availableBus.ticketTypes.map((t) => ({
          name: t.name,
          _id: t._id,
          seats: 0,
          price: 0,
        }));
        setSelectedSeats(ticketTypes);
      }

      const departureCity = availableBus.locations?.find(
        (loc) => loc.city?._id === selectedFromCity || loc.city === selectedFromCity
      );
      const arrivalCity = availableBus.locations?.find(
        (loc) => loc.city?._id === selectedToCity || loc.city === selectedToCity
      );

      if (departureCity && arrivalCity) {
        setDepartureTime(departureCity.departureTime || null);
        setArrivalTime(arrivalCity.arrivalTime || null);
      }
    } else {
      setDepartureTime(null);
      setArrivalTime(null);
    }
  }, [availableBus, selectedFromCity, selectedToCity]);

  // Trip selection changes
  const handleDateChange = async (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);

    if (newDate && selectedFromCity && selectedToCity) {
      triggerBusCheck(newDate, selectedFromCity, selectedToCity);
    }
  };

  const handleFromCityChange = (cityId) => {
    setSelectedFromCity(cityId);
    setSelectedToCity("");
    setDepartureTime(null);
    setArrivalTime(null);
    setTicketsPrice(0);
    setSelectedSeats([]);
    dispatch(resetBusAvailabilityData());
  };

  const handleToCityChange = (cityId) => {
    setSelectedToCity(cityId);
    if (selectedDate && selectedFromCity && cityId) {
      triggerBusCheck(selectedDate, selectedFromCity, cityId);
    }
  };

  const triggerBusCheck = async (date, from, to) => {
    const queryObject = {
      selectedDate: date,
      selectedFromCity: from,
      selectedToCity: to,
    };
    const resultAction = await dispatch(checkIfBusAvailable(queryObject));
    if (checkIfBusAvailable.rejected.match(resultAction)) {
      toast.error(resultAction.payload || "No bus available for selected route.", {
        duration: 4000,
      });
      setTicketsPrice(0);
    }
  };

  // Seat selection
  const handleSeatChange = (ticketTypeId, count, unitPrice) => {
    const newSeatsCount = parseInt(count, 10) || 0;
    const updatedSeats = selectedSeats.map((s) => {
      if (s._id === ticketTypeId) {
        return {
          ...s,
          seats: newSeatsCount,
          price: unitPrice,
        };
      }
      return s;
    });

    setSelectedSeats(updatedSeats);

    const priceSum = updatedSeats.reduce(
      (total, t) => total + (parseFloat(t.price) || 0) * (parseInt(t.seats, 10) || 0),
      0
    );
    setTicketsPrice(priceSum);
  };

  const totalAvailableSeats = busAvailabilityData?.availableSeats ?? 0;
  const seatsTaken = selectedSeats.reduce(
    (sum, item) => sum + (parseInt(item.seats, 10) || 0),
    0
  );

  // Pricing calculations
  const taxRate = tax !== null && tax !== undefined ? Number(tax) : 0;
  const calculatedTax = Number(((taxRate / 100) * ticketsPrice).toFixed(2));
  const flexFee = flexOption ? flexCharge : 0;
  const grandTotal = Number((ticketsPrice + flexFee + calculatedTax).toFixed(2));

  // Inline Validation
  const errors = useMemo(() => {
    const errs = {};
    if (!selectedDate) errs.selectedDate = "Travel date is required.";
    if (!selectedFromCity) errs.selectedFromCity = "Departure city is required.";
    if (!selectedToCity) errs.selectedToCity = "Arrival city is required.";
    if (tripType === "round-trip" && !returnDate) {
      errs.returnDate = "Return date is required for round trips.";
    }
    if (!firstName || !firstName.trim()) errs.firstName = "First name is required.";
    if (!phone || !phone.trim()) errs.phone = "Phone number is required.";
    if (!email || !email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Please enter a valid email address.";
    }
    if (!pickupAddress || !pickupAddress.trim()) {
      errs.pickupAddress = "Pickup address is required.";
    }
    if (!dropoffAddress || !dropoffAddress.trim()) {
      errs.dropoffAddress = "Drop-off address is required.";
    }
    if (seatsTaken <= 0) {
      errs.seats = "Please select at least 1 seat.";
    }
    return errs;
  }, [
    selectedDate,
    selectedFromCity,
    selectedToCity,
    tripType,
    returnDate,
    firstName,
    phone,
    email,
    pickupAddress,
    dropoffAddress,
    seatsTaken,
  ]);

  const resetState = () => {
    setSelectedDate(getCurrentDate());
    setReturnDate("");
    setTripType("one-way");
    setSelectedFromCity("");
    setSelectedToCity("");
    setSelectedSeats([]);
    setTicketsPrice(0);
    setDepartureTime(null);
    setArrivalTime(null);
    setBookingStatus("confirmed");
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setPickupAddress("");
    setDropoffAddress("");
    setSuitcases(0);
    setNotes("");
    setFlexOption(false);
    setError(null);
    setSubmitted(false);
    dispatch(resetBusAvailabilityData());
  };

  const confirmBusAvailable = async (queryObject) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/booking/confirm-bus-seats-availability`,
        queryObject,
        config
      );
      if (response.data && response.data.success === true) {
        return true;
      } else {
        setError(response.data?.message || "Bus seat availability check failed.");
        return false;
      }
    } catch (err) {
      setError(err.message || "Failed to confirm bus availability.");
      return false;
    }
  };

  const confirmBooking = async (bookingData) => {
    if (!isAdmin || !token) {
      toast.error("Unauthorized");
      return false;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/booking/add-booking`,
        bookingData,
        config
      );
      if (response.data && response.data.success === true) {
        return true;
      } else {
        setError(response.data?.message || "Failed to create booking.");
        return false;
      }
    } catch (err) {
      setError(err.message || "Booking submission error.");
      return false;
    }
  };

  const submitForm = async () => {
    setSubmitted(true);

    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      toast.error(firstError, { duration: 4000 });
      setError("Please resolve the highlighted validation errors before saving.");
      return;
    }

    if (!availableBus?._id) {
      toast.error("Please search and select a valid available bus before booking.", {
        duration: 4000,
      });
      setError("No valid bus selected.");
      return;
    }

    setLoading(true);
    setError(null);

    const requestedSeats = selectedSeats.reduce(
      (total, seat) => total + (parseInt(seat.seats, 10) || 0),
      0
    );

    try {
      const queryObject = {
        selectedDate,
        busId: availableBus._id,
        requestedSeats,
      };

      const doesBusSeatsExist = await confirmBusAvailable(queryObject);

      if (doesBusSeatsExist === true) {
        const bookingData = {
          bus: availableBus._id,
          busType: availableBus.busType?._id || availableBus.busType,
          route: availableBus.route?._id || availableBus.route,
          from: selectedFromCity,
          to: selectedToCity,
          selectedDate,
          returnDate: tripType === "round-trip" ? returnDate : null,
          personalDetails: {
            firstName: firstName.trim(),
            lastName: lastName ? lastName.trim() : "",
            phone: phone.trim(),
            email: email.trim(),
            pickupAddress: pickupAddress.trim(),
            dropoffAddress: dropoffAddress.trim(),
            suitcases: Number(suitcases) || 0,
            notes: notes ? notes.trim() : "",
          },
          selectedSeats,
          requestedSeats,
          status: bookingStatus,
          flexOption,
          tripType,
        };

        const confirmed = await confirmBooking(bookingData);
        if (confirmed === true) {
          resetState();
          toast.success("Booking has been added successfully.", {
            duration: 4000,
            position: "top-right",
          });
          navigate("/admin/bookings");
        }
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const filteredToCities = cities.filter(
    (city) => city._id !== selectedFromCity
  );

  return (
    <Container fluid className="admin-add-booking-container py-3">
      {/* Page Title & Breadcrumbs */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
            Create New Booking
          </h2>
          <p className="text-muted mb-0 small">
            Admin reservation entry with instant availability, fare calculation, and route assignment.
          </p>
        </div>
        <div className="d-flex gap-2 mt-2 mt-sm-0">
          <Link
            to="/admin/bookings"
            className="btn btn-outline-secondary"
            onClick={() => resetState()}
          >
            Cancel
          </Link>
          <Button
            variant="primary"
            onClick={submitForm}
            disabled={loading}
            className="px-4 fw-semibold"
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Saving...
              </>
            ) : (
              "Create Booking"
            )}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-4">
          <ExclamationCircle className="me-2" size={18} />
          {error}
        </Alert>
      )}

      {/* 2-Column Responsive Layout for 6 Clean Logical Sections */}
      <Row>
        {/* ROW 1: Section 1 (Trip) + Section 2 (Passenger) */}
        <Col lg={6} md={12}>
          {/* SECTION 1: TRIP */}
          <div className="admin-booking-card">
            <div className="section-header">
              <div className="section-title-wrap">
                <span className="section-badge">1</span>
                <h5 className="section-title">Trip Information</h5>
              </div>
              <Badge bg={availableBus ? "success" : "secondary"}>
                {availableBus ? "Bus Available" : "Select Route"}
              </Badge>
            </div>

            {/* Trip Type Toggle */}
            <div className="trip-type-toggle-group">
              <Button
                variant={tripType === "one-way" ? "primary" : "outline-secondary"}
                className="trip-type-btn"
                onClick={() => setTripType("one-way")}
              >
                One Way
              </Button>
              <Button
                variant={tripType === "round-trip" ? "primary" : "outline-secondary"}
                className="trip-type-btn"
                onClick={() => setTripType("round-trip")}
              >
                Round Trip
              </Button>
            </div>

            {/* From & To Selects */}
            <Row className="g-3 mb-3">
              <Col sm={6}>
                <Form.Label className="fw-semibold small text-secondary">
                  From City <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={selectedFromCity}
                  onChange={(e) => handleFromCityChange(e.target.value)}
                  isInvalid={submitted && !!errors.selectedFromCity}
                >
                  <option value="">Choose Origin</option>
                  {cities.map(
                    (c) =>
                      c.status === "active" && (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      )
                  )}
                </Form.Select>
                {submitted && errors.selectedFromCity && (
                  <div className="inline-field-error">{errors.selectedFromCity}</div>
                )}
              </Col>
              <Col sm={6}>
                <Form.Label className="fw-semibold small text-secondary">
                  To City <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={selectedToCity}
                  onChange={(e) => handleToCityChange(e.target.value)}
                  disabled={!selectedFromCity}
                  isInvalid={submitted && !!errors.selectedToCity}
                >
                  <option value="">Choose Destination</option>
                  {filteredToCities.map(
                    (c) =>
                      c.status === "active" && (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      )
                  )}
                </Form.Select>
                {submitted && errors.selectedToCity && (
                  <div className="inline-field-error">{errors.selectedToCity}</div>
                )}
              </Col>
            </Row>

            {/* Dates */}
            <Row className="g-3 mb-2">
              <Col sm={tripType === "round-trip" ? 6 : 12}>
                <Form.Label className="fw-semibold small text-secondary">
                  Travel Date <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  min={minCurrentDate}
                  value={selectedDate}
                  onChange={handleDateChange}
                  isInvalid={submitted && !!errors.selectedDate}
                />
                {submitted && errors.selectedDate && (
                  <div className="inline-field-error">{errors.selectedDate}</div>
                )}
              </Col>
              {tripType === "round-trip" && (
                <Col sm={6}>
                  <Form.Label className="fw-semibold small text-secondary">
                    Return Date <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    min={selectedDate || minCurrentDate}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    isInvalid={submitted && !!errors.returnDate}
                  />
                  {submitted && errors.returnDate && (
                    <div className="inline-field-error">{errors.returnDate}</div>
                  )}
                </Col>
              )}
            </Row>

            {/* Bus Schedule Indicator */}
            {isBusAvailableLoading && (
              <div className="d-flex align-items-center gap-2 mt-3 text-primary small">
                <Spinner animation="border" size="sm" /> Checking bus schedule...
              </div>
            )}

            {availableBus && !isBusAvailableLoading && (
              <div className="bus-schedule-badge">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-bold text-dark">
                    {availableBus.route?.name || "Scheduled Route"}
                  </span>
                  <Badge bg="info" text="dark">
                    {availableBus.busType?.name || "Standard Bus"}
                  </Badge>
                </div>
                <div className="d-flex flex-wrap gap-3 text-muted small">
                  {departureTime && (
                    <span>
                      <Clock className="me-1 text-primary" /> Departure: {departureTime}
                    </span>
                  )}
                  {arrivalTime && (
                    <span>
                      <Clock className="me-1 text-success" /> Arrival: {arrivalTime}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </Col>

        <Col lg={6} md={12}>
          {/* SECTION 2: PASSENGER */}
          <div className="admin-booking-card">
            <div className="section-header">
              <div className="section-title-wrap">
                <span className="section-badge">2</span>
                <h5 className="section-title">Passenger Details</h5>
              </div>
              <Person size={20} className="text-muted" />
            </div>

            <Row className="g-3 mb-3">
              <Col sm={6}>
                <Form.Label className="fw-semibold small text-secondary">
                  First Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  isInvalid={submitted && !!errors.firstName}
                />
                {submitted && errors.firstName && (
                  <div className="inline-field-error">{errors.firstName}</div>
                )}
              </Col>
              <Col sm={6}>
                <Form.Label className="fw-semibold small text-secondary">
                  Last Name
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Col>
            </Row>

            <Row className="g-3 mb-2">
              <Col sm={6}>
                <Form.Label className="fw-semibold small text-secondary">
                  Phone Number <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text>
                    <Telephone size={14} />
                  </InputGroup.Text>
                  <Form.Control
                    type="tel"
                    placeholder="e.g. (555) 012-3456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    isInvalid={submitted && !!errors.phone}
                  />
                </InputGroup>
                {submitted && errors.phone && (
                  <div className="inline-field-error">{errors.phone}</div>
                )}
              </Col>
              <Col sm={6}>
                <Form.Label className="fw-semibold small text-secondary">
                  Email Address <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text>
                    <Envelope size={14} />
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder="e.g. john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={submitted && !!errors.email}
                  />
                </InputGroup>
                {submitted && errors.email && (
                  <div className="inline-field-error">{errors.email}</div>
                )}
              </Col>
            </Row>
          </div>
        </Col>

        {/* ROW 2: Section 3 (Pickup & Drop-off) + Section 4 (Passengers & Seats) */}
        <Col lg={6} md={12}>
          {/* SECTION 3: PICKUP / DROP-OFF */}
          <div className="admin-booking-card">
            <div className="section-header">
              <div className="section-title-wrap">
                <span className="section-badge">3</span>
                <h5 className="section-title">Pickup & Drop-off</h5>
              </div>
              <GeoAlt size={20} className="text-muted" />
            </div>

            <div className="mb-3">
              <Form.Label className="fw-semibold small text-secondary">
                Pickup Address / Landmark <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter exact pickup address or terminal"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                isInvalid={submitted && !!errors.pickupAddress}
              />
              {submitted && errors.pickupAddress && (
                <div className="inline-field-error">{errors.pickupAddress}</div>
              )}
            </div>

            <div className="mb-3">
              <Form.Label className="fw-semibold small text-secondary">
                Drop-off Address / Landmark <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter exact drop-off address or terminal"
                value={dropoffAddress}
                onChange={(e) => setDropoffAddress(e.target.value)}
                isInvalid={submitted && !!errors.dropoffAddress}
              />
              {submitted && errors.dropoffAddress && (
                <div className="inline-field-error">{errors.dropoffAddress}</div>
              )}
            </div>

            <div className="mb-2">
              <Form.Label className="fw-semibold small text-secondary">
                Suitcases / Luggage Count
              </Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <Suitcase2 size={16} />
                </InputGroup.Text>
                <Form.Select
                  value={suitcases}
                  onChange={(e) => setSuitcases(Number(e.target.value))}
                >
                  {Array.from({ length: 21 }, (_, i) => (
                    <option key={i} value={i}>
                      {i} {i === 1 ? "Suitcase" : "Suitcases"}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </div>
          </div>
        </Col>

        <Col lg={6} md={12}>
          {/* SECTION 4: PASSENGERS & SEATS */}
          <div className="admin-booking-card">
            <div className="section-header">
              <div className="section-title-wrap">
                <span className="section-badge">4</span>
                <h5 className="section-title">Passengers & Seats</h5>
              </div>
              {busAvailabilityData && (
                <span
                  className={`seat-avail-indicator ${
                    totalAvailableSeats > 5
                      ? "seat-avail-green"
                      : totalAvailableSeats > 0
                      ? "seat-avail-amber"
                      : "seat-avail-red"
                  }`}
                >
                  {totalAvailableSeats} seats left
                </span>
              )}
            </div>

            {!availableBus ? (
              <div className="text-center py-4 text-muted small bg-light rounded">
                Select departure and destination cities to view seat options.
              </div>
            ) : totalAvailableSeats <= 0 ? (
              <Alert variant="warning" className="small mb-0">
                This bus has no remaining available seats on this date.
              </Alert>
            ) : (
              <>
                <p className="text-muted small mb-2">
                  Select the number of tickets for each passenger category:
                </p>
                <div className="d-flex flex-column gap-2 mb-3">
                  {availableBus.ticketPrices?.map((price) => {
                    const ticketInfo = availableBus.ticketTypes?.find(
                      (t) => t._id === price.ticketType
                    );
                    const fromLocationCity = availableBus.locations?.find(
                      (loc) => loc.city?._id === selectedFromCity || loc.city === selectedFromCity
                    );
                    const toLocationCity = availableBus.locations?.find(
                      (loc) => loc.city?._id === selectedToCity || loc.city === selectedToCity
                    );
                    const ticketPriceInfo = price.prices?.find(
                      (p) =>
                        (fromLocationCity?.city?._id === selectedFromCity ||
                          fromLocationCity?.city === selectedFromCity) &&
                        (toLocationCity?.city?._id === selectedToCity ||
                          toLocationCity?.city === selectedToCity) &&
                        fromLocationCity?._id?.toString() === p.fromLocationId?.toString() &&
                        toLocationCity?._id?.toString() === p.toLocationId?.toString()
                    );

                    if (!ticketInfo || !ticketPriceInfo) return null;

                    const currentSeats =
                      selectedSeats?.find((s) => s._id === ticketInfo._id)?.seats || 0;
                    const maxAllowedForThis = Math.max(
                      0,
                      totalAvailableSeats - seatsTaken + currentSeats
                    );
                    const seatOptions = Array.from(
                      { length: maxAllowedForThis + 1 },
                      (_, i) => i
                    );

                    return (
                      <div key={ticketInfo._id} className="ticket-type-row">
                        <div>
                          <div className="fw-semibold text-dark">{ticketInfo.name}</div>
                          <div className="text-muted small">
                            ${Number(ticketPriceInfo.price).toFixed(2)} / passenger
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <Form.Select
                            size="sm"
                            style={{ width: "80px" }}
                            value={currentSeats}
                            onChange={(e) =>
                              handleSeatChange(
                                ticketInfo._id,
                                e.target.value,
                                ticketPriceInfo.price
                              )
                            }
                          >
                            {seatOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </Form.Select>
                          <span className="fw-bold text-dark" style={{ minWidth: "60px", textAlign: "right" }}>
                            ${(currentSeats * Number(ticketPriceInfo.price)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                  <span className="small text-muted">Total Passengers / Seats:</span>
                  <Badge bg={seatsTaken > 0 ? "primary" : "secondary"} className="fs-6">
                    {seatsTaken} {seatsTaken === 1 ? "seat" : "seats"}
                  </Badge>
                </div>
                {submitted && errors.seats && (
                  <div className="inline-field-error text-end">{errors.seats}</div>
                )}
              </>
            )}
          </div>
        </Col>

        {/* ROW 3: Section 5 (Pricing Summary) + Section 6 (Booking Status & Notes) */}
        <Col lg={6} md={12}>
          {/* SECTION 5: PRICING */}
          <div className="admin-booking-card">
            <div className="section-header">
              <div className="section-title-wrap">
                <span className="section-badge">5</span>
                <h5 className="section-title">Pricing Summary</h5>
              </div>
              <CurrencyDollar size={20} className="text-success" />
            </div>

            {/* Flex protection add-on */}
            <div className="p-3 mb-3 bg-light rounded border">
              <Form.Check
                type="checkbox"
                id="flex-protection-toggle"
                label={
                  <div className="ms-1">
                    <span className="fw-semibold text-dark">
                      Add Flex Protection (+$5.00)
                    </span>
                    <div className="text-muted small">
                      Permits date and time modifications up to 2 hours prior to departure.
                    </div>
                  </div>
                }
                checked={flexOption}
                onChange={(e) => setFlexOption(e.target.checked)}
              />
            </div>

            <div className="pricing-summary-card">
              <div className="pricing-row">
                <span>Base Ticket Fare ({seatsTaken} seats):</span>
                <span className="fw-semibold">${ticketsPrice.toFixed(2)}</span>
              </div>
              <div className="pricing-row">
                <span>Flex Option Protection:</span>
                <span className="fw-semibold">${flexFee.toFixed(2)}</span>
              </div>
              <div className="pricing-row">
                <span>Estimated Tax ({taxRate}%):</span>
                <span className="fw-semibold">${calculatedTax.toFixed(2)}</span>
              </div>
              <div className="pricing-row total-row">
                <span>Total Amount Due:</span>
                <span className="total-pill">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-3 text-muted small text-end">
              <ShieldCheck className="me-1 text-success" /> Payment collected directly by admin.
            </div>
          </div>
        </Col>

        <Col lg={6} md={12}>
          {/* SECTION 6: BOOKING & CONFIRMATION */}
          <div className="admin-booking-card">
            <div className="section-header">
              <div className="section-title-wrap">
                <span className="section-badge">6</span>
                <h5 className="section-title">Booking Status & Notes</h5>
              </div>
              <JournalText size={20} className="text-muted" />
            </div>

            <div className="mb-3">
              <Form.Label className="fw-semibold small text-secondary">
                Booking Status <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                value={bookingStatus}
                onChange={(e) => setBookingStatus(e.target.value)}
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </Form.Select>
            </div>

            <div className="mb-3">
              <Form.Label className="fw-semibold small text-secondary">
                Payment Channel / Reference
              </Form.Label>
              <Form.Control
                type="text"
                disabled
                className="bg-light"
                value="Admin Manual / Cash / In-Office Booking"
              />
            </div>

            <div className="mb-4">
              <Form.Label className="fw-semibold small text-secondary">
                Administrative Notes
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Optional internal remarks, special instructions, or payment references..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Bottom Actions */}
            <div className="d-flex justify-content-end gap-2 mt-auto pt-3 border-top">
              <Link
                to="/admin/bookings"
                className="btn btn-outline-secondary px-3"
                onClick={() => resetState()}
              >
                Cancel
              </Link>
              <Button
                variant="primary"
                onClick={submitForm}
                disabled={loading}
                className="px-4 fw-semibold"
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Processing...
                  </>
                ) : (
                  "Create Booking"
                )}
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AddBooking;
