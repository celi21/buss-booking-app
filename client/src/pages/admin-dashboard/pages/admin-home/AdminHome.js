import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Badge,
  Table,
  Accordion,
  Modal,
  Form,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import {
  ArrowUp,
  ArrowDown,
  Calendar,
  Lock,
  Plus,
  CheckCircle,
  PlayCircle,
  XCircle,
  Trash,
  Eye,
  CurrencyDollar,
} from "react-bootstrap-icons";
import { Link } from "react-router-dom";

const AdminHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    source: "Admin",
    tag: "Normal",
  });

  // Refund Modal State
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedRefundTask, setSelectedRefundTask] = useState(null);
  const [refundForm, setRefundForm] = useState({
    refundAmount: "",
    refundReason: "",
    stripeRefundRef: "",
  });

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchDashboardData();
    fetchTasks();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/booking/get-dashboard-stats`,
        {},
        config
      );
      if (response.data && response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      setTasksLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/task/get-tasks`,
        {},
        config
      );
      if (response.data && response.data.success) {
        setTasks(response.data.data.tasks);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTasksLoading(false);
    }
  };

  const handleOpenRefund = (task) => {
    const parseRefundDetails = (description) => {
      if (!description) return {};
      const lines = description.split("\n");
      const details = {};
      lines.forEach((line) => {
        const parts = line.split(":");
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const val = parts.slice(1).join(":").trim();
          details[key] = val;
        }
      });
      return {
        customerName: details["Customer Name"] || "",
        bookingId: details["Booking ID"] || "",
        refundAmount: details["Refund Amount"] ? details["Refund Amount"].replace("$", "") : "",
        refundPercentage: details["Refund Percentage"] ? details["Refund Percentage"].replace("%", "") : "",
        refundReason: details["Refund Reason"] || "",
        stripePaymentId: details["Stripe Payment ID"] || "",
      };
    };

    const details = parseRefundDetails(task.description);
    setSelectedRefundTask(task);
    setRefundForm({
      refundAmount: details.refundAmount || "",
      refundReason: details.refundReason || "Manual refund",
      stripeRefundRef: "",
    });
    setShowRefundModal(true);
  };

  const handleSubmitRefund = async () => {
    if (!selectedRefundTask?.relatedBooking?._id) {
      toast.error("Booking ID is required to mark as refunded");
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/booking/mark-refunded`,
        {
          taskId: selectedRefundTask._id,
          bookingId: selectedRefundTask.relatedBooking._id,
          refundAmount: refundForm.refundAmount,
          refundReason: refundForm.refundReason,
          stripeRefundRef: refundForm.stripeRefundRef,
        },
        config
      );
      if (response.data && response.data.success) {
        toast.success("Booking marked as Refunded and task completed!");
        setShowRefundModal(false);
        setSelectedRefundTask(null);
        fetchTasks();
      } else {
        toast.error(response.data.message || "Failed to mark as refunded");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to process refund action");
    }
  };

  const createTask = async () => {
    if (!newTask.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/task/create-task`,
        newTask,
        config
      );
      if (response.data && response.data.success) {
        toast.success("Task created successfully");
        setNewTask({ title: "", description: "", source: "Admin", tag: "Normal" });
        setShowTaskModal(false);
        fetchTasks();
      }
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/task/update-task-status`,
        { taskId, status },
        config
      );
      if (response.data && response.data.success) {
        toast.success("Task status updated");
        fetchTasks();
      }
    } catch (error) {
      toast.error("Failed to update task status");
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/task/delete-task`,
        { taskId },
        config
      );
      if (response.data && response.data.success) {
        toast.success("Task deleted successfully");
        fetchTasks();
      }
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      confirmed: "success",
      pending: "warning",
      cancelled: "danger",
      refunded: "secondary",
    };
    return variants[status] || "primary";
  };

  const getTaskStatusBadge = (status) => {
    const variants = {
      Pending: "warning",
      Started: "info",
      Completed: "success",
    };
    return variants[status] || "secondary";
  };

  if (loading) {
    return (
      <Container fluid>
        <LoadingSpinner />
      </Container>
    );
  }

  const bookingChange = dashboardData?.newBookingsToday - dashboardData?.newBookingsYesterday;
  const percentChange = dashboardData?.newBookingsYesterday > 0
    ? ((bookingChange / dashboardData?.newBookingsYesterday) * 100).toFixed(1)
    : 0;

  return (
    <Container fluid>
      <h4 className="mb-4">Admin Dashboard</h4>

      {/* 1. New Bookings Today */}
      <Row className="mb-4">
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-muted mb-3">New Bookings Today</Card.Title>
              <h2 className="mb-2">{dashboardData?.newBookingsToday || 0}</h2>
              <div className="d-flex align-items-center">
                {bookingChange >= 0 ? (
                  <>
                    <ArrowUp className="text-success me-2" size={20} />
                    <span className="text-success">+{percentChange}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="text-danger me-2" size={20} />
                    <span className="text-danger">{percentChange}%</span>
                  </>
                )}
                <span className="text-muted ms-2">vs yesterday</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 2. Latest Bookings Preview */}
      <Row className="mb-4">
        <Col xs={12}>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Latest Bookings (Preview)</Accordion.Header>
              <Accordion.Body>
                <div className="table-responsive">
                  <Table striped hover size="sm">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Passenger</th>
                        <th>Route</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData?.latestBookings?.slice(0, 10).map((booking) => (
                        <tr key={booking.bookingId}>
                          <td>
                            <strong>{booking.bookingId}</strong>
                          </td>
                          <td>{booking.passengerName || "N/A"}</td>
                          <td>
                            <small>
                              {booking.from} → {booking.to}
                            </small>
                          </td>
                          <td>{booking.bookingDate}</td>
                          <td>
                            <Badge bg={getStatusBadge(booking.status)}>
                              {booking.status}
                            </Badge>
                          </td>
                          <td>
                            <Link
                              to={`/booking/${booking.bookingId}`}
                              target="_blank"
                              className="btn btn-sm btn-outline-primary"
                            >
                              <Eye size={14} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                {dashboardData?.latestBookings?.length === 0 && (
                  <p className="text-center text-muted">No bookings yet</p>
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>

      {/* 3. Fully Booked Dates */}
      <Row className="mb-4">
        <Col xs={12}>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <Lock className="me-2" /> Fully Booked Dates
              </Accordion.Header>
              <Accordion.Body>
                {dashboardData?.fullyBookedDates?.length > 0 ? (
                  <div className="table-responsive">
                    <Table striped hover size="sm">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Route</th>
                          <th>Total Seats</th>
                          <th>Available</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.fullyBookedDates.map((item, idx) => (
                          <tr key={idx}>
                            <td>
                              <Calendar className="me-2" />
                              {item.date}
                            </td>
                            <td>{item.route}</td>
                            <td>{item.totalSeats}</td>
                            <td>{item.availableSeats}</td>
                            <td>
                              <Badge bg="danger">
                                <Lock size={12} className="me-1" />
                                Fully Booked
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center text-muted">No fully booked dates</p>
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>

      {/* 4. Dispatcher Task Queue */}
      <Row className="mb-4">
        <Col xs={12}>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Dispatcher Task Queue</Accordion.Header>
              <Accordion.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Active Tasks</h6>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setShowTaskModal(true)}
                  >
                    <Plus className="me-1" /> New Task
                  </Button>
                </div>

                {tasksLoading ? (
                  <LoadingSpinner />
                ) : tasks.length > 0 ? (
                  <div className="table-responsive">
                    <Table striped hover size="sm">
                      <thead>
                        <tr>
                          <th>Task</th>
                          <th>Source</th>
                          <th>Priority</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks.map((task) => (
                          <tr key={task._id}>
                            <td>
                              <strong>{task.title}</strong>
                              {task.description && (
                                <div>
                                  <small className="text-muted">
                                    {task.description.substring(0, 50)}
                                    {task.description.length > 50 ? "..." : ""}
                                  </small>
                                </div>
                              )}
                            </td>
                            <td>
                              <Badge bg="secondary">{task.source}</Badge>
                            </td>
                            <td>
                              <Badge bg={task.tag === "URGENT" ? "danger" : "info"}>
                                {task.tag}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={getTaskStatusBadge(task.status)}>
                                {task.status}
                              </Badge>
                            </td>
                            <td>
                                <div className="d-flex gap-1">
                                  {task.title && task.title.startsWith("Refund Request:") && task.status !== "Completed" && (
                                    <Button
                                      size="sm"
                                      variant="warning"
                                      className="text-white"
                                      onClick={() => handleOpenRefund(task)}
                                      title="Mark Refunded"
                                    >
                                      <CurrencyDollar size={14} className="me-1" /> Mark
                                    </Button>
                                  )}
                                  {task.status === "Pending" && (
                                    <Button
                                      size="sm"
                                      variant="outline-info"
                                      onClick={() => updateTaskStatus(task._id, "Started")}
                                      title="Mark as Started"
                                    >
                                      <PlayCircle size={14} />
                                    </Button>
                                  )}
                                {task.status === "Started" && (
                                  <Button
                                    size="sm"
                                    variant="outline-success"
                                    onClick={() => updateTaskStatus(task._id, "Completed")}
                                    title="Mark as Completed"
                                  >
                                    <CheckCircle size={14} />
                                  </Button>
                                )}
                                {task.status === "Completed" && (
                                  <Button
                                    size="sm"
                                    variant="outline-warning"
                                    onClick={() => updateTaskStatus(task._id, "Pending")}
                                    title="Reopen Task"
                                  >
                                    <XCircle size={14} />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() => deleteTask(task._id)}
                                  title="Delete Task"
                                >
                                  <Trash size={14} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center text-muted">No tasks yet</p>
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>

      {/* 5. Live Trip Feed (Today Only) */}
      <Row className="mb-4">
        <Col xs={12}>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Live Trip Feed (Today)</Accordion.Header>
              <Accordion.Body>
                {dashboardData?.todayTrips?.length > 0 ? (
                  <Row>
                    {dashboardData.todayTrips.map((routeData, idx) => (
                      <Col xs={12} md={6} key={idx} className="mb-3">
                        <Card className="border-primary">
                          <Card.Header className="bg-primary text-white">
                            <strong>{routeData.routeName}</strong>
                          </Card.Header>
                          <Card.Body>
                            <div className="mb-2">
                              <strong>Active Trips:</strong> {routeData.trips.length}
                            </div>
                            <div className="mb-3">
                              <strong>Total Passengers:</strong>{" "}
                              {routeData.totalPassengers}
                            </div>
                            <div className="table-responsive">
                              <Table size="sm" bordered>
                                <thead>
                                  <tr>
                                    <th>Bus</th>
                                    <th>Passengers</th>
                                    <th>Capacity</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {routeData.trips.map((trip, tripIdx) => (
                                    <tr key={tripIdx}>
                                      <td>{trip.busName}</td>
                                      <td>{trip.passengers}</td>
                                      <td>
                                        {trip.passengers}/{trip.totalSeats}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <p className="text-center text-muted">No trips scheduled for today</p>
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>

      {/* New Task Modal */}
      <Modal show={showTaskModal} onHide={() => setShowTaskModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Task Title *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter task description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Source</Form.Label>
              <Form.Select
                value={newTask.source}
                onChange={(e) => setNewTask({ ...newTask, source: e.target.value })}
              >
                <option value="Admin">Admin</option>
                <option value="Passenger">Passenger</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                value={newTask.tag}
                onChange={(e) => setNewTask({ ...newTask, tag: e.target.value })}
              >
                <option value="Normal">Normal</option>
                <option value="URGENT">URGENT</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTaskModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={createTask}>
            Create Task
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Manual Refund Confirmation Modal */}
      <Modal show={showRefundModal} onHide={() => setShowRefundModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Process Manual Refund</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted mb-3">
            Confirm that the refund has been processed manually in Stripe. Submitting this form updates the booking status to "Refunded" and marks the task as completed.
          </p>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Refund Amount ($)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="Enter refund amount"
                value={refundForm.refundAmount}
                onChange={(e) => setRefundForm({ ...refundForm, refundAmount: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stripe Refund Reference ID (optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. re_3PtfqyAFFo9b3crI1QzKlVPT"
                value={refundForm.stripeRefundRef}
                onChange={(e) => setRefundForm({ ...refundForm, stripeRefundRef: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Refund Reason</Form.Label>
              <Form.Control
                type="text"
                placeholder="Reason for refund"
                value={refundForm.refundReason}
                onChange={(e) => setRefundForm({ ...refundForm, refundReason: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRefundModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitRefund}>
            Mark Refunded
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminHome;
