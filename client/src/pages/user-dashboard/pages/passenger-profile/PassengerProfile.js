import React, { useState } from "react";
import {
    Container,
    Card,
    Form,
    Button,
    Accordion,
    Row,
    Col,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Person, Telephone, Envelope, GeoAlt, Globe } from "react-bootstrap-icons";

const PassengerProfile = () => {
    const { user } = useSelector((state) => state.auth);
    const [editMode, setEditMode] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: user?.name?.split(" ")[0] || "",
        lastName: user?.name?.split(" ").slice(1).join(" ") || "",
        phone: "",
        email: user?.email || "",
        emergencyContact: "",
        defaultPickupAddress: "",
        savedAddresses: [],
        language: "English",
    });

    const handleSave = () => {
        toast.success("Profile updated successfully");
        setEditMode(false);
    };

    return (
        <Container className="mt-4">
            <h4 className="mb-4">Profile</h4>

            {/* User Info */}
            <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">User Information</h5>
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <Person className="me-2" />
                                        First Name
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={profileData.firstName}
                                        onChange={(e) =>
                                            setProfileData({ ...profileData, firstName: e.target.value })
                                        }
                                        disabled={!editMode}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <Person className="me-2" />
                                        Last Name
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={profileData.lastName}
                                        onChange={(e) =>
                                            setProfileData({ ...profileData, lastName: e.target.value })
                                        }
                                        disabled={!editMode}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                <Telephone className="me-2" />
                                Phone Number
                            </Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="000-000-0000"
                                value={profileData.phone}
                                onChange={(e) =>
                                    setProfileData({ ...profileData, phone: e.target.value })
                                }
                                disabled={!editMode}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                <Envelope className="me-2" />
                                Email
                            </Form.Label>
                            <Form.Control
                                type="email"
                                value={profileData.email}
                                disabled
                                readOnly
                            />
                            <Form.Text className="text-muted">
                                Email cannot be changed (Google / Apple ID)
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                <Telephone className="me-2" />
                                Emergency Contact
                            </Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="000-000-0000"
                                value={profileData.emergencyContact}
                                onChange={(e) =>
                                    setProfileData({
                                        ...profileData,
                                        emergencyContact: e.target.value,
                                    })
                                }
                                disabled={!editMode}
                            />
                        </Form.Group>

                        {editMode ? (
                            <div className="d-flex gap-2">
                                <Button variant="primary" onClick={handleSave}>
                                    Save Changes
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => setEditMode(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                            <Button variant="outline-primary" onClick={() => setEditMode(true)}>
                                Edit Profile
                            </Button>
                        )}
                    </Form>
                </Card.Body>
            </Card>

            {/* Settings */}
            <Card className="mb-4 shadow-sm">
                <Card.Header>
                    <h5 className="mb-0">Settings</h5>
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                <GeoAlt className="me-2" />
                                Default Pickup Address
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your default pickup address"
                                value={profileData.defaultPickupAddress}
                                onChange={(e) =>
                                    setProfileData({
                                        ...profileData,
                                        defaultPickupAddress: e.target.value,
                                    })
                                }
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                <Globe className="me-2" />
                                Language
                            </Form.Label>
                            <Form.Select
                                value={profileData.language}
                                onChange={(e) =>
                                    setProfileData({ ...profileData, language: e.target.value })
                                }
                            >
                                <option value="English">English</option>
                                <option value="Spanish">Español</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>

            {/* Information */}
            <Card className="shadow-sm">
                <Card.Header>
                    <h5 className="mb-0">Information</h5>
                </Card.Header>
                <Card.Body>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Rules & Policies</Accordion.Header>
                            <Accordion.Body>
                                <p>
                                    For complete rules and policies, please visit{" "}
                                    <a
                                        href="https://www.buenoexpresstransport.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        www.buenoexpresstransport.com
                                    </a>
                                </p>
                                <ul>
                                    <li>Arrive at pickup location 15 minutes before departure</li>
                                    <li>Valid ID required for boarding</li>
                                    <li>Luggage restrictions apply</li>
                                    <li>No smoking or alcohol on board</li>
                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="1">
                            <Accordion.Header>FAQ</Accordion.Header>
                            <Accordion.Body>
                                <h6>How do I cancel my trip?</h6>
                                <p>
                                    Go to Support tab and submit a "Cancel trip" request. Refunds
                                    are subject to our cancellation policy.
                                </p>

                                <h6>Can I change my pickup address?</h6>
                                <p>
                                    Yes, submit a request through the Support tab. Changes must be
                                    made at least 24 hours before departure.
                                </p>

                                <h6>What is the Flex Option?</h6>
                                <p>
                                    The Flex Option allows you to change your booking up to 2 hours
                                    before departure for a small fee.
                                </p>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="2">
                            <Accordion.Header>About</Accordion.Header>
                            <Accordion.Body>
                                <h6>Bueno Express Transport</h6>
                                <p>
                                    Providing reliable and comfortable bus transportation services.
                                </p>
                                <p>
                                    <strong>Contact:</strong> support@buenoexpresstransport.com
                                </p>
                                <p>
                                    <strong>Website:</strong>{" "}
                                    <a
                                        href="https://www.buenoexpresstransport.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        www.buenoexpresstransport.com
                                    </a>
                                </p>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default PassengerProfile;
