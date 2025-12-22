import React from "react";
import { Col, Container, Row, Nav } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Navigate, Outlet, NavLink, useLocation } from "react-router-dom";
import UserSidebar from "./components/user-side-bar/UserSidebar.js";
import { Toaster } from "react-hot-toast";
import { House, Wallet, Person, Headset } from "react-bootstrap-icons";
import "./UserDashboardLayout.css";

const UserDashboardLayout = () => {
  const { user, isAdmin } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user || isAdmin) {
    return <Navigate to={"/"} />;
  }

  const isPassengerRoute = location.pathname.includes("/user/home") ||
    location.pathname.includes("/user/wallet") ||
    location.pathname.includes("/user/support") ||
    location.pathname.includes("/user/profile");

  return (
    <Container fluid>
      <Toaster />
      <Row className="">
        <Col xs={4} md={3} lg={2} className="sidebar-column px-1">
          <UserSidebar />
        </Col>
        <Col xs={8} md={9} lg={10} className="main-column py-2 px-1" style={{ paddingBottom: isPassengerRoute ? "80px" : "16px" }}>
          <Outlet />
        </Col>
      </Row>

      {/* Bottom Navigation for Passenger Dashboard */}
      {isPassengerRoute && (
        <Nav className="bottom-nav fixed-bottom bg-white border-top shadow-lg">
          <NavLink
            to="/user/home"
            className={({ isActive }) =>
              `bottom-nav-item ${isActive ? "active" : ""}`
            }
          >
            <House size={24} />
            <span>Home</span>
          </NavLink>
          <NavLink
            to="/user/wallet"
            className={({ isActive }) =>
              `bottom-nav-item ${isActive ? "active" : ""}`
            }
          >
            <Wallet size={24} />
            <span>Wallet</span>
          </NavLink>
          <NavLink
            to="/user/profile"
            className={({ isActive }) =>
              `bottom-nav-item ${isActive ? "active" : ""}`
            }
          >
            <Person size={24} />
            <span>Profile</span>
          </NavLink>
          <NavLink
            to="/user/support"
            className={({ isActive }) =>
              `bottom-nav-item ${isActive ? "active" : ""}`
            }
          >
            <Headset size={24} />
            <span>Support</span>
          </NavLink>
        </Nav>
      )}
    </Container>
  );
};

export default UserDashboardLayout;
