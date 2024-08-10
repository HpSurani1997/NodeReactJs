import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { forgotPassword } from "../../redux/slices/userSlice";
import { useDispatch } from "react-redux";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const forgetUserPassword = () => {
    dispatch(forgotPassword({ email: email, host: window.location.host }))
      .unwrap()
      .then(() => {
        setSuccessMessage("A password reset link has been sent to your email address.");
        setEmailError("");
      })
      .catch((err) => {});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateEmail(email)) {
      forgetUserPassword();
    } else {
      setEmailError("Please enter a valid email address.");
      setSuccessMessage("");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h3 className="text-center mb-4">Forgot Password</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={!!emailError}
                  />
                  <Form.Control.Feedback type="invalid">
                    {emailError}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-4 w-100">
                  Send Reset Link
                </Button>
              </Form>

              {successMessage && (
                <div className="alert alert-success mt-4" role="alert">
                  {successMessage}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
