import React, { useState } from "react";
import { Alert, Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { ArrowRepeat } from "react-bootstrap-icons";
import BookingDetailsRow from "../booking-details-row/BookingDetailsRow";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentBookingStep,
  updateBookingStepStatus,
} from "../../../../store/slices/bookingSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { translateText } from "../../../../utils/translation";
import StripeContainer from "../booking-payment/stripe/StripeContainer";

const ConfirmBooking = ({
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
  booking,
  SetBooking,
  showConfirmationModal,
  setShowConfirmationModal,
  resetForm,
  flexOption,
  setFlexOption,
  flexCharge,
}) => {
  const [localError, setLocalError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

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
    const stepsToUpdate = ["details", "confirm", "tickets"];
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

  const selectedLanguage = useSelector(
    (state) => state.settings.selectedLanguage
  );

  const handleBackButton = () => {
    dispatch(setCurrentBookingStep("details"));
    dispatch(
      updateBookingStepStatus({
        step: "confirm",
        isCompleted: false,
      })
    );
  };

  return (
    <div className="bg-light border p-3 rounded w-100">
      <p className="fs-4 fw-semibold text-center border-bottom pb-3">
        {selectedLanguage &&
          translateText("confirm-details", selectedLanguage.code)}
      </p>
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
        <div className="d-flex flex-row align-items-center gap-2 mb-4">
          <p className="fs-4 fw-bold m-0 p-0">
            {selectedLanguage &&
              translateText("Personal", selectedLanguage.code)}{" "}
            {selectedLanguage &&
              translateText("details", selectedLanguage.code)}
          </p>
          <Button
            className="p-0 m-0 bg-transparent border-0 outline-none text-primary"
            onClick={() => handleBackButton()}
          >
            {selectedLanguage && translateText("change", selectedLanguage.code)}{" "}
            {selectedLanguage &&
              translateText("details", selectedLanguage.code)}
          </Button>
        </div>

        {personalDetails && (
          <div>
            <Row className="mb-3">
              <Col lg={6} xl={6} md={12} sm={12} xs={12}>
                <div>
                  <Form.Label className="m-0" htmlFor="firstName">
                    {selectedLanguage &&
                      translateText("first-name", selectedLanguage.code)}
                    :
                  </Form.Label>
                  <div className="fw-semibold">{personalDetails.firstName}</div>
                </div>
              </Col>
              <Col lg={6} xl={6} md={12} sm={12} xs={12}>
                <div>
                  <Form.Label className="m-0" htmlFor="lastName">
                    {selectedLanguage &&
                      translateText("last-name", selectedLanguage.code)}
                    :
                  </Form.Label>
                  <div className="fw-semibold">{personalDetails.lastName}</div>
                </div>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col lg={6} xl={6} md={12} sm={12} xs={12}>
                <div>
                  <Form.Label className="m-0" htmlFor="phone">
                    {selectedLanguage &&
                      translateText("phone", selectedLanguage.code)}
                    :
                  </Form.Label>
                  <div className="fw-semibold">{personalDetails.phone}</div>
                </div>
              </Col>
              <Col lg={6} xl={6} md={12} sm={12} xs={12}>
                <div>
                  <Form.Label className="m-0" htmlFor="email">
                    {selectedLanguage &&
                      translateText("email", selectedLanguage.code)}
                    :
                  </Form.Label>
                  <div className="fw-semibold">{personalDetails.email}</div>
                </div>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col lg={6} xl={6} md={12} sm={12} xs={12}>
                <div>
                  <Form.Label className="m-0" htmlFor="pickup-address">
                    {selectedLanguage &&
                      translateText("Pickup Address", selectedLanguage.code)}
                    :
                  </Form.Label>
                  <div className="fw-semibold">
                    {personalDetails.pickupAddress}
                  </div>
                </div>
              </Col>
              <Col lg={6} xl={6} md={12} sm={12} xs={12}>
                <div>
                  <Form.Label className="m-0" htmlFor="dropoff-address">
                    {selectedLanguage &&
                      translateText("Dropoff Address", selectedLanguage.code)}
                    :
                  </Form.Label>
                  <div className="fw-semibold">
                    {personalDetails.dropoffAddress}
                  </div>
                </div>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col lg={6} xl={6} md={12} sm={12} xs={12}>
                <div>
                  <Form.Label className="m-0" htmlFor="notes">
                    {selectedLanguage &&
                      translateText("Notes", selectedLanguage.code)}
                    :
                  </Form.Label>
                  <p className="fw-semibold">{personalDetails.notes}</p>
                </div>
              </Col>
              <Col lg={6} xl={6} md={12} sm={12} xs={12}>
                <div>
                  <Form.Label className="m-0" htmlFor="suitcases">
                    {selectedLanguage &&
                      translateText("Suitcases", selectedLanguage.code)}
                    :
                  </Form.Label>
                  <div className="fw-semibold">{personalDetails.suitcases}</div>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </div>

      <div className="my-4">
        <div className="d-flex flex-row align-items-center gap-2 mb-4">
          <p className="fs-4 fw-bold m-0 p-0">
            {selectedLanguage &&
              translateText("payment", selectedLanguage.code)}{" "}
            {selectedLanguage &&
              translateText("details", selectedLanguage.code)}
          </p>
          <Button
            className="p-0 m-0 bg-transparent border-0 outline-none text-primary"
            onClick={() => handleBackButton()}
          >
            {selectedLanguage && translateText("change", selectedLanguage.code)}{" "}
            {selectedLanguage &&
              translateText("details", selectedLanguage.code)}
          </Button>
        </div>
        <div>
          <StripeContainer
            ticketsPrice={ticketsPrice}
            setLocalError={setLocalError}
            SetBooking={SetBooking}
            selectedSeats={selectedSeats}
            selectedDate={selectedDate}
            selectedFromCity={selectedFromCity}
            selectedToCity={selectedToCity}
            personalDetails={personalDetails}
            flexOption={flexOption}
            resetForm={resetForm}
            setShowConfirmationModal={setShowConfirmationModal}
            setLoading={setLoading}
            loading={loading}
            handleBackButton={handleBackButton}
          />
        </div>
      </div>

      {localError && <Alert variant="danger">{localError}</Alert>}
    </div>
  );
};

export default ConfirmBooking;
