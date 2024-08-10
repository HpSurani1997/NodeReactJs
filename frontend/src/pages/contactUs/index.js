import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { contactUsSubmit } from "../../redux/slices/userSlice";

const ContactUs = () => {
  const user = useSelector((state) => state.user);
  const [name, setName] = useState(user?.userData?.name);
  const [email, setEmail] = useState(user.userData?.email);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(
        contactUsSubmit({
          email: email,
          name: name,
          queries: message,
          header: {
            "x-access-token": user.token,
            "Content-Type": "application/json",
          },
        })
      )
        .unwrap()
        .then((data) => {
          alert("Thank you for your message. We'll get back to you shortly.");
          navigate("/");
        })
        .catch((err) => {
          alert("There was an error submitting the form. Please try again.");
        });
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: 40.73061,
    lng: -73.935242,
  };

  const onLoad = (marker) => {
    console.log("marker: ", marker);
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              <h3 className="text-center mb-4">Contact Us</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formEmail" className="mt-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formMessage" className="mt-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-4 w-100">
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Body>
              <h3 className="text-center mb-4">Our Location</h3>
              <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={10}
                >
                  <Marker onLoad={onLoad} position={center} />
                </GoogleMap>
              </LoadScript>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactUs;
