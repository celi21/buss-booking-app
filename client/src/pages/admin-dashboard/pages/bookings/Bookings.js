import React, { useEffect, useState } from "react";
import {
  Accordion,
  Button,
  Col,
  Container,
  Form,
  FormControl,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import { ChevronDown, Plus, Search } from "react-bootstrap-icons";
import "./bookings.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminBookings } from "../../../../store/slices/bookingSlice";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import { fetchRoutes } from "../../../../store/slices/RoutesSlice";
import { fetchBuses } from "../../../../store/slices/BusSlice";
import BookingRow from "./booking-row/BookingRow";

const Bookings = () => {
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const { adminBookings, isAdminBookingsLoading } = useSelector(
    (state) => state.booking
  );
  const { routes } = useSelector((state) => state.routes);
  const { buses } = useSelector((state) => state.bus);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRoute, setFilterRoute] = useState("");
  const [filterBus, setFilterBus] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");

  useEffect(() => {
    dispatch(fetchBuses());
    dispatch(fetchRoutes());
    dispatch(fetchAdminBookings());
  }, []);

  const filteredBookings = adminBookings?.filter((booking) => {
    const matchesSearch =
      search.trim() === "" ||
      booking.personalDetails?.firstName
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      booking.personalDetails?.lastName
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      booking.personalDetails?.email
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || booking.status === filterStatus;

    const matchesRoute =
      filterRoute === "" || booking.route._id === filterRoute;
    const matchesBus = filterBus === "" || booking.bus._id === filterBus;

    let isDateInRange = true;
    if (filterFromDate !== "" && filterToDate !== "") {
      let StartDate = new Date(filterFromDate);
      let EndDate = new Date(filterToDate);
      let checkDate = new Date(booking.bookingDate);
      isDateInRange = checkDate >= StartDate && checkDate <= EndDate;
    }

    return (
      matchesSearch &&
      matchesStatus &&
      matchesRoute &&
      matchesBus &&
      isDateInRange
    );
  });

  console.log(filteredBookings);

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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
              <select
                className="form-select w-100"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="refunded">Refunded</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </Row>
        </Col>
      </Row>

      {showMoreOptions && (
        <Row>
          <div
            className="shadow-sm border rounded p-4"
            style={{
              fontSize: 14,
            }}
          >
            <Row className="mb-2">
              <Col>
                <Row>
                  <Col lg={3} md={3} xl={3} sm={3} xs={3}>
                    From
                  </Col>
                  <Col>
                    <FormControl
                      type="date"
                      value={filterFromDate}
                      onChange={(e) => setFilterFromDate(e.target.value)}
                    />
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row>
                  <Col lg={3} md={3} xl={3} sm={3} xs={3}>
                    To
                  </Col>
                  <Col>
                    <FormControl
                      type="date"
                      value={filterToDate}
                      onChange={(e) => setFilterToDate(e.target.value)}
                      min={filterFromDate}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row>
              <Col>
                <Row>
                  <Col lg={3} md={3} xl={3} sm={3} xs={3}>
                    Route
                  </Col>
                  <Col>
                    <Form.Select
                      onChange={(e) => setFilterRoute(e.target.value)}
                    >
                      <option value="" key="">
                        Choose
                      </option>
                      {routes.map((route) => {
                        return (
                          <option value={route._id} key={route._id}>
                            {route.name}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row>
                  <Col lg={3} md={3} xl={3} sm={3} xs={3}>
                    Bus
                  </Col>
                  <Col>
                    <Form.Select onChange={(e) => setFilterBus(e.target.value)}>
                      <option value="" key="">
                        Choose
                      </option>
                      {buses.map((bus, index) => (
                        <option value={bus._id} key={bus._id}>
                          {bus.route?.name || 'N/A'}{" "}
                          {bus.locations && bus.locations.length > 0
                            ? `${bus.locations[0].departureTime} - ${bus.locations[bus.locations.length - 1].arrivalTime}`
                            : 'N/A'}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>
              </Col>
            </Row>

            <div className="d-flex align-items-center justify-content-center flex-row gap-2 mt-3">
              <Button variant="light" className="border border-secondary">
                Search
              </Button>
              <Button
                variant="light"
                className="border border-secondary"
                onClick={() => setShowMoreOptions(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Row>
      )}

      <Table responsive hover striped className="mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th className="text-nowrap">Client</th>
            <th className="text-nowrap">Date / Time</th>
            <th className="text-nowrap">Bus / Route</th>
            <th className="text-nowrap">Status</th>
            <th className="text-nowrap">Actions</th>
          </tr>
        </thead>
        {isAdminBookingsLoading ? (
          <LoadingSpinner />
        ) : (
          <tbody
            style={{
              verticalAlign: "middle",
            }}
          >
            {filteredBookings.map((booking, index) => {
              return <BookingRow booking={booking} key={index} index={index} />;
            })}
          </tbody>
        )}
      </Table>
    </Container>
  );
};

export default Bookings;
