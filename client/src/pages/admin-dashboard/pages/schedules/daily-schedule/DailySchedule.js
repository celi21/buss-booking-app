import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Col,
  Container,
  Dropdown,
  FormControl,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchBuses } from "../../../../../store/slices/BusSlice";
import LoadingSpinner from "../../../../../components/loading-spinner/LoadingSpinner";
import { fetchRoutes } from "../../../../../store/slices/RoutesSlice";

const DailySchedule = () => {
  const getCurrentDate = () => {
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + month + "-" + day;
    return today;
  };
  const getFullDayName = (number) => {
    const days = {
      0: "Sunday",
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday",
      7: "Sunday",
    };
    return days[number];
  };

  const { isBusesLoading, buses } = useSelector((state) => state.bus);
  const { routes, isRoutesLoading } = useSelector((state) => state.routes);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [date, setDate] = useState(getCurrentDate());
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [tripsData, setTripsData] = useState([]);
  const [isTripsLoading, setIsTripsLoading] = useState(false);

  const fetchTripsForDate = async (targetDate) => {
    if (!targetDate) return;
    try {
      setIsTripsLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/booking/get-dispatch-trips`,
        { date: targetDate },
        config
      );
      if (response.data && response.data.success) {
        setTripsData(response.data.data.trips || []);
      }
    } catch (err) {
      console.error("Failed to load schedule trips:", err);
    } finally {
      setIsTripsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchBuses());
    dispatch(fetchRoutes());
    const cur = getCurrentDate();
    setDate(cur);
    fetchTripsForDate(cur);
  }, []);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    fetchTripsForDate(newDate);
  };

  const filteredBuses = buses
    .filter((bus) => {
      if (!bus.periodStartDate || !bus.periodEndDate || !date) return false;
      const [sY, sM, sD] = bus.periodStartDate.split("-").map(Number);
      const periodStartDate = new Date(sY, sM - 1, sD);
      const [eY, eM, eD] = bus.periodEndDate.split("-").map(Number);
      const periodEndDate = new Date(eY, eM - 1, eD);

      const [y, m, d] = date.split("-").map(Number);
      const checkDate = new Date(y, m - 1, d);
      const checkDay = getFullDayName(checkDate.getDay());

      // Check if checkDate is within the start and end dates
      const isDateInRange =
        checkDate >= periodStartDate && checkDate <= periodEndDate;

      // Check if the recurring day matches checkDay and has checked: true
      const isRecurringChecked = bus.recurring?.some(
        (rec) => rec.name === checkDay && rec.checked === true
      );

      // Also include if there are bookings for this bus on this date
      const hasBookingsOnDate = tripsData.some(
        (t) => t.busId === bus._id && t.passengers > 0
      );

      // Return true if conditions are met or has bookings
      return (isDateInRange && isRecurringChecked) || hasBookingsOnDate;
    })
    .filter((bus) => {
      return selectedRoute ? bus.route?._id === selectedRoute : bus;
    });

  return (
    <Container fluid>
      {isBusesLoading || isRoutesLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Row className="mb-3">
            <Col md="auto">
              <Button
                variant="light"
                className="border fw-semibold d-flex align-items-center"
                onClick={() => {
                  handleDateChange(getCurrentDate());
                }}
              >
                Today
              </Button>
            </Col>
            <Col md="auto">
              <InputGroup>
                <FormControl
                  type="date"
                  value={date}
                  onChange={(e) => {
                    handleDateChange(e.target.value);
                  }}
                />
              </InputGroup>
            </Col>
            <Col className="d-flex justify-content-end align-items-center gap-3">
              <div>Filter by route:</div>
              <Row className="d-flex flex-row">
                <div className="w-100">
                  <select
                    className="form-select"
                    defaultValue={selectedRoute}
                    onChange={(e) => {
                      setSelectedRoute(e.target.value);
                    }}
                  >
                    <option value="" key="">
                      Choose
                    </option>
                    {routes?.map((r) => (
                      <option
                        value={r._id}
                        key={r._id}
                        defaultValue={r._id}
                        selected={selectedRoute == r._id}
                      >
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </Row>
            </Col>
          </Row>

          <Row>
            <Table hover striped responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Bus</th>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>FT Tickets (Available)</th>
                  <th>Total Tickets (Booked)</th>
                </tr>
              </thead>
              <tbody>
                {filteredBuses.map((bus, index) => {
                  const tripInfo = tripsData.find((t) => t.busId === bus._id);
                  const bookedTickets = tripInfo ? tripInfo.passengers : 0;
                  const availableSeats = tripInfo ? tripInfo.availableSeats : (bus.busType?.seats || 10);

                  return (
                    <tr key={bus._id}>
                      <td>{index + 1}</td>
                      <td className="fw-semibold">{bus.route?.name || 'N/A'}</td>
                      <td>
                        {bus.locations && bus.locations.length > 0
                          ? bus.locations[0].departureTime
                          : 'N/A'}
                      </td>
                      <td>
                        {bus.locations && bus.locations.length > 0
                          ? bus.locations[bus.locations.length - 1].arrivalTime
                          : 'N/A'}
                      </td>
                      <td>
                        <span className="fw-semibold text-secondary">
                          {availableSeats}
                        </span>
                      </td>
                      <td>
                        {bookedTickets > 0 ? (
                          <Badge bg="success" className="fs-6 fw-semibold px-2 py-1">
                            {bookedTickets} Booked
                          </Badge>
                        ) : (
                          <span className="text-muted fw-semibold">0</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredBuses.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No Buses found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Row>
        </>
      )}
    </Container>
  );
};

export default DailySchedule;
