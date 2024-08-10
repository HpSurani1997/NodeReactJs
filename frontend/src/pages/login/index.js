import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginWithEmail } from "../../redux/slices/userSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const loginUser = () => {
    dispatch(loginWithEmail({ email: email, password: password }))
      .unwrap()
      .then((data) => {
        if (data.userData.status === "pending") {
          alert(
            "Login successfully please enter otp you received in your email."
          );
          navigate("/otp-verification", { replace: true });
        } else {
          alert("Login successfully.");
        }
      })
      .catch((err) => {
        alert("Invalid credential.");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateEmail(email)) {
      // Handle the login logic here
      loginUser(); // Clear any previous errors
    } else {
      setEmailError("Please enter a valid email address.");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h3 className="text-center mb-4">Log In</h3>
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

                <Form.Group controlId="formBasicPassword" className="mt-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Container
                  onClick={() => navigate("forget")}
                  style={{ cursor: "pointer" }}
                >
                  <body className="text-end mt-3">forget password</body>
                </Container>
                <Button variant="primary" type="submit" className="mt-4 w-100">
                  Log In
                </Button>

                <Container
                  onClick={() => navigate("register")}
                  style={{ cursor: "pointer" }}
                >
                  <body className="text-end mt-3">
                    Don't have an acccount? Sign up
                  </body>
                </Container>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
