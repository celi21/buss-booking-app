import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  FormControl,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../../../../../components/loading-spinner/LoadingSpinner";
import { fetchRoutes } from "../../../../../store/slices/RoutesSlice";

const RouteTimetable = () => {
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
      0: "Sunday",
    };
    return days[number];
  };

  function getWeek(fromDate) {
    var day = fromDate.getDay();
    var diff = fromDate.getDate() - (day === 0 ? 6 : day - 1);
    var monday = new Date(fromDate.setDate(diff)),
      result = [new Date(monday)];
    while (monday.setDate(monday.getDate() + 1) && monday.getDay() !== 1) {
      result.push(new Date(monday));
    }
    return result;
  }

  const { buses } = useSelector((state) => state.bus);
  const { routes, isRoutesLoading } = useSelector((state) => state.routes);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [currentRouteData, setCurrentRouteData] = useState(null);
  const [departureTime, setDepartureTime] = useState(null);
  const [date, setDate] = useState(null);
  const dispatch = useDispatch();
  const [week, setWeek] = useState([]);

  useEffect(() => {
    setDate(getCurrentDate());
    dispatch(fetchRoutes());
    setWeek(getWeek(new Date(getCurrentDate())));
  }, []);

  useEffect(() => {
    if (routes.length > 0) {
      console.log(routes);
      setSelectedRoute(routes[0]._id);
    }
  }, [routes]);

  useEffect(() => {
    if (selectedRoute) {
      let findRoute = buses.find((b) => b.route?._id === selectedRoute);
      let bus = buses?.find((b) => b.route?._id === selectedRoute);
      if (bus) {
        console.log(bus);
        setDepartureTime(bus?.locations?.[0]?.departureTime);
      }
      if (findRoute) {
        setCurrentRouteData(findRoute);
      }
    }
  }, [selectedRoute, buses]);

  const checkIfCurrentDateInBetween = (
    periodStartDate,
    periodEndDate,
    day,
    recurring
  ) => {
    let StartDate = new Date(periodStartDate);
    let EndDate = new Date(periodEndDate);
    let checkDate = new Date(date);

    // Check if checkDate is within the start and end dates
    const isDateInRange = checkDate >= StartDate && checkDate <= EndDate;

    // Check if the recurring day matches checkDay and has checked: true
    let isOperatingOnDay = recurring.find(
      (rec) => rec.name === getFullDayName(day) && rec.checked == true
    );

    // Return true if both conditions are met
    return isDateInRange && isOperatingOnDay;
  };

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col
          className="d-flex justify-content-end align-items-center gap-3"
          md="auto"
        >
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
        <Col md="auto">
          <InputGroup>
            <FormControl
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setWeek(getWeek(new Date(e.target.value)));
              }}
            />
          </InputGroup>
        </Col>
        <Col md="auto">
          <Button
            variant="light"
            className="border fw-semibold d-flex align-items-center"
            onClick={() => {
              setDate(getCurrentDate());
              setWeek(getWeek(new Date(date)));
            }}
          >
            Today
          </Button>
        </Col>
      </Row>

      {isRoutesLoading ? (
        <LoadingSpinner />
      ) : (
        <Row>
          <Table hover striped>
            <thead>
              <tr>
                <th className="fw-normal">Bus</th>
                {week.map((w) => {
                  return (
                    <th
                      className={
                        w.getDay() == new Date(date).getDay()
                          ? "fw-bold"
                          : "fw-normal"
                      }
                    >
                      {getFullDayName(w.getDay())} <br />
                      {`${w.getDate()}/${w.getMonth() + 1}/${w.getFullYear()}`}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <tr key="">
                <td>{currentRouteData?.route?.name || 'N/A'}</td>
                {currentRouteData &&
                  week.map((w) => {
                    let checkDate = checkIfCurrentDateInBetween(
                      currentRouteData?.periodStartDate,
                      currentRouteData?.periodEndDate,
                      w.getDay(),
                      currentRouteData?.recurring
                    );
                    if (checkDate) {
                      return (
                        <td
                          className={
                            w.getDay() == new Date(date).getDay()
                              ? "fw-bold"
                              : "fw-normal"
                          }
                        >
                          {departureTime}
                        </td>
                      );
                    } else {
                      return <td></td>;
                    }
                  })}
              </tr>
              {/* {filteredBuses.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center">
                  No Buses found
                </td>
              </tr>
            )} */}
            </tbody>
          </Table>
        </Row>
      )}
    </Container>
  );
};

export default RouteTimetable;
