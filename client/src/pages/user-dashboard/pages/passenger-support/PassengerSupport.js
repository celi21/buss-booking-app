import React, { useEffect, useState } from "react";
import {
    Container,
    Card,
    Form,
    Button,
    ListGroup,
    Badge,
    Row,
    Col,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import { Send, CheckCircle, Clock, PlayCircle } from "react-bootstrap-icons";

const PassengerSupport = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [newRequest, setNewRequest] = useState({
        requestType: "",
        description: "",
        bookingId: "",
    });

    const { token } = useSelector((state) => state.auth);

    const requestTypes = [
        "Change pickup address",
        "Change drop-off address",
        "Update phone number",
        "Add note for driver",
        "Cancel trip",
        "Report issue",
        "Other",
    ];

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/booking/get-passenger-requests`,
                {},
                config
            );
            if (response.data && response.data.success) {
                setRequests(response.data.data.requests);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const submitRequest = async (e) => {
        e.preventDefault();

        if (!newRequest.requestType || !newRequest.description) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setSubmitting(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/booking/submit-passenger-request`,
                newRequest,
                config
            );
            if (response.data && response.data.success) {
                toast.success("Request submitted successfully");
                setNewRequest({ requestType: "", description: "", bookingId: "" });
                fetchRequests();
            }
        } catch (error) {
            toast.error("Failed to submit request");
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status) => {
        if (status === "Submitted")
            return (
                <Badge bg="warning">
                    <Clock className="me-1" /> Submitted
                </Badge>
            );
        if (status === "In Progress")
            return (
                <Badge bg="info">
                    <PlayCircle className="me-1" /> In Progress
                </Badge>
            );
        if (status === "Resolved")
            return (
                <Badge bg="success">
                    <CheckCircle className="me-1" /> Resolved
                </Badge>
            );
        return <Badge bg="secondary">{status}</Badge>;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Container className="mt-4">
            <h4 className="mb-4">Support</h4>

            {/* Submit Request Form */}
            <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">Submit Request</h5>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={submitRequest}>
                        <Form.Group className="mb-3">
                            <Form.Label>Request Type *</Form.Label>
                            <Form.Select
                                value={newRequest.requestType}
                                onChange={(e) =>
                                    setNewRequest({ ...newRequest, requestType: e.target.value })
                                }
                                required
                            >
                                <option value="">Select request type...</option>
                                {requestTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Please describe your request in detail..."
                                value={newRequest.description}
                                onChange={(e) =>
                                    setNewRequest({ ...newRequest, description: e.target.value })
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Booking ID (Optional)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter booking ID if related to a specific trip"
                                value={newRequest.bookingId}
                                onChange={(e) =>
                                    setNewRequest({ ...newRequest, bookingId: e.target.value })
                                }
                            />
                            <Form.Text className="text-muted">
                                Leave blank if not related to a specific booking
                            </Form.Text>
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            disabled={submitting}
                            className="w-100"
                        >
                            <Send className="me-2" />
                            {submitting ? "Submitting..." : "Submit Request"}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            {/* Active Requests */}
            <Card className="shadow-sm">
                <Card.Header>
                    <h5 className="mb-0">Active Requests</h5>
                </Card.Header>
                <Card.Body>
                    {loading ? (
                        <LoadingSpinner />
                    ) : requests.length > 0 ? (
                        <ListGroup variant="flush">
                            {requests.map((request) => (
                                <ListGroup.Item key={request._id}>
                                    <Row>
                                        <Col xs={12} md={8}>
                                            <h6 className="mb-2">{request.requestType}</h6>
                                            <p className="mb-2 text-muted">
                                                <small>{request.description}</small>
                                            </p>
                                            {request.bookingId && (
                                                <small className="text-muted">
                                                    Booking ID: {request.bookingId}
                                                </small>
                                            )}
                                            <div className="mt-2">
                                                <small className="text-muted">
                                                    Submitted: {formatDate(request.createdAt)}
                                                </small>
                                            </div>
                                        </Col>
                                        <Col xs={12} md={4} className="text-md-end">
                                            {getStatusBadge(request.status)}
                                            {request.tag === "URGENT" && (
                                                <Badge bg="danger" className="ms-2">
                                                    URGENT
                                                </Badge>
                                            )}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <div className="text-center py-5">
                            <p className="text-muted">No active requests</p>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default PassengerSupport;
