// Sidebar.js
import React, { useState } from "react";
import { Button, Container, Nav, Row } from "react-bootstrap";
import {
  House,
  Calendar,
  Clipboard,
  BusFront,
  Diagram3,
  BarChart,
  FileEarmarkSpreadsheet,
  Gear,
  People,
  CloudArrowDown,
  BoxArrowRight,
  X,
  MenuButton,
} from "react-bootstrap-icons";
import "./admin-sidebar.css";
import { Link } from "react-router-dom";

function AdminSidebar() {
  return (
    <Nav className="flex-column bg-light sidebar p-2">
      <Link
        to="/admin/dashboard"
        active
        className="text-primary bg-white nav-link"
      >
        <House className="me-2 text-primary" />
        Dashboard
      </Link>
      <Nav.Link href="/schedule" className="text-secondary">
        <Calendar className="me-2" />
        Schedule
      </Nav.Link>
      <Nav.Link href="/bookings" className="text-secondary">
        <Clipboard className="me-2" />
        Bookings
      </Nav.Link>
      <Nav.Link href="/buses" className="text-secondary">
        <BusFront className="me-2" />
        Buses
      </Nav.Link>
      <Nav.Link href="/routes" className="text-secondary">
        <Diagram3 className="me-2" />
        Routes
      </Nav.Link>
      <Link to="/admin/bus-types" className="text-secondary nav-link">
        <Diagram3 className="me-2" />
        Bus Types
      </Link>
      <Nav.Link href="/reports" className="text-secondary">
        <BarChart className="me-2" />
        Reports
      </Nav.Link>
      <Nav.Link href="/google-sheets" className="text-secondary">
        <FileEarmarkSpreadsheet className="me-2" />
        Google Sheets
      </Nav.Link>
      <Nav.Link href="/bookings-table" className="text-secondary">
        <FileEarmarkSpreadsheet className="me-2" />
        Bookings Table
      </Nav.Link>
      <Nav.Link href="/settings" className="text-secondary">
        <Gear className="me-2" />
        Settings
      </Nav.Link>
      <Nav.Link href="/users" className="text-secondary">
        <People className="me-2" />
        Users
      </Nav.Link>
      <Nav.Link href="/install-preview" className="text-secondary">
        <CloudArrowDown className="me-2" />
        Install & Preview
      </Nav.Link>
      <Nav.Link href="/logout" className="text-secondary">
        <BoxArrowRight className="me-2" />
        Logout
      </Nav.Link>
    </Nav>
  );
}

export default AdminSidebar;
