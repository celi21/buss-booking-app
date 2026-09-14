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
    FiletypeHtml,
    FiletypeCsv,
    Eye,
} from "react-bootstrap-icons";

const getTodayDate = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

const Dispatch = () => {
    const [selectedDate, setSelectedDate] = useState(getTodayDate());
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

    const handleUpdateTripStatus = async (newStatus) => {
        if (!selectedTrip) return;
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/booking/update-trip-status`,
                {
                    busId: selectedTrip.busId,
                    date: selectedDate,
                    status: newStatus,
                },
                config
            );
            if (response.data && response.data.success) {
                toast.success("Trip status updated successfully");
                // Update local state
                setTrips(
                    trips.map((t) =>
                        t.tripId === selectedTrip.tripId
                            ? { ...t, tripStatus: newStatus }
                            : t
                    )
                );
                setSelectedTrip({ ...selectedTrip, tripStatus: newStatus });
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update trip status");
        }
    };

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
                const fetchedTrips = response.data.data.trips || [];
                setTrips(fetchedTrips);
                if (fetchedTrips.length > 0) {
                    const matched = fetchedTrips.find(
                        (t) => t.busId === selectedTrip?.busId || t.tripId === selectedTrip?.tripId
                    );
                    setSelectedTrip(matched || fetchedTrips[0]);
                } else {
                    setSelectedTrip(null);
                    setManifest([]);
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

    const exportDriverHTML = () => {
        const totalPax = manifest.reduce((sum, p) => sum + (Number(p.numberOfPassengers) || 0), 0);
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Driver Passenger Manifest - ${selectedDate}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 24px; color: #1a1a2e; background: #fff; }
    .header { border-bottom: 2px solid #0d6efd; padding-bottom: 14px; margin-bottom: 20px; }
    .title { font-size: 22px; font-weight: 700; margin: 0 0 6px; color: #0d6efd; }
    .meta-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-top: 10px; font-size: 13px; }
    .meta-item strong { color: #555; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
    th { background: #f1f5f9; color: #334155; font-weight: 600; text-align: left; padding: 10px 10px; border: 1px solid #cbd5e1; }
    td { padding: 9px 10px; border: 1px solid #e2e8f0; vertical-align: top; }
    tr:nth-child(even) { background-color: #f8fafc; }
    .price-col { font-weight: 600; text-align: right; }
    .no-print { margin-bottom: 20px; display: flex; gap: 10px; }
    .btn { padding: 8px 18px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px; text-decoration: none; border: none; }
    .btn-primary { background: #0d6efd; color: #fff; }
    .btn-secondary { background: #64748b; color: #fff; }
    @media print {
      .no-print { display: none !important; }
      body { margin: 0; padding: 12px; }
      th { background-color: #f1f5f9 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="no-print">
    <button class="btn btn-primary" onclick="window.print()">Print Manifest</button>
    <button class="btn btn-secondary" onclick="window.close()">Close</button>
  </div>
  <div class="header">
    <div class="title">Bueno Transit — Driver Passenger Manifest</div>
    <div class="meta-grid">
      <div class="meta-item"><strong>Route:</strong> ${selectedTrip?.route || "N/A"}</div>
      <div class="meta-item"><strong>Date:</strong> ${selectedDate}</div>
      <div class="meta-item"><strong>Departure Time:</strong> ${selectedTrip?.departureTime || "N/A"}</div>
      <div class="meta-item"><strong>Total Passengers:</strong> ${totalPax}</div>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width: 35px;">#</th>
        <th>Booking ID</th>
        <th>Client Name</th>
        <th>Pickup Address</th>
        <th>Dropoff Address</th>
        <th style="width: 50px; text-align: center;">Pax</th>
        <th>Notes</th>
        <th style="width: 90px; text-align: right;">Total Paid</th>
      </tr>
    </thead>
    <tbody>
      ${manifest.map((p, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td><strong>${p.bookingId}</strong></td>
          <td><strong>${p.clientName}</strong></td>
          <td>${p.pickupAddress || "-"}</td>
          <td>${p.dropoffAddress || "-"}</td>
          <td style="text-align: center;">${p.numberOfPassengers}</td>
          <td>${p.notes || "-"}</td>
          <td class="price-col">$${Number(p.paymentAmount || 0).toFixed(2)}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>
</body>
</html>
        `;
        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            toast.success("Driver HTML manifest opened");
        } else {
            toast.error("Please allow popups to view the HTML manifest");
        }
    };

    const exportDispatchHTML = () => {
        const totalPax = manifest.reduce((sum, p) => sum + (Number(p.numberOfPassengers) || 0), 0);
        const totalRevenue = manifest.reduce((sum, p) => sum + (Number(p.paymentAmount) || 0), 0);
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Dispatch Passenger Manifest - ${selectedDate}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 24px; color: #1a1a2e; background: #fff; }
    .header { border-bottom: 2px solid #0d6efd; padding-bottom: 14px; margin-bottom: 20px; }
    .title { font-size: 22px; font-weight: 700; margin: 0 0 6px; color: #0d6efd; }
    .meta-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-top: 10px; font-size: 13px; }
    .meta-item strong { color: #555; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 11px; }
    th { background: #f1f5f9; color: #334155; font-weight: 600; text-align: left; padding: 8px 8px; border: 1px solid #cbd5e1; }
    td { padding: 7px 8px; border: 1px solid #e2e8f0; vertical-align: top; }
    tr:nth-child(even) { background-color: #f8fafc; }
    .price-col { font-weight: 600; text-align: right; }
    .status-badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-weight: 600; font-size: 10px; }
    .no-print { margin-bottom: 20px; display: flex; gap: 10px; }
    .btn { padding: 8px 18px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px; text-decoration: none; border: none; }
    .btn-primary { background: #0d6efd; color: #fff; }
    .btn-secondary { background: #64748b; color: #fff; }
    @media print {
      .no-print { display: none !important; }
      body { margin: 0; padding: 8px; }
      th { background-color: #f1f5f9 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="no-print">
    <button class="btn btn-primary" onclick="window.print()">Print Manifest</button>
    <button class="btn btn-secondary" onclick="window.close()">Close</button>
  </div>
  <div class="header">
    <div class="title">Bueno Transit — Dispatch Passenger Manifest (Full)</div>
    <div class="meta-grid">
      <div class="meta-item"><strong>Route:</strong> ${selectedTrip?.route || "N/A"}</div>
      <div class="meta-item"><strong>Date:</strong> ${selectedDate}</div>
      <div class="meta-item"><strong>Departure Time:</strong> ${selectedTrip?.departureTime || "N/A"}</div>
      <div class="meta-item"><strong>Total Passengers:</strong> ${totalPax}</div>
      <div class="meta-item"><strong>Total Collected (incl. Tax):</strong> $${totalRevenue.toFixed(2)}</div>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width: 30px;">#</th>
        <th>Booking ID</th>
        <th>Passenger Name</th>
        <th>Phone</th>
        <th>Email</th>
        <th>Pickup Address</th>
        <th>Dropoff Address</th>
        <th style="width: 40px; text-align: center;">Pax</th>
        <th style="width: 75px; text-align: right;">Total Paid</th>
        <th style="width: 75px;">Status</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody>
      ${manifest.map((p, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td><strong>${p.bookingId}</strong></td>
          <td><strong>${p.clientName}</strong></td>
          <td>${p.phone || "-"}</td>
          <td>${p.email || "-"}</td>
          <td>${p.pickupAddress || "-"}</td>
          <td>${p.dropoffAddress || "-"}</td>
          <td style="text-align: center;">${p.numberOfPassengers}</td>
          <td class="price-col">$${Number(p.paymentAmount || 0).toFixed(2)}</td>
          <td>${p.boardingStatus || "Not Boarded"}</td>
          <td>${p.notes || "-"}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>
</body>
</html>
        `;
        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            toast.success("Dispatch HTML manifest opened");
        } else {
            toast.error("Please allow popups to view the HTML manifest");
        }
    };

    const exportDriverCSV = () => {
        const headers = [
            "Order",
            "Booking ID",
            "Client Name",
            "Pickup Address",
            "Dropoff Address",
            "Passengers",
            "Notes",
            "Total Amount (incl. Tax)",
        ];
        const rows = manifest.map((p, idx) => [
            idx + 1,
            p.bookingId,
            p.clientName,
            p.pickupAddress,
            p.dropoffAddress,
            p.numberOfPassengers,
            p.notes || "-",
            Number(p.paymentAmount || 0).toFixed(2),
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
            "Booking ID",
            "Name",
            "Phone",
            "Email",
            "Pickup",
            "Dropoff",
            "Passengers",
            "Total Amount (incl. Tax)",
            "Status",
        ];
        const rows = manifest.map((p, idx) => [
            idx + 1,
            p.bookingId,
            p.clientName,
            p.phone,
            p.email,
            p.pickupAddress,
            p.dropoffAddress,
            p.numberOfPassengers,
            Number(p.paymentAmount || 0).toFixed(2),
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
                        <Col md={5}>
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
                        {selectedTrip && (
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>Trip Status</Form.Label>
                                    <Form.Select
                                        value={selectedTrip.tripStatus || "On Time"}
                                        onChange={(e) => handleUpdateTripStatus(e.target.value)}
                                    >
                                        <option value="On Time">On Time</option>
                                        <option value="Delayed">Delayed</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        )}
                        <Col md={2} className="d-flex align-items-end">
                            <Button
                                variant="outline-primary"
                                size="sm"
                                className="w-100"
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
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={exportDriverHTML}
                                >
                                    <FiletypeHtml className="me-1" /> HTML
                                </Button>
                                <Button variant="success" size="sm" onClick={exportDriverCSV}>
                                    <FiletypeCsv className="me-1" /> CSV
                                </Button>
                            </Col>
                            <Col>
                                <h6>Dispatch Export (Full)</h6>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={exportDispatchHTML}
                                >
                                    <FiletypeHtml className="me-1" /> HTML
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
