import React, { useEffect, useState } from "react";
import { Container, Card, Button, Badge, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../../components/loading-spinner/LoadingSpinner";
import { Calendar, Clock, MapPin, CheckCircle } from "react-bootstrap-icons";

const PassengerHome = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkingIn, setCheckingIn] = useState(false);

    const { user, token } = useSelector((state) => state.auth);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/booking/get-passenger-dashboard`,
                {},
                config
            );
            if (response.data && response.data.success) {
                setDashboardData(response.data.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        if (!dashboardData?.nextTrip) return;

        try {
            setCheckingIn(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/booking/check-in-passenger`,
                { bookingId: dashboardData.nextTrip._id },
                config
            );
            if (response.data && response.data.success) {
                toast.success("Checked in successfully!");
                fetchDashboard();
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to check in");
            }
        } finally {
            setCheckingIn(false);
        }
    };

    const getStatusColor = (status) => {
        return status === "On Time" ? "success" : "warning";
    };

    if (loading) {
        return (
            <Container className="mt-4">
                <LoadingSpinner />
            </Container>
        );
    }

    const nextTrip = dashboardData?.nextTrip;

    return (
        <Container className="mt-4">
            {/* Header */}
            <div className="mb-4">
                <h4>Hello, {user?.name || "Passenger"}!</h4>
                {nextTrip ? (
                    <Badge bg="primary" className="mt-2">
                        Next trip on {nextTrip.date}
                    </Badge>
                ) : (
                    <Badge bg="secondary" className="mt-2">
                        No upcoming trips
                    </Badge>
                )}
            </div>

            {/* Upcoming Trip Card */}
            {nextTrip ? (
                <Card className="shadow-sm mb-4">
                    <Card.Header className="bg-primary text-white">
                        <h5 className="mb-0">Upcoming Trip</h5>
                    </Card.Header>
                    <Card.Body>
                        <Row className="mb-3">
                            <Col xs={12} md={6}>
                                <div className="mb-3">
                                    <MapPin className="me-2 text-primary" />
                                    <strong>From:</strong>
                                    <div className="ms-4">{nextTrip.from}</div>
                                </div>
                                <div className="mb-3">
                                    <MapPin className="me-2 text-danger" />
                                    <strong>To:</strong>
                                    <div className="ms-4">{nextTrip.to}</div>
                                </div>
                            </Col>
                            <Col xs={12} md={6}>
                                <div className="mb-3">
                                    <Calendar className="me-2" />
                                    <strong>Date:</strong> {nextTrip.date}
                                </div>
                                <div className="mb-3">
                                    <Clock className="me-2" />
                                    <strong>Departure:</strong> {nextTrip.departureTime}
                                </div>
                                <div className="mb-3">
                                    <strong>Route:</strong> {nextTrip.route}
                                </div>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col>
                                <Badge bg={getStatusColor(nextTrip.status)} className="me-2">
                                    {nextTrip.status}
                                </Badge>
                                {nextTrip.boardingStatus === "Boarded" && (
                                    <Badge bg="success">
                                        <CheckCircle className="me-1" />
                                        Checked In
                                    </Badge>
                                )}
                            </Col>
                        </Row>

                        {nextTrip.canCheckIn && nextTrip.boardingStatus !== "Boarded" && (
                            <Button
                                variant="success"
                                onClick={handleCheckIn}
                                disabled={checkingIn}
                                className="w-100"
                            >
                                <CheckCircle className="me-2" />
                                {checkingIn ? "Checking in..." : "Check In Now"}
                            </Button>
                        )}

                        {!nextTrip.canCheckIn && nextTrip.boardingStatus !== "Boarded" && (
                            <div className="text-muted text-center">
                                <small>Check-in available on travel date</small>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            ) : (
                <Card className="shadow-sm mb-4">
                    <Card.Body className="text-center py-5">
                        <h5 className="text-muted">No upcoming trips</h5>
                        <p className="text-muted">Book a ride to see your trip details here</p>
                        <Button variant="primary" href="/booking">
                            Book a Ride
                        </Button>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default PassengerHome;
