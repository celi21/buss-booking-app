import React, { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import { useSelector } from "react-redux";

const EditBusTicketTypes = ({ handleCancel }) => {
  const { fetchBusObject } = useSelector((state) => state.bus);
  const [ticketTypes, setTicketTypes] = useState([]);

  const handleAddTicketType = () => {
    let newTickets = [
      ...ticketTypes,
      {
        id: ticketTypes.length + 1,
        type: "",
      },
    ];

    setTicketTypes(newTickets);
  };

  const handleRemoveTicketType = (index, id) => {
    const filteredTickets = ticketTypes.filter((t) => t.id !== id);
    setTicketTypes(filteredTickets);
  };

  const handleTicketInputChange = (value, id) => {
    let newTickets = ticketTypes.map((t) => {
      if (t.id == id) {
        return {
          ...t,
          type: value,
        };
      } else {
        return t;
      }
    });
    setTicketTypes(newTickets);
  };

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col sm="5" lg="3" md="5" xl="3">
          <div>Seats available:</div>
        </Col>
        <Col>
          <div>{fetchBusObject?.busType?.seats}</div>
        </Col>
      </Row>

      {ticketTypes.map((ticket, index) => {
        return (
          <Row key={index} className="align-items-center mb-2">
            <Col sm="5" lg="3" md="5" xl="3">
              <div>Select Ticket Type {index + 1}:</div>
            </Col>
            <Col>
              <li className="d-flex">
                <input
                  type="text"
                  className="p-1"
                  value={ticket.type}
                  placeholder="Write Ticket Type"
                  onChange={(e) => {
                    handleTicketInputChange(e.target.value, ticket.id);
                  }}
                />
                <Button
                  className="ms-3"
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveTicketType(index, ticket.id)}
                >
                  Remove
                </Button>
              </li>
            </Col>
          </Row>
        );
      })}

      <Row>
        <Col sm="5" lg="3" md="5" xl="3"></Col>
        <Col>
          {ticketTypes.length == 0 && <i>No ticket types added.</i>}
          <Button
            variant="dark"
            className="border px-2 d-flex align-items-center mt-2"
            onClick={handleAddTicketType}
            type="button"
            size="sm"
          >
            <Plus size={20} />
            Add
          </Button>
        </Col>
      </Row>

      <hr />

      <div className="w-100 d-flex flex-row gap-2">
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          variant="primary"
          // onClick={handleSubmit}
          // disabled={addNewBusLoading}
        >
          Update
          {/* {addNewBusLoading ? "loading..." : "Save"} */}
        </Button>
      </div>
    </Container>
  );
};

export default EditBusTicketTypes;
