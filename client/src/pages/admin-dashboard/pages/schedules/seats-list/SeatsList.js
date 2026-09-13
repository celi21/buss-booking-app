import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  FormControl,
  InputGroup,
  Overlay,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchPassengersList } from "../../../../../store/slices/bookingSlice";
import LoadingSpinner from "../../../../../components/loading-spinner/LoadingSpinner";
import SeatRow from "./components/SeatRow";

const SeatsList = () => {
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
      </Row>

      {isBusesLoading || isPassengersListLoading ? (
        <LoadingSpinner />
      ) : (
        <Row>
          <Table>
            <thead>
              <tr>
                {busLocations.map((loc, index) => {
                  return (
                    <th key={loc._id} className="border bg-light">
                      {loc.city.name} <br />
                      <div className="fw-normal text-nowrap">
                        {index === busLocations.length - 1 ? (
                          <div>Arrive: {loc.arrivalTime}</div>
                        ) : (
                          <div>Departure: {loc.departureTime}</div>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {passengersList.map((booking) => {
                // Find the indices of the from and to locations in busLocations
                const fromIndex = busLocations.findIndex(
                  (loc) => loc.city._id === booking.from._id
                );
                const toIndex = busLocations.findIndex(
                  (loc) => loc.city._id === booking.to._id
                );

                // Calculate the middle index
                const middleIndex = Math.floor((fromIndex + toIndex) / 2);

                return (
                  <tr key={booking._id}>
                    {busLocations.map((loc, index) => {
                      // Check if the current location is within the from-to range
                      if (index >= fromIndex && index <= toIndex) {
                        return (
                          <SeatRow
                            loc={loc}
                            index={index}
                            middleIndex={middleIndex}
                            booking={booking}
                          />
                        );
                      } else {
                        return <td key={loc.city._id} className="border"></td>;
                      }
                    })}
                  </tr>
                );
              })}
            </tbody>
            {passengersList.length == 0 && (
              <div className="text-center w-100 my-3">No Data Found</div>
            )}
          </Table>
        </Row>
      )}
    </Container>
  );
};

export default SeatsList;
