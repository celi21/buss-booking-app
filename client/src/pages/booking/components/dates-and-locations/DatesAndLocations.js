import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { InfoCircleFill } from "react-bootstrap-icons";

const DatesAndLocations = ({ selectedDate, setSelectedDate }) => {
  const getCurrentDate = () => {
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + month + "-" + day;
    return today;
  };
  const [minCurrentDate, setMinCurrentDate] = useState(null);

  useEffect(() => {
    setMinCurrentDate(getCurrentDate());
  }, []);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    if (new Date(newDate) < new Date(minCurrentDate)) {
      setSelectedDate(minCurrentDate);
    } else {
      setSelectedDate(newDate);
    }
  };

  return (
    <div className="bg-light border p-3 rounded w-100">
      <Row>
        <Col xl={6} lg={6}>
          <Form.Group className="mb-3 w-100">
            <Form.Label>
              <span>Departing:</span>
              <InfoCircleFill
                title="Please Select a Booking Date"
                color="#aaa"
                size={13}
                className="ms-2"
              />
            </Form.Label>
            <Form.Control
              type="date"
              min={minCurrentDate}
              value={selectedDate}
              onChange={handleDateChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col xl={6} lg={6}>
          <Row>
            <Col xl={6} lg={6}>
              <Form.Group className="mb-3 w-100">
                <Form.Label>
                  <span>From:</span>
                  <InfoCircleFill
                    title="Please Choose your Starting City/Stop"
                    color="#aaa"
                    size={13}
                    className="ms-2"
                  />
                </Form.Label>
                <Form.Select aria-label="Default select example">
                  <option>Open this select menu</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col xl={6} lg={6}>
              <Form.Group className="mb-3 w-100">
                <Form.Label>
                  <span>To:</span>
                  <InfoCircleFill
                    title="Please Choose your Destination."
                    color="#aaa"
                    size={13}
                    className="ms-2"
                  />
                </Form.Label>
                <Form.Select aria-label="Default select example">
                  <option>Open this select menu</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          <Button className="px-3 py-2 fw-semibold">Check Availability</Button>
        </Col>
      </Row>
    </div>
  );
};

export default DatesAndLocations;
