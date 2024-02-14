import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import {
  ArrowRightCircleFill,
  ArrowRightShort,
  BusFrontFill,
  CurrencyRupee,
  Dot,
  GeoAltFill,
  SignTurnRightFill,
  TicketPerforatedFill,
} from "react-bootstrap-icons";

import { formatDate, timeDifference } from "../utils/datetime";
import BookModal from "./BookModal";

const getAverageRating = (reviews) => {
  const ratings = reviews.map((review) => review.rating);

  let sum = 0;
  ratings.forEach((rating) => (sum += rating));

  return sum / ratings.length;
};

function SearchResultCard({ bus, index, boarding, deboarding, date }) {
  const [showBookModal, setShowBookModal] = useState(false);
  const [seatsBooked, setSeatsBooked] = useState([]);
  const [showSidebar, setShowSidebar] = useState("");

  useEffect(() => {
    const booked = [];

    bus.bookings.map((booking) => {
      if (!booking.cancelled) {
        return booked.push(...booking.seatNumbers);
      }
      return booking;
    });

    setSeatsBooked(booked);
  }, [bus.bookings]);

  return (
    <>
      <Card
        border={index === 0 ? "primary" : "dark"}
        key={bus._id}
        className={`p-0 mb-4 ${index % 2 === 0 ? "bg-light text-dark" : ""} `}
        style={{ borderWidth: "2px" }}
      >
        <Card.Header as="h5" className="d-flex align-items-center">
        <div className="d-flex justify-content-between w-100">
            <div className="w-25">
              {bus.busName}
              {index === 0 && (
                <Badge bg="danger" className="ms-2">
                  Cheapest
                </Badge>
              )}
            </div>
            <div className="d-flex gap-2 justify-content-end">
              <div onClick={(e)=>setShowSidebar("policy")} className={`text-muted fs-6 btn cursor-pointer ${showSidebar === "policy" && "custom-aliceblue-bg"}`}>Bookung Policy</div>
              <div onClick={(e)=>setShowSidebar("dropPoints")}className={`text-muted fs-6 btn cursor-pointer ${showSidebar === "dropPoints" && "custom-aliceblue-bg"}`}>Boarding and Droping Points</div>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col className="col-12 col-md-6 d-flex align-items-center justify-content-between">
              <p>
                {bus.busRoute.length > 0 && (
                  <span className="h6">
                    <SignTurnRightFill className="me-2" />
                    Route:&nbsp;
                  </span>
                )}
                {bus.busRoute?.map((location, index) => (
                  <span key={location} className="mr-4">
                    {location}
                    {index !== bus.busRoute.length - 1 && <ArrowRightShort />}
                  </span>
                ))}
              </p>
              <p>
                <Badge pill bg="success">
                  {bus.reviews.length > 0 ? (
                    <React.Fragment>
                      Ratings: {getAverageRating(bus.reviews).toString().substring(0, 3)} / 5
                    </React.Fragment>
                  ) : (
                    "Not rated"
                  )}
                </Badge>
              </p>
            </Col>

            <Col className="col-12 col-md-6">
              <p>
                {bus.facilities.length > 0 && (
                  <span className="h6">
                    <BusFrontFill className="me-2" />
                    Facilities:{" "}
                  </span>
                )}
                {bus.facilities?.map((facility, index) => (
                  <span key={facility}>
                    {facility}
                    {index !== bus.facilities.length - 1 && <Dot />}
                  </span>
                ))}
              </p>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col className="col-12 col-md-6">
              <span className="h6">
                <TicketPerforatedFill className="me-2" />
                Seats left:{" "}
              </span>
              <span>
                {bus.numOfSeats - seatsBooked.length} / {bus.numOfSeats}
              </span>
            </Col>

            <Col className="col-12 col-md-6">
              {bus.busRoute.length > 0 && (
                <>
                  <span className="h6">
                    <GeoAltFill className="me-2" />
                    Boarding at:{" "}
                  </span>
                  <span>{boarding}</span>
                </>
              )}
            </Col>
          </Row>

          <Row>
            <Col className="d-flex flex-column justify-content-center align-items-center">
              <p className="h2">{bus.from.toUpperCase()}</p>
              <p className="h5">
                {formatDate(date)} {bus.departure.substr(11, 5)}
              </p>
            </Col>

            <Col className="d-flex flex-column justify-content-center align-items-center">
              <ArrowRightCircleFill className="m-2" />
              <p className="h5">{timeDifference(bus.arrival, bus.departure)}</p>
            </Col>

            <Col className="d-flex flex-column justify-content-center align-items-center">
              <p className="h2">{bus.to.toUpperCase()}</p>
              <p className="h5">
                {formatDate(date)} {bus.arrival.substr(11, 5)}
              </p>
            </Col>

            <Col className="d-flex flex-column align-items-end">
              <h3 className="d-flex align-items-center display-6">
                <CurrencyRupee />
                {bus.fare}
              </h3>
              <Button onClick={(e) => setShowBookModal(true)}>Book Now</Button>
            </Col>
          </Row>
          {showSidebar === 'policy' && bus.bookingPolicies.length > 0 &&
            <div>
              <h4 className="d-flex justify-content-center">Booking Policies</h4>
              { bus.bookingPolicies.map((policy, index) => (
                <div key={index} className="mt-4">
                  <div className="h5">{policy.name}</div>
                  <div className="text-muted">{policy.description}</div>
                  <div className="mt-2">
                    <div className="text-muted">Cancellation Policy</div>
                    <div className="text-muted">{policy.cancellationPolicy}</div>
                  </div>
                </div>
              ))}
            </div>
          }

          {showSidebar === 'dropPoints' &&
            <div>
              <h4 className="d-flex justify-content-center">Boarding and Droping Points</h4>
              <ul>
                  <li>Boarding: {bus.from}</li>
                  {bus.busRoute.slice(1, bus.busRoute.length - 1).map((stop, index) => (
                    <li key={index}>{stop}</li>
                  ))}
                  <li>Droping: {bus.to}</li>
              </ul>
            </div>
          }
          
        </Card.Body>
      </Card>
      {showBookModal && (
        <BookModal
          bus={bus}
          from={boarding}
          to={deboarding}
          date={date}
          showBookModal={showBookModal}
          setShowBookModal={setShowBookModal}
          seatsBooked={seatsBooked}
          setSeatsBooked={setSeatsBooked}
        />
      )}
    </>
  );
}

export default SearchResultCard;
