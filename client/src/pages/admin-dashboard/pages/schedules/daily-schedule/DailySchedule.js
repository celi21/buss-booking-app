import React, { useEffect, useState } from "react";
import {
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
  const dispatch = useDispatch();
  const [date, setDate] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    dispatch(fetchBuses());
    dispatch(fetchRoutes());
    setDate(getCurrentDate());
  }, []);

  const filteredBuses = buses
    .filter((bus) => {
      let periodStartDate = new Date(bus.periodStartDate);
      let periodEndDate = new Date(bus.periodEndDate);
      let checkDate = new Date(date);
      let checkDay = getFullDayName(checkDate.getDay());

      // Check if checkDate is within the start and end dates
      const isDateInRange =
        checkDate >= periodStartDate && checkDate <= periodEndDate;

      // Check if the recurring day matches checkDay and has checked: true
      const isRecurringChecked = bus.recurring.some(
        (rec) => rec.name === checkDay && rec.checked === true
      );

      // Return true if both conditions are met
      return isDateInRange && isRecurringChecked;
    })
    .filter((bus) => {
      return selectedRoute ? bus.route._id === selectedRoute : bus;
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
                  setDate(getCurrentDate());
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
                    setDate(e.target.value);

                    console.log(e.target.value);
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
            <Table hover striped>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Bus</th>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>FT Tickets</th>
                  <th>Total Tickets</th>
                  {/* <th>Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {filteredBuses.map((bus, index) => {
                  return (
                    <tr key={bus._id}>
                      <td>{index + 1}</td>
                      <td>{bus.route.name}</td>
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
                      <td>{index}</td>
                      <td>{index}</td>
                      {/* <td>
                        <div className="d-flex flex-row gap-2">
                          <Button
                            size="sm"
                            className="border border-secondary"
                            variant="light"
                          >
                            Add Booking
                          </Button>
                          <Dropdown
                            size="sm"
                            drop="down"
                            popperConfig={{
                              modifiers: [
                                {
                                  name: "preventOverflow",
                                  options: { boundary: "viewport" },
                                },
                              ],
                            }}
                          >
                            <Dropdown.Toggle
                              variant="light"
                              className="border border-secondary"
                              id="dropdown-basic"
                            ></Dropdown.Toggle>

                            <Dropdown.Menu
                              style={{
                                position: "absolute",
                                zIndex: 1000,
                              }}
                            >
                              <Dropdown.Item>Action</Dropdown.Item>
                              <Dropdown.Item>Another action</Dropdown.Item>
                              <Dropdown.Item>Something else</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </td> */}
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
