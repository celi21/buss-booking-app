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
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../../store/slices/AuthSlice";

function AdminSidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <Nav
      className="flex-column bg-light sidebar p-2 "
      style={{
        height: "100vh",
        overflowY: "scroll",
      }}
    >
      <div>
        <NavLink
          to="/admin/dashboard"
          className={({ isActive, isPending }) =>
            isPending
              ? "text-muted"
              : isActive
                ? "active nav-link "
                : "nav-link"
          }
        >
          <House className="me-2" />
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/schedules"
          className={({ isActive, isPending }) =>
            isPending
              ? "text-muted"
              : isActive
                ? "active nav-link "
                : "nav-link"
          }
        >
          <Calendar className="me-2" />
          Schedule
        </NavLink>
        <NavLink
          to="/admin/bookings"
          className={({ isActive, isPending }) =>
            isPending
              ? "text-muted"
              : isActive
                ? "active nav-link "
                : "nav-link"
          }
        >
          <Clipboard className="me-2" />
          Bookings
        </NavLink>
        <NavLink
          to="/admin/buses"
          className={({ isActive, isPending }) =>
            isPending
              ? "text-muted"
              : isActive
                ? "active nav-link "
                : "nav-link"
          }
        >
          <BusFront className="me-2" />
          Buses
        </NavLink>
        <NavLink
          to="/admin/bus-routes"
          className={({ isActive, isPending }) =>
            isPending
              ? "text-muted"
              : isActive
                ? "active nav-link "
                : "nav-link"
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
                ? "active nav-link "
                : "nav-link"
          }
        >
          <Diagram3 className="me-2" />
          Bus Types
        </NavLink>
        <NavLink
          to="/admin/reports"
          className={({ isActive, isPending }) =>
            isPending
              ? "text-muted"
              : isActive
                ? "active nav-link "
                : "nav-link"
          }
        >
          <BarChart className="me-2" />
          Reports
        </NavLink>
        {/* <NavLink
        to="/google-sheets"
        className={({ isActive, isPending }) =>
          isPending ? "text-muted" : isActive ? "active nav-link " : "nav-link"
        }
      >
        <FileEarmarkSpreadsheet className="me-2" />
        Google Sheets
      </NavLink>
      <NavLink
        to="/bookings-table"
        className={({ isActive, isPending }) =>
          isPending ? "text-muted" : isActive ? "active nav-link " : "nav-link"
        }
      >
        <FileEarmarkSpreadsheet className="me-2" />
        Bookings Table
      </NavLink>
      <NavLink
        to="/settings"
        className={({ isActive, isPending }) =>
          isPending ? "text-muted" : isActive ? "active nav-link " : "nav-link"
        }
      >
        <Gear className="me-2" />
        Settings
      </NavLink>
      <NavLink
        to="/users"
        className={({ isActive, isPending }) =>
          isPending ? "text-muted" : isActive ? "active nav-link " : "nav-link"
        }
      >
        <People className="me-2" />
        Users
      </NavLink> */}
        <NavLink
          onClick={handleLogout}
          to="/"
          className={({ isActive, isPending }) =>
            isPending
              ? "text-muted"
              : isActive
                ? "active nav-link "
                : "nav-link"
          }
        >
          <BoxArrowRight className="me-2" />
          Logout
        </NavLink>
      </div>
    </Nav>
  );
}

export default AdminSidebar;
