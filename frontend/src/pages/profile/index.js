import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Image,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  getUserProfileData,
  updateProfile,
  userLogout,
} from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.userData?.name);
  const [email, setEmail] = useState(user?.userData?.email);
  const dispatch = useDispatch();
  const [profilePicture, setProfilePicture] = useState(
    user?.userData?.imageUrl
      ? user?.userData?.imageUrl
      : "https://via.placeholder.com/150"
  );

  const [newName, setNewName] = useState(name);
  const [newEmail, setNewEmail] = useState(email);
  const [newProfilePicture, setNewProfilePicture] = useState(profilePicture);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getProfileData();
  }, []);

  const getProfileData = () => {
    dispatch(
      getUserProfileData({
        header: {
          "Content-Type": "application/json",
          "x-access-token": user.token,
        },
      })
    )
      .unwrap()
      .then(() => {})
      .catch((err) => {});
  };

  const handleLogout = () => {
    dispatch(userLogout({}))
      .unwrap()
      .then(() => {})
      .catch((err) => {});
  };

  const handleSaveChanges = () => {
    const formData = new FormData();
    formData.append("name", newName);
    if (profilePicFile) {
      formData.append("file", profilePicFile);
    }
    const header = {
      "Content-Type": "multipart/form-data",
      "x-access-token": user.token,
    };
    dispatch(updateProfile({ data: formData, header: header }))
      .unwrap()
      .then(() => {
        setName(newName);
        setEmail(newEmail);
        setProfilePicture(newProfilePicture);
        setEditing(false);
      })
      .catch((err) => {});
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleContactUs = () => {
    navigate("/contact-us");
  };

  const handleCancel = () => {
    setEditing(false);
    setNewName(name);
    setProfilePicFile(null);
    setNewEmail(email);
    setNewProfilePicture(profilePicture);
  };

  const handleSave = (e) => {
    e.preventDefault();
    handleSaveChanges();
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
      setProfilePicFile(file);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h3 className="text-center mb-4">Profile</h3>
              {editing ? (
                <Form onSubmit={handleSave}>
                  {newProfilePicture && (
                    <div className="text-center mb-3">
                      <Image
                        src={newProfilePicture}
                        roundedCircle
                        className="mt-3"
                        width="150"
                        height="150"
                      />
                    </div>
                  )}
                  <Form.Group controlId="formProfilePicture">
                    <Form.Label>Profile Picture</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="formName" className="mt-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="formEmail" className="mt-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      disabled
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="mt-4 w-100"
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    className="mt-2 w-100"
                  >
                    Cancel
                  </Button>
                </Form>
              ) : (
                <>
                  <div className="text-center mb-3">
                    <Image
                      src={profilePicture}
                      roundedCircle
                      width="150"
                      height="150"
                    />
                  </div>
                  <p>
                    <strong>Name:</strong> {name}
                  </p>
                  <p>
                    <strong>Email:</strong> {email}
                  </p>
                  <Button
                    variant="primary"
                    onClick={handleEdit}
                    className="mt-4 w-100"
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleContactUs}
                    className="mt-2 w-100"
                  >
                    Contact Us
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleLogout}
                    className="mt-2 w-100"
                  >
                    Logout
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
