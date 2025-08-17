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
import { translateText } from "../../../../utils/translation";

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
  flexOption,
  setFlexOption,
  flexCharge,
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
      toast.error(
        selectedLanguage &&
          translateText(
            "Please provide your First Name",
            selectedLanguage.code
          ),
        {
          duration: 4000,
        }
      );
      setLocalError(
        selectedLanguage &&
          translateText("Please provide your First Name", selectedLanguage.code)
      );
      return;
    }
    if (!phone || phone.trim() == "") {
      toast.error(
        selectedLanguage &&
          translateText("Please provide your Phone", selectedLanguage.code),
        {
          duration: 4000,
        }
      );
      setLocalError(
        selectedLanguage &&
          translateText("Please provide your Phone", selectedLanguage.code)
      );
      return;
    }
    if (!email || email.trim() == "") {
      toast.error(
        selectedLanguage &&
          translateText("Please provide your Email", selectedLanguage.code),
        {
          duration: 4000,
        }
      );
      setLocalError(
        selectedLanguage &&
          translateText("Please provide your Email", selectedLanguage.code)
      );
      return;
    }
    if (!validateEmail(email)) {
      toast.error(
        selectedLanguage &&
          translateText(
            "Please provide a valid Email address.",
            selectedLanguage.code
          ),
        {
          duration: 4000,
        }
      );
      setLocalError(
        selectedLanguage &&
          translateText(
            "Please provide a valid Email address.",
            selectedLanguage.code
          )
      );
      return;
    }
    if (!pickupAddress || pickupAddress.trim() == "") {
      toast.error(
        selectedLanguage &&
          translateText(
            "Please provide your Pickup Address",
            selectedLanguage.code
          ),
        {
          duration: 4000,
        }
      );
      setLocalError(
        selectedLanguage &&
          translateText(
            "Please provide your Pickup Address",
            selectedLanguage.code
          )
      );
      return;
    }
    if (!dropoffAddress || dropoffAddress.trim() == "") {
      toast.error(
        selectedLanguage &&
          translateText(
            "Please provide your Dropoff Address",
            selectedLanguage.code
          ),
        {
          duration: 4000,
        }
      );
      setLocalError(
        selectedLanguage &&
          translateText(
            "Please provide your Dropoff Address",
            selectedLanguage.code
          )
      );
      return;
    }
    // if (!fullName || fullName.trim() == "") {
    //   toast.error(
    //     selectedLanguage &&
    //       translateText(
    //         "Please provide your Full Name on Card Details.",
    //         selectedLanguage.code
    //       ),
    //     {
    //       duration: 4000,
    //     }
    //   );
    //   setLocalError(
    //     selectedLanguage &&
    //       translateText(
    //         "Please provide your Full Name on Card Details.",
    //         selectedLanguage.code
    //       )
    //   );
    //   return;
    // }
    // if (!cardNumber || cardNumber.trim() == "") {
    //   toast.error(
    //     selectedLanguage &&
    //       translateText(
    //         "Please provide your Card Number on Card Details.",
    //         selectedLanguage.code
    //       ),
    //     {
    //       duration: 4000,
    //     }
    //   );
    //   setLocalError(
    //     selectedLanguage &&
    //       translateText(
    //         "Please provide your Card Number on Card Details.",
    //         selectedLanguage.code
    //       )
    //   );
    //   return;
    // }
    // if (!expiryMonth || expiryMonth.trim() == "") {
    //   toast.error(
    //     selectedLanguage &&
    //       translateText(
    //         "Please provide card Expiry Month on Card Details.",
    //         selectedLanguage.code
    //       ),
    //     {
    //       duration: 4000,
    //     }
    //   );
    //   setLocalError(
    //     selectedLanguage &&
    //       translateText(
    //         "Please provide card Expiry Month on Card Details.",
    //         selectedLanguage.code
    //       )
    //   );
    //   return;
    // }
    // if (!expiryYear || expiryYear.trim() == "") {
    //   toast.error(
    //     selectedLanguage &&
    //       translateText(
    //         "Please provide card Expiry Year on Card Details.",
    //         selectedLanguage.code
    //       ),
    //     {
    //       duration: 4000,
    //     }
    //   );
    //   setLocalError(
    //     selectedLanguage &&
    //       translateText(
    //         "Please provide card Expiry Year on Card Details.",
    //         selectedLanguage.code
    //       )
    //   );
    //   return;
    // }
    // if (!cvv || cvv.trim() == "") {
    //   toast.error(
    //     selectedLanguage &&
    //       translateText(
    //         "Please provide card CVV/CVC number on Card Details.",
    //         selectedLanguage.code
    //       ),
    //     {
    //       duration: 4000,
    //     }
    //   );
    //   setLocalError(
    //     selectedLanguage &&
    //       translateText(
    //         "Please provide card CVV/CVC number on Card Details.",
    //         selectedLanguage.code
    //       )
    //   );
    //   return;
    // }
    if (!captcha || captcha.trim() == "") {
      toast.error(
        selectedLanguage &&
          translateText(
            "Please enter the Captcha code.",
            selectedLanguage.code
          ),
        {
          duration: 4000,
        }
      );
      setLocalError(
        selectedLanguage &&
          translateText("Please enter the Captcha code.", selectedLanguage.code)
      );
      return;
    }

    if (captcha !== captchaCode) {
      toast.error(
        selectedLanguage &&
          translateText("Invalid Captcha code.", selectedLanguage.code),
        {
          duration: 4000,
        }
      );
      setLocalError(
        selectedLanguage &&
          translateText("Invalid Captcha code.", selectedLanguage.code)
      );
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

  const selectedLanguage = useSelector(
    (state) => state.settings.selectedLanguage
  );

  return (
    <div className="bg-light border p-3 rounded w-100">
      {isTimerStarted && (
        <Alert variant="warning">
          <div className="fw-bold">
            {selectedLanguage &&
              translateText("Booking Timeout Alert", selectedLanguage.code)}
          </div>
          {selectedLanguage &&
            translateText("alert-description", selectedLanguage.code)}
        </Alert>
      )}
      <p className="fs-4 fw-bold">
        {selectedLanguage &&
          translateText("booking-details", selectedLanguage.code)}
      </p>

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
        flexOption={flexOption}
        setFlexOption={setFlexOption}
        flexCharge={flexCharge}
      />

      <div className="my-4">
        <p className="fs-4 fw-bold">
          {selectedLanguage && translateText("Personal", selectedLanguage.code)}{" "}
          {selectedLanguage && translateText("details", selectedLanguage.code)}
        </p>
        <Form>
          <Row className="mb-3">
            <Col lg={6} xl={6} md={12} sm={12} xs={12}>
              <Form.Group>
                <Form.Label className="m-0 fw-semibold" htmlFor="firstName">
                  {selectedLanguage &&
                    translateText("first-name", selectedLanguage.code)}
                  :<span className="text-danger ms-1">*</span>
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
                  {selectedLanguage &&
                    translateText("last-name", selectedLanguage.code)}
                  :
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
                  {selectedLanguage &&
                    translateText("phone", selectedLanguage.code)}
                  :<span className="text-danger ms-1">*</span>
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
                  {selectedLanguage &&
                    translateText("email", selectedLanguage.code)}
                  :<span className="text-danger ms-1">*</span>
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
                  {selectedLanguage &&
                    translateText("Pickup Address", selectedLanguage.code)}
                  :<span className="text-danger ms-1">*</span>
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
                  {selectedLanguage &&
                    translateText("Dropoff Address", selectedLanguage.code)}
                  :<span className="text-danger ms-1">*</span>
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
                  {selectedLanguage &&
                    translateText("Notes", selectedLanguage.code)}
                  :
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
                  {selectedLanguage &&
                    translateText("Suitcases", selectedLanguage.code)}
                  :
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

      <p className="fs-4 fw-bold text-capitalize">
        {selectedLanguage && translateText("payment", selectedLanguage.code)}{" "}
        {selectedLanguage && translateText("details", selectedLanguage.code)}
      </p>
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

      <Row className="mb-3 mt-5">
        <Col lg={6} xl={6} md={12} sm={12} xs={12}>
          <Form.Group>
            <div className="d-flex align-items-center gap-3 mb-1">
              <Form.Label className="m-0 fw-semibold" htmlFor="Captcha">
                {selectedLanguage &&
                  translateText("Captcha", selectedLanguage.code)}
                :<span className="text-danger ms-1">*</span>
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
            {selectedLanguage && translateText("back", selectedLanguage.code)}
          </Button>
        </Col>
        <Col className="justify-content-end d-flex">
          <Button
            className="px-3 py-2 fw-semibold"
            onClick={handleProceedButton}
          >
            {selectedLanguage &&
              translateText("proceed-to-confirmation", selectedLanguage.code)}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default PersonalDetails;
