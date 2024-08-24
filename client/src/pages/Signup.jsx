import React, { useEffect } from "react";
import { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/slices/AuthSlice";

function Signup() {
  const navigate = useNavigate();
  const {
    loading,
    user,
    error: registrationError,
  } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  const handleSignup = async (event) => {
    event.preventDefault();
    setError(null);
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all the fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and confirm passwords should be the same.");
      return;
    }
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <Container>
      <Row>
        <Col className="text-center mb-3 mt-3">
          <h2>Signup</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          {error && <Alert variant="danger">{error}</Alert>}
          {registrationError && (
            <Alert variant="danger">{registrationError}</Alert>
          )}
          <Form>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="on"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="on"
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? <Spinner animation="border" /> : "Sign Up"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Signup;
