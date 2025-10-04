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
import { fetchBuses, removeBus } from "../../../../store/slices/BusSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchRoutes } from "../../../../store/slices/RoutesSlice";

const Buses = () => {
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleEditClose = () => setShowEdit(false);
  const [search, setSearch] = useState("");
  const [filterRoute, setFilterRoute] = useState("");
  const { isBusesLoading, buses } = useSelector((state) => state.bus);
  const { routes } = useSelector((state) => state.routes);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchBuses());
    dispatch(fetchRoutes());
  }, []);

  const editBus = (bus) => {
    navigate(`/admin/edit-bus/${bus._id}`);
  };

  const handleRemoveBus = (busId) => {
    // confirm before deleting
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    dispatch(removeBus(busId));
    toast.success("Bus Removed Successfully", {
      duration: 4000,
    });
  };

  const filteredBuses = buses?.filter((bus) => {
    const matchesSearch =
      search.trim() === "" ||
      bus.route.name?.toLowerCase().includes(search.toLowerCase()) ||
      bus.busType.name?.toLowerCase().includes(search.toLowerCase());

    const matchesRoute = filterRoute === "" || bus.route._id === filterRoute;

    return matchesSearch && matchesRoute;
  });

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
          <div>Filter by Route:</div>
          <Row className="d-flex flex-row">
            <div className="w-100">
              <select
                className="form-select w-100"
                defaultValue={null}
                onChange={(e) => {
                  setFilterRoute(e.target.value);
                }}
              >
                <option value={""} key={""}>
                  Choose
                </option>
                {routes?.map((r) => {
                  return (
                    <option value={r._id} key={r._id}>
                      {r.name}
                    </option>
                  );
                })}
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
              <th className="text-nowrap">#</th>
              <th className="text-nowrap">Route</th>
              <th className="text-nowrap">Bus Type (seats)</th>
              <th className="text-nowrap">Depart - Arrive</th>
              <th className="text-nowrap">Operates From - To (dates)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBuses.map((bus, index) => (
              <tr key={bus._id}>
                <td className="text-nowrap">{index + 1}</td>
                <td className="text-nowrap">{bus.route.name}</td>
                <td className="text-nowrap">
                  {bus.busType.name} ({bus.busType.seats})
                </td>
                <td className="text-nowrap">
                  {bus.locations && bus.locations.length > 0
                    ? `${bus.locations[0].departureTime} - ${bus.locations[bus.locations.length - 1].arrivalTime}`
                    : 'N/A'}
                </td>
                <td className="text-nowrap">
                  {bus.periodStartDate} - {bus.periodEndDate}
                </td>
                <td className="text-nowrap">
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
                      handleRemoveBus(bus._id);
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
