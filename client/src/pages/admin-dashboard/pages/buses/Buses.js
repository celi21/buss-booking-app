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
import { Plus, Search } from "react-bootstrap-icons";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import AddNewBus from "./components/add-new-bus/AddNewBus";
import { fetchRoutes } from "../../../../store/slices/RoutesSlice";

const Buses = () => {
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleEditClose = () => setShowEdit(false);
  const { routes, isLoading } = useSelector((state) => state.routes);
  const [search, setSearch] = useState("");

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
      {isLoading ? (
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
          {/* <tbody> */}
          {/* {filteredBusTypes.map((busType, index) => (
            <tr key={busType._id}>
              <td>{index + 1}</td>
              <td>{busType.name}</td>
              <td>{busType.seats}</td>
              <td>
                <div className="d-flex flex-row justify-content-start align-items-center gap-2">
                  <select
                    className="form-select form-select-sm w-auto"
                    defaultValue={busType.status}
                    onChange={(e) => {
                      updateStatus(busType._id, e.target.value);
                    }}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <div
                    className={` ${
                      busType.status == "active"
                        ? "bg-success"
                        : "bg-secondary"
                    } rounded-circle d-flex justify-content-center align-items-center`}
                    style={{ width: "20px", height: "20px" }}
                  >
                    {busType.status == "active" ? (
                      <Check className="text-white" size={17} />
                    ) : (
                      <X className="text-white" size={17} />
                    )}
                  </div>
                </div>
              </td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    editButType(busType);
                  }}
                >
                  <PencilSquare />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    removeBusType(busType._id);
                  }}
                >
                  <Trash3 />
                </Button>
              </td>
            </tr>
          ))} */}
          {/* {busTypes.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">
                No data found
              </td>
            </tr>
          )}
        </tbody> */}
        </Table>
      )}
    </Container>
  );
};

export default Buses;
