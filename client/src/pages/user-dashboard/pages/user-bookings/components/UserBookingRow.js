import React, { useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { InfoCircleFill, XCircleFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import CancelBookingModal from "./CancelBookingModal";
import { useSelector } from "react-redux";
import { translateText } from "../../../../../utils/translation";

const UserBookingRow = ({ booking }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-success";
      case "completed":
        return "bg-info";
      case "refunded":
        return "bg-secondary";
      case "cancelled":
        return "bg-danger";
      default:
        return "bg-primary";
    }
  };

  const [showCancelModal, setShowCancelModal] = useState(false);
  const selectedLanguage = useSelector(
    (state) => state.settings.selectedLanguage
  );

  return (
    <>
      {showCancelModal && (
        <CancelBookingModal
          showModal={showCancelModal}
          setShowModal={setShowCancelModal}
          booking={booking}
        />
      )}
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
            className={`${getStatusColor(
              booking.status === "pending" ? "confirmed" : booking.status
            )} text-white p-1 rounded`}
          >
            {selectedLanguage &&
              translateText(
                booking.status === "pending" ? "confirmed" : booking.status,
                selectedLanguage.code
              )}
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
                  <span>
                    {selectedLanguage &&
                      translateText("View Details", selectedLanguage.code)}
                  </span>
                </Link>
              </Dropdown.Item>
              <Dropdown.Item as={"div"}>
                <Button
                  className="d-flex flex-row gap-2 align-items-center p-0 m-0 outline-none bg-transparent border-0 text-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCancelModal(true);
                  }}
                >
                  <XCircleFill color="red" />
                  <span>
                    {selectedLanguage &&
                      translateText("Cancel Booking", selectedLanguage.code)}
                  </span>
                </Button>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    </>
  );
};

export default UserBookingRow;
