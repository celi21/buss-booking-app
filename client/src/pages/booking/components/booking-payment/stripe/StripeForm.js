import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import axios from "axios";
import React, { useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { translateText } from "../../../../../utils/translation";

const StripeForm = ({
  setLocalError,
  SetBooking,
  selectedSeats,
  selectedDate,
  selectedFromCity,
  selectedToCity,
  personalDetails,
  flexOption,
  resetForm,
  setShowConfirmationModal,
  setLoading,
  loading,
  handleBackButton,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [formLoading, setFormLoading] = useState(false);
  const { availableBus, busAvailabilityData } = useSelector(
    (state) => state.booking
  );
  const { user } = useSelector((state) => state.auth);
  const selectedLanguage = useSelector(
    (state) => state.settings.selectedLanguage
  );
  const dispatch = useDispatch();

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
    try {
      const paymentResult = await stripe.confirmPayment({
        redirect: "if_required",
        elements,
      });

      if (paymentResult.paymentIntent) {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const stripeData = {
          paymentId: paymentResult.paymentIntent.id,
          paymentAmount: paymentResult.paymentIntent.amount,
          paymentCreated: paymentResult.paymentIntent.created,
        };
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/booking/confirm-booking`,
          { bookingData, stripeData },
          config
        );
        if (
          response.data &&
          response.data.success &&
          response.data.success == true
        ) {
          // Return the booking object directly
          return response.data.booking;
        } else {
          setLocalError(response.data.message);
          return null;
        }
      } else {
        setLocalError(paymentResult.error.message);
        return null;
      }
    } catch (error) {
      setLocalError(error.message);
      return null;
    }
  };

  const handleConfirmButton = async () => {
    setLoading(true);
    try {
      const requestedSeats = selectedSeats.reduce(
        (total, seat) => total + seat.seats
      );

      const queryObject = {
        selectedDate,
        busId: availableBus?._id,
        requestedSeats: requestedSeats,
      };
      // confirm if bus/seats is still available
      const doesBusSeatsExists = await confirmBusAvailable(queryObject);

      if (doesBusSeatsExists === true) {
        let bookingData = {
          bus: availableBus._id,
          busType: availableBus.busType._id,
          route: availableBus.route._id,
          from: selectedFromCity,
          to: selectedToCity,
          selectedDate: selectedDate,
          // paymentDetails: paymentDetails,
          personalDetails: personalDetails,
          selectedSeats: selectedSeats,
          requestedSeats: requestedSeats,
          user: user,
          flexOption: flexOption,
        };

        const bookingResult = await confirmBooking(bookingData);
        if (bookingResult && bookingResult.bookingId) {
          // Set booking state with the returned booking object
          SetBooking(bookingResult);
          
          // Use setTimeout to ensure state updates before opening modal
          setTimeout(() => {
            setShowConfirmationModal(true);
            toast.success("Your booking has been completed Successfully.", {
              duration: 4000,
              position: "top-right",
            });
          }, 100);
          
          // Don't reset form automatically - let user close modal first
          // The modal close button or navigation will handle cleanup
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
    <form className="mx-2">
      <Row>
        <Col
          lg={6}
          xl={6}
          md={12}
          sm={12}
          xs={12}
          className="bg-white p-3 shadow-sm border"
          style={{ borderRadius: "10px" }}
        >
          <PaymentElement
            id="payment-element"
            options={
              {
                // layout: "tabs",
              }
            }
            onLoaderStart={() => {
              setFormLoading(true);
            }}
            onReady={() => {
              setFormLoading(false);
            }}
          />
        </Col>
      </Row>
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
            variant="primary"
            className="fw-bold py-2"
            style={{
              fontSize: "18px",
            }}
            onClick={handleConfirmButton}
            disabled={loading}
          >
            {loading ? (
              <div className="d-flex align-items-center justify-content-center">
                <Spinner size="small" />
              </div>
            ) : (
              selectedLanguage &&
              translateText("confirm-booking", selectedLanguage.code)
            )}
          </Button>
        </Col>
      </Row>
    </form>
  );
};

export default StripeForm;