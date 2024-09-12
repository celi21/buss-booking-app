import React, { useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import {
  CreditCard2BackFill,
  CreditCardFill,
  LockFill,
  PersonFill,
} from "react-bootstrap-icons";

const BookingPayment = ({
  selectedSeats,
  ticketsPrice,
  paymentDetails,
  setPaymentDetails,
}) => {
  const [fullName, setFullName] = useState(paymentDetails.fullName);
  const [cardNumber, setCardNumber] = useState(paymentDetails.cardNumber);
  const [expiryMonth, setExpiryMonth] = useState(paymentDetails.expiryMonth);
  const [expiryYear, setExpiryYear] = useState(paymentDetails.expiryYear);
  const [cvv, setCvv] = useState(paymentDetails.cvv);

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
                          onChange={(e) => {
                            setExpiryMonth(e.target.value);
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
                          onChange={(e) => {
                            setExpiryYear(e.target.value);
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
                          }}
                        />
                      </InputGroup>
                    </Form.Group>
                  </div>
                </div>

                <div className="w-100 mt-4">
                  <Button
                    variant="primary"
                    className="w-100 fw-bold"
                    style={{
                      letterSpacing: "1px",
                      fontSize: "18px",
                    }}
                  >
                    Pay
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
          <Button variant="dark" className="px-3 py-2 fw-semibold">
            Back
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default BookingPayment;
