import React from "react";
import { Button, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import {
  ChevronDoubleLeft,
  ChevronDoubleRight,
  QuestionCircleFill,
} from "react-bootstrap-icons";

const Tickets = () => {
  return (
    <div className="bg-light border p-3 rounded w-100">
      <Row className="m-0 p-0">
        <div>
          <p>
            Journey from{" "}
            <span className="fw-bold text-primary">
              1218 St Nicholas Ave Pablo Express (Near McDonalds)
            </span>{" "}
            to{" "}
            <span className="fw-bold text-primary">
              UPSTATE*(UTICA and Surrounding Areas)
            </span>
          </p>
        </div>
      </Row>

      <Row className="m-0 p-0">
        <div className="d-flex justify-content-end flex-row align-items-center gap-1">
          <div>Date of Departure:</div>
          <Button className="p-0 bg-transparent border-0 outline-none text-primary">
            <ChevronDoubleLeft className="p-0 m-0" size={12} />
            prev
          </Button>
          <div className="fw-bold">09-10-2024</div>
          <Button className="p-0 bg-transparent border-0 outline-none text-primary">
            next
            <ChevronDoubleRight className="p-0 m-0" size={12} />
          </Button>
        </div>
      </Row>

      <Row className="mt-3">
        <Table responsive className="shadow-sm">
          <thead className="bg-dark text-white">
            <tr>
              <th>Bus</th>
              <th>Available Seats</th>
              <th>Departure time</th>
              <th>Arrival time</th>
              <th>Duration</th>
            </tr>
          </thead>

          <tbody>
            <tr className="bg-white">
              <td>
                <div className="d-flex justify-content-between align-items-center">
                  <div>NYC TO UPSTATE</div>
                  <Button className="p-0 bg-transparent border-0 outline-none text-primary">
                    <QuestionCircleFill />
                  </Button>
                </div>
              </td>
              <td>7</td>
              <td>09-11-2024, 12:00 PM</td>
              <td>09-11-2024, 04:30 PM</td>
              <td>4 hours 30 minutes</td>
            </tr>

            <tr key="" className="bg-white">
              <td></td>
              <td>
                <Form.Label htmlFor="adults-seats" className="fw-bold">
                  ADULT(S)
                </Form.Label>
                <InputGroup className="mb-3">
                  <Form.Select id="adults-seats">
                    <option>1</option>
                    <option>2</option>
                  </Form.Select>
                  <InputGroup.Text className="fw-semibold">
                    x $55.00
                  </InputGroup.Text>
                </InputGroup>
              </td>
              <td>
                <Form.Label htmlFor="infants-seats" className="fw-bold">
                  INFANTS (0-1 YR)
                </Form.Label>
                <InputGroup className="mb-3">
                  <Form.Select id="infants-seats">
                    <option>1</option>
                    <option>2</option>
                  </Form.Select>
                  <InputGroup.Text className="fw-semibold">
                    x $44
                  </InputGroup.Text>
                </InputGroup>
              </td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </Table>
      </Row>

      <Row>
        <div className="d-flex justify-content-end flex-row align-items-center gap-1">
          <div className="fs-4 fw-semibold">Total Price: $780.10</div>
        </div>
      </Row>

      <Row className="mt-3">
        <Col>
          <Button variant="dark" className="px-3 py-2 fw-semibold">
            Back
          </Button>
        </Col>
        <Col className="justify-content-end d-flex">
          <Button className="px-3 py-2 fw-semibold">Checkout</Button>
        </Col>
      </Row>
    </div>
  );
};

export default Tickets;
