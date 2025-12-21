import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Table,
    Button,
    Badge,
    Modal,
    OverlayTrigger,
    Tooltip,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import {
    GripVertical,
    InfoCircle,
    FileEarmarkPdf,
    FiletypeCsv,
    Eye,
} from "react-bootstrap-icons";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Dispatch = () => {
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [trips, setTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [manifest, setManifest] = useState([]);
    const [loading, setLoading] = useState(false);
    const [manifestLoading, setManifestLoading] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedPassenger, setSelectedPassenger] = useState(null);
    const [editedDetails, setEditedDetails] = useState({});
    const [draggedIndex, setDraggedIndex] = useState(null);

    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (selectedDate) {
            fetchTrips();
        }
    }, [selectedDate]);

    useEffect(() => {
        if (selectedTrip) {
            fetchManifest();
        }
    }, [selectedTrip]);

    const fetchTrips = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/booking/get-dispatch-trips`,
                { date: selectedDate },
                config
            );
            if (response.data && response.data.success) {
                setTrips(response.data.data.trips);
                if (response.data.data.trips.length > 0 && !selectedTrip) {
                    setSelectedTrip(response.data.data.trips[0]);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch trips");
        } finally {
            setLoading(false);
        }
    };

    const fetchManifest = async () => {
        if (!selectedTrip) return;

        try {
            setManifestLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/booking/get-passenger-manifest`,
                { busId: selectedTrip.busId, date: selectedDate },
                config
            );
            if (response.data && response.data.success) {
                setManifest(response.data.data.manifest);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch manifest");
        } finally {
            setManifestLoading(false);
        }
    };

    const updatePassengerStatus = async (bookingId, status) => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/booking/update-passenger-status`,
                { bookingId, status },
                config
            );
            if (response.data && response.data.success) {
                toast.success("Status updated successfully");
                fetchManifest();
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const savePassengerDetails = async () => {
        if (!selectedPassenger) return;

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/booking/update-passenger-details`,
                {
                    bookingId: selectedPassenger._id,
                    ...editedDetails,
                },
                config
            );
            if (response.data && response.data.success) {
                toast.success("Details updated successfully");
                setShowDetailsModal(false);
                fetchManifest();
            }
        } catch (error) {
            toast.error("Failed to update details");
        }
    };

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newManifest = [...manifest];
        const draggedItem = newManifest[draggedIndex];
        newManifest.splice(draggedIndex, 1);
        newManifest.splice(index, 0, draggedItem);

        setManifest(newManifest);
        setDraggedIndex(index);
    };

    const handleDragEnd = async () => {
        if (draggedIndex === null) return;

        // Save new order to backend
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const manifestOrder = manifest.map((item) => ({
                bookingId: item._id,
            }));
            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/booking/update-pickup-order`,
                { manifestOrder },
                config
            );
            toast.success("Pickup order updated");
        } catch (error) {
            toast.error("Failed to update pickup order");
        }

        setDraggedIndex(null);
    };

    const openDetailsModal = (passenger) => {
        setSelectedPassenger(passenger);
        setEditedDetails({
            phone: passenger.phone,
            pickupAddress: passenger.pickupAddress,
            dropoffAddress: passenger.dropoffAddress,
            notes: passenger.notes,
        });
        setShowDetailsModal(true);
    };

    const exportDriverPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Driver Manifest", 14, 15);
        doc.setFontSize(10);
        doc.text(`Route: ${selectedTrip?.route || "N/A"}`, 14, 25);
        doc.text(`Date: ${selectedDate}`, 14, 30);
        doc.text(`Departure: ${selectedTrip?.departureTime || "N/A"}`, 14, 35);

        const tableData = manifest.map((p, idx) => [
            idx + 1,
            p.clientName,
            p.pickupAddress,
            p.dropoffAddress,
            p.numberOfPassengers,
            p.notes || "-",
            `$${p.paymentAmount}`,
        ]);

        doc.autoTable({
            startY: 40,
            head: [
                ["#", "Client Name", "Pickup", "Dropoff", "Passengers", "Notes", "Amount"],
            ],
            body: tableData,
            styles: { fontSize: 8 },
        });

        doc.save(`driver-manifest-${selectedDate}.pdf`);
        toast.success("Driver manifest exported");
    };

    const exportDispatchPDF = () => {
        const doc = new jsPDF("landscape");
        doc.setFontSize(16);
        doc.text("Dispatch Manifest", 14, 15);
        doc.setFontSize(10);
        doc.text(`Route: ${selectedTrip?.route || "N/A"}`, 14, 25);
        doc.text(`Date: ${selectedDate}`, 14, 30);

        const tableData = manifest.map((p, idx) => [
            idx + 1,
            p.clientName,
            p.phone,
            p.email,
            p.pickupAddress,
            p.dropoffAddress,
            p.numberOfPassengers,
            `$${p.paymentAmount}`,
            p.boardingStatus,
        ]);

        doc.autoTable({
            startY: 35,
            head: [
                [
                    "#",
                    "Name",
                    "Phone",
                    "Email",
                    "Pickup",
                    "Dropoff",
                    "Pax",
                    "Amount",
                    "Status",
                ],
            ],
            body: tableData,
            styles: { fontSize: 7 },
        });

        doc.save(`dispatch-manifest-${selectedDate}.pdf`);
        toast.success("Dispatch manifest exported");
    };

    const exportDriverCSV = () => {
        const headers = [
            "Order",
            "Client Name",
            "Pickup Address",
            "Dropoff Address",
            "Passengers",
            "Notes",
            "Amount",
        ];
        const rows = manifest.map((p, idx) => [
            idx + 1,
            p.clientName,
            p.pickupAddress,
            p.dropoffAddress,
            p.numberOfPassengers,
            p.notes || "-",
            p.paymentAmount,
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `driver-manifest-${selectedDate}.csv`;
        a.click();
        toast.success("Driver manifest exported");
    };

    const exportDispatchCSV = () => {
        const headers = [
            "Order",
            "Name",
            "Phone",
            "Email",
            "Pickup",
            "Dropoff",
            "Passengers",
            "Amount",
            "Status",
        ];
        const rows = manifest.map((p, idx) => [
            idx + 1,
            p.clientName,
            p.phone,
            p.email,
            p.pickupAddress,
            p.dropoffAddress,
            p.numberOfPassengers,
            p.paymentAmount,
            p.boardingStatus,
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `dispatch-manifest-${selectedDate}.csv`;
        a.click();
        toast.success("Dispatch manifest exported");
    };

    const getStatusBadge = (status) => {
        const variants = {
            "Not Boarded": "secondary",
            Boarded: "success",
            "No-Show": "danger",
            Cancelled: "warning",
        };
        return variants[status] || "secondary";
    };

    return (
        <Container fluid>
            <h4 className="mb-4">Dispatch - Passenger Manifest</h4>

            {/* Trip Selector */}
            <Card className="mb-4">
                <Card.Body>
                    <Row>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Select Trip</Form.Label>
                                <Form.Select
                                    value={selectedTrip?.tripId || ""}
                                    onChange={(e) => {
                                        const trip = trips.find((t) => t.tripId === e.target.value);
                                        setSelectedTrip(trip);
                                    }}
                                    disabled={loading || trips.length === 0}
                                >
                                    {trips.length === 0 ? (
                                        <option>No trips available</option>
                                    ) : (
                                        trips.map((trip) => (
                                            <option key={trip.tripId} value={trip.tripId}>
                                                {trip.route} - {trip.departureTime} ({trip.totalSeats -
                                                    trip.availableSeats}/{trip.totalSeats} seats)
                                            </option>
                                        ))
                                    )}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3} className="d-flex align-items-end">
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={fetchManifest}
                                disabled={!selectedTrip}
                            >
                                Refresh Manifest
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Export Options */}
            {manifest.length > 0 && (
                <Card className="mb-4">
                    <Card.Body>
                        <Row>
                            <Col>
                                <h6>Driver Export (Restricted)</h6>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    className="me-2"
                                    onClick={exportDriverPDF}
                                >
                                    <FileEarmarkPdf className="me-1" /> PDF
                                </Button>
                                <Button variant="success" size="sm" onClick={exportDriverCSV}>
                                    <FiletypeCsv className="me-1" /> CSV
                                </Button>
                            </Col>
                            <Col>
                                <h6>Dispatch Export (Full)</h6>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    className="me-2"
                                    onClick={exportDispatchPDF}
                                >
                                    <FileEarmarkPdf className="me-1" /> PDF
                                </Button>
                                <Button variant="success" size="sm" onClick={exportDispatchCSV}>
                                    <FiletypeCsv className="me-1" /> CSV
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}

            {/* Passenger Manifest */}
            <Card>
                <Card.Header>
                    <h5 className="mb-0">
                        Passenger Manifest ({manifest.length} passengers)
                    </h5>
                    <small className="text-muted">
                        Drag rows to reorder pickup sequence
                    </small>
                </Card.Header>
                <Card.Body>
                    {manifestLoading ? (
                        <LoadingSpinner />
                    ) : manifest.length === 0 ? (
                        <p className="text-center text-muted">
                            No passengers for this trip
                        </p>
                    ) : (
                        <div className="table-responsive">
                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th style={{ width: "30px" }}></th>
                                        <th>#</th>
                                        <th>Client Name</th>
                                        <th>Phone</th>
                                        <th>Pickup Address</th>
                                        <th>Drop-off Address</th>
                                        <th>Notes</th>
                                        <th>Payment</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {manifest.map((passenger, index) => (
                                        <tr
                                            key={passenger._id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, index)}
                                            onDragOver={(e) => handleDragOver(e, index)}
                                            onDragEnd={handleDragEnd}
                                            style={{
                                                cursor: "move",
                                                opacity: draggedIndex === index ? 0.5 : 1,
                                            }}
                                        >
                                            <td className="text-center">
                                                <GripVertical />
                                            </td>
                                            <td>{index + 1}</td>
                                            <td>
                                                <strong>{passenger.clientName}</strong>
                                            </td>
                                            <td>{passenger.phone}</td>
                                            <td>
                                                <small>{passenger.pickupAddress}</small>
                                            </td>
                                            <td>
                                                <small>{passenger.dropoffAddress}</small>
                                            </td>
                                            <td className="text-center">
                                                {passenger.notes ? (
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={
                                                            <Tooltip>{passenger.notes}</Tooltip>
                                                        }
                                                    >
                                                        <InfoCircle className="text-info" />
                                                    </OverlayTrigger>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td>${passenger.paymentAmount}</td>
                                            <td>
                                                <Form.Select
                                                    size="sm"
                                                    value={passenger.boardingStatus}
                                                    onChange={(e) =>
                                                        updatePassengerStatus(
                                                            passenger._id,
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="Not Boarded">Not Boarded</option>
                                                    <option value="Boarded">Boarded</option>
                                                    <option value="No-Show">No-Show</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </Form.Select>
                                            </td>
                                            <td>
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => openDetailsModal(passenger)}
                                                >
                                                    <Eye size={14} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Passenger Details Modal */}
            <Modal
                show={showDetailsModal}
                onHide={() => setShowDetailsModal(false)}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Passenger Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedPassenger && (
                        <>
                            <h6>Client Info</h6>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <strong>Name:</strong> {selectedPassenger.clientName}
                                </Col>
                                <Col md={6}>
                                    <strong>Email:</strong> {selectedPassenger.email}
                                </Col>
                            </Row>

                            <h6>Booking Info</h6>
                            <Row className="mb-3">
                                <Col md={4}>
                                    <strong>Booking ID:</strong> {selectedPassenger.bookingId}
                                </Col>
                                <Col md={4}>
                                    <strong>Passengers:</strong>{" "}
                                    {selectedPassenger.numberOfPassengers}
                                </Col>
                                <Col md={4}>
                                    <strong>Suitcases:</strong> {selectedPassenger.suitcases}
                                </Col>
                            </Row>

                            <h6>Payment Info</h6>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <strong>Total Paid:</strong> ${selectedPassenger.paymentAmount}
                                </Col>
                                <Col md={6}>
                                    <strong>Flex Option:</strong>{" "}
                                    {selectedPassenger.flexOption ? "Yes" : "No"}
                                </Col>
                            </Row>

                            <h6>Editable Fields</h6>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editedDetails.phone || ""}
                                        onChange={(e) =>
                                            setEditedDetails({ ...editedDetails, phone: e.target.value })
                                        }
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Pickup Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editedDetails.pickupAddress || ""}
                                        onChange={(e) =>
                                            setEditedDetails({
                                                ...editedDetails,
                                                pickupAddress: e.target.value,
                                            })
                                        }
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Drop-off Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editedDetails.dropoffAddress || ""}
                                        onChange={(e) =>
                                            setEditedDetails({
                                                ...editedDetails,
                                                dropoffAddress: e.target.value,
                                            })
                                        }
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Notes</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={editedDetails.notes || ""}
                                        onChange={(e) =>
                                            setEditedDetails({ ...editedDetails, notes: e.target.value })
                                        }
                                    />
                                </Form.Group>
                            </Form>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={savePassengerDetails}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Dispatch;
