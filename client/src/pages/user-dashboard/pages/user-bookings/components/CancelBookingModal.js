import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert, Button, Modal, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBookings } from "../../../../../store/slices/bookingSlice";
import { translateText } from "../../../../../utils/translation";

const CancelBookingModal = ({ showModal, setShowModal, booking }) => {
  const [cancelMessage, setCancelMessage] = useState(null);
  const [isCancelPossible, setIsCancelPossible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const [error, setError] = useState(null);
  const selectedLanguage = useSelector(
    (state) => state.settings.selectedLanguage
  );

  const checkIfCancelPossible = (booking) => {
    if (booking.status === "refunded" || booking.status === "cancelled") {
      setCancelMessage(
        selectedLanguage &&
          translateText(
            "Your booking has already been canceled. No further action is required, and the refund (if applicable) is being processed.",
            selectedLanguage.code
          )
      );
      setIsCancelPossible(false);
      return;
    }
    // Find the departure time for the 'from' city
    const fromLocation = booking.bus.locations.find(
      (loc) => loc.city === booking.from._id
    );

    if (!fromLocation || !fromLocation.departureTime) {
      setCancelMessage(
        selectedLanguage &&
          translateText(
            "There was an error while cancelling your booking. Please try again later.",
            selectedLanguage.code
          )
      );
      setIsCancelPossible(false);
      return;
    }

    let bookingDate = booking.bookingDate;
    let departureTime = fromLocation.departureTime;
    let bookingDateTime = new Date(`${bookingDate} ${departureTime}`);
    let currentDateTime = Date.now();

    let timeDifference = bookingDateTime - currentDateTime;
    let hoursDifference = timeDifference / (1000 * 60 * 60);

    if (hoursDifference < 0) {
      setIsCancelPossible(false);
      setCancelMessage(
        selectedLanguage &&
          translateText(
            "Your booking cannot be canceled because the departure date and time have already passed. Unfortunately, no refunds are available for bookings after the bus has departed.",
            selectedLanguage.code
          )
      );
      return;
    } else if (hoursDifference <= 24) {
      setIsCancelPossible(false);
      setCancelMessage(
        selectedLanguage &&
          translateText(
            "Your booking cannot be canceled because it is within 24 hours of the departure time. Bookings must be canceled at least 24 hours before departure to be eligible for a refund. Please contact customer support for further assistance.",
            selectedLanguage.code
          )
      );
      return;
    } else {
      setIsCancelPossible(true);
      setCancelMessage(
        selectedLanguage &&
          translateText(
            "Your booking is eligible for cancellation. Upon cancellation, you will receive a refund according to our refund policy. Please proceed if you'd like to cancel your booking.",
            selectedLanguage.code
          )
      );
    }
  };

  useEffect(() => {
    if (booking) {
      checkIfCancelPossible(booking);
    }
  }, [booking]);

  const dispatch = useDispatch();
  const handleCancelBooking = async () => {
    if (!booking || !booking.bookingId) return;
    if (!user || !token) return;
    if (!isCancelPossible) return;

    try {
      setIsLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/booking/cancel-booking`,
        {
          bookingId: booking.bookingId,
        },
        config
      );
      if (
        response.data &&
        response.data.success &&
        response.data.success == true
      ) {
        setError(null);
        setCancelMessage(null);
        setIsCancelPossible(false);
        toast.success(
          selectedLanguage &&
            translateText(
              "Your booking has been successfully canceled. The refund will be processed according to our refund policy.",
              selectedLanguage.code
            ),
          {
            duration: 10000,
          }
        );
        dispatch(fetchUserBookings());
      } else {
        setError(response.data.message);
        toast.error(response.data.message, {
          duration: 4000,
        });
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
        toast.error(error.response.data.message, {
          duration: 4000,
        });
      } else {
        setError(error.message);
        toast.error(error.message, {
          duration: 4000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      show={showModal}
      onHide={() => {
        setError(null);
        setCancelMessage(null);
        setIsCancelPossible(false);
        setShowModal(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedLanguage &&
            translateText("Booking Cancellation", selectedLanguage.code)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cancelMessage}
        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setError(null);
            setCancelMessage(null);
            setIsCancelPossible(false);
            setShowModal(false);
          }}
        >
          {selectedLanguage && translateText("close", selectedLanguage.code)}
        </Button>
        <Button
          variant="primary"
          disabled={!isCancelPossible || isLoading}
          onClick={() => {
            if (isCancelPossible) {
              handleCancelBooking();
              return;
            }
          }}
        >
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            selectedLanguage &&
            translateText("Cancel Booking", selectedLanguage.code)
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CancelBookingModal;
