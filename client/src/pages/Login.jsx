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
    window.location.href = `${process.env.REACT_APP_API_BASE_URL}/api/oauth/google`;
  };

  const handleAppleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_BASE_URL}/api/oauth/apple`;
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
              <span className="text-muted">or continue with</span>
            </div>

            <Button
              variant="outline-danger"
              className="w-100 mb-2 d-flex align-items-center justify-content-center"
              onClick={handleGoogleLogin}
              style={{ gap: '8px' }}
            >
              <Google size={20} />
              Sign in with Google
            </Button>

            <Button
              variant="outline-dark"
              className="w-100 d-flex align-items-center justify-content-center"
              onClick={handleAppleLogin}
              style={{ gap: '8px' }}
            >
              <Apple size={20} />
              Sign in with Apple
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
