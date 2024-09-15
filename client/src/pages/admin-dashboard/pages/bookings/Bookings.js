import React, { useState } from "react";
import {
  Accordion,
  Button,
  Col,
  Container,
  FormControl,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import { ChevronDown, Plus, Search } from "react-bootstrap-icons";
import "./bookings.css";
import { Link } from "react-router-dom";

const Bookings = () => {
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  return (
    <Container fluid>
      <Row className="mb-3 position-relative">
        <Col md="auto">
          <Link
            className="border fw-semibold d-flex align-items-center btn btn-light"
            to="/admin/add-booking"
          >
            <Plus size={20} />
            Add Booking
          </Link>
        </Col>
        <Col md="auto">
          <div className="d-flex flex-row gap-2">
            <InputGroup>
              <FormControl
                placeholder="Search..."
                aria-label="Search"
                // value={search}
                // onChange={(e) => setSearch(e.target.value)}
              />
              <InputGroup.Text id="search-icon" className="bg-transparent">
                <Search />
              </InputGroup.Text>
            </InputGroup>
            <Button
              variant="light"
              className="border text-black"
              onClick={() => {
                setShowMoreOptions(!showMoreOptions);
              }}
            >
              <ChevronDown />
            </Button>
          </div>
        </Col>

        <Col className="d-flex justify-content-end align-items-center gap-3">
          <div>Filter by:</div>
          <Row className="d-flex flex-row">
            <div className="w-100">
              <select className="form-select w-100">
                <option value="all">All</option>
                <option value="all">All All</option>
              </select>
            </div>
          </Row>
        </Col>
      </Row>

      {showMoreOptions && (
        <Row>
          <div className="shadow-sm border rounded p-4">
            <p>
              lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem
              ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
            </p>
          </div>
        </Row>
      )}

      <Table responsive hover striped className="mt-4">
        <thead>
          <tr>
            <th className="text-nowrap">#</th>
            <th className="text-nowrap">Client</th>
            <th className="text-nowrap">Date / Time</th>
            <th className="text-nowrap">Bus / Route</th>
            <th className="text-nowrap">Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody></tbody>
      </Table>
    </Container>
  );
};

export default Bookings;
