import React, { useState, useEffect } from "react";
import {
    Container,
    Card,
    Form,
    Button,
    Accordion,
    Row,
    Col,
    Modal,
    Spinner,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Person, Telephone, Envelope, GeoAlt, Globe, ExclamationTriangleFill } from "react-bootstrap-icons";
import axios from "axios";
import { updateUserSuccess } from "../../../../store/slices/AuthSlice";

const PassengerProfile = () => {
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.auth);
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: user?.name?.split(" ")[0] || "",
        lastName: user?.name?.split(" ").slice(1).join(" ") || "",
        phone: user?.phone || "",
        email: user?.email || "",
        emergencyContact: "",
        defaultPickupAddress: user?.defaultPickupAddress || "",
        savedAddresses: [],
        language: "English",
    });

    useEffect(() => {
        if (user) {
            setProfileData((prev) => ({
                ...prev,
                firstName: user.name?.split(" ")[0] || "",
                lastName: user.name?.split(" ").slice(1).join(" ") || "",
                phone: user.phone || "",
                email: user.email || "",
                defaultPickupAddress: user.defaultPickupAddress || "",
            }));
        }
    }, [user]);

    // Account deletion state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletionLoading, setDeletionLoading] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/auth/update-profile`,
                {
                    name: fullName,
                    phone: profileData.phone,
                    defaultPickupAddress: profileData.defaultPickupAddress,
                },
                config
            );

            if (response.data && response.data.success) {
                dispatch(updateUserSuccess(response.data.user));
                toast.success("Profile updated successfully!");
                setEditMode(false);
            } else {
                toast.error(response.data.message || "Failed to update profile.");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleRequestDeletion = async () => {
        setDeletionLoading(true);
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/task/request-account-deletion`,
                {},
                config
            );
            if (response.data && response.data.success) {
                toast.success(response.data.message);
                setShowDeleteModal(false);
            } else {
                toast.error(response.data.message || "Failed to submit deletion request.");
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to submit request. Please try again.";
            toast.error(msg);
        } finally {
            setDeletionLoading(false);
        }
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
                                <Button variant="primary" onClick={handleSave} disabled={saving}>
                                    {saving ? "Saving..." : "Save Changes"}
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => setEditMode(false)}
                                    disabled={saving}
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
                            <Form.Text className="text-muted">
                                This address will automatically pre-fill on your future booking reservations.
                            </Form.Text>
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

                        <Button variant="primary" onClick={handleSave} disabled={saving}>
                            {saving ? "Saving Settings..." : "Save Settings"}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            {/* Information */}
            <Card className="mb-4 shadow-sm">
                <Card.Header>
                    <h5 className="mb-0">Information</h5>
                </Card.Header>
                <Card.Body>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Rules &amp; Policies</Accordion.Header>
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

            {/* Account Management */}
            <Card className="shadow-sm border-danger">
                <Card.Header className="bg-danger text-white">
                    <h5 className="mb-0">
                        <ExclamationTriangleFill className="me-2" />
                        Account Management
                    </h5>
                </Card.Header>
                <Card.Body>
                    <p className="text-muted mb-1">
                        <strong>Delete Account</strong>
                    </p>
                    <p className="text-muted small mb-3">
                        Request permanent deletion of your Bueno Transit account. This action
                        will be reviewed by our team before processing.
                    </p>
                    <Button
                        variant="outline-danger"
                        onClick={() => setShowDeleteModal(true)}
                    >
                        Request Account Deletion
                    </Button>
                </Card.Body>
            </Card>

            {/* Account Deletion Confirmation Modal */}
            <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                centered
            >
                <Modal.Header closeButton className="border-danger">
                    <Modal.Title className="text-danger">
                        <ExclamationTriangleFill className="me-2" />
                        Delete Your Account
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Deleting your Bueno Transit account is permanent and cannot be undone.
                    </p>
                    <ul className="mb-3">
                        <li>
                            Your profile information will be permanently removed after approval.
                        </li>
                        <li>
                            Active reservations must be completed or cancelled before deletion.
                        </li>
                        <li>
                            If you signed in with Google or Apple, this only removes your Bueno
                            Transit account. It does <strong>NOT</strong> delete your Google or
                            Apple account.
                        </li>
                    </ul>
                    <p className="text-muted small mb-0">
                        After submitting, our team will review your request. You will remain
                        logged in until the deletion is processed.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowDeleteModal(false)}
                        disabled={deletionLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleRequestDeletion}
                        disabled={deletionLoading}
                    >
                        {deletionLoading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    className="me-2"
                                />
                                Submitting...
                            </>
                        ) : (
                            "Request Account Deletion"
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default PassengerProfile;

