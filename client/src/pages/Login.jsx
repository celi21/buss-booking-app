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
import { loginUser } from "../store/slices/AuthSlice";
import { translateText } from "../utils/translation";
import { Google, Apple } from "react-bootstrap-icons";

function Login() {
  const navigate = useNavigate();
  const { loading, user, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  const handleLogin = async (event) => {
    event.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  const handleGoogleLogin = () => {
    // OAuth routes are always at /api/oauth/* on the backend root (not inside /api prefix of REACT_APP_API_BASE_URL)
    const backendRoot = (process.env.REACT_APP_API_BASE_URL || '').replace(/\/api$/, '');
    window.location.href = `${backendRoot}/api/oauth/google`;
  };

  const handleAppleLogin = () => {
    const backendRoot = (process.env.REACT_APP_API_BASE_URL || '').replace(/\/api$/, '');
    window.location.href = `${backendRoot}/api/oauth/apple`;
  };

  const selectedLanguage = useSelector(
    (state) => state.settings.selectedLanguage
  );

  return (
    <Container className="mt-3">
      <Row>
        <h2>
          {selectedLanguage && translateText("Login", selectedLanguage.code)}
        </h2>
        {error && <Alert variant="danger">{error}</Alert>}
      </Row>
      <Row>
        <Col>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>
                {selectedLanguage &&
                  translateText("email", selectedLanguage.code)}
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>
                {selectedLanguage &&
                  translateText("password", selectedLanguage.code)}
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="on"
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? <Spinner animation="border" /> : "Log In"}
            </Button>

            <div className="text-center my-3">
              <span className="text-muted small text-uppercase fw-semibold" style={{ letterSpacing: "0.5px" }}>
                or continue with
              </span>
            </div>

            <Row className="g-2">
              <Col xs={6}>
                <Button
                  variant="outline-secondary"
                  className="w-100 py-2 d-flex align-items-center justify-content-center fw-semibold text-dark border shadow-sm rounded-3"
                  onClick={handleGoogleLogin}
                  style={{ gap: "8px", backgroundColor: "#ffffff", borderColor: "#dadce0", fontSize: "14px" }}
                >
                  <Google size={18} style={{ color: "#ea4335" }} />
                  <span>Google</span>
                </Button>
              </Col>
              <Col xs={6}>
                <Button
                  variant="dark"
                  className="w-100 py-2 d-flex align-items-center justify-content-center fw-semibold border-0 shadow-sm rounded-3 text-white"
                  onClick={handleAppleLogin}
                  style={{ gap: "8px", backgroundColor: "#000000", fontSize: "14px" }}
                >
                  <Apple size={18} style={{ marginBottom: "2px" }} />
                  <span>Apple</span>
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
