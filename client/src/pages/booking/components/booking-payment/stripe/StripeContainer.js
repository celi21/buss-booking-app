import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import axios from "axios";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../../../../components/loading-spinner/LoadingSpinner";
import { loadStripe } from "@stripe/stripe-js";
import StripeForm from "./StripeForm";

const stripeLoader = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const StripeContainer = ({
  ticketsPrice,
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
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchIntent = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/booking/create-payment-intent`,
        { ticketsPrice },
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data && response.data.client_secret) {
        const client_secret = response.data.client_secret;
        setClientSecret(client_secret);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIntent();
  }, []);

  return (
    <form id="payment-form">
      {clientSecret && !isLoading ? (
        <Elements
          options={{
            clientSecret: clientSecret,
          }}
          stripe={stripeLoader}
        >
          <StripeForm
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
        </Elements>
      ) : (
        <LoadingSpinner />
      )}
    </form>
  );
};

export default StripeContainer;
