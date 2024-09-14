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
  PlusCircle,
} from "react-bootstrap-icons";
import "./user-sidebar.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../../store/slices/AuthSlice";

const UserSidebar = () => {
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
          to="/booking"
          className={({ isActive, isPending }) =>
            isPending
              ? "text-muted"
              : isActive
              ? "active nav-link "
              : "nav-link"
          }
        >
          <PlusCircle className="me-2" />
          New Booking
        </NavLink>
        <NavLink
          to="/user/dashboard"
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
          to="/user/bookings"
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
};

export default UserSidebar;
