import React, { useState } from "react";
import { Button, Col, Container, ListGroup, Row } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";

const EditBusOutOfService = ({ handleCancel }) => {
  const [dates, setDates] = useState([]);
  const handleAddDate = () => {
    let newDates = [
      ...dates,
      {
        id: dates.length + 1,
        date: null,
      },
    ];

    setDates(newDates);
  };

  const handleRemoveDate = (index, id) => {
    let filteredDates = dates.filter((d) => d.id !== id);
    setDates(filteredDates);
  };

  return (
    <Container fluid>
      <Row>
        <Col sm="4" lg="2" md="4" xl="2">
          <div>Out of service on:</div>
        </Col>
        <Col>
          {dates.length == 0 && (
            <div>
              <i>No dates added.</i>
            </div>
          )}
          <ul
            className="p-0 m-0"
            style={{
              listStyle: "none",
            }}
          >
            {dates.map((date, index) => {
              return (
                <li className="d-flex mb-2">
                  <input type="date" className="p-1" defaultValue={date.date} />
                  <Button
                    className="ms-3"
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveDate(index, date.id)}
                  >
                    Remove
                  </Button>
                </li>
              );
            })}
          </ul>

          <Button
            variant="dark"
            className="border px-2 d-flex align-items-center mt-2"
            onClick={handleAddDate}
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

export default EditBusOutOfService;
