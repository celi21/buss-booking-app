import React, { useEffect, useState } from "react";
import { Container, Table, Badge, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";

const Reports = () => {
    const [deletionLogs, setDeletionLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token, isAdmin } = useSelector((state) => state.auth);

    useEffect(() => {
        fetchDeletionLogs();
    }, []);

    const fetchDeletionLogs = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/booking/fetch-deletion-logs`,
                {},
                config
            );
            if (response.data && response.data.success) {
                setDeletionLogs(response.data.data.logs);
            } else {
                toast.error(response.data.message || "Failed to fetch deletion logs", {
                    duration: 4000,
                });
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                toast.error(error.response.data.message, {
                    duration: 4000,
                });
            } else {
                toast.error(error.message || "Failed to fetch deletion logs", {
                    duration: 4000,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    return (
        <Container fluid>
            <h4 className="mb-3">Deletion Reports</h4>
            <Card>
                <Card.Body>
                    <Card.Title>Booking Deletion Logs</Card.Title>
                    <Card.Text className="text-muted">
                        This page shows all bookings that have been deleted by administrators, including timestamps and details.
                    </Card.Text>

                    {loading ? (
                        <LoadingSpinner />
                    ) : deletionLogs.length === 0 ? (
                        <div className="text-center py-5">
                            <p className="text-muted">No deletion logs found.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Booking ID</th>
                                        <th>Customer Details</th>
                                        <th>Route Details</th>
                                        <th>Booking Date</th>
                                        <th>Seats</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Deleted By</th>
                                        <th>Deleted At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deletionLogs.map((log, index) => (
                                        <tr key={log._id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <strong>{log.bookingId}</strong>
                                            </td>
                                            <td>
                                                <div>
                                                    <strong>{log.bookingDetails.customerName}</strong>
                                                    <br />
                                                    <small className="text-muted">
                                                        {log.bookingDetails.email}
                                                    </small>
                                                    <br />
                                                    <small className="text-muted">
                                                        {log.bookingDetails.phone}
                                                    </small>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <strong>{log.bookingDetails.route}</strong>
                                                    <br />
                                                    <small>
                                                        From: {log.bookingDetails.from}
                                                    </small>
                                                    <br />
                                                    <small>
                                                        To: {log.bookingDetails.to}
                                                    </small>
                                                </div>
                                            </td>
                                            <td>{log.bookingDetails.bookingDate}</td>
                                            <td>
                                                {log.bookingDetails.seatDetails?.map((seat, idx) => (
                                                    <div key={idx}>
                                                        <small>
                                                            {seat.name}: {seat.seats}
                                                        </small>
                                                    </div>
                                                ))}
                                            </td>
                                            <td>${log.bookingDetails.totalAmount}</td>
                                            <td>
                                                <Badge
                                                    bg={
                                                        log.bookingDetails.status === "confirmed"
                                                            ? "success"
                                                            : log.bookingDetails.status === "pending"
                                                                ? "warning"
                                                                : log.bookingDetails.status === "cancelled"
                                                                    ? "danger"
                                                                    : "secondary"
                                                    }
                                                >
                                                    {log.bookingDetails.status}
                                                </Badge>
                                            </td>
                                            <td>
                                                {log.deletedBy?.name || log.deletedBy?.email || "Admin"}
                                            </td>
                                            <td>
                                                <small>{formatDate(log.deletedAt)}</small>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Reports;
