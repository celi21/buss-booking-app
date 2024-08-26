import React from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import AdminRoutesTab from "./components/admin-routes-tab/AdminRoutesTab";
import AdminCitiesTab from "./components/admin-cities-tab/AdminCitiesTab";
import "./style.css";

const BusRoutes = () => {
  return (
    <Container fluid>
      <Tabs defaultActiveKey="routes" className="mb-3 pb-3">
        <Tab eventKey="routes" title="Routes">
          <AdminRoutesTab />
        </Tab>
        <Tab eventKey="cities" title="Cities">
          <AdminCitiesTab />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default BusRoutes;
