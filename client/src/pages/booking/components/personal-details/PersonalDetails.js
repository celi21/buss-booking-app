import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { ArrowRepeat } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentBookingStep,
  updateBookingStepStatus,
} from "../../../../store/slices/bookingSlice";
import Autocomplete from "react-google-autocomplete";
import toast from "react-hot-toast";
import BookingDetailsRow from "../booking-details-row/BookingDetailsRow";
import BookingPayment from "../booking-payment/BookingPayment";

const PersonalDetails = ({
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
  setPaymentDetails,
  resetForm,
  showConfirmationModal,
  setShowConfirmationModal,
  booking,
  SetBooking,
  setIsTimerStarted,
  isTimerStarted,
}) => {
  const dispatch = useDispatch();
  const handleBackButton = () => {
    dispatch(setCurrentBookingStep("tickets"));
  };

  const { availableBus, isBusAvailableLoading, busAvailabilityData } =
    useSelector((state) => state.booking);

  const [firstName, setFirstName] = useState(personalDetails.firstName);
  const [lastName, setLastName] = useState(personalDetails.lastName);
  const [phone, setPhone] = useState(personalDetails.phone);
  const [email, setEmail] = useState(personalDetails.email);
  const [pickupAddress, setPickupAddress] = useState(
    personalDetails.pickupAddress
  );
  const [dropoffAddress, setDropoffAddress] = useState(
    personalDetails.dropoffAddress
  );
  const [notes, setNotes] = useState(personalDetails.notes);
  const [suitcases, setSuitcases] = useState(personalDetails.suitcases);
  const [captcha, setCaptcha] = useState(personalDetails.captcha);
  const [captchaCode, setCaptchaCode] = useState(null);
  const [localError, setLocalError] = useState(null);

  // card details
  const [fullName, setFullName] = useState(paymentDetails.fullName);
  const [cardNumber, setCardNumber] = useState(paymentDetails.cardNumber);
  const [expiryMonth, setExpiryMonth] = useState(paymentDetails.expiryMonth);
  const [expiryYear, setExpiryYear] = useState(paymentDetails.expiryYear);
  const [cvv, setCvv] = useState(paymentDetails.cvv);

  const generateCaptcha = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      let randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  };

  const validate = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const validateEmail = (email) => {
    if (validate(email)) {
      return true;
    } else {
      return false;
    }
    return false;
  };

  useEffect(() => {
    setIsTimerStarted(true);
    if (!captchaCode) {
      setCaptchaCode(generateCaptcha(7));
    }
  }, []);

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
    const stepsToUpdate = ["details", "confirm", "payment", "tickets"];
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

  const handleProceedButton = () => {
    if (!firstName || firstName.trim() == "") {
      toast.error("Please provide your First Name", {
        duration: 4000,
      });
      setLocalError("Please provide your First Name");
      return;
    }
    if (!phone || phone.trim() == "") {
      toast.error("Please provide your Phone", {
        duration: 4000,
      });
      setLocalError("Please provide your Phone");
      return;
    }
    if (!email || email.trim() == "") {
      toast.error("Please provide your Email", {
        duration: 4000,
      });
      setLocalError("Please provide your Email");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Please provide a valid Email address.", {
        duration: 4000,
      });
      setLocalError("Please provide a valid Email address.");
      return;
    }
    if (!pickupAddress || pickupAddress.trim() == "") {
      toast.error("Please provide your Pickup Address", {
        duration: 4000,
      });
      setLocalError("Please provide your Pickup Address");
      return;
    }
    if (!dropoffAddress || dropoffAddress.trim() == "") {
      toast.error("Please provide your Dropoff Address", {
        duration: 4000,
      });
      setLocalError("Please provide your Dropoff Address");
      return;
    }
    if (!fullName || fullName.trim() == "") {
      toast.error("Please provide your Full Name on Card Details.", {
        duration: 4000,
      });
      setLocalError("Please provide your Full Name on Card Details.");
      return;
    }
    if (!cardNumber || cardNumber.trim() == "") {
      toast.error("Please provide your Card Number on Card Details.", {
        duration: 4000,
      });
      setLocalError("Please provide your Card Number on Card Details.");
      return;
    }
    if (!expiryMonth || expiryMonth.trim() == "") {
      toast.error("Please provide card Expiry Month on Card Details.", {
        duration: 4000,
      });
      setLocalError("Please provide card Expiry Month on Card Details.");
      return;
    }
    if (!expiryYear || expiryYear.trim() == "") {
      toast.error("Please provide card Expiry Year on Card Details.", {
        duration: 4000,
      });
      setLocalError("Please provide card Expiry Year on Card Details.");
      return;
    }
    if (!cvv || cvv.trim() == "") {
      toast.error("Please provide card CVV/CVC number on Card Details.", {
        duration: 4000,
      });
      setLocalError("Please provide card CVV/CVC number on Card Details.");
      return;
    }
    if (!captcha || captcha.trim() == "") {
      toast.error("Please enter the Captcha code.", {
        duration: 4000,
      });
      setLocalError("Please enter the Captcha code.");
      return;
    }

    if (captcha !== captchaCode) {
      toast.error("Invalid Captcha code.", {
        duration: 4000,
      });
      setLocalError("Invalid Captcha code.");
      return;
    }

    const details = {
      firstName,
      lastName,
      phone,
      email,
      pickupAddress,
      dropoffAddress,
      notes,
      suitcases,
      captcha,
    };

    const payment = {
      fullName: fullName,
      cardNumber: cardNumber,
      expiryMonth: expiryMonth,
      expiryYear: expiryYear,
      cvv: cvv,
    };
    setPaymentDetails(payment);
    setPersonalDetails(details);

    dispatch(setCurrentBookingStep("confirm"));
    dispatch(
      updateBookingStepStatus({
        step: "details",
        isCompleted: true,
      })
    );
    setLocalError(null);
  };

  return (
    <div className="bg-light border p-3 rounded w-100">
      {isTimerStarted && (
        <Alert variant="warning">
          <div className="fw-bold">Booking Timeout Alert!</div>
          Please Note: You have 4 minutes to complete your booking process. If
          the time runs out, your current booking information will be reset. The
          remaining time is displayed at the top right side of the screen. We
          appreciate your prompt attention.
        </Alert>
      )}
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
        <p className="fs-4 fw-bold">Personal Details</p>
        <Form>
          <Row className="mb-3">
            <Col lg={6} xl={6} md={12} sm={12} xs={12}>
              <Form.Group>
                <Form.Label className="m-0 fw-semibold" htmlFor="firstName">
                  First Name:<span className="text-danger ms-1">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  id="firstName"
                  placeholder="Enter First Name"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setLocalError(null);
                  }}
                />
              </Form.Group>
            </Col>
            <Col lg={6} xl={6} md={12} sm={12} xs={12}>
              <Form.Group>
                <Form.Label className="m-0 fw-semibold" htmlFor="lastName">
                  Last Name:
                </Form.Label>
                <Form.Control
                  type="text"
                  id="lastName"
                  placeholder="Enter Last Name"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setLocalError(null);
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col lg={6} xl={6} md={12} sm={12} xs={12}>
              <Form.Group>
                <Form.Label className="m-0 fw-semibold" htmlFor="phone">
                  Phone:<span className="text-danger ms-1">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  id="phone"
                  placeholder="Enter Phone"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setLocalError(null);
                  }}
                />
              </Form.Group>
            </Col>
            <Col lg={6} xl={6} md={12} sm={12} xs={12}>
              <Form.Group>
                <Form.Label className="m-0 fw-semibold" htmlFor="email">
                  Email:<span className="text-danger ms-1">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  id="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setLocalError(null);
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col lg={6} xl={6} md={12} sm={12} xs={12}>
              <Form.Group>
                <Form.Label
                  className="m-0 fw-semibold"
                  htmlFor="pickup-address"
                >
                  Pickup Address:<span className="text-danger ms-1">*</span>
                </Form.Label>
                <Autocomplete
                  apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                  defaultValue={pickupAddress}
                  onPlaceSelected={(place) =>
                    setPickupAddress(place.formatted_address)
                  }
                  onChange={(e) => {
                    setPickupAddress(e.target.value);
                    setLocalError(null);
                  }}
                  className="form-control"
                />
              </Form.Group>
            </Col>
            <Col lg={6} xl={6} md={12} sm={12} xs={12}>
              <Form.Group>
                <Form.Label
                  className="m-0 fw-semibold"
                  htmlFor="dropoff-address"
                >
                  Dropoff Address:<span className="text-danger ms-1">*</span>
                </Form.Label>
                <Autocomplete
                  apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                  defaultValue={dropoffAddress}
                  onPlaceSelected={(place) =>
                    setDropoffAddress(place.formatted_address)
                  }
                  onChange={(e) => {
                    setDropoffAddress(e.target.value);
                    setLocalError(null);
                  }}
                  className="form-control"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col lg={6} xl={6} md={12} sm={12} xs={12}>
              <Form.Group>
                <Form.Label className="m-0 fw-semibold" htmlFor="notes">
                  Notes:
                </Form.Label>
                <textarea
                  cols="30"
                  rows="5"
                  id="notes"
                  className="form-control"
                  placeholder="Enter Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </Form.Group>
            </Col>
            <Col lg={6} xl={6} md={12} sm={12} xs={12}>
              <Form.Group>
                <Form.Label className="m-0 fw-semibold" htmlFor="suitcases">
                  Suitcases:
                </Form.Label>
                <Form.Select
                  id="suitcases"
                  value={suitcases}
                  onChange={(e) => setSuitcases(e.target.value)}
                >
                  {Array.from({ length: 20 }, (_, i) => i).map((i) => {
                    return (
                      <option value={i} key={i}>
                        {i}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </div>

      <hr />

      <p className="fs-4 fw-bold">Payment Details</p>
      <BookingPayment
        selectedSeats={selectedSeats}
        ticketsPrice={ticketsPrice}
        fullName={fullName}
        setFullName={setFullName}
        cardNumber={cardNumber}
        setCardNumber={setCardNumber}
        expiryMonth={expiryMonth}
        setExpiryMonth={setExpiryMonth}
        expiryYear={expiryYear}
        setExpiryYear={setExpiryYear}
        cvv={cvv}
        setCvv={setCvv}
        setLocalError={setLocalError}
      />

      <Row className="mb-3">
        <Col lg={6} xl={6} md={12} sm={12} xs={12}>
          <Form.Group>
            <div className="d-flex align-items-center gap-3 mb-1">
              <Form.Label className="m-0 fw-semibold" htmlFor="Captcha">
                Captcha:<span className="text-danger ms-1">*</span>
              </Form.Label>
              <div
                className="bg-secondary p-3 py-1 text-white"
                style={{
                  position: "relative",
                  display: "inline-block",
                  padding: "0.5rem",
                  backgroundColor: "#6c757d",
                  color: "#fff",
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  userSelect: "none",
                  cursor: "default",
                  pointerEvents: "none",
                  overflow: "hidden",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "10%",
                    left: "40%",
                    transform: "rotate(-10deg)",
                    color: "rgba(255,255,255,0.3)",
                    fontSize: "1.5rem",
                  }}
                >
                  |
                </span>
                <span
                  style={{
                    position: "absolute",
                    top: "-20%",
                    left: "10%",
                    transform: "rotate(-40deg)",
                    color: "rgba(255,255,255,0.3)",
                    fontSize: "2.5rem",
                  }}
                >
                  |
                </span>
                <span
                  style={{
                    position: "absolute",
                    top: "-20%",
                    right: "10%",
                    transform: "rotate(-40deg)",
                    color: "rgba(255,255,255,0.3)",
                    fontSize: "2.5rem",
                  }}
                >
                  |
                </span>
                <span
                  style={{
                    position: "absolute",
                    bottom: "20%",
                    right: "20%",
                    transform: "rotate(15deg)",
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "1.5rem",
                  }}
                >
                  /
                </span>
                <span
                  style={{
                    fontFamily: "Courier New, Courier, monospace",
                  }}
                >
                  {captchaCode}
                </span>
              </div>

              <Button
                className="p-0 bg-transparent border-0 outline-none text-primary"
                title="Generate New Captcha Code"
                onClick={() => {
                  setCaptchaCode(generateCaptcha(7));
                }}
              >
                <ArrowRepeat size={24} />
              </Button>
            </div>
            <Form.Control
              type="text"
              id="Captcha"
              placeholder="Enter Captcha Code"
              value={captcha}
              onChange={(e) => {
                setCaptcha(e.target.value);
                setLocalError(null);
              }}
              style={{
                fontFamily: "Courier New, Courier, monospace",
              }}
              className="fw-bold"
            />
          </Form.Group>
        </Col>
      </Row>

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
            className="px-3 py-2 fw-semibold"
            onClick={handleProceedButton}
          >
            Proceed to Confirmation
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default PersonalDetails;
