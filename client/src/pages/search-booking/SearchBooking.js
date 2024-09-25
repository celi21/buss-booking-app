import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../components/loading-spinner/LoadingSpinner";
import { Alert, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import { translateText } from "../../utils/translation";

const SearchBooking = () => {
  const { bookingId } = useParams();
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [statusColor, setStatusColor] = useState(null);
  const selectedLanguage = useSelector(
    (state) => state.settings.selectedLanguage
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Convert to a human-readable format
    const humanReadableDate = date.toLocaleString("en-US", {
      weekday: "long", // "Monday"
      year: "numeric", // "2024"
      month: "long", // "September"
      day: "numeric", // "13"
      hour: "numeric", // "8 PM"
      minute: "numeric", // "40"
      second: "numeric", // "17"
      hour12: true, // Use 12-hour format
    });
    return humanReadableDate;
  };

  const searchBooking = async (id) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      let response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/booking/search-booking/${id}`,
        config
      );
      if (
        response.data &&
        response.data.success &&
        response.data.success === true
      ) {
        setBookingData(response.data.booking);
        setError(null);
      } else if (response.data && response.data.success === false) {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) {
      searchBooking(bookingId);
    }
  }, [bookingId]);

  useEffect(() => {
    if (bookingData) {
      setBookingStatus(bookingData.status);

      switch (bookingData.status) {
        case "confirmed":
          setStatusColor("bg-success");
          break;
        case "pending":
          setStatusColor("bg-warning");
          break;
        case "refunded":
          setStatusColor("bg-secondary");
          break;
        case "cancelled":
          setStatusColor("bg-danger");
          break;
        default:
          setStatusColor("bg-primary");
          break;
      }
    }
  }, [bookingData]);

  if (!bookingId) {
    return (
      <div className="d-flex align-items-center justify-content-center p-3">
        No Booking Id Provided
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-3">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Container fluid className="my-4">
      {error && <Alert variant="danger">{error}</Alert>}

      {bookingData && (
        <>
          <Row className="mb-4 mx-auto border-bottom">
            <h4 className="fw-bold text-center">
              {selectedLanguage &&
                translateText("booking-details", selectedLanguage.code)}
            </h4>
            <div className="mx-auto text-center">
              <div className="fw-bold mb-0 d-flex flex-row justify-content-center align-items-center gap-2">
                <div className="bg-primary text-white p-2 px-3 rounded">
                  ID: {bookingId}
                </div>
                <div className={`text-white p-2 px-3 rounded ${statusColor}`}>
                  {selectedLanguage &&
                    translateText("status", selectedLanguage.code)}
                  :{" "}
                  <span className="text-uppercase">
                    {selectedLanguage &&
                      translateText(bookingData.status, selectedLanguage.code)}
                  </span>
                </div>
              </div>

              <p>
                {selectedLanguage &&
                  translateText("search-page-desc", selectedLanguage.code)}{" "}
                <span className="fw-semibold">
                  {formatDate(bookingData.createdAt)}
                </span>
              </p>
            </div>
          </Row>
          <Row className="d-flex align-items-stretch">
            {bookingData.user && (
              <Col xl={4} lg={4} md={6} sm={12} xs={12} className="mb-4">
                <Card className="shadow-sm h-100">
                  <Card.Body>
                    <Card.Title>
                      {selectedLanguage &&
                        translateText("User Details", selectedLanguage.code)}
                    </Card.Title>
                    <ListGroup className="list-group-flush">
                      <ListGroup.Item className="px-0 mx-0">
                        <div>
                          <div className="fw-semibold">
                            {selectedLanguage &&
                              translateText("name", selectedLanguage.code)}
                          </div>
                          <div>{bookingData.user.name}</div>
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item className="px-0 mx-0">
                        <div>
                          <div className="fw-semibold">
                            {selectedLanguage &&
                              translateText("email", selectedLanguage.code)}
                          </div>
                          <div>{bookingData.user.email}</div>
                        </div>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            )}

            <Col xl={4} lg={4} md={6} sm={12} xs={12} className="mb-4">
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title>
                    {selectedLanguage &&
                      translateText(
                        "dates-and-locations",
                        selectedLanguage.code
                      )}
                  </Card.Title>
                  <ListGroup className="list-group-flush">
                    <ListGroup.Item className="px-0 mx-0">
                      <div>
                        <div className="fw-semibold">
                          {selectedLanguage &&
                            translateText(
                              "departure-from",
                              selectedLanguage.code
                            )}
                        </div>
                        <div>
                          {bookingData.bookingDate}{" "}
                          {
                            bookingData.bus.locations.find(
                              (loc) => loc.city === bookingData.from._id
                            ).departureTime
                          }
                        </div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 mx-0">
                      <div>
                        <div className="fw-semibold">
                          {selectedLanguage &&
                            translateText("arrive-to", selectedLanguage.code)}
                        </div>
                        <div>
                          {bookingData.bookingDate}{" "}
                          {
                            bookingData.bus.locations.find(
                              (loc) => loc.city === bookingData.to._id
                            ).arrivalTime
                          }
                        </div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 mx-0">
                      <div>
                        <div className="fw-semibold">
                          {selectedLanguage &&
                            translateText("from", selectedLanguage.code)}
                        </div>
                        <div>{bookingData.from.name}</div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 mx-0">
                      <div>
                        <div className="fw-semibold">
                          {selectedLanguage &&
                            translateText("to", selectedLanguage.code)}
                        </div>
                        <div>{bookingData.to.name}</div>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            <Col xl={4} lg={4} md={6} sm={12} xs={12} className="mb-4">
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title>
                    {selectedLanguage &&
                      translateText("bus", selectedLanguage.code)}{" "}
                    {selectedLanguage &&
                      translateText("details", selectedLanguage.code)}
                  </Card.Title>
                  <ListGroup className="list-group-flush">
                    <ListGroup.Item className="px-0 mx-0">
                      <div>
                        <div className="fw-semibold">
                          {selectedLanguage &&
                            translateText("name", selectedLanguage.code)}
                        </div>
                        <div>{bookingData.route.name}</div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 mx-0">
                      <div>
                        <div className="fw-semibold">
                          {selectedLanguage &&
                            translateText("Total Seats", selectedLanguage.code)}
                        </div>
                        <div>{bookingData.busType.seats}</div>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            <Col xl={4} lg={4} md={6} sm={12} xs={12} className="mb-4">
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title>
                    {selectedLanguage &&
                      translateText("tickets", selectedLanguage.code)}
                  </Card.Title>
                  <ListGroup className="list-group-flush">
                    {bookingData.seatDetails.map((seat) => {
                      return (
                        <ListGroup.Item className="px-0 mx-0">
                          <div>
                            <div className="fw-semibold">{seat.name}</div>
                            <div>
                              {selectedLanguage &&
                                translateText("Total", selectedLanguage.code)}
                              : {seat.seats}
                            </div>
                            <div>
                              {selectedLanguage &&
                                translateText("Seats", selectedLanguage.code)}
                              : ${seat.price}{" "}
                              {selectedLanguage &&
                                translateText(
                                  "per seat",
                                  selectedLanguage.code
                                )}
                            </div>
                          </div>
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            <Col xl={4} lg={4} md={6} sm={12} xs={12} className="mb-4">
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title>
                    {selectedLanguage &&
                      translateText("payment", selectedLanguage.code)}{" "}
                    {selectedLanguage &&
                      translateText("details", selectedLanguage.code)}
                  </Card.Title>
                  <ListGroup className="list-group-flush">
                    <ListGroup.Item className="px-0 mx-0">
                      <div>
                        <div className="fw-semibold">
                          {selectedLanguage &&
                            translateText(
                              "Transaction",
                              selectedLanguage.code
                            )}{" "}
                          ID
                        </div>
                        <div>{bookingData.payment.transactionId}</div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 mx-0">
                      <div>
                        <div className="fw-semibold">
                          {selectedLanguage &&
                            translateText(
                              "Tickets total",
                              selectedLanguage.code
                            )}
                        </div>
                        <div>${bookingData.payment.amount}</div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 mx-0">
                      <div>
                        <div className="fw-semibold">
                          {selectedLanguage &&
                            translateText("Tax", selectedLanguage.code)}
                        </div>
                        <div>${bookingData.payment.tax}</div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 mx-0">
                      <div>
                        <div className="fw-semibold">
                          {selectedLanguage &&
                            translateText(
                              "Flex Charges",
                              selectedLanguage.code
                            )}
                        </div>
                        <div>${bookingData.flexOption == true ? 8 : 0}</div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 mx-0">
                      <div>
                        <div className="fw-semibold">
                          {selectedLanguage &&
                            translateText("Total", selectedLanguage.code)}
                        </div>
                        <div>${bookingData.payment.amount}</div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 mx-0">
                      <div>
                        <div className="fw-semibold">
                          {selectedLanguage &&
                            translateText("Deposit", selectedLanguage.code)}
                        </div>
                        <div>${bookingData.payment.amount}</div>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            <Col xl={4} lg={4} md={6} sm={12} xs={12} className="mb-4">
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title>
                    {selectedLanguage &&
                      translateText("Personal", selectedLanguage.code)}{" "}
                    {selectedLanguage &&
                      translateText("details", selectedLanguage.code)}
                  </Card.Title>
                  <ListGroup className="list-group-flush">
                    <ListGroup.Item className="px-0 mx-0">
                      <div>
                        <div className="fw-semibold">
                          {selectedLanguage &&
                            translateText("first-name", selectedLanguage.code)}
                        </div>
                        <div>{bookingData.personalDetails.firstName}</div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 mx-0">
                      <div>
                        <div className="fw-semibold">
                          {selectedLanguage &&
                            translateText("last-name", selectedLanguage.code)}
                        </div>
                        <div>{bookingData.personalDetails.lastName}</div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 mx-0">
                      <div>
                        <div className="fw-semibold">
                          {selectedLanguage &&
                            translateText("phone", selectedLanguage.code)}
                        </div>
                        <div>{bookingData.personalDetails.phone}</div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 mx-0">
                      <div>
                        <div className="fw-semibold">
                          {selectedLanguage &&
                            translateText("email", selectedLanguage.code)}
                        </div>
                        <div>{bookingData.personalDetails.email}</div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 mx-0">
                      <div>
                        <div className="fw-semibold">
                          {selectedLanguage &&
                            translateText(
                              "Pickup Address",
                              selectedLanguage.code
                            )}
                        </div>
                        <div>{bookingData.personalDetails.pickupAddress}</div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 mx-0">
                      <div>
                        <div className="fw-semibold">
                          {selectedLanguage &&
                            translateText(
                              "Dropoff Address",
                              selectedLanguage.code
                            )}
                        </div>
                        <div>{bookingData.personalDetails.dropoffAddress}</div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 mx-0">
                      <div>
                        <div className="fw-semibold">
                          {selectedLanguage &&
                            translateText("Notes", selectedLanguage.code)}
                        </div>
                        <div>{bookingData.personalDetails.notes}</div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 mx-0">
                      <div>
                        <div className="fw-semibold">
                          {selectedLanguage &&
                            translateText("Suitcases", selectedLanguage.code)}
                        </div>
                        <div>{bookingData.personalDetails.suitcases}</div>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default SearchBooking;
