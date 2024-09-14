import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import UserSidebar from "./components/user-side-bar/UserSidebar.js";
import { Toaster } from "react-hot-toast";

const UserDashboardLayout = () => {
  const { user, isAdmin } = useSelector((state) => state.auth);
  if (!user || isAdmin) {
    return <Navigate to={"/"} />;
  }

  return (
    <Container fluid>
      <Toaster />
      <Row className="">
        <Col xs={4} md={3} lg={2} className="sidebar-column px-1">
          <UserSidebar />
        </Col>
        <Col xs={8} md={9} lg={10} className="main-column py-2 px-1">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboardLayout;
