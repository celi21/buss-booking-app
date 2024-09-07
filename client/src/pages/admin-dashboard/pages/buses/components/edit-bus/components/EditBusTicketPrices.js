import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { CurrencyDollar } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../../../../../../../components/loading-spinner/LoadingSpinner";
import toast from "react-hot-toast";
import {
  editBus,
  setEditBusError,
} from "../../../../../../../store/slices/BusSlice";
import TicketPriceInput from "./TicketPriceInput";

const EditBusTicketPrices = ({ handleCancel }) => {
  const { fetchBusObject, editBusLoading, editBusError } = useSelector(
    (state) => state.bus
  );
  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  const [busLocations, setBusLocations] = useState([]);
  const [ticketChangeLoading, setTicketChangeLoading] = useState(false);
  const [ticketPrices, setTicketPrices] = useState([]);

  useEffect(() => {
    if (fetchBusObject) {
      setTicketTypes(fetchBusObject.ticketTypes);

      if (fetchBusObject.ticketTypes.length > 0) {
        setSelectedTicketType(fetchBusObject.ticketTypes[0]._id);
      }

      if (fetchBusObject.locations.length > 0) {
        setBusLocations(fetchBusObject.locations);
      }

      if (fetchBusObject.ticketPrices) {
        setTicketPrices(fetchBusObject.ticketPrices);
      }
    }
  }, [fetchBusObject]);

  const handleTicketTypeChange = async (e) => {
    // console.log(e.target.value);
    if (!e.target.value) return;
    setTicketChangeLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setSelectedTicketType(e.target.value);
    setTicketChangeLoading(false);
  };

  const handlePriceChange = (fromLocation, toLocation, price) => {
    // if the bus have ticket types
    if (ticketTypes.length > 0) {
      // if there is a selected ticket
      if (selectedTicketType) {
        // check if ticket type exists in array.
        const findTicket = ticketPrices.find(
          (t) => t.ticketType === selectedTicketType
        );
        if (findTicket) {
          const updatedTicketPrices = ticketPrices.map((ticket) => {
            // if the ticket type (eg: Adults) already exists.
            if (ticket.ticketType === selectedTicketType) {
              // check to see if the to and from locations are same and update its price
              const existingPriceIndex = ticket.prices.findIndex(
                (p) =>
                  p.fromLocationId == fromLocation._id &&
                  p.toLocationId == toLocation._id
              );
              // meaning price exist
              if (existingPriceIndex !== -1) {
                let ticketPrices = [...ticket.prices];
                let updatedPrice = {
                  ...ticketPrices[existingPriceIndex],
                  price: price,
                };
                ticketPrices[existingPriceIndex] = updatedPrice;
                return {
                  ...ticket,
                  prices: ticketPrices,
                };
              } else {
                // price does not exist. add new
                // ticket.prices.push({
                //   fromLocationId: fromLocation._id,
                //   toLocationId: toLocation._id,
                //   price: price,
                // });
                let ticketPrices = [...ticket.prices];
                ticketPrices.push({
                  fromLocationId: fromLocation._id,
                  toLocationId: toLocation._id,
                  price: price,
                });
                return {
                  ...ticket,
                  prices: ticketPrices,
                };
              }
            }

            return ticket;
          });
          setTicketPrices(updatedTicketPrices);
        } else {
          let newTicket = {
            ticketType: selectedTicketType,
            prices: [
              {
                fromLocationId: fromLocation._id,
                toLocationId: toLocation._id,
                price: price,
              },
            ],
          };
          let updatedTicketPrices = [...ticketPrices, newTicket];
          setTicketPrices(updatedTicketPrices);
        }
      }
    } else {
      // bus does not have any ticket types yet. just store a new entry with no ticket type and price and location
      let newTicket = {
        prices: [
          {
            fromLocationId: fromLocation._id,
            toLocationId: toLocation._id,
            price: price,
          },
        ],
      };
      let updatedTicketPrices = [...ticketPrices, newTicket];
      setTicketPrices(updatedTicketPrices);
    }

    console.log(ticketPrices);
  };

  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (fetchBusObject) {
      console.log(ticketPrices);
      const busObject = {
        ticketPrices,
        busId: fetchBusObject._id,
        tab: "ticket-prices",
      };

      dispatch(editBus(busObject));

      if (!editBusLoading && !editBusError) {
        toast.success("Ticket Prices Settings Updated", {
          duration: 4000,
        });
        dispatch(setEditBusError(null));
      }
    }
  };

  const getInputValue = (fromLocation, toLocation) => {
    return ticketPrices
      .find((t) => t.ticketType === selectedTicketType)
      ?.prices.find(
        (p) =>
          p.fromLocationId === fromLocation._id &&
          p.toLocationId === toLocation._id
      )?.price;
  };

  return (
    <Container fluid>
      <Row className="mb-3 align-items-center">
        <Col sm="5" lg="3" md="5" xl="2">
          <div>Select Ticket Type:</div>
        </Col>
        <Col>
          {ticketTypes.length > 0 ? (
            <select
              className="form-select w-auto"
              defaultValue={selectedTicketType}
              onChange={(e) => {
                handleTicketTypeChange(e);
              }}
            >
              {ticketTypes?.map((ticket) => (
                <option
                  value={ticket._id}
                  key={ticket._id}
                  defaultValue={ticket._id}
                  selected={selectedTicketType._id == ticket._id}
                >
                  {ticket.name}
                </option>
              ))}
            </select>
          ) : (
            <i>First add a ticket type for the Bus.</i>
          )}
        </Col>
      </Row>

      {ticketChangeLoading ? (
        <div style={{ height: 300 }}>
          <LoadingSpinner />
        </div>
      ) : (
        <Row className="my-5">
          <Table responsive hover bordered>
            <thead>
              <tr>
                <th className="bg-light"></th>
                {busLocations.map((location, index) => {
                  if (index != 0)
                    return (
                      <th className="fw-semibold" style={{ fontSize: 15 }}>
                        {location.city.name}
                      </th>
                    );
                })}
              </tr>
            </thead>
            <tbody>
              {busLocations.map((location, index) => {
                // input render
                let renderRow = () => {
                  let render = [];
                  for (let i = 0; i < busLocations.length - 1; i++) {
                    if (i < index) {
                      render.push(<td className="bg-light" key={i}></td>);
                    } else {
                      let inputValue =
                        getInputValue(location, busLocations[i + 1]) || "";
                      render.push(
                        <td
                          key={`${busLocations[i]._id}-${selectedTicketType}`}
                        >
                          <div class="input-group input-group-md">
                            <span class="input-group-text p-1">
                              <CurrencyDollar size={16} />
                            </span>
                            <TicketPriceInput
                              handlePriceChange={handlePriceChange}
                              fromLocation={location}
                              toLocation={busLocations[i + 1]}
                              inputValue={inputValue}
                            />
                          </div>
                        </td>
                      );
                    }
                  }

                  return render;
                };

                if (index != busLocations.length - 1)
                  return (
                    <tr
                      className="fw-semibold"
                      style={{ fontSize: 15 }}
                      key={`${location._id}-${selectedTicketType}`}
                    >
                      <td>{location.city.name}</td>
                      {renderRow()}
                    </tr>
                  );
              })}
            </tbody>
          </Table>
        </Row>
      )}

      <hr />

      <div className="w-100 d-flex flex-row gap-2">
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          // disabled={editBusLoading}
        >
          Save Ticket Prices
          {/* {editBusLoading ? "loading..." : "Save Ticket Types"} */}
        </Button>
      </div>
    </Container>
  );
};

export default EditBusTicketPrices;
