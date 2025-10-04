import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import {
  ArrowClockwise,
  Check,
  Clock,
  Eye,
  EyeFill,
  InfoCircleFill,
  PencilSquare,
  Trash3,
  X,
} from "react-bootstrap-icons";
import toast from "react-hot-toast";
import { fetchAdminBookings } from "../../../../../store/slices/bookingSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const BookingRow = ({ booking, index }) => {
  const [currentBookingStatus, setCurrentBookingStatus] = useState(
    booking.status
  );
  const [loading, setIsLoading] = useState(false);
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-success";
      case "pending":
        return "bg-warning";
      case "refunded":
        return "bg-secondary";
      case "cancelled":
        return "bg-danger";
      default:
        return "bg-primary";
    }
  };

  useEffect(() => {
    if (booking) {
      setCurrentBookingStatus(booking.status);
    }
  }, [booking]);

  const dispatch = useDispatch();
  const { isAdmin, token } = useSelector((state) => state.auth);
  const updateBookingStatus = async (booking_id, status) => {
    // Define a confirmation message based on the status
    let message = "";
    switch (status) {
      case "confirmed":
        message = "Are you sure you want to confirm this booking?";
        break;
      case "pending":
        message = "Are you sure you want to set this booking to pending?";
        break;
      case "refunded":
        message =
          "Are you sure you want to mark this booking as refunded? Upon refunding, customer will receive a refund according to refund policy and booking will be cancelled.";
        break;
      case "cancelled":
        message =
          "Are you sure you want to cancel this booking? Upon cancellation, customer will receive a refund according to our refund policy. Please proceed if you'd like to cancel this booking.";
        break;
      default:
        message = "Are you sure you want to change the booking status?";
    }

    // Ask for user confirmation
    const userConfirmed = window.confirm(message);

    if (userConfirmed) {
      if (!booking || !booking_id) return;
      if (!isAdmin || !token) return;

      try {
        setIsLoading(true);
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/booking/change-booking-status`,
          {
            bookingId: booking_id,
            status,
          },
          config
        );
        if (
          response.data &&
          response.data.success &&
          response.data.success == true
        ) {
          toast.success("Booking status has been changed successfully!", {
            duration: 10000,
          });
          dispatch(fetchAdminBookings());
        } else {
          toast.error(response.data.message, {
            duration: 4000,
          });
        }
      } catch (error) {
        if (error.response && error.response.data.message) {
          toast.error(error.response.data.message, {
            duration: 4000,
          });
        } else {
          toast.error(error.message, {
            duration: 4000,
          });
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // If the user cancels, revert back to the initial booking status
      setCurrentBookingStatus(booking.status);
    }
  };
  const navigate = useNavigate();

  return (
    <>
      <tr
        key={booking._id}
        style={{
          fontSize: 14,
        }}
        className="position-relative"
      >
        {loading && (
          <div
            className="position-absolute w-100 h-100 bg-light"
            style={{
              top: 0,
              left: 0,
              zIndex: 100,
              opacity: 0.8,
            }}
          ></div>
        )}
        <td>{index + 1}</td>
        <td className="text-nowrap">
          {booking.personalDetails?.firstName +
            " " +
            (booking.personalDetails?.lastName == null
              ? ""
              : booking.personalDetails?.lastName)}
          <br />
          {booking.personalDetails?.email}
        </td>
        <td className="text-nowrap">
          {booking.bookingDate} <br />
          {booking.bus && booking.bus.locations && booking.bus.locations.length > 0
            ? `${booking.bus.locations[0].departureTime} - ${booking.bus.locations[booking.bus.locations.length - 1].arrivalTime}`
            : 'N/A'}
        </td>
        <td>
          {booking.route.name}, {booking.bus && booking.bus.locations && booking.bus.locations.length > 0
            ? `${booking.bus.locations[0].departureTime} - ${booking.bus.locations[booking.bus.locations.length - 1].arrivalTime}`
            : 'N/A'}
          <br />
          <b>from</b> {booking.from.name} <b>to</b> {booking.to.name}
        </td>
        <td className="text-nowrap">
          <div className="d-flex flex-row justify-content-start align-items-center gap-2">
            <select
              className="form-select form-select-sm w-auto"
              defaultValue={currentBookingStatus}
              value={currentBookingStatus}
              onChange={(e) => {
                updateBookingStatus(booking._id, e.target.value);
              }}
            >
              <option
                value="confirmed"
                selected={currentBookingStatus === "confirmed"}
              >
                Confirmed
              </option>
              <option
                value="pending"
                selected={currentBookingStatus === "pending"}
              >
                Pending
              </option>
              <option
                value="refunded"
                selected={currentBookingStatus === "refunded"}
              >
                Refunded
              </option>
              <option
                value="cancelled"
                selected={currentBookingStatus === "cancelled"}
              >
                Cancelled
              </option>
            </select>
            <div
              className={`${getStatusColor(
                currentBookingStatus
              )} rounded-circle d-flex justify-content-center align-items-center`}
              style={{ width: "20px", height: "20px" }}
            >
              {currentBookingStatus === "confirmed" && (
                <Check className="text-white" size={17} />
              )}
              {currentBookingStatus === "pending" && (
                <Clock className="text-white" size={17} />
              )}
              {currentBookingStatus === "refunded" && (
                <ArrowClockwise className="text-white" size={17} />
              )}
              {currentBookingStatus === "cancelled" && (
                <X className="text-white" size={17} />
              )}
            </div>
          </div>
        </td>
        <td>
          <div className="d-flex flex-column justify-content-center align-items-start gap-1">
            <Button
              variant="primary"
              size="sm"
              className="me-2"
              onClick={() => {
                if (booking._id) {
                  navigate(`/admin/edit-booking/${booking.bookingId}`);
                }
              }}
              title="Edit"
            >
              <PencilSquare />
            </Button>
            <Link
              to={`/booking/${booking.bookingId}`}
              target="_blank"
              className="btn btn-info btn-sm text-light"
              title="View Details"
            >
              <EyeFill color="#fff" size={15} />
            </Link>
          </div>
        </td>
      </tr>
    </>
  );
};

export default BookingRow;
