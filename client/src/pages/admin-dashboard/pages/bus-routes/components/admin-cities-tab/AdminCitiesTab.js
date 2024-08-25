import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { Check, PencilSquare, Plus, Trash3, X } from "react-bootstrap-icons";
import LoadingSpinner from "../../../../../../components/loading-spinner/LoadingSpinner";
import AddCity from "../add-city/AddCity";
import { fetchCities } from "../../../../../../store/slices/RoutesSlice";
import { useDispatch, useSelector } from "react-redux";

const AdminCitiesTab = () => {
  const [show, setShow] = useState(false);
  // const [showEdit, setShowEdit] = useState(false);

  const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);
  // const handleEditClose = () => setShowEdit(false);
  const { cities, isCitiesLoading } = useSelector((state) => state.routes);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchCities());
  }, []);

  const removeBusType = (id) => {
    // confirm before deleting
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    // dispatch(removeBusTypeItem(id));
  };

  const updateStatus = (cityId, status) => {
    // dispatch(updateBusTypeStatus({ busTypeId, status }));
  };

  const editCity = (city) => {
    // dispatch(setEditBusTypeObject(busType));
    // setShowEdit(true);
  };

  return (
    <Container fluid>
      <AddCity show={show} handleClose={handleClose} />
      <Row className="mb-3">
        <Col md="auto">
          <Button
            variant="light"
            className="border fw-semibold d-flex align-items-center"
            onClick={() => setShow(true)}
          >
            <Plus size={20} />
            Add City
          </Button>
        </Col>
      </Row>

      {isCitiesLoading ? (
        <LoadingSpinner />
      ) : (
        <Table responsive hover striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city, index) => (
              <tr key={city._id}>
                <td>{index + 1}</td>
                <td>{city.name}</td>
                <td>
                  <div className="d-flex flex-row justify-content-start align-items-center gap-2">
                    <select
                      className="form-select form-select-sm w-auto"
                      defaultValue={city.status}
                      onChange={(e) => {
                        updateStatus(city._id, e.target.value);
                      }}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <div
                      className={` ${
                        city.status == "active" ? "bg-success" : "bg-secondary"
                      } rounded-circle d-flex justify-content-center align-items-center`}
                      style={{ width: "20px", height: "20px" }}
                    >
                      {city.status == "active" ? (
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
                      editCity(city);
                    }}
                  >
                    <PencilSquare />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      removeBusType(city._id);
                    }}
                  >
                    <Trash3 />
                  </Button>
                </td>
              </tr>
            ))}
            {cities.length === 0 && (
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

export default AdminCitiesTab;
