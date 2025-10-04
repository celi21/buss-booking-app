import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
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
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedStartLocation, setSelectedStartLocation] = useState(null);
  const { buses, isBusesLoading } = useSelector((state) => state.bus);
  const { passengersList, isPassengersListLoading } = useSelector(
    (state) => state.booking
  );
  const [busLocations, setBusLocations] = useState([]);
  const dispatch = useDispatch();

  const getCurrentDate = () => {
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + month + "-" + day;
    return today;
  };

  const handleBusChange = (busId) => {
    if (!busId) return;

    setSelectedBus(busId);
    dispatch(fetchPassengersList(busId));
    setBusLocations(buses.find((bus) => bus._id === busId).locations);
  };

  useEffect(() => {
    if (buses.length > 0) {
      setSelectedBus(buses[0]._id);
      setBusLocations(buses[0].locations);
      dispatch(fetchPassengersList(buses[0]._id));
    }
  }, [buses]);

  return (
    <Container fluid>
      <div className="fw-semibold mb-2">Date: {getCurrentDate()}</div>

      <Row className="mb-3 gap-2">
        <Col className="d-flex justify-content-start align-items-center gap-3">
          <div>Bus:</div>
          <Row className="d-flex flex-row">
            <div>
              <select
                className="form-select w-auto"
                defaultValue={selectedBus}
                onChange={(e) => {
                  handleBusChange(e.target.value);
                }}
              >
                {buses?.map((bus) => (
                  <option
                    value={bus._id}
                    key={bus._id}
                    defaultValue={bus._id}
                    selected={selectedBus == bus._id}
                  >
                    {bus.route.name},{" "}
                    {bus.locations && bus.locations.length > 0
                      ? `${bus.locations[0].departureTime} - ${bus.locations[bus.locations.length - 1].arrivalTime}`
                      : 'N/A'}
                  </option>
                ))}
              </select>
            </div>
          </Row>
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
