import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import AdminSidebar from "./components/admin-side-bar/AdminSidebar";

const AdminDashboardLayout = () => {
  const { user, isAdmin } = useSelector((state) => state.auth);
  if (!user || !isAdmin) {
    return <Navigate to={"/"} />;
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col xs={4} md={3} lg={3} className="sidebar-column">
          <AdminSidebar />
        </Col>
        <Col xs={8} md={9} lg={9} className="main-column">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboardLayout;
