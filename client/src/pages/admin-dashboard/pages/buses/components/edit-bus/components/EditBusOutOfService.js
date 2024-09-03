import React, { useEffect, useState } from "react";
import { Button, Col, Container, ListGroup, Row } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  editBus,
  setEditBusError,
} from "../../../../../../../store/slices/BusSlice";

const EditBusOutOfService = ({ handleCancel }) => {
  const [dates, setDates] = useState([]);
  const { fetchBusObject, editBusLoading, editBusError } = useSelector(
    (state) => state.bus
  );

  useEffect(() => {
    if (fetchBusObject) {
      if (
        fetchBusObject.outOfServiceDates &&
        fetchBusObject.outOfServiceDates.length > 0
      ) {
        let savedDates = fetchBusObject.outOfServiceDates;
        let newDates = savedDates.map((date, index) => {
          return {
            date: date,
            id: index + 1,
          };
        });
        setDates(newDates);
      }
    }
  }, [fetchBusObject]);

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

  const handleDateChange = (e, id) => {
    if (!e.target.value) return;

    let updatedDates = dates.map((d) => {
      if (d.id === id) {
        return {
          ...d,
          date: e.target.value,
        };
      } else {
        return d;
      }
    });

    setDates(updatedDates);
  };

  const dispatch = useDispatch();
  const handleSubmit = () => {
    if (dates.length > 0) {
      for (let i = 0; i < dates.length; i++) {
        if (
          !dates[i].date ||
          dates[i].date.trim() === "" ||
          dates[i].date === null
        ) {
          dispatch(setEditBusError("Please choose all the date entries."));
          toast.error("Please choose all the date entries.", {
            duration: 4000,
          });
          return;
        }
      }
    }

    const busObject = {
      busId: fetchBusObject._id,
      dates,
      tab: "out-of-service",
    };

    dispatch(editBus(busObject));
    if (!editBusLoading && !editBusError) {
      toast.success("Bus Out of Service Dates Saved", {
        duration: 4000,
      });
      dispatch(setEditBusError(null));
    }
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
                <li className="d-flex mb-2" key={date.id}>
                  <input
                    type="date"
                    className="p-1"
                    defaultValue={date.date}
                    value={date.date}
                    onChange={(e) => handleDateChange(e, date.id)}
                  />
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
          onClick={handleSubmit}
          disabled={editBusLoading}
        >
          {editBusLoading ? "loading..." : "Save"}
        </Button>
      </div>
    </Container>
  );
};

export default EditBusOutOfService;
