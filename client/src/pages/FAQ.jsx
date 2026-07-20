import React, { useEffect } from "react";
import { Container, Accordion, Card, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { translateText } from "../utils/translation";

const FAQ = () => {
  const selectedLanguage = useSelector(
    (state) => state.settings.selectedLanguage
  );

  const t = (key) => {
    return (selectedLanguage && translateText(key, selectedLanguage.code)) || key;
  };

  useEffect(() => {
    document.title = `${t("Frequently Asked Questions (FAQ)")} | Bueno Express`;
  }, [selectedLanguage]);

  return (
    <Container className="py-5" style={{ maxWidth: "800px" }}>

      <div className="text-center mb-5">
        <h1 className="fw-bold text-dark mb-2">{t("Frequently Asked Questions (FAQ)")}</h1>
        <p className="text-muted lead">{t("Find everything you need to know about your trip with Bueno Express.")}</p>
      </div>

      <Accordion defaultActiveKey="0" className="shadow-sm rounded-4 overflow-hidden border">
        {/* Category: Booking & Fares */}
        <Card className="border-0 border-bottom">
          <Card.Header className="bg-light fw-bold py-3 text-primary">
            {t("Booking & Fares")}
          </Card.Header>
          <Accordion.Item eventKey="0" className="border-0">
            <Accordion.Header className="fw-semibold">{t("How much does a ticket cost?")}</Accordion.Header>
            <Accordion.Body className="bg-white text-secondary" style={{ lineHeight: "1.6" }}>
              <ul>
                <li><strong>{t("Adult / Standard Fare")}:</strong> $60 + tax ({t("includes Upstate NY and Albany routes")}).</li>
                <li><strong>{t("Infants (1 year & under)")}:</strong> $40 + tax.</li>
              </ul>
              <p className="mb-0 text-muted small"><em><strong>{t("Note")}:</strong> {t("Full payment is required in advance through our secure payment gateway to reserve your seat.")}</em></p>
            </Accordion.Body>
          </Accordion.Item>
          
          <Accordion.Item eventKey="1" className="border-0">
            <Accordion.Header className="fw-semibold">{t("Are there age limits to travel?")}</Accordion.Header>
            <Accordion.Body className="bg-white text-secondary" style={{ lineHeight: "1.6" }}>
              <p>{t("Passengers must be 16 years or older to travel independently with Bueno Express.")}</p>
              <p className="mb-0 text-danger"><em>{t("Parents traveling with infants (1 year & under) are required by law to bring an approved child car seat.")}</em></p>
            </Accordion.Body>
          </Accordion.Item>
        </Card>

        {/* Category: Schedules & Pickup Locations */}
        <Card className="border-0 border-bottom">
          <Card.Header className="bg-light fw-bold py-3 text-primary">
            {t("Schedules & Pickup Locations")}
          </Card.Header>
          <Accordion.Item eventKey="2" className="border-0">
            <Accordion.Header className="fw-semibold">{t("What is the Upstate to NYC schedule?")}</Accordion.Header>
            <Accordion.Body className="bg-white text-secondary" style={{ lineHeight: "1.6" }}>
              <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                <li><strong>5:00 AM:</strong> {t("Daily departures begin in Upstate NY (Utica, Frankfort, Ilion, Herkimer).")}</li>
                <li><strong>7:30 AM:</strong> {t("Pickup at Albany, NY (Guilderland Travel Plaza, 103 Brookview Dr, Schenectady, NY 12303).")}</li>
                <li><strong>9:30 AM:</strong> {t("Arrival in New York City.")}</li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
          
          <Accordion.Item eventKey="3" className="border-0">
            <Accordion.Header className="fw-semibold">{t("Where does the bus pick up in NYC for Upstate trips?")}</Accordion.Header>
            <Accordion.Body className="bg-white text-secondary" style={{ lineHeight: "1.6" }}>
              <p>{t("You must choose one of these primary pickup points when booking:")}</p>
              <ul>
                <li><strong>11:20 AM ({t("Best Price")}):</strong> Pablo Express – 1218 St. Nicholas Ave, NYC</li>
                <li><strong>11:25 AM:</strong> Fort Lee – Near the George Washington Bridge, NJ</li>
                <li><strong>11:25 AM:</strong> Paramus – Route 4, Paramus, NJ</li>
              </ul>
              <div className="alert alert-warning mb-0 p-3" style={{ fontSize: "0.9rem" }}>
                <strong>{t("Important Location Update")}:</strong> {t("We no longer offer home door-to-door pickups or transfers/drop-offs within Manhattan and the Bronx. Please arrive early at your selected stop so you don't miss the bus.")}
              </div>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="4" className="border-0">
            <Accordion.Header className="fw-semibold">{t("Do you offer airport transfer services?")}</Accordion.Header>
            <Accordion.Body className="bg-white text-secondary" style={{ lineHeight: "1.6" }}>
              <p>{t("Yes. Airport connections are available for JFK, LaGuardia, and Newark airports.")}</p>
              <p className="mb-0 text-muted">{t("These are handled via a third-party service, require a separate reservation, and carry an additional fee.")}</p>
            </Accordion.Body>
          </Accordion.Item>
        </Card>

        {/* Category: Luggage & Pet Policies */}
        <Card className="border-0 border-bottom">
          <Card.Header className="bg-light fw-bold py-3 text-primary">
            {t("Luggage & Pet Policies")}
          </Card.Header>
          <Accordion.Item eventKey="5" className="border-0">
            <Accordion.Header className="fw-semibold">{t("What is the luggage allowance?")}</Accordion.Header>
            <Accordion.Body className="bg-white text-secondary" style={{ lineHeight: "1.6" }}>
              <p>{t("Each ticket includes:")}</p>
              <ul>
                <li><strong>1 {t("Personal Item")}:</strong> {t("Maximum weight of 25 lbs.")}</li>
                <li><strong>1 {t("Carry-on Luggage")}:</strong> {t("Maximum weight of 50 lbs and under 24 inches.")}</li>
              </ul>
              <p className="mb-0 text-danger fw-bold">{t("extra, oversized, or bulky luggage is NOT ALLOWED.")}</p>
            </Accordion.Body>
          </Accordion.Item>
          
          <Accordion.Item eventKey="6" className="border-0">
            <Accordion.Header className="fw-semibold">{t("Are pets allowed?")}</Accordion.Header>
            <Accordion.Body className="bg-white text-secondary" style={{ lineHeight: "1.6" }}>
              <p className="mb-0">{t("No. Pets are not permitted on Bueno Express buses.")}</p>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="7" className="border-0">
            <Accordion.Header className="fw-semibold">{t("Can I ship a package?")}</Accordion.Header>
            <Accordion.Body className="bg-white text-secondary" style={{ lineHeight: "1.6" }}>
              <p>{t("Yes, but all packages are subject to mandatory safety inspection and must remain open for review.")}</p>
              <p className="mb-0 text-muted">{t("Bueno Express is not responsible for lost or damaged personal items or package contents.")}</p>
              <p className="mt-2 mb-0 text-warning fw-semibold" style={{ fontSize: "0.9rem" }}>
                * {t("Note: Packages can only travel to and from 1218 St Nicholas Avenue and Picked up or Droped off Door to Door in Utica, New York .")}
              </p>
            </Accordion.Body>
          </Accordion.Item>
        </Card>

        {/* Category: Seating, Refunds & Date Changes */}
        <Card className="border-0 border-bottom">
          <Card.Header className="bg-light fw-bold py-3 text-primary">
            {t("Seating, Refunds & Date Changes")}
          </Card.Header>
          <Accordion.Item eventKey="8" className="border-0">
            <Accordion.Header className="fw-semibold">{t("What is your cancellation and refund policy?")}</Accordion.Header>
            <Accordion.Body className="bg-white text-secondary" style={{ lineHeight: "1.6" }}>
              <ul>
                <li><strong>100% {t("Refund")}:</strong> {t("Cancellations made with Flex option")}</li>
                <li><strong>50% {t("Refund")}:</strong> {t("at least 1 day (24 hours) prior to travel.")}</li>
                <li><strong>30% {t("Refund")}:</strong> {t("Same-day cancellations or no-shows.")}</li>
                <li><strong>{t("Date Changes")}:</strong> {t("Allowed, but subject to a partial change fee.")}</li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
          
          <Accordion.Item eventKey="9" className="border-0">
            <Accordion.Header className="fw-semibold">{t("Can I request special seating?")}</Accordion.Header>
            <Accordion.Body className="bg-white text-secondary" style={{ lineHeight: "1.6" }}>
              <p>{t("Priority front seating is reserved for tall passengers or individuals with disabilities. Please notify our dispatchers ahead of time to make accommodations.")}</p>
              <p className="mb-0">{t("Adults traveling with children will be seated together whenever possible.")}</p>
            </Accordion.Body>
          </Accordion.Item>
        </Card>

        {/* Category: Customer Support */}
        <Card className="border-0">
          <Card.Header className="bg-light fw-bold py-3 text-primary">
            {t("Customer Support")}
          </Card.Header>
          <Accordion.Item eventKey="10" className="border-0">
            <Accordion.Header className="fw-semibold">{t("How can I contact Bueno Express?")}</Accordion.Header>
            <Accordion.Body className="bg-white text-secondary" style={{ lineHeight: "1.6" }}>
              <p><strong>{t("Phone")}:</strong> <a href="tel:3157971010">(315) 797-1010</a></p>
              <p className="mb-0"><strong>{t("Hours of Operation")}:</strong> {t("Everyday from 4:30 AM – 9:30 PM")}</p>
            </Accordion.Body>
          </Accordion.Item>
        </Card>
      </Accordion>
    </Container>
  );
};

export default FAQ;
