import React, { useEffect, useState } from "react";
import {
    Container,
    Tabs,
    Tab,
    Card,
    Badge,
    Button,
    ListGroup,
    Modal,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import { Receipt, ExclamationTriangle } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

const PassengerWallet = () => {
    const [walletData, setWalletData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);

    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        fetchWallet();
    }, []);

    const fetchWallet = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/booking/get-passenger-wallet`,
                {},
                config
            );
            if (response.data && response.data.success) {
                setWalletData(response.data.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load wallet");
        } finally {
            setLoading(false);
        }
    };

    const viewReceipt = (trip) => {
        setSelectedTrip(trip);
        setShowReceiptModal(true);
    };

    const getStatusBadge = (trip) => {
        if (trip.status === "confirmed") return <Badge bg="success">Confirmed</Badge>;
        if (trip.status === "pending") return <Badge bg="warning">Pending</Badge>;
        if (trip.status === "cancelled") return <Badge bg="danger">Cancelled</Badge>;
        return <Badge bg="secondary">{trip.status}</Badge>;
    };

    const TripCard = ({ trip, showActions = false }) => (
        <Card className="mb-3">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <h6 className="mb-1">{trip.route}</h6>
                        <small className="text-muted">
                            {trip.from} → {trip.to}
                        </small>
                    </div>
                    {getStatusBadge(trip)}
                </div>
                <div className="mb-2">
                    <strong>Date:</strong> {trip.date}
                </div>
                <div className="mb-2">
                    <strong>Total Paid:</strong> ${trip.totalPaid}
                </div>
                <div className="mb-2">
                    <strong>Payment Status:</strong>{" "}
                    <Badge bg="success">Paid</Badge>
                </div>
                {trip.flexOption && (
                    <div className="mb-2">
                        <Badge bg="info">Flex Option</Badge>
                    </div>
                )}
                {showActions && (
                    <div className="mt-3 d-flex gap-2">
                        <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => viewReceipt(trip)}
                        >
                            <Receipt className="me-1" /> View Receipt
                        </Button>
                        <Link
                            to="/user/support"
                            className="btn btn-outline-warning btn-sm"
                        >
                            <ExclamationTriangle className="me-1" /> Report Issue
                        </Link>
                    </div>
                )}
            </Card.Body>
        </Card>
    );

    if (loading) {
        return (
            <Container className="mt-4">
                <LoadingSpinner />
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h4 className="mb-4">Wallet</h4>

            <Tabs defaultActiveKey="upcoming" className="mb-3">
                <Tab eventKey="upcoming" title="Upcoming">
                    {walletData?.upcoming && walletData.upcoming.length > 0 ? (
                        walletData.upcoming.map((trip) => (
                            <TripCard key={trip._id} trip={trip} showActions={false} />
                        ))
                    ) : (
                        <Card>
                            <Card.Body className="text-center py-5">
                                <p className="text-muted">Upcoming: None</p>
                            </Card.Body>
                        </Card>
                    )}
                </Tab>

                <Tab eventKey="completed" title="Completed">
                    {walletData?.completed && walletData.completed.length > 0 ? (
                        walletData.completed.map((trip) => (
                            <TripCard key={trip._id} trip={trip} showActions={true} />
                        ))
                    ) : (
                        <Card>
                            <Card.Body className="text-center py-5">
                                <p className="text-muted">No completed trips</p>
                            </Card.Body>
                        </Card>
                    )}
                </Tab>

                <Tab eventKey="cancelled" title="Cancelled">
                    {walletData?.cancelled && walletData.cancelled.length > 0 ? (
                        walletData.cancelled.map((trip) => (
                            <TripCard key={trip._id} trip={trip} showActions={false} />
                        ))
                    ) : (
                        <Card>
                            <Card.Body className="text-center py-5">
                                <p className="text-muted">No cancelled trips</p>
                            </Card.Body>
                        </Card>
                    )}
                </Tab>
            </Tabs>

            {/* Receipt Modal */}
            <Modal
                show={showReceiptModal}
                onHide={() => setShowReceiptModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Receipt</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTrip && (
                        <>
                            <div className="mb-3">
                                <strong>Booking ID:</strong> {selectedTrip.bookingId}
                            </div>
                            <div className="mb-3">
                                <strong>Route:</strong> {selectedTrip.route}
                            </div>
                            <div className="mb-3">
                                <strong>Date:</strong> {selectedTrip.date}
                            </div>
                            <div className="mb-3">
                                <strong>From:</strong> {selectedTrip.from}
                            </div>
                            <div className="mb-3">
                                <strong>To:</strong> {selectedTrip.to}
                            </div>
                            <hr />
                            <div className="mb-3">
                                <strong>Total Paid:</strong> ${selectedTrip.totalPaid}
                            </div>
                            <div className="mb-3">
                                <strong>Payment Status:</strong>{" "}
                                <Badge bg="success">Paid</Badge>
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowReceiptModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default PassengerWallet;
