import React, { useState } from "react";
import { Button, Col, Container, Offcanvas, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import AdminSidebar from "./components/admin-side-bar/AdminSidebar";
import { Toaster } from "react-hot-toast";
import { List } from "react-bootstrap-icons";

const AdminDashboardLayout = () => {
  const { user, isAdmin } = useSelector((state) => state.auth);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  if (!user || !isAdmin) {
    return <Navigate to={"/"} />;
  }

  return (
    <Container fluid>
      <Toaster />

      {/* Mobile Header Bar */}
      <div className="d-md-none bg-light p-2 mb-2 rounded border d-flex justify-content-between align-items-center">
        <span className="fw-bold fs-6 text-primary">Admin Portal</span>
        <Button
          variant="outline-primary"
          size="sm"
          className="d-flex align-items-center gap-1"
          onClick={() => setShowMobileMenu(true)}
        >
          <List size={20} /> Menu
        </Button>
      </div>

      {/* Mobile Offcanvas Sidebar Drawer */}
      <Offcanvas
        show={showMobileMenu}
        onHide={() => setShowMobileMenu(false)}
        className="d-md-none"
        placement="start"
      >
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title className="fw-bold text-primary">Admin Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <AdminSidebar onItemClick={() => setShowMobileMenu(false)} />
        </Offcanvas.Body>
      </Offcanvas>

      <Row className="">
        {/* Desktop / Tablet Sidebar */}
        <Col md={3} lg={2} className="sidebar-column px-1 d-none d-md-block">
          <AdminSidebar />
        </Col>

        {/* Main Content Column */}
        <Col xs={12} md={9} lg={10} className="main-column py-2 px-2 px-md-3">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboardLayout;
