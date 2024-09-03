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
import {
  Check,
  PencilSquare,
  Plus,
  Search,
  Trash3,
  X,
} from "react-bootstrap-icons";
import LoadingSpinner from "../../../../../../components/loading-spinner/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import AddRoute from "../add-route/AddRoute";
import EditRoute from "../edit-route/EditRoute";
import {
  fetchRoutes,
  removeRouteItem,
  setEditRouteObject,
  updateRouteStatus,
} from "../../../../../../store/slices/RoutesSlice";
import toast from "react-hot-toast";

const AdminRoutesTab = () => {
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleEditClose = () => setShowEdit(false);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const { newRouteError, routes, isRoutesLoading } = useSelector(
    (state) => state.routes
  );

  useEffect(() => {
    dispatch(fetchRoutes());
  }, []);

  const removeRoute = (id) => {
    // confirm before deleting
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    dispatch(removeRouteItem(id));
    toast.success("Route Removed Successfully", {
      duration: 4000,
    });
  };

  const editRoute = (route) => {
    dispatch(setEditRouteObject(route));
    setShowEdit(true);
  };

  const updateStatus = (id, status) => {
    dispatch(updateRouteStatus({ id, status }));
    toast.success("Status Updated Successfully", {
      duration: 4000,
    });
  };

  const [statusFilter, setStatusFilter] = useState("all");
  let filteredRoutes = routes.filter((route) => {
    return (
      (statusFilter === "all" || route.status === statusFilter) &&
      route.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <Container fluid>
      <AddRoute show={show} handleClose={handleClose} />
      <EditRoute show={showEdit} handleClose={handleEditClose} />
      <Row>
        <Col md="auto">
          <Button
            variant="light"
            className="border fw-semibold d-flex align-items-center"
            onClick={handleShow}
          >
            <Plus size={20} />
            Add Route
          </Button>
        </Col>
        <Col md="auto">
          <InputGroup className="mb-3">
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
        <Col className="d-flex justify-content-end">
          <Row>
            <Col>
              <Button
                variant="light"
                className="border"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
            </Col>
            <Col>
              <Button
                variant="light"
                className="border"
                onClick={() => setStatusFilter("active")}
              >
                Active
              </Button>
            </Col>
            <Col>
              <Button
                variant="light"
                className="border"
                onClick={() => setStatusFilter("inactive")}
              >
                InActive
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      {isRoutesLoading ? (
        <LoadingSpinner />
      ) : (
        <Table responsive hover striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoutes.map((route, index) => (
              <tr key={route._id}>
                <td>{index + 1}</td>
                <td>{route.name}</td>
                <td>{route.from.name}</td>
                <td>{route.to.name}</td>
                <td>
                  <div className="d-flex flex-row justify-content-start align-items-center gap-2">
                    <select
                      className="form-select form-select-sm w-auto"
                      defaultValue={route.status}
                      onChange={(e) => {
                        updateStatus(route._id, e.target.value);
                      }}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <div
                      className={` ${
                        route.status == "active" ? "bg-success" : "bg-secondary"
                      } rounded-circle d-flex justify-content-center align-items-center`}
                      style={{ width: "20px", height: "20px" }}
                    >
                      {route.status == "active" ? (
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
                      editRoute(route);
                    }}
                  >
                    <PencilSquare />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      removeRoute(route._id);
                    }}
                  >
                    <Trash3 />
                  </Button>
                </td>
              </tr>
            ))}
            {routes.length === 0 && (
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

export default AdminRoutesTab;
