// Sidebar.js
import React from "react";
import { Nav } from "react-bootstrap";
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
} from "react-bootstrap-icons";
import "./admin-sidebar.css";
import { Link, NavLink } from "react-router-dom";

function AdminSidebar() {
  return (
    <Nav className="flex-column bg-light sidebar p-2">
      <NavLink
        to="/admin/dashboard"
        className={({ isActive, isPending }) =>
          isPending
            ? "text-muted nav-link"
            : isActive
            ? "active nav-link bg-white"
            : "nav-link text-secondary"
        }
      >
        <House className="me-2" />
        Dashboard
      </NavLink>
      <NavLink
        to="/schedule"
        className={({ isActive, isPending }) =>
          isPending
            ? "text-muted nav-link"
            : isActive
            ? "active nav-link bg-white"
            : "nav-link text-secondary"
        }
      >
        <Calendar className="me-2" />
        Schedule
      </NavLink>
      <NavLink
        to="/bookings"
        className={({ isActive, isPending }) =>
          isPending
            ? "text-muted nav-link"
            : isActive
            ? "active nav-link bg-white"
            : "nav-link text-secondary"
        }
      >
        <Clipboard className="me-2" />
        Bookings
      </NavLink>
      <NavLink
        to="/buses"
        className={({ isActive, isPending }) =>
          isPending
            ? "text-muted nav-link"
            : isActive
            ? "active nav-link bg-white"
            : "nav-link text-secondary"
        }
      >
        <BusFront className="me-2" />
        Buses
      </NavLink>
      <NavLink
        to="/admin/bus-routes"
        className={({ isActive, isPending }) =>
          isPending
            ? "text-muted nav-link"
            : isActive
            ? "active nav-link bg-white"
            : "nav-link text-secondary"
        }
      >
        <Diagram3 className="me-2" />
        Routes
      </NavLink>
      <NavLink
        to="/admin/bus-types"
        className={({ isActive, isPending }) =>
          isPending
            ? "text-primary nav-link"
            : isActive
            ? "active nav-link bg-white"
            : "nav-link text-secondary"
        }
      >
        <Diagram3 className="me-2" />
        Bus Types
      </NavLink>
      <NavLink
        to="/reports"
        className={({ isActive, isPending }) =>
          isPending
            ? "text-muted nav-link"
            : isActive
            ? "active nav-link bg-white"
            : "nav-link text-secondary"
        }
      >
        <BarChart className="me-2" />
        Reports
      </NavLink>
      <NavLink
        to="/google-sheets"
        className={({ isActive, isPending }) =>
          isPending
            ? "text-muted nav-link"
            : isActive
            ? "active nav-link bg-white"
            : "nav-link text-secondary"
        }
      >
        <FileEarmarkSpreadsheet className="me-2" />
        Google Sheets
      </NavLink>
      <NavLink
        to="/bookings-table"
        className={({ isActive, isPending }) =>
          isPending
            ? "text-muted nav-link"
            : isActive
            ? "active nav-link bg-white"
            : "nav-link text-secondary"
        }
      >
        <FileEarmarkSpreadsheet className="me-2" />
        Bookings Table
      </NavLink>
      <NavLink
        to="/settings"
        className={({ isActive, isPending }) =>
          isPending
            ? "text-muted nav-link"
            : isActive
            ? "active nav-link bg-white"
            : "nav-link text-secondary"
        }
      >
        <Gear className="me-2" />
        Settings
      </NavLink>
      <NavLink
        to="/users"
        className={({ isActive, isPending }) =>
          isPending
            ? "text-muted nav-link"
            : isActive
            ? "active nav-link bg-white"
            : "nav-link text-secondary"
        }
      >
        <People className="me-2" />
        Users
      </NavLink>
      <NavLink
        to="/install-preview"
        className={({ isActive, isPending }) =>
          isPending
            ? "text-muted nav-link"
            : isActive
            ? "active nav-link bg-white"
            : "nav-link text-secondary"
        }
      >
        <CloudArrowDown className="me-2" />
        Install & Preview
      </NavLink>
      <NavLink
        to="/logout"
        className={({ isActive, isPending }) =>
          isPending
            ? "text-muted nav-link"
            : isActive
            ? "active nav-link bg-white"
            : "nav-link text-secondary"
        }
      >
        <BoxArrowRight className="me-2" />
        Logout
      </NavLink>
    </Nav>
  );
}

export default AdminSidebar;
