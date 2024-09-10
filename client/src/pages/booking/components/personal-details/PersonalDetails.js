import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { ArrowRepeat } from "react-bootstrap-icons";

const PersonalDetails = () => {
  return (
    <div className="bg-light border p-3 rounded w-100">
      <p className="fs-4 fw-bold">Booking Details</p>

      <Row className="d-flex align-items-stretch">
        <Col xl={4} lg={4} className="d-flex flex-column">
          <div className="bg-white p-2 rounded shadow-sm h-100">
            <div className="fs-5 fw-semibold mb-3">JOURNEY</div>
            <Row className="mb-2">
              <Col xl="2" lg="2" md="2" sm="2" xs="2">
                Date:
              </Col>
              <Col
                className="d-flex flex-row justify-content-end align-items-center gap-2"
                xl="10"
                lg="10"
                md="10"
                sm="10"
                xs="10"
              >
                <span className="fw-semibold">09-11-2024</span>
                <Button className="p-0 bg-transparent border-0 outline-none text-primary">
                  Change date
                </Button>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col>Departure from:</Col>
              <div className="fw-semibold">
                1218 St Nicholas Ave Pablo Express (Near McDonalds) at 12:00 PM
              </div>
            </Row>

            <Row className="mb-2">
              <Col>Arrive to:</Col>
              <div className="fw-semibold">
                UPSTATE*(UTICA and Surrounding Areas) at 04:30 PM
              </div>
            </Row>

            <Row className="mb-2">
              <Col xl="2" lg="2" md="2" sm="2" xs="2">
                Bus:
              </Col>
              <Col
                className="d-flex flex-row justify-content-end align-items-center gap-2"
                xl="10"
                lg="10"
                md="10"
                sm="10"
                xs="10"
              >
                <p className="fw-semibold">NYC TO UPSTATE</p>
              </Col>
            </Row>
          </div>
        </Col>

        <Col xl={4} lg={4} className="d-flex flex-column">
          <div className="bg-white p-2 rounded shadow-sm h-100">
            <div className="fs-5 fw-semibold mb-3">Tickets</div>

            <Row className="mb-2">
              <Col xl="3" lg="3" md="3" sm="3" xs="3">
                Tickets:
              </Col>
              <Col
                className="d-flex flex-column justify-content-start align-items-start gap-2"
                xl="9"
                lg="9"
                md="9"
                sm="9"
                xs="9"
              >
                <span className="fw-semibold">2 ADULT(S) x $55.00</span>
                <span className="fw-semibold">2 INFANTE (0-1 YR) x $40.00</span>
                <Button className="p-0 bg-transparent border-0 outline-none text-primary">
                  Change seats
                </Button>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col xl="3" lg="3" md="3" sm="3" xs="3">
                Seats:
              </Col>
              <Col
                className="d-flex flex-column justify-content-start align-items-start gap-2"
                xl="9"
                lg="9"
                md="9"
                sm="9"
                xs="9"
              >
                <span className="fw-semibold">5,6,7</span>
              </Col>
            </Row>
          </div>
        </Col>

        <Col xl={4} lg={4} className="d-flex flex-column">
          <div className="bg-white p-2 rounded shadow-sm h-100">
            <div className="fs-5 fw-semibold mb-3">PAYMENT</div>

            <Row className="mb-2">
              <Col xl="6" lg="6" md="6" sm="6" xs="6">
                Tickets total
              </Col>
              <Col xl="6" lg="6" md="6" sm="6" xs="6">
                <span className="fw-semibold">$190.00</span>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col xl="6" lg="6" md="6" sm="6" xs="6">
                Tax
              </Col>
              <Col xl="6" lg="6" md="6" sm="6" xs="6">
                <span className="fw-semibold">$190.00</span>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col xl="6" lg="6" md="6" sm="6" xs="6">
                Total
              </Col>
              <Col xl="6" lg="6" md="6" sm="6" xs="6">
                <span className="fw-semibold">$190.00</span>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col xl="6" lg="6" md="6" sm="6" xs="6">
                Deposit
              </Col>
              <Col xl="6" lg="6" md="6" sm="6" xs="6">
                <span className="fw-semibold">$190.00</span>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <div className="mt-4">
        <p className="fs-4 fw-bold">Personal Details</p>
        <Form>
          <Row className="mb-3">
            <Col lg={6} xl={6} md={12} sm={12} xs={12}>
              <Form.Group>
                <Form.Label className="m-0 fw-semibold" htmlFor="firstName">
                  First Name:
                </Form.Label>
                <Form.Control
                  type="text"
                  id="firstName"
                  placeholder="Enter First Name"
                />
              </Form.Group>
            </Col>
            <Col lg={6} xl={6} md={12} sm={12} xs={12}>
              <Form.Group>
                <Form.Label className="m-0 fw-semibold" htmlFor="lastName">
                  Last Name:
                </Form.Label>
                <Form.Control
                  type="text"
                  id="lastName"
                  placeholder="Enter Last Name"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col lg={6} xl={6} md={12} sm={12} xs={12}>
              <Form.Group>
                <Form.Label className="m-0 fw-semibold" htmlFor="phone">
                  Phone:
                </Form.Label>
                <Form.Control
                  type="text"
                  id="phone"
                  placeholder="Enter Phone"
                />
              </Form.Group>
            </Col>
            <Col lg={6} xl={6} md={12} sm={12} xs={12}>
              <Form.Group>
                <Form.Label className="m-0 fw-semibold" htmlFor="email">
                  Email:
                </Form.Label>
                <Form.Control
                  type="email"
                  id="email"
                  placeholder="Enter Email"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col lg={6} xl={6} md={12} sm={12} xs={12}>
              <Form.Group>
                <Form.Label
                  className="m-0 fw-semibold"
                  htmlFor="pickup-address"
                >
                  Pickup Address:
                </Form.Label>
                <Form.Control
                  type="text"
                  id="pickup-address"
                  placeholder="Enter Pickup Address"
                />
              </Form.Group>
            </Col>
            <Col lg={6} xl={6} md={12} sm={12} xs={12}>
              <Form.Group>
                <Form.Label
                  className="m-0 fw-semibold"
                  htmlFor="dropoff-address"
                >
                  Dropoff Address:
                </Form.Label>
                <Form.Control
                  type="text"
                  id="dropoff-address"
                  placeholder="Enter Dropoff Address"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col lg={6} xl={6} md={12} sm={12} xs={12}>
              <Form.Group>
                <Form.Label className="m-0 fw-semibold" htmlFor="notes">
                  Notes:
                </Form.Label>
                <textarea
                  cols="30"
                  rows="5"
                  id="notes"
                  className="form-control"
                  placeholder="Enter Notes"
                ></textarea>
              </Form.Group>
            </Col>
            <Col lg={6} xl={6} md={12} sm={12} xs={12}>
              <Form.Group>
                <Form.Label className="m-0 fw-semibold" htmlFor="suitcases">
                  Suitcases:
                </Form.Label>
                <Form.Select id="suitcases">
                  <option value="1" key="1">
                    1
                  </option>
                  <option value="2" key="2">
                    2
                  </option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col lg={6} xl={6} md={12} sm={12} xs={12}>
              <Form.Group>
                <div className="d-flex align-items-center gap-3 mb-1">
                  <Form.Label className="m-0 fw-semibold" htmlFor="Captcha">
                    Captcha:
                  </Form.Label>
                  <div
                    className="bg-secondary p-3 py-1 text-white"
                    style={{
                      position: "relative",
                      display: "inline-block",
                      padding: "0.5rem",
                      backgroundColor: "#6c757d",
                      color: "#fff",
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      userSelect: "none",
                      cursor: "default",
                      pointerEvents: "none",
                      overflow: "hidden",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: "10%",
                        left: "40%",
                        transform: "rotate(-10deg)",
                        color: "rgba(255,255,255,0.3)",
                        fontSize: "1.5rem",
                      }}
                    >
                      |
                    </span>
                    <span
                      style={{
                        position: "absolute",
                        top: "-20%",
                        left: "10%",
                        transform: "rotate(-40deg)",
                        color: "rgba(255,255,255,0.3)",
                        fontSize: "2.5rem",
                      }}
                    >
                      |
                    </span>
                    <span
                      style={{
                        position: "absolute",
                        top: "-20%",
                        right: "10%",
                        transform: "rotate(-40deg)",
                        color: "rgba(255,255,255,0.3)",
                        fontSize: "2.5rem",
                      }}
                    >
                      |
                    </span>
                    <span
                      style={{
                        position: "absolute",
                        bottom: "20%",
                        right: "20%",
                        transform: "rotate(15deg)",
                        color: "rgba(255,255,255,0.4)",
                        fontSize: "1.5rem",
                      }}
                    >
                      /
                    </span>
                    <span
                      style={{
                        fontFamily: "Courier New, Courier, monospace",
                      }}
                    >
                      X5U0I9ME
                    </span>
                  </div>

                  <Button
                    className="p-0 bg-transparent border-0 outline-none text-primary"
                    title="Generate New Captcha Code"
                  >
                    <ArrowRepeat size={24} />
                  </Button>
                </div>
                <Form.Control
                  type="text"
                  id="Captcha"
                  placeholder="Enter Captcha Code"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </div>

      <Row className="mt-5">
        <Col>
          <Button variant="dark" className="px-3 py-2 fw-semibold">
            Back
          </Button>
        </Col>
        <Col className="justify-content-end d-flex">
          <Button className="px-3 py-2 fw-semibold">Next</Button>
        </Col>
      </Row>
    </div>
  );
};

export default PersonalDetails;
