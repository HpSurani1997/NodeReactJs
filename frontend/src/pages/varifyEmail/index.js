import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Spinner,
} from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  changeUserPassword,
  verifyEmailWithToken,
} from "../../redux/slices/userSlice";
import { useDispatch } from "react-redux";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [linkVerify, setLinkVerify] = useState(false);
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    dispatch(verifyEmailWithToken({ token: token, email: email }))
      .unwrap()
      .then((data) => {
        setLinkVerify(data.status);
        setToken(data.token);
      })
      .catch((err) => {});
  }, []);

  const updatePassword = () => {
    dispatch(
      changeUserPassword({
        newPassword: newPassword,
        confirmPassword: confirmPassword,
        header: {
          "x-access-token": token,
          "Content-Type": "application/json",
        },
      })
    )
      .unwrap()
      .then((data) => {
        alert("Your password has been changed successfully.")
        navigate("/", { replace: true });
      })
      .catch((err) => {
        alert("Your password change failed.")
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match.");
      setSuccessMessage("");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters long.");
      setSuccessMessage("");
      return;
    }
    updatePassword();
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            {linkVerify ? (
              <Card.Body>
                <h3 className="text-center mb-4">Change Password</h3>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formNewPassword" className="mt-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="formConfirmPassword" className="mt-3">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Form.Group>

                  {errorMessage && (
                    <div className="alert alert-danger mt-4" role="alert">
                      {errorMessage}
                    </div>
                  )}

                  <Button
                    variant="primary"
                    type="submit"
                    className="mt-4 w-100"
                  >
                    Change Password
                  </Button>

                  {successMessage && (
                    <div className="alert alert-success mt-4" role="alert">
                      {successMessage}
                    </div>
                  )}
                </Form>
              </Card.Body>
            ) : (
              <Card.Body>
                <div className="text-center">
                  <body className="text-center mb-4" style={{ color: "red" }}>
                    Invalid email link.
                  </body>
                </div>
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChangePassword;
