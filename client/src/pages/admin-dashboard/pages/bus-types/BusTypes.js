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
import AddNewBusType from "./components/AddNewBusType";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBusTypes,
  removeBusTypeItem,
} from "../../../../store/slices/BusTypeSlice";

const BusTypes = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { busTypes, isLoading } = useSelector((state) => state.busType);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBusTypes());
  }, []);

  const removeBusType = (id) => {
    // confirm before deleting
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    dispatch(removeBusTypeItem(id));
  };

  return (
    <Container fluid>
      <AddNewBusType handleClose={handleClose} show={show} />
      <Row>
        <Col md="auto">
          <Button
            variant="light"
            className="border fw-semibold d-flex align-items-center"
            onClick={handleShow}
          >
            <Plus size={20} />
            Add Bus Type
          </Button>
        </Col>
        <Col md="auto">
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search..."
              aria-label="Search"
              aria-describedby="search-icon"
            />
            <InputGroup.Text id="search-icon" className="bg-transparent">
              <Search />
            </InputGroup.Text>
          </InputGroup>
        </Col>
        <Col className="d-flex justify-content-end">hello</Col>
      </Row>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Table responsive hover striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Seat(s)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {busTypes.map((busType, index) => (
              <tr key={busType._id}>
                <td>{index + 1}</td>
                <td>{busType.name}</td>
                <td>{busType.seats}</td>
                <td>{busType.status}</td>
                <td>
                  <Button variant="primary" size="sm" className="me-2">
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      removeBusType(busType._id);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {busTypes.length === 0 && (
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

export default BusTypes;
