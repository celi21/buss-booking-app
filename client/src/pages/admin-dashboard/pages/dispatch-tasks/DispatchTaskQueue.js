import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Badge,
  Table,
  Modal,
  Form,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import {
  Plus,
  CheckCircle,
  PlayCircle,
  XCircle,
  Trash,
  CurrencyDollar,
} from "react-bootstrap-icons";

// Helper function to parse refund details from task description
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

const DispatchTaskQueue = () => {
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
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
    fetchTasks();
  }, []);

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
      toast.error("Failed to fetch tasks");
    } finally {
      setTasksLoading(false);
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
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/task/create-task`,
        newTask,
        config
      );
      toast.success("Task created successfully");
      setNewTask({ title: "", description: "", source: "Admin", tag: "Normal" });
      setShowTaskModal(false);
      fetchTasks();
    } catch (error) {
      console.error(error);
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
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/task/update-task-status`,
        { taskId, status },
        config
      );
      toast.success("Task status updated");
      fetchTasks();
    } catch (error) {
      console.error(error);
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
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/task/delete-task`,
        { taskId },
        config
      );
      toast.success("Task deleted successfully");
      fetchTasks();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete task");
    }
  };

  // Open refund processing form
  const handleOpenRefund = (task) => {
    const details = parseRefundDetails(task.description);
    setSelectedRefundTask(task);
    setRefundForm({
      refundAmount: details.refundAmount || "",
      refundReason: details.refundReason || "Manual refund",
      stripeRefundRef: "",
    });
    setShowRefundModal(true);
  };

  // Submit manual refund details
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

  const getTaskStatusBadge = (status) => {
    const variants = {
      Pending: "warning",
      Started: "info",
      Completed: "success",
    };
    return variants[status] || "secondary";
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">Dispatch Task Queue</h4>
            <p className="text-muted mb-0">Manage passenger requests, refunds, and operational tasks</p>
          </div>
          <Button variant="primary" onClick={() => setShowTaskModal(true)}>
            <Plus className="me-1" /> New Task
          </Button>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Body>
              {tasksLoading ? (
                <LoadingSpinner />
              ) : tasks.length > 0 ? (
                <div className="table-responsive">
                  <Table striped hover verticalAlign="middle">
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
                      {tasks.map((task) => {
                        const isRefund = task.title && task.title.startsWith("Refund Request:");
                        return (
                          <tr key={task._id}>
                            <td>
                              <strong>{task.title}</strong>
                              {task.description && (
                                <div style={{ whiteSpace: "pre-line", marginTop: 5 }}>
                                  <small className="text-muted">{task.description}</small>
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
                                {isRefund && task.status !== "Completed" && (
                                  <Button
                                    size="sm"
                                    variant="warning"
                                    className="text-white"
                                    onClick={() => handleOpenRefund(task)}
                                    title="Mark Refunded"
                                  >
                                    <CurrencyDollar size={14} className="me-1" /> Mark Refunded
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
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <p className="text-center text-muted py-4">No tasks found</p>
              )}
            </Card.Body>
          </Card>
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

export default DispatchTaskQueue;
