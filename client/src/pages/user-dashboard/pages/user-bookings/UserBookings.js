import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBookings } from "../../../../store/slices/bookingSlice";
import { Container, Dropdown, Row, Table } from "react-bootstrap";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import { Link } from "react-router-dom";

const UserBookings = () => {
  const dispatch = useDispatch();
  const { userBookings, isUserBookingsLoading } = useSelector(
    (state) => state.booking
  );

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, []);

  return (
    <Container fluid>
      <Row className="pb-20">
        <Table responsive hover striped>
          <thead>
            <tr>
              <th>Booking Id</th>
              <th>Bus</th>
              <th>Date</th>
              <th>From</th>
              <th>To</th>
              <th>Departure Time</th>
              <th>Arrival Time</th>
              <th>Tickets</th>
              <th>Total Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isUserBookingsLoading ? (
              <LoadingSpinner />
            ) : (
              userBookings.map((booking, index) => {
                return (
                  <tr key={booking._id}>
                    <td className="text-nowrap">{booking.bookingId}</td>
                    <td className="text-nowrap">{booking.busType.name}</td>
                    <td className="text-nowrap">{booking.bookingDate}</td>
                    <td>{booking.from.name}</td>
                    <td>{booking.to.name}</td>
                    <td>
                      {
                        booking.bus.locations.find(
                          (loc) => loc.city === booking.from._id
                        ).departureTime
                      }
                    </td>
                    <td>
                      {
                        booking.bus.locations.find(
                          (loc) => loc.city === booking.to._id
                        ).arrivalTime
                      }
                    </td>
                    <td className="text-nowrap">
                      {booking.seatDetails.map((seat) => {
                        return (
                          <div>
                            {seat.seats} {seat.name}
                          </div>
                        );
                      })}
                    </td>
                    <td>${booking.payment.amount}</td>
                    <td>
                      <Dropdown
                        size="sm"
                        drop="down"
                        popperConfig={{
                          modifiers: [
                            {
                              name: "preventOverflow",
                              options: { boundary: "viewport" },
                            },
                          ],
                        }}
                      >
                        <Dropdown.Toggle
                          variant="light"
                          className="border border-secondary"
                          id="dropdown-basic"
                        ></Dropdown.Toggle>

                        <Dropdown.Menu
                          style={{
                            position: "absolute",
                            zIndex: 1000,
                          }}
                        >
                          <Dropdown.Item>
                            <Link to={`/booking/${booking.bookingId}`}>
                              View Details
                            </Link>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
};

export default UserBookings;
