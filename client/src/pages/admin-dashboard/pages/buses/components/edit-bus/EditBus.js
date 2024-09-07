import React, { useEffect } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchBusById } from "../../../../../../store/slices/BusSlice";
import EditBusGeneralSettings from "./components/EditBusGeneralSettings";
import EditBusOutOfService from "./components/EditBusOutOfService";
import EditBusTicketTypes from "./components/EditBusTicketTypes";
import EditBusTicketPrices from "./components/EditBusTicketPrices";
import LoadingSpinner from "../../../../../../components/loading-spinner/LoadingSpinner";
import { fetchRoutes } from "../../../../../../store/slices/RoutesSlice";
import { fetchBusTypes } from "../../../../../../store/slices/BusTypeSlice";
import { ArrowLeft } from "react-bootstrap-icons";

const EditBus = () => {
  const dispatch = useDispatch();
  const { busId } = useParams();
  const { fetchBusLoading, fetchBusObject } = useSelector((state) => state.bus);
  const navigate = useNavigate();
  const handleCancel = () => {
    navigate("/admin/buses");
  };

  useEffect(() => {
    if (busId) {
      dispatch(fetchBusById(busId));
      dispatch(fetchRoutes());
      dispatch(fetchBusTypes());
    }
  }, [busId]);

  if (fetchBusLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Container fluid>
      <div>
        <div
          className="d-flex align-items-center flex-row gap-1 bg-light p-1 px-2 rounded border border-primary text-primary"
          style={{
            width: "fit-content",
            fontSize: 14,
          }}
        >
          <ArrowLeft />
          <Link to={"/admin/buses"}>Back to Buses List</Link>
        </div>
        <h4 className="text-center mb-3">
          Route: {fetchBusObject?.route?.name}
        </h4>
      </div>
      <Tabs defaultActiveKey="generalSettings" className="mb-3 pb-3">
        <Tab eventKey="generalSettings" title="General Settings">
          <EditBusGeneralSettings handleCancel={handleCancel} />
        </Tab>
        <Tab eventKey="outOfService" title="Out Of Service">
          <EditBusOutOfService handleCancel={handleCancel} />
        </Tab>
        <Tab eventKey="ticketTypes" title="Ticket Types">
          <EditBusTicketTypes handleCancel={handleCancel} />
        </Tab>
        <Tab eventKey="ticketPrices" title="Ticket Prices">
          <EditBusTicketPrices handleCancel={handleCancel} />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default EditBus;
