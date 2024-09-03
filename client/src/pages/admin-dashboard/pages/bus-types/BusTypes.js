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
import AddNewBusType from "./components/AddNewBusType";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBusTypes,
  removeBusTypeItem,
  setEditBusTypeObject,
  updateBusTypeStatus,
} from "../../../../store/slices/BusTypeSlice";
import EditBusType from "./components/EditBusType";
import toast from "react-hot-toast";

const BusTypes = () => {
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleEditClose = () => setShowEdit(false);
  const { busTypes, isLoading } = useSelector((state) => state.busType);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchBusTypes());
  }, []);

  const removeBusType = (id) => {
    // confirm before deleting
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    dispatch(removeBusTypeItem(id));
    toast.success("Bus Type Removed Successfully", {
      duration: 4000,
    });
  };

  const updateStatus = (busTypeId, status) => {
    dispatch(updateBusTypeStatus({ busTypeId, status }));
    toast.success("Status Updated Successfully", {
      duration: 4000,
    });
  };

  const editButType = (busType) => {
    dispatch(setEditBusTypeObject(busType));
    setShowEdit(true);
  };

  const [statusFilter, setStatusFilter] = useState("all");

  let filteredBusTypes = busTypes.filter((busType) => {
    return (
      (statusFilter === "all" || busType.status === statusFilter) &&
      (busType.name.toLowerCase().includes(search.toLowerCase()) ||
        busType.seats.toString().includes(search))
    );
  });

  return (
    <Container fluid>
      <AddNewBusType handleClose={handleClose} show={show} />
      <EditBusType handleClose={handleEditClose} show={showEdit} />
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
            {filteredBusTypes.map((busType, index) => (
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
