import React, { useEffect } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchBusById } from "../../../../../../store/slices/BusSlice";
import EditBusGeneralSettings from "./components/EditBusGeneralSettings";
import EditBusOutOfService from "./components/EditBusOutOfService";
import EditBusTicketTypes from "./components/EditBusTicketTypes";
import EditBusTicketPrices from "./components/EditBusTicketPrices";
import LoadingSpinner from "../../../../../../components/loading-spinner/LoadingSpinner";
import { fetchRoutes } from "../../../../../../store/slices/RoutesSlice";
import { fetchBusTypes } from "../../../../../../store/slices/BusTypeSlice";

const EditBus = () => {
  const dispatch = useDispatch();
  const { busId } = useParams();
  const { fetchBusLoading, fetchBusObject } = useSelector((state) => state.bus);

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
      <h4 className="text-center mb-3">Route: {fetchBusObject?.route?.name}</h4>
      <Tabs defaultActiveKey="generalSettings" className="mb-3 pb-3">
        <Tab eventKey="generalSettings" title="General Settings">
          <EditBusGeneralSettings />
        </Tab>
        <Tab eventKey="outOfService" title="Out Of Service">
          <EditBusOutOfService />
        </Tab>
        <Tab eventKey="ticketTypes" title="Ticket Types">
          <EditBusTicketTypes />
        </Tab>
        <Tab eventKey="ticketPrices" title="Ticket Prices">
          <EditBusTicketPrices />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default EditBus;
