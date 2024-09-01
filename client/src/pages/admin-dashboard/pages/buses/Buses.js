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
import { PencilSquare, Plus, Search, Trash3 } from "react-bootstrap-icons";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import AddNewBus from "./components/add-new-bus/AddNewBus";
import { fetchBuses } from "../../../../store/slices/BusSlice";
import { useNavigate } from "react-router-dom";

const Buses = () => {
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleEditClose = () => setShowEdit(false);
  const [search, setSearch] = useState("");
  const { isBusesLoading, buses } = useSelector((state) => state.bus);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchBuses());
  }, []);

  const editBus = (bus) => {
    navigate(`/admin/edit-bus/${bus._id}`);
  };

  return (
    <Container fluid>
      <AddNewBus handleClose={handleClose} show={show} />
      {/* <EditBusType handleClose={handleEditClose} show={showEdit} /> */}
      <Row className="mb-3">
        <Col md="auto">
          <Button
            variant="light"
            className="border fw-semibold d-flex align-items-center"
            onClick={handleShow}
          >
            <Plus size={20} />
            Add Bus
          </Button>
        </Col>
        <Col md="auto">
          <InputGroup>
            <FormControl
              placeholder="Search..."
              aria-label="Search"
              aria-describedby="search-icon"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <InputGroup.Text id="search-icon" className="bg-transparent">
              <Search />
            </InputGroup.Text>
          </InputGroup>
        </Col>
        <Col className="d-flex justify-content-end align-items-center gap-3">
          <div>Filter by:</div>
          <Row className="d-flex flex-row">
            <div className="w-100">
              <select className="form-control w-100">
                <option value="all">All</option>
                <option value="all">All All</option>
              </select>
            </div>
          </Row>
        </Col>
      </Row>
      {isBusesLoading ? (
        <LoadingSpinner />
      ) : (
        <Table responsive hover striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Route</th>
              <th>Depart - Arrive</th>
              <th>Operates From - To (dates)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus, index) => (
              <tr key={bus._id}>
                <td>{index + 1}</td>
                <td>{bus.route.name}</td>
                <td>
                  {bus.locations[0].departureTime} -{" "}
                  {bus.locations[bus.locations.length - 1].arrivalTime}
                </td>
                <td>
                  {bus.periodStartDate} - {bus.periodEndDate}
                </td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    className="me-2"
                    onClick={() => {
                      editBus(bus);
                    }}
                  >
                    <PencilSquare />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      // removeBus(bus._id);
                    }}
                  >
                    <Trash3 />
                  </Button>
                </td>
              </tr>
            ))}
            {buses.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Buses;
