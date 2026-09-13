import React, { useEffect, useState } from "react";
import { Button, Col, Container, FormControl, InputGroup, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../../../../../components/loading-spinner/LoadingSpinner";
import { fetchPassengersList } from "../../../../../store/slices/bookingSlice";
import { Link } from "react-router-dom";

const PassengersList = () => {
  const getCurrentDate = () => {
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + month + "-" + day;
    return today;
  };

  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedStartLocation, setSelectedStartLocation] = useState(null);
  const { buses, isBusesLoading } = useSelector((state) => state.bus);
  const { passengersList, isPassengersListLoading } = useSelector(
    (state) => state.booking
  );
  const [busLocations, setBusLocations] = useState([]);
  const dispatch = useDispatch();

  const handleBusChange = (busId, date = selectedDate) => {
    if (!busId) return;

    setSelectedBus(busId);
    dispatch(fetchPassengersList({ busId, date }));
    setBusLocations(buses.find((bus) => bus._id === busId)?.locations || []);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    if (selectedBus) {
      dispatch(fetchPassengersList({ busId: selectedBus, date: newDate }));
    }
  };

  useEffect(() => {
    if (buses.length > 0) {
      const initialBus = selectedBus || buses[0]._id;
      setSelectedBus(initialBus);
      setBusLocations(buses.find((b) => b._id === initialBus)?.locations || buses[0].locations);
      dispatch(fetchPassengersList({ busId: initialBus, date: selectedDate }));
    }
  }, [buses]);

  const filteredPassengersList = passengersList.filter((p) => {
    if (!selectedStartLocation) return p;
    else if (p.from?._id === selectedStartLocation) return p;
  });

  let totalPassengers = 0;
  let seatsTypes = {};

  filteredPassengersList.forEach((p) => {
    p.seatDetails?.forEach((s) => {
      totalPassengers += s.seats;
      if (s.name in seatsTypes) {
        seatsTypes[s.name] += s.seats;
      } else {
        seatsTypes[s.name] = s.seats;
      }
    });
  });

  return (
    <Container fluid>
      <div className="fw-semibold mb-2">Assigned Date: {selectedDate}</div>

      <Row className="mb-3 g-2 align-items-center">
        <Col md="auto">
          <Button
            variant="light"
            className="border fw-semibold d-flex align-items-center"
            onClick={() => handleDateChange(getCurrentDate())}
          >
            Today
          </Button>
        </Col>
        <Col md="auto">
          <InputGroup>
            <FormControl
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md="auto" className="d-flex justify-content-start align-items-center gap-2">
          <div>Bus:</div>
          <div>
            <select
              className="form-select w-auto"
              value={selectedBus || ""}
              onChange={(e) => {
                handleBusChange(e.target.value);
              }}
            >
              {buses?.map((bus) => (
                <option
                  value={bus._id}
                  key={bus._id}
                >
                  {bus.route?.name || 'N/A'},{" "}
                  {bus.locations && bus.locations.length > 0
                    ? `${bus.locations[0].departureTime} - ${bus.locations[bus.locations.length - 1].arrivalTime}`
                    : 'N/A'}
                </option>
              ))}
            </select>
          </div>
        </Col>
        <Col md="auto" className="d-flex justify-content-start align-items-center gap-2">
          <div className="text-nowrap">Start Location:</div>
          <div>
            <select
              className="form-select w-auto"
              value={selectedStartLocation || ""}
              onChange={(e) => {
                setSelectedStartLocation(e.target.value);
              }}
            >
              <option value="" key="">
                Choose
              </option>
              {busLocations?.map((loc) => (
                <option
                  value={loc.city._id}
                  key={loc.city._id}
                  defaultValue={loc.city._id}
                  selected={selectedStartLocation == loc.city._id}
                >
                  {loc.city.name}
                </option>
              ))}
            </select>
          </div>
        </Col>
      </Row>

      <div className="mb-5 d-flex flex-column gap-2">
        <Row>
          <Col lg={3} xl={3} sm={6} md={3} xs={6}>
            Total Passengers:
          </Col>
          <Col>{totalPassengers}</Col>
        </Row>
        {Object.keys(seatsTypes).map((seat) => {
          return (
            <Row>
              <Col lg={3} xl={3} sm={6} md={3} xs={6}>
                {seat}
              </Col>
              <Col>{seatsTypes[seat]}</Col>
            </Row>
          );
        })}
        <Row>
          <Col lg={3} xl={3} sm={6} md={3} xs={6}>
            Total Bookings:
          </Col>
          <Col>{filteredPassengersList.length}</Col>
        </Row>
      </div>

      {isBusesLoading || isPassengersListLoading ? (
        <LoadingSpinner />
      ) : (
        <Row>
          <Table hover striped>
            <thead>
              <th>Client</th>
              <th>Phone</th>
              <th>From</th>
              <th>To</th>
              <th>Tickets</th>
            </thead>
            <tbody>
              {filteredPassengersList.map((p, index) => {
                return (
                  <tr key={p._id}>
                    <td className="text-nowrap">
                      <Link
                        to={p.bookingId ? `/admin/edit-booking/${p.bookingId}` : `/booking/${p._id}`}
                        className="text-primary text-decoration-underline"
                      >
                        {p.personalDetails.firstName +
                          " " +
                          (p.personalDetails.lastName == null
                            ? ""
                            : p.personalDetails.lastName)}
                      </Link>
                    </td>
                    <td className="text-nowrap">{p.personalDetails.phone}</td>
                    <td>{p.from.name}</td>
                    <td>{p.to.name}</td>
                    <td className="text-nowrap">
                      {p.seatDetails.map((s, index) => {
                        if (s.seats > 0) {
                          return (
                            <div>
                              {s.name} x {s.seats}
                            </div>
                          );
                        }
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          {filteredPassengersList.length === 0 && <div>No Data Found</div>}
        </Row>
      )}
    </Container>
  );
};

export default PassengersList;
