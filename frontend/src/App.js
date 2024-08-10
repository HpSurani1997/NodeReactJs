import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import SignUp from "./pages/signup";
import Login from "./pages/login";
import ForgotPassword from "./pages/forgetPassword";
import ChangePassword from "./pages/varifyEmail";
import Profile from "./pages/profile";
import { useSelector } from "react-redux";
import OTPVerification from "./pages/otpVerification";
import ContactUs from "./pages/contactUs";

function App() {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <Routes>
      <Route path="/" Component={isLoggedIn ? Profile : Login} />
      <Route path="/signin" Component={Login}></Route>
      <Route path="/register" Component={SignUp}></Route>
      <Route path="/forget" Component={ForgotPassword}></Route>
      <Route path="/otp-verification" Component={OTPVerification}></Route>
      <Route path="/verify-email" Component={ChangePassword}></Route>
      <Route path="/profile" Component={Profile}></Route>
      <Route path="/contact-us" Component={ContactUs}></Route>
    </Routes>
  );
}

export default App;
