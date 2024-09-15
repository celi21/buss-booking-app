import React from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

const ClientDetails = () => {
  return (
    <Container fluid>
      <Row className="mb-4">
        <Col lg={3} md={6} sm={6}>
          First Name:
        </Col>
        <Col lg={4} md={6} sm={6}>
          <Form.Control type="text" />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={3} md={6} sm={6}>
          Last Name:
        </Col>
        <Col lg={4} md={6} sm={6}>
          <Form.Control type="text" />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={3} md={6} sm={6}>
          Phone:
        </Col>
        <Col lg={4} md={6} sm={6}>
          <Form.Control type="text" />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={3} md={6} sm={6}>
          Email:
        </Col>
        <Col lg={4} md={6} sm={6}>
          <Form.Control type="email" />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={3} md={6} sm={6}>
          Pickup Address:
        </Col>
        <Col lg={4} md={6} sm={6}>
          <Form.Control type="text" />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={3} md={6} sm={6}>
          Dropoff Address:
        </Col>
        <Col lg={4} md={6} sm={6}>
          <Form.Control type="text" />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={3} md={6} sm={6}>
          Suitcases:
        </Col>
        <Col lg={4} md={6} sm={6}>
          <Form.Select defaultValue={null}>
            <option value="" key="">
              Choose
            </option>
            <option>City</option>
          </Form.Select>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={3} md={6} sm={6}>
          Notes:
        </Col>
        <Col lg={4} md={6} sm={6}>
          <textarea cols="30" rows="10" className="form-control"></textarea>
        </Col>
      </Row>
    </Container>
  );
};

export default ClientDetails;
