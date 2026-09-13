import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, InputGroup, Row, Table } from "react-bootstrap";
import { CurrencyDollar, Percent } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../../../../../../../components/loading-spinner/LoadingSpinner";
import toast from "react-hot-toast";
import {
  editBus,
  setEditBusError,
} from "../../../../../../../store/slices/BusSlice";
import {
  fetchTaxAmount,
  updateTaxAmount,
} from "../../../../../../../store/slices/SettingsSlice";
import TicketPriceInput from "./TicketPriceInput";

const EditBusTicketPrices = ({ handleCancel }) => {
  const dispatch = useDispatch();
  const { fetchBusObject, editBusLoading, editBusError } = useSelector(
    (state) => state.bus
  );
  const { tax } = useSelector((state) => state.settings);

  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  const [busLocations, setBusLocations] = useState([]);
  const [ticketPrices, setTicketPrices] = useState([]);
  const [isSavingPrices, setIsSavingPrices] = useState(false);

  // Tax configuration state
  const [taxRateInput, setTaxRateInput] = useState("");
  const [isSavingTax, setIsSavingTax] = useState(false);

  useEffect(() => {
    dispatch(fetchTaxAmount());
  }, [dispatch]);

  useEffect(() => {
    if (tax !== null && tax !== undefined) {
      setTaxRateInput(String(tax));
    }
  }, [tax]);

  useEffect(() => {
    if (fetchBusObject) {
      const types = fetchBusObject.ticketTypes || [];
      setTicketTypes(types);

      if (types.length > 0) {
        setSelectedTicketType(types[0]._id);
      }

      if (fetchBusObject.locations && fetchBusObject.locations.length > 0) {
        setBusLocations(fetchBusObject.locations);
      }

      if (fetchBusObject.ticketPrices) {
        setTicketPrices(fetchBusObject.ticketPrices);
      }
    }
  }, [fetchBusObject]);

  const handleTicketTypeChange = (e) => {
    if (!e.target.value) return;
    setSelectedTicketType(e.target.value);
  };

  const getInputValue = (fromLocation, toLocation) => {
    const fromId = String(fromLocation._id || fromLocation);
    const toId = String(toLocation._id || toLocation);
    const targetTicketType = String(selectedTicketType);

    const ticketGroup = ticketPrices.find(
      (t) => String(t.ticketType?._id || t.ticketType) === targetTicketType
    );

    const priceEntry = ticketGroup?.prices?.find(
      (p) =>
        String(p.fromLocationId?._id || p.fromLocationId) === fromId &&
        String(p.toLocationId?._id || p.toLocationId) === toId
    );

    return priceEntry?.price !== undefined ? priceEntry.price : "";
  };

  const handlePriceChange = (fromLocation, toLocation, price) => {
    const fromId = String(fromLocation._id || fromLocation);
    const toId = String(toLocation._id || toLocation);
    const targetTicketType = String(selectedTicketType);

    if (ticketTypes.length > 0 && selectedTicketType) {
      const existingTicketIndex = ticketPrices.findIndex(
        (t) => String(t.ticketType?._id || t.ticketType) === targetTicketType
      );

      if (existingTicketIndex !== -1) {
        const ticketGroup = ticketPrices[existingTicketIndex];
        const prices = [...(ticketGroup.prices || [])];
        const existingPriceIndex = prices.findIndex(
          (p) =>
            String(p.fromLocationId?._id || p.fromLocationId) === fromId &&
            String(p.toLocationId?._id || p.toLocationId) === toId
        );

        if (existingPriceIndex !== -1) {
          prices[existingPriceIndex] = {
            ...prices[existingPriceIndex],
            fromLocationId: fromId,
            toLocationId: toId,
            price: price,
          };
        } else {
          prices.push({
            fromLocationId: fromId,
            toLocationId: toId,
            price: price,
          });
        }

        const updated = [...ticketPrices];
        updated[existingTicketIndex] = {
          ...ticketGroup,
          ticketType: targetTicketType,
          prices,
        };
        setTicketPrices(updated);
      } else {
        const newGroup = {
          ticketType: targetTicketType,
          prices: [
            {
              fromLocationId: fromId,
              toLocationId: toId,
              price: price,
            },
          ],
        };
        setTicketPrices([...ticketPrices, newGroup]);
      }
    } else {
      const newGroup = {
        prices: [
          {
            fromLocationId: fromId,
            toLocationId: toId,
            price: price,
          },
        ],
      };
      setTicketPrices([...ticketPrices, newGroup]);
    }
  };

  const handleSaveTicketPrices = async () => {
    if (!fetchBusObject) return;

    setIsSavingPrices(true);
    const busObject = {
      ticketPrices,
      busId: fetchBusObject._id,
      tab: "ticket-prices",
    };

    try {
      const savedBus = await dispatch(editBus(busObject)).unwrap();
      if (savedBus && savedBus.ticketPrices) {
        setTicketPrices(savedBus.ticketPrices);
      }
      toast.success("Ticket prices saved successfully!", {
        duration: 4000,
      });
      dispatch(setEditBusError(null));
    } catch (err) {
      toast.error(err || "Failed to save ticket prices. Please try again.", {
        duration: 4000,
      });
    } finally {
      setIsSavingPrices(false);
    }
  };

  const handleSaveTax = async (e) => {
    if (e) e.preventDefault();
    if (
      taxRateInput === "" ||
      isNaN(Number(taxRateInput)) ||
      Number(taxRateInput) < 0
    ) {
      toast.error("Please enter a valid non-negative tax percentage (e.g. 8 for 8%).");
      return;
    }

    setIsSavingTax(true);
    try {
      const savedTax = await dispatch(updateTaxAmount(Number(taxRateInput))).unwrap();
      setTaxRateInput(String(savedTax));
      toast.success(`Tax rate saved to database: ${savedTax}%!`, {
        duration: 4000,
      });
    } catch (err) {
      toast.error(err || "Failed to save tax rate. Please try again.", {
        duration: 4000,
      });
    } finally {
      setIsSavingTax(false);
    }
  };

  return (
    <Container fluid>
      {/* Tax Configuration Section */}
      <Card className="mb-4 border shadow-sm">
        <Card.Header className="bg-light fw-bold py-2">
          Global Tax Configuration
        </Card.Header>
        <Card.Body>
          <p className="text-muted small mb-3">
            Set the applicable tax rate applied to all ticket bookings across BuenoTransit. This value is stored permanently in the database and persists across reloads and server restarts.
          </p>
          <Form onSubmit={handleSaveTax} className="d-flex align-items-center gap-3 flex-wrap">
            <div style={{ maxWidth: "220px" }}>
              <InputGroup>
                <Form.Control
                  type="number"
                  step="any"
                  min="0"
                  placeholder="e.g. 8"
                  value={taxRateInput}
                  onChange={(e) => setTaxRateInput(e.target.value)}
                  disabled={isSavingTax}
                />
                <InputGroup.Text>
                  <Percent size={16} />
                </InputGroup.Text>
              </InputGroup>
            </div>
            <Button
              variant="success"
              type="submit"
              disabled={isSavingTax}
              className="fw-semibold px-3"
            >
              {isSavingTax ? "Saving Tax..." : "Save Tax Rate"}
            </Button>
            {tax !== null && tax !== undefined && (
              <span className="badge bg-secondary p-2">
                Current in Database: {tax}%
              </span>
            )}
          </Form>
        </Card.Body>
      </Card>

      {/* Ticket Prices by Route Matrix */}
      <Card className="mb-4 border shadow-sm">
        <Card.Header className="bg-light d-flex justify-content-between align-items-center py-2">
          <span className="fw-bold">Ticket Prices by Stop / Destination</span>
          {ticketTypes.length > 0 && (
            <div className="d-flex align-items-center gap-2">
              <span className="small fw-semibold text-secondary">Ticket Type:</span>
              <select
                className="form-select form-select-sm w-auto"
                value={selectedTicketType || ""}
                onChange={handleTicketTypeChange}
              >
                {ticketTypes?.map((ticket) => (
                  <option value={ticket._id} key={ticket._id}>
                    {ticket.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </Card.Header>
        <Card.Body>
          {ticketTypes.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <i>First add at least one Ticket Type in the &ldquo;Ticket Types&rdquo; tab before setting prices.</i>
            </div>
          ) : busLocations.length < 2 ? (
            <div className="text-center py-4 text-muted">
              <i>Add at least two locations in General Settings to configure fares.</i>
            </div>
          ) : (
            <Table responsive hover bordered className="align-middle mb-0">
              <thead>
                <tr>
                  <th className="bg-light text-secondary small text-uppercase">Origin \ Destination</th>
                  {busLocations.map((location, index) => {
                    if (index !== 0)
                      return (
                        <th className="fw-semibold text-center" style={{ fontSize: 14 }} key={location._id || index}>
                          {location.city?.name || "City"}
                        </th>
                      );
                    return null;
                  })}
                </tr>
              </thead>
              <tbody>
                {busLocations.map((location, index) => {
                  if (index === busLocations.length - 1) return null;

                  return (
                    <tr key={`${location._id || index}-${selectedTicketType}`}>
                      <td className="fw-semibold bg-light" style={{ fontSize: 14 }}>
                        {location.city?.name || "City"}
                      </td>
                      {busLocations.slice(1).map((destLocation, colIndex) => {
                        if (colIndex < index) {
                          return <td className="bg-light text-center text-muted" key={colIndex}>-</td>;
                        }

                        const inputValue = getInputValue(location, destLocation);
                        return (
                          <td key={`${destLocation._id || colIndex}-${selectedTicketType}`} style={{ minWidth: "130px" }}>
                            <div className="input-group input-group-sm">
                              <span className="input-group-text p-1">
                                <CurrencyDollar size={15} />
                              </span>
                              <TicketPriceInput
                                handlePriceChange={handlePriceChange}
                                fromLocation={location}
                                toLocation={destLocation}
                                inputValue={inputValue}
                              />
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <div className="w-100 d-flex flex-row gap-2 mb-4">
        <Button variant="secondary" onClick={handleCancel} disabled={isSavingPrices}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSaveTicketPrices}
          disabled={isSavingPrices || editBusLoading}
          className="px-4 fw-semibold"
        >
          {isSavingPrices || editBusLoading ? "Saving Prices..." : "Save Ticket Prices"}
        </Button>
      </div>
    </Container>
  );
};

export default EditBusTicketPrices;
