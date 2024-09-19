import React from "react";
import { Button, Dropdown } from "react-bootstrap";
import { InfoCircleFill, XCircleFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

const UserBookingRow = ({ booking }) => {
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

  const checkIfDateValid = (booking) => {
    // Find the departure time for the 'from' city
    const fromLocation = booking.bus.locations.find(
      (loc) => loc.city === booking.from._id
    );

    if (!fromLocation || !fromLocation.departureTime) {
      return false; // No departure time available
    }

    // Combine bookingDate and departureTime into a valid Date object
    const departureDateTime = new Date(booking.bookingDate); // Booking date
    const [departureHour, departureMin, departurePeriod] =
      fromLocation.departureTime.split(/[:\s]+/);

    // Convert 12-hour time to 24-hour format
    let hour = parseInt(departureHour);
    if (departurePeriod === "PM" && hour !== 12) {
      hour += 12;
    } else if (departurePeriod === "AM" && hour === 12) {
      hour = 0;
    }

    departureDateTime.setHours(hour);
    departureDateTime.setMinutes(parseInt(departureMin));

    // Get the current time
    const currentTime = new Date();

    // Check if it's still more than 24 hours before departure
    const timeDiff = departureDateTime - currentTime; // Time difference in milliseconds

    const hoursDiff = timeDiff / (1000 * 60 * 60); // Convert to hours

    if (hoursDiff > 24) {
      return true; // Can cancel as more than 24 hours remain
    }

    // If it's after the departure time, cancellation should be disallowed
    if (currentTime > departureDateTime) {
      return false; // Bus already departed, cannot cancel
    }

    return false; // Less than 24 hours remain, cannot cancel
  };

  const handleCancelBooking = () => {
    if (checkIfDateValid(booking)) {
      alert("You can cancel");
    } else {
      alert("You cannot cancel");
    }
  };

  return (
    <tr
      key={booking._id}
      style={{
        verticalAlign: "middle",
        fontSize: 14,
      }}
    >
      <td className="text-nowrap">{booking.bookingId}</td>
      <td className="text-nowrap">{booking.route.name}</td>
      <td className="text-nowrap">{booking.bookingDate}</td>
      <td>
        {booking.from.name}
        <div className="fw-bold">
          {
            booking.bus.locations.find((loc) => loc.city === booking.from._id)
              .departureTime
          }
        </div>
      </td>
      <td>
        {booking.to.name}
        <div className="fw-bold">
          {
            booking.bus.locations.find((loc) => loc.city === booking.to._id)
              .arrivalTime
          }
        </div>
      </td>
      <td className="text-nowrap">
        {booking.seatDetails.map((seat) => {
          return (
            seat.seats > 0 && (
              <div>
                {seat.seats} {seat.name}
              </div>
            )
          );
        })}
      </td>
      <td>${booking.payment.amount}</td>
      <td>
        <div
          className={`${getStatusColor(booking.status)} text-white p-1 rounded`}
        >
          {booking.status}
        </div>
      </td>
      <td className="text-center">
        <Dropdown size="sm" drop="down" className="p-0 m-0">
          <Dropdown.Toggle
            variant="light"
            className="border border-secondary p-0 px-2 m-0 h-auto"
            id="dropdown-basic"
          ></Dropdown.Toggle>

          <Dropdown.Menu
            style={{
              position: "absolute",
              zIndex: 1000,
            }}
          >
            <Dropdown.Item>
              <Link
                to={`/booking/${booking.bookingId}`}
                target="_blank"
                className="d-flex flex-row gap-2 align-items-center"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <InfoCircleFill color="blue" />
                <span>View Details</span>
              </Link>
            </Dropdown.Item>
            <Dropdown.Item as={"div"}>
              <Button
                className="d-flex flex-row gap-2 align-items-center p-0 m-0 outline-none bg-transparent border-0 text-black"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelBooking();
                }}
              >
                <XCircleFill color="red" />
                <span>Cancel Booking</span>
              </Button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  );
};

export default UserBookingRow;
