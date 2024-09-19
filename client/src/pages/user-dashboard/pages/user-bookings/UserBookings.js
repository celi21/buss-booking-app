import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBookings } from "../../../../store/slices/bookingSlice";
import { Container, Dropdown, Row, Table } from "react-bootstrap";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import { Link } from "react-router-dom";
import UserBookingRow from "./components/UserBookingRow";

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
              <th>Tickets</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isUserBookingsLoading ? (
              <LoadingSpinner />
            ) : (
              userBookings.map((booking, index) => {
                return <UserBookingRow booking={booking} />;
              })
            )}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
};

export default UserBookings;
