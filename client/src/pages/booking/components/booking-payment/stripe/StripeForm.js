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
  const { 
    availableBus, 
    busAvailabilityData,
    tripType,
    returnDate,
    availableReturnBus,
    returnBusAvailabilityData,
  } = useSelector((state) => state.booking);
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

  const confirmBooking = async (bookingData, returnBookingData = null) => {
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
        
        const requestBody = { bookingData, stripeData };
        if (returnBookingData) {
          requestBody.returnBookingData = returnBookingData;
        }
        
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/booking/confirm-booking`,
          requestBody,
          config
        );
        if (
          response.data &&
          response.data.success &&
          response.data.success == true
        ) {
          // Return both bookings for round-trip
          return {
            booking: response.data.booking,
            returnBooking: response.data.returnBooking || null,
          };
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

      // Check outbound bus availability
      const queryObject = {
        selectedDate,
        busId: availableBus?._id,
        requestedSeats: requestedSeats,
      };
      const doesBusSeatsExists = await confirmBusAvailable(queryObject);

      if (!doesBusSeatsExists) {
        setLoading(false);
        return;
      }

      // For round-trip, check return bus availability
      if (tripType === "round-trip") {
        if (!availableReturnBus) {
          setLocalError("Return bus not available");
          setLoading(false);
          return;
        }

        const returnQueryObject = {
          selectedDate: returnDate,
          busId: availableReturnBus._id,
          requestedSeats: requestedSeats,
        };
        const doesReturnBusSeatsExist = await confirmBusAvailable(returnQueryObject);

        if (!doesReturnBusSeatsExist) {
          setLoading(false);
          return;
        }
      }

      // Prepare outbound booking data
      let bookingData = {
        bus: availableBus._id,
        busType: availableBus.busType._id,
        route: availableBus.route._id,
        from: selectedFromCity,
        to: selectedToCity,
        selectedDate: selectedDate,
        personalDetails: personalDetails,
        selectedSeats: selectedSeats,
        requestedSeats: requestedSeats,
        user: user,
        flexOption: flexOption,
        tripType: tripType,
        availableReturnBus: availableReturnBus,
      };

      // Prepare return booking data if round-trip
      let returnBookingData = null;
      if (tripType === "round-trip") {
        returnBookingData = {
          bus: availableReturnBus._id,
          busType: availableReturnBus.busType._id,
          route: availableReturnBus.route._id,
          from: selectedToCity, // Swap cities for return
          to: selectedFromCity,
          selectedDate: returnDate,
          selectedSeats: selectedSeats,
          requestedSeats: requestedSeats,
        };
      }

      const bookingResult = await confirmBooking(bookingData, returnBookingData);
      if (bookingResult && bookingResult.booking) {
        // Set booking state with both outbound and return bookings
        SetBooking(bookingResult);
        
        setTimeout(() => {
          setShowConfirmationModal(true);
          const successMsg = tripType === "round-trip" 
            ? "Your round-trip booking has been completed successfully!" 
            : "Your booking has been completed successfully.";
          toast.success(successMsg, {
            duration: 4000,
            position: "top-right",
          });
        }, 100);
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