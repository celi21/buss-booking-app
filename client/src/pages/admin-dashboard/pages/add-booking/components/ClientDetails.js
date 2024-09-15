import React, { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

const ClientDetails = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  phone,
  setPhone,
  email,
  setEmail,
  pickupAddress,
  setPickupAddress,
  dropoffAddress,
  setDropoffAddress,
  suitcases,
  setSuitcases,
  notes,
  setNotes,
}) => {
  return (
    <Container fluid>
      <Row className="mb-4">
        <Col lg={3} md={6} sm={6}>
          First Name:<span className="text-danger ms-1">*</span>
        </Col>
        <Col lg={4} md={6} sm={6}>
          <Form.Control
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter first name"
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={3} md={6} sm={6}>
          Last Name:
        </Col>
        <Col lg={4} md={6} sm={6}>
          <Form.Control
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter last name"
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={3} md={6} sm={6}>
          Phone:<span className="text-danger ms-1">*</span>
        </Col>
        <Col lg={4} md={6} sm={6}>
          <Form.Control
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={3} md={6} sm={6}>
          Email:<span className="text-danger ms-1">*</span>
        </Col>
        <Col lg={4} md={6} sm={6}>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={3} md={6} sm={6}>
          Pickup Address:<span className="text-danger ms-1">*</span>
        </Col>
        <Col lg={4} md={6} sm={6}>
          <Form.Control
            type="text"
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
            placeholder="Enter pickup address"
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={3} md={6} sm={6}>
          Dropoff Address:<span className="text-danger ms-1">*</span>
        </Col>
        <Col lg={4} md={6} sm={6}>
          <Form.Control
            type="text"
            value={dropoffAddress}
            onChange={(e) => setDropoffAddress(e.target.value)}
            placeholder="Enter dropoff address"
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={3} md={6} sm={6}>
          Suitcases:
        </Col>
        <Col lg={4} md={6} sm={6}>
          <Form.Select
            value={suitcases}
            onChange={(e) => setSuitcases(e.target.value)}
          >
            {Array.from({ length: 20 }, (_, i) => i).map((i) => {
              return (
                <option value={i} key={i}>
                  {i}
                </option>
              );
            })}
          </Form.Select>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={3} md={6} sm={6}>
          Notes:
        </Col>
        <Col lg={4} md={6} sm={6}>
          <textarea
            cols="30"
            rows="10"
            className="form-control"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter any additional notes"
          ></textarea>
        </Col>
      </Row>
    </Container>
  );
};

export default ClientDetails;
