import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBookings } from "../../../../store/slices/bookingSlice";
import { Container, Dropdown, Row, Table } from "react-bootstrap";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import { Link } from "react-router-dom";
import UserBookingRow from "./components/UserBookingRow";
import { translateText } from "../../../../utils/translation";

const UserBookings = () => {
  const dispatch = useDispatch();
  const { userBookings, isUserBookingsLoading } = useSelector(
    (state) => state.booking
  );
  const selectedLanguage = useSelector(
    (state) => state.settings.selectedLanguage
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
              <th>
                {selectedLanguage &&
                  translateText("booking", selectedLanguage.code)}{" "}
                Id
              </th>
              <th>
                {selectedLanguage &&
                  translateText("bus", selectedLanguage.code)}
              </th>
              <th>
                {selectedLanguage &&
                  translateText("date", selectedLanguage.code)}
              </th>
              <th>
                {selectedLanguage &&
                  translateText("from", selectedLanguage.code)}
              </th>
              <th>
                {selectedLanguage && translateText("to", selectedLanguage.code)}
              </th>
              <th>
                {selectedLanguage &&
                  translateText("tickets", selectedLanguage.code)}
              </th>
              <th>
                {selectedLanguage &&
                  translateText("amount", selectedLanguage.code)}
              </th>
              <th>
                {selectedLanguage &&
                  translateText("status", selectedLanguage.code)}
              </th>
              <th>
                {selectedLanguage &&
                  translateText("actions", selectedLanguage.code)}
              </th>
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
