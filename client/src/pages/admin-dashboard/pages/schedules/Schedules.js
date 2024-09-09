import React from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import DailySchedule from "./daily-schedule/DailySchedule";
import RouteTimetable from "./route-timetable/RouteTimetable";
import PassengersList from "./passengers-list/PassengersList";
import SeatsList from "./seats-list/SeatsList";

const Schedules = () => {
  return (
    <Container fluid>
      <Tabs defaultActiveKey="daily-schedule" className="mb-3 pb-3">
        <Tab eventKey="daily-schedule" title="Daily Schedule">
          <DailySchedule />
        </Tab>
        <Tab eventKey="route-timetable" title="Route Timetable">
          <RouteTimetable />
        </Tab>
        <Tab eventKey="passengers-list" title="Passengers List">
          <PassengersList />
        </Tab>
        <Tab eventKey="seats-list" title="Seats List">
          <SeatsList />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Schedules;
