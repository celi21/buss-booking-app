import React from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import DailySchedule from "./daily-schedule/DailySchedule";

const Schedules = () => {
  return (
    <Container fluid>
      <Tabs defaultActiveKey="daily-schedule" className="mb-3 pb-3">
        <Tab eventKey="daily-schedule" title="Daily Schedule">
          <DailySchedule />
        </Tab>
        <Tab eventKey="route-timetable" title="Route Timetable">
          Route Timetable
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Schedules;
