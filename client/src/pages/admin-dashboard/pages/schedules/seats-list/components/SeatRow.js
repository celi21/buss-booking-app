import React, { useRef, useState } from "react";
import { Button, Overlay, Tooltip } from "react-bootstrap";
import { InfoCircleFill } from "react-bootstrap-icons";

const SeatRow = ({ loc, index, middleIndex, booking }) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);

  return (
    <td
      key={loc.city._id}
      className="bg-primary text-white text-center"
      style={{
        paddingBottom: 10,
        paddingTop: 10,
      }}
    >
      {index === middleIndex ? (
        <div className="d-flex flex-row align-items-center gap-1">
          <div>
            {booking.personalDetails.firstName +
              " " +
              (booking.personalDetails.lastName == null
                ? ""
                : booking.personalDetails.lastName)}
          </div>
          <div>
            <Button
              ref={target}
              onClick={() => setShow(!show)}
              title="Click to view details"
              className="border-0 shadow-none outline-none bg-transparent p-0 m-0"
            >
              <InfoCircleFill color="white" />
            </Button>
            <Overlay target={target.current} show={show} placement="right">
              {(props) => (
                <Tooltip id="overlay-example" {...props}>
                  <div className="d-flex flex-column align-items-start">
                    <div>Booking ID: {booking.bookingId}</div>
                    <div className="d-flex flex-row align-items-start gap-1">
                      <div>Tickets:</div>
                      <div className="text-start">
                        {booking.seatDetails.map((seat) => {
                          return (
                            seat.seats > 0 && (
                              <>
                                <div>
                                  {seat.name} x {seat.seats}
                                </div>
                              </>
                            )
                          );
                        })}
                      </div>
                    </div>
                    <div>Phone: {booking.personalDetails.phone}</div>
                    <div>Email: {booking.personalDetails.email}</div>
                  </div>
                </Tooltip>
              )}
            </Overlay>
          </div>
        </div>
      ) : (
        ""
      )}
    </td>
  );
};

export default SeatRow;
