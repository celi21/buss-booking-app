import axios from "axios";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Col,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import {
  CreditCard2BackFill,
  CreditCardFill,
  LockFill,
  PersonFill,
} from "react-bootstrap-icons";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentBookingStep } from "../../../../store/slices/bookingSlice";
import BookingConfirmationModal from "./booking-confirmation-modal/BookingConfirmationModal";

const BookingPayment = ({
  selectedSeats,
  ticketsPrice,
  paymentDetails,
  setPaymentDetails,
  personalDetails,
  selectedFromCity,
  selectedToCity,
  totalDuration,
  departureTime,
  arrivalTime,
  selectedDate,
  resetForm,
  showConfirmationModal,
  setShowConfirmationModal,
  booking,
  SetBooking,
}) => {
  const [fullName, setFullName] = useState(paymentDetails.fullName);
  const [cardNumber, setCardNumber] = useState(paymentDetails.cardNumber);
  const [expiryMonth, setExpiryMonth] = useState(paymentDetails.expiryMonth);
  const [expiryYear, setExpiryYear] = useState(paymentDetails.expiryYear);
  const [cvv, setCvv] = useState(paymentDetails.cvv);
  const [localError, setLocalError] = useState(null);
  const { availableBus, busAvailabilityData } = useSelector(
    (state) => state.booking
  );
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleBackButton = () => {
    dispatch(setCurrentBookingStep("confirm"));
  };
  const { user } = useSelector((state) => state.auth);

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
        setLocalError(response.data.message);
        return false;
      }
    } catch (error) {
      setLocalError(error.message);
      return false;
    }
  };

  const confirmBooking = async (bookingData) => {
    // /confirm-booking
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/booking/confirm-booking`,
        bookingData,
        config
      );
      if (
        response.data &&
        response.data.success &&
        response.data.success == true
      ) {
        SetBooking(response.data.booking);
        return true;
      } else {
        setLocalError(response.data.message);
        return false;
      }
    } catch (error) {
      setLocalError(error.message);
      return false;
    }
  };

  const handlePayButton = async () => {
    console.log({
      user: null,
      bus: availableBus._id,
      busType: availableBus.busType._id,
      route: availableBus.route._id,
      from: selectedFromCity,
      to: selectedToCity,
      selectedDate: selectedDate,
      personalDetails: personalDetails,
      selectedSeats: selectedSeats,
    });
    if (!fullName || fullName.trim() == "") {
      toast.error("Please provide your Full Name", {
        duration: 4000,
      });
      setLocalError("Please provide your Full Name");
      return;
    }
    if (!cardNumber || cardNumber.trim() == "") {
      toast.error("Please provide your Card Number", {
        duration: 4000,
      });
      setLocalError("Please provide your Card Number");
      return;
    }
    if (!expiryMonth || expiryMonth.trim() == "") {
      toast.error("Please provide card Expiry Month", {
        duration: 4000,
      });
      setLocalError("Please provide card Expiry Month");
      return;
    }
    if (!expiryYear || expiryYear.trim() == "") {
      toast.error("Please provide card Expiry Year", {
        duration: 4000,
      });
      setLocalError("Please provide card Expiry Year");
      return;
    }
    if (!cvv || cvv.trim() == "") {
      toast.error("Please provide card CVV/CVC number", {
        duration: 4000,
      });
      setLocalError("Please provide card CVV/CVC number");
      return;
    }
    setLoading(true);

    try {
      const payment = {
        fullName: fullName,
        cardNumber: cardNumber,
        expiryMonth: expiryMonth,
        expiryYear: expiryYear,
        cvv: cvv,
      };
      setPaymentDetails(payment);
      setLocalError(null);

      const requestedSeats = selectedSeats.reduce(
        (total, seat) => total + seat.seats
      );

      const queryObject = {
        selectedDate,
        busId: availableBus?._id,
        requestedSeats: requestedSeats,
      };
      const doesBusSeatsExists = await confirmBusAvailable(queryObject);
      if (doesBusSeatsExists === true) {
        let bookingData = {
          bus: availableBus._id,
          busType: availableBus.busType._id,
          route: availableBus.route._id,
          from: selectedFromCity,
          to: selectedToCity,
          selectedDate: selectedDate,
          paymentDetails: payment,
          personalDetails: personalDetails,
          selectedSeats: selectedSeats,
          requestedSeats: requestedSeats,
          user: user,
        };

        const confirm = await confirmBooking(bookingData);
        if (confirm === true) {
          resetForm();
          setShowConfirmationModal(true);
          toast.success("Your booking has been completed Successfully.", {
            duration: 4000,
            position: "top-right",
          });
        }
      }
    } catch (error) {
      setLocalError(error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light border p-5 rounded w-100">
      <Row className="shadow bg-white rounded">
        <Col xl="6" lg="6" className="mx-auto">
          <div class="card border-0">
            <div
              class="card-header bg-white"
              style={{
                borderBottomColor: "#E0E0E0",
                padding: 0,
                paddingBottom: 6,
              }}
            >
              <h2 class="mb-0">
                <div
                  class="d-flex align-items-center justify-content-between text-left p-3 btn fw-semibold"
                  style={{
                    color: "#1a1a1ab3",
                  }}
                >
                  <span>Payment Summary</span>
                </div>
              </h2>
            </div>

            <div
              id="collapseOne"
              class="collapse show"
              aria-labelledby="headingOne"
              data-parent="#accordionExample"
            >
              <div class="card-body payment-card-body">
                <div>
                  <Row className="mb-2">
                    <Col xl="6" lg="6" md="6" sm="6" xs="6">
                      <div
                        className="fw-semibold"
                        style={{
                          color: "#1a1a1ab3",
                          fontSize: 14,
                        }}
                      >
                        Tickets
                      </div>
                    </Col>
                    <Col
                      className="d-flex flex-column justify-content-start align-items-start"
                      xl="6"
                      lg="6"
                      md="6"
                      sm="6"
                      xs="6"
                      style={{
                        color: "#1a1a1ab3",
                        fontSize: 14,
                      }}
                    >
                      {selectedSeats.map((seat) => {
                        return (
                          <span>
                            {`${seat.seats} ${seat.name} x $${seat.price}`}
                          </span>
                        );
                      })}
                    </Col>
                  </Row>

                  <Row className="mb-2">
                    <Col
                      xl="6"
                      lg="6"
                      md="6"
                      sm="6"
                      xs="6"
                      className="fw-semibold"
                      style={{
                        color: "#1a1a1ab3",
                        fontSize: 14,
                      }}
                    >
                      Tax
                    </Col>
                    <Col xl="6" lg="6" md="6" sm="6" xs="6">
                      <span
                        style={{
                          color: "#1a1a1ab3",
                          fontSize: 14,
                        }}
                      >
                        $0.00
                      </span>
                    </Col>
                  </Row>

                  <hr
                    style={{
                      borderStyle: "dashed",
                    }}
                  />

                  <Row className="mb-2">
                    <Col
                      xl="6"
                      lg="6"
                      md="6"
                      sm="6"
                      xs="6"
                      className="fw-semibold"
                      style={{
                        color: "#1a1a1ab3",
                        fontSize: 14,
                      }}
                    >
                      Total
                    </Col>
                    <Col xl="6" lg="6" md="6" sm="6" xs="6">
                      <span
                        style={{
                          color: "#1a1a1ab3",
                          fontSize: 14,
                        }}
                      >
                        ${ticketsPrice}
                      </span>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </Col>

        <Col xl="6" lg="6" className="mx-auto">
          <div class="card border-0">
            <div
              class="card-header bg-white p-0"
              style={{
                borderBottomColor: "#E0E0E0",
              }}
            >
              <h2 class="mb-0">
                <div
                  class="d-flex align-items-center justify-content-between text-left p-3 btn fw-semibold"
                  style={{
                    color: "#1a1a1ab3",
                  }}
                >
                  <div className="text-start">Pay Via Credit/Debit Card</div>
                  <div class="icons">
                    <img
                      src="https://i.imgur.com/2ISgYja.png"
                      width="30"
                      alt="mastercard"
                    />
                    <img
                      src="https://i.imgur.com/W1vtnOV.png"
                      width="30"
                      alt="visa"
                    />
                    <img
                      src="https://1000logos.net/wp-content/uploads/2020/11/Discover-Logo-500x313.jpg"
                      width="40"
                      alt="Discover"
                    />
                    <img
                      src="https://1000logos.net/wp-content/uploads/2016/10/American-Express-Color-500x281.png"
                      width="40"
                      alt="American express"
                    />
                    <img
                      src="https://1000logos.net/wp-content/uploads/2020/07/Maestro-Logo-1996-500x333.png"
                      width="40"
                      alt="Maestro"
                    />
                    {/* <img src="https://i.imgur.com/35tC99g.png" width="30" /> */}
                    {/* <img src="https://i.imgur.com/2ISgYja.png" width="30" /> */}
                  </div>
                </div>
              </h2>
            </div>

            <div
              id="collapseOne"
              class="collapse show"
              aria-labelledby="headingOne"
              data-parent="#accordionExample"
            >
              <div class="card-body payment-card-body">
                <Form.Group>
                  <Form.Label
                    style={{
                      color: "#1a1a1ab3",
                      fontSize: 14,
                    }}
                    className="fw-semibold"
                  >
                    Cardholder Name
                  </Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text
                      className="bg-transparent border-end-0"
                      style={{
                        borderColor: "#E0E0E0",
                        borderWidth: 2,
                      }}
                    >
                      <PersonFill color="#1a1a1a69" />
                    </InputGroup.Text>
                    <Form.Control
                      className="border-start-0"
                      placeholder="Full name on card"
                      style={{
                        borderColor: "#E0E0E0",
                        borderWidth: 2,
                      }}
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setLocalError(null);
                      }}
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group>
                  <Form.Label
                    style={{
                      color: "#1a1a1ab3",
                      fontSize: 14,
                    }}
                    className="fw-semibold"
                  >
                    Card Number
                  </Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text
                      className="bg-transparent border-end-0"
                      style={{
                        borderColor: "#E0E0E0",
                        borderWidth: 2,
                      }}
                    >
                      <CreditCardFill color="#1a1a1a69" />
                    </InputGroup.Text>
                    <Form.Control
                      className="border-start-0"
                      placeholder="0000 0000 0000 0000"
                      style={{
                        borderColor: "#E0E0E0",
                        borderWidth: 2,
                      }}
                      value={cardNumber}
                      onChange={(e) => {
                        setCardNumber(e.target.value);
                        setLocalError(null);
                      }}
                    />
                  </InputGroup>
                </Form.Group>

                <div class="row mt-3">
                  <div class="col-md-6">
                    <Form.Group>
                      <Form.Label
                        style={{
                          color: "#1a1a1ab3",
                          fontSize: 14,
                        }}
                        className="fw-semibold"
                      >
                        Expiry Date
                      </Form.Label>
                      <div
                        className="mb-3 d-flex flex-row align-items-center rounded"
                        style={{
                          borderColor: "#E0E0E0",
                          borderWidth: 2,
                          borderStyle: "solid",
                        }}
                      >
                        <Form.Control
                          placeholder="MM"
                          className="border-0 text-center shadow-none"
                          value={expiryMonth}
                          maxLength={2}
                          onChange={(e) => {
                            setExpiryMonth(e.target.value);
                            setLocalError(null);
                          }}
                        />
                        <div
                          style={{
                            color: "rgb(207 207 207)",
                            fontSize: "24px",
                          }}
                        >
                          /
                        </div>
                        <Form.Control
                          placeholder="YY"
                          className="border-0 text-center shadow-none"
                          value={expiryYear}
                          maxLength={2}
                          onChange={(e) => {
                            setExpiryYear(e.target.value);
                            setLocalError(null);
                          }}
                        />
                      </div>
                    </Form.Group>
                  </div>

                  <div class="col-md-6">
                    <Form.Group>
                      <Form.Label
                        style={{
                          color: "#1a1a1ab3",
                          fontSize: 14,
                        }}
                        className="fw-semibold"
                      >
                        CVC/CVV
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text
                          className="bg-transparent border-end-0"
                          style={{
                            borderColor: "#E0E0E0",
                            borderWidth: 2,
                          }}
                        >
                          <CreditCard2BackFill color="#1a1a1a69" />
                        </InputGroup.Text>
                        <Form.Control
                          className="border-start-0"
                          placeholder="000"
                          style={{
                            borderColor: "#E0E0E0",
                            borderWidth: 2,
                          }}
                          value={cvv}
                          onChange={(e) => {
                            setCvv(e.target.value);
                            setLocalError(null);
                          }}
                        />
                      </InputGroup>
                    </Form.Group>
                  </div>
                </div>

                {localError && <Alert variant="danger">{localError}</Alert>}

                <div className="w-100 mt-4">
                  <Button
                    variant="primary"
                    className="w-100 fw-bold py-2"
                    style={{
                      letterSpacing: "1px",
                      fontSize: "18px",
                    }}
                    onClick={handlePayButton}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="d-flex align-items-center justify-content-center">
                        <Spinner size="small" />
                      </div>
                    ) : (
                      "Pay"
                    )}
                  </Button>
                </div>

                <div class="text-muted certificate-text d-flex flex-row align-items-center gap-2 justify-content-center mt-2">
                  <LockFill />
                  <div
                    style={{
                      fontSize: 14,
                    }}
                  >
                    Your transaction is secured with ssl certificate
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

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
      </Row>
    </div>
  );
};

export default BookingPayment;
