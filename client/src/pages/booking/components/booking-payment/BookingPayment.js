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
import { translateText } from "../../../../utils/translation";
import { loadStripe } from "@stripe/stripe-js";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { useEffect } from "react";
// import StripeForm from "./stripeForm/StripeForm";

const BookingPayment = ({
  selectedSeats,
  ticketsPrice,
  fullName,
  setFullName,
  cardNumber,
  setCardNumber,
  expiryMonth,
  setExpiryMonth,
  expiryYear,
  setExpiryYear,
  cvv,
  setCvv,
  setLocalError,
}) => {
  const selectedLanguage = useSelector(
    (state) => state.settings.selectedLanguage
  );
  const { tax } = useSelector((state) => state.settings);

  return (
    <Row className="align-items-stretch d-flex">
      <Col xl="6" lg="6" className="h-100">
        <div class="card border h-100">
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
                <span>
                  {selectedLanguage &&
                    translateText("payment", selectedLanguage.code)}{" "}
                  {selectedLanguage &&
                    translateText("summary", selectedLanguage.code)}
                </span>
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
                      {selectedLanguage &&
                        translateText("tickets", selectedLanguage.code)}
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
                    {selectedLanguage &&
                      translateText("Tax", selectedLanguage.code)}
                  </Col>
                  <Col xl="6" lg="6" md="6" sm="6" xs="6">
                    <span
                      style={{
                        color: "#1a1a1ab3",
                        fontSize: 14,
                      }}
                    >
                      ${((Number(tax) / 100) * ticketsPrice).toFixed(3)}
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
                    {selectedLanguage &&
                      translateText("Total", selectedLanguage.code)}
                  </Col>
                  <Col xl="6" lg="6" md="6" sm="6" xs="6">
                    <span
                      style={{
                        color: "#1a1a1ab3",
                        fontSize: 14,
                      }}
                    >
                      ${ticketsPrice + (Number(tax) / 100) * ticketsPrice}
                    </span>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default BookingPayment;
