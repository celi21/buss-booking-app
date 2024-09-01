import React, { useEffect } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchBusById } from "../../../../../../store/slices/BusSlice";
import EditBusGeneralSettings from "./components/EditBusGeneralSettings";
import LoadingSpinner from "../../../../../../components/loading-spinner/LoadingSpinner";
import { fetchRoutes } from "../../../../../../store/slices/RoutesSlice";
import { fetchBusTypes } from "../../../../../../store/slices/BusTypeSlice";

const EditBus = () => {
  const dispatch = useDispatch();
  const { busId } = useParams();
  const { fetchBusLoading } = useSelector((state) => state.bus);

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
      <Tabs defaultActiveKey="generalSettings" className="mb-3 pb-3">
        <Tab eventKey="generalSettings" title="General Settings">
          <EditBusGeneralSettings />
        </Tab>
        <Tab eventKey="outOfService" title="Out Of Service">
          {/* <AdminCitiesTab /> */}
        </Tab>
        <Tab eventKey="ticketTypes" title="Ticket Types">
          {/* <AdminCitiesTab /> */}
        </Tab>
        <Tab eventKey="ticketPrices" title="Ticket Prices">
          {/* <AdminCitiesTab /> */}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default EditBus;
