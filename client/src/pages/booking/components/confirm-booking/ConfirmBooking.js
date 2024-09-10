import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { ArrowRepeat } from "react-bootstrap-icons";

const ConfirmBooking = () => {
  return (
    <div className="bg-light border p-3 rounded w-100">
      <p className="fs-4 fw-semibold text-center border-bottom pb-3">
        Please Confirm your Details.
      </p>
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
        <div>
          <Row className="mb-3">
            <Col lg={6} xl={6} md={12} sm={12} xs={12}>
              <div>
                <Form.Label className="m-0" htmlFor="firstName">
                  First Name:
                </Form.Label>
                <div className="fw-semibold">john</div>
              </div>
            </Col>
            <Col lg={6} xl={6} md={12} sm={12} xs={12}>
              <div>
                <Form.Label className="m-0" htmlFor="lastName">
                  Last Name:
                </Form.Label>
                <div className="fw-semibold"></div>
              </div>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col lg={6} xl={6} md={12} sm={12} xs={12}>
              <div>
                <Form.Label className="m-0" htmlFor="phone">
                  Phone:
                </Form.Label>
                <div className="fw-semibold">+9278782789</div>
              </div>
            </Col>
            <Col lg={6} xl={6} md={12} sm={12} xs={12}>
              <div>
                <Form.Label className="m-0" htmlFor="email">
                  Email:
                </Form.Label>
                <div className="fw-semibold">John@gmail.com</div>
              </div>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col lg={6} xl={6} md={12} sm={12} xs={12}>
              <div>
                <Form.Label className="m-0" htmlFor="pickup-address">
                  Pickup Address:
                </Form.Label>
                <div className="fw-semibold">japan</div>
              </div>
            </Col>
            <Col lg={6} xl={6} md={12} sm={12} xs={12}>
              <div>
                <Form.Label className="m-0" htmlFor="dropoff-address">
                  Dropoff Address:
                </Form.Label>
                <div className="fw-semibold">Korea</div>
              </div>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col lg={6} xl={6} md={12} sm={12} xs={12}>
              <div>
                <Form.Label className="m-0" htmlFor="notes">
                  Notes:
                </Form.Label>
                <p className="fw-semibold">
                  lorem ipsum lorem ipsum lorem ipsum lorem ipsum
                </p>
              </div>
            </Col>
            <Col lg={6} xl={6} md={12} sm={12} xs={12}>
              <div>
                <Form.Label className="m-0" htmlFor="suitcases">
                  Suitcases:
                </Form.Label>
                <div className="fw-semibold">13</div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <Row className="mt-5">
        <Col>
          <Button variant="dark" className="px-3 py-2 fw-semibold">
            Back
          </Button>
        </Col>
        <Col className="justify-content-end d-flex">
          <Button className="px-3 py-2 fw-semibold">Go to Payment</Button>
        </Col>
      </Row>
    </div>
  );
};

export default ConfirmBooking;
