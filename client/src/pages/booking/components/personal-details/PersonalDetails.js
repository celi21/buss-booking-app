import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
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

  const { availableBus, isBusAvailableLoading, busAvailabilityData, cities } =
    useSelector((state) => state.booking);
  const { user } = useSelector((state) => state.auth);

  const [firstName, setFirstName] = useState(
    personalDetails.firstName || user?.name?.split(" ")[0] || ""
  );
  const [lastName, setLastName] = useState(
    personalDetails.lastName || user?.name?.split(" ").slice(1).join(" ") || ""
  );
  const [phone, setPhone] = useState(personalDetails.phone || user?.phone || "");
  const [email, setEmail] = useState(personalDetails.email || user?.email || "");
  const [pickupAddress, setPickupAddress] = useState(
    personalDetails.pickupAddress || user?.defaultPickupAddress || ""
  );
  const [dropoffAddress, setDropoffAddress] = useState(
    personalDetails.dropoffAddress || ""
  );

  // Auto-populate pickup and dropoff addresses based on user default pickup address or booking search origin/destination
  useEffect(() => {
    if (user?.defaultPickupAddress && !personalDetails.pickupAddress) {
      setPickupAddress(user.defaultPickupAddress);
    }
  }, [user, personalDetails.pickupAddress]);

  useEffect(() => {
    if (cities && cities.length > 0) {
      const isManualStop = (cityName) => {
        if (!cityName) return false;
        const cleaned = cityName.trim().toLowerCase();
        return [
          "upstate door service",
          "rome, ny",
          "package delivery utica",
          "package delivery nyc"
        ].includes(cleaned);
      };

      if (!pickupAddress && !personalDetails.pickupAddress && !user?.defaultPickupAddress) {
        const fromCity = cities.find((city) => city._id === selectedFromCity);
        if (fromCity) {
          if (isManualStop(fromCity.name)) {
            setPickupAddress("");
          } else {
            setPickupAddress(fromCity.name);
          }
        }
      }
      if (!dropoffAddress && !personalDetails.dropoffAddress) {
        const toCity = cities.find((city) => city._id === selectedToCity);
        if (toCity) {
          if (isManualStop(toCity.name)) {
            setDropoffAddress("");
          } else {
            setDropoffAddress(toCity.name);
          }
        }
      }
    }
  }, [cities, selectedFromCity, selectedToCity, personalDetails.pickupAddress, personalDetails.dropoffAddress, user]);
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
                  value={pickupAddress}
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
                  value={dropoffAddress}
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
