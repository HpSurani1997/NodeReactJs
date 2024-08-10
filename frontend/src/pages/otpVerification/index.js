import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { otpVerification } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const OTPVerification = () => {
  const user = useSelector((state) => state.user);
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (otp.length !== 6) {
      setErrorMessage("OTP must be 6 digits.");
      setSuccessMessage("");
      return;
    }

    try {
      dispatch(otpVerification({ email: user?.userData?.email, otp: otp }))
        .unwrap()
        .then(() => {
          alert("Account verified successfully.");
          navigate("/");
        })
        .catch((err) => {
          setErrorMessage("Wrong OTP.");
        });
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred. Please try again later.");
      setSuccessMessage("");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h3 className="text-center mb-4">OTP Verification</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formOTP">
                  <Form.Label>Enter OTP</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength="6"
                    isInvalid={!!errorMessage}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorMessage}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-4 w-100">
                  Verify OTP
                </Button>

                {successMessage && (
                  <div className="alert alert-success mt-4" role="alert">
                    {successMessage}
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OTPVerification;
