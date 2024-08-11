import axios from "axios";

const API_END_POINT = {
  LOGIN: "user/login",
  REGISTER: "user/register",
  VERIFY_OTP: "user/verifyOtp",
  FORGOT_PASSWORD: "user/forgotPassword",
  VERIFY_EMAIL: "user/verify-email",
  CHANGE_PASSWORD: "user/createNewPassword",
  UPADTE_PROFILE: "profile/updateProfile",
  GET_PROFILE: "profile/getProfile",
  CONTACT_US: "profile/contactUs",
};

export const login = async (email, password) => {
  return _baseRequest(API_END_POINT.LOGIN, "POST", { email, password }).then(
    (loginResponse) => {
      return loginResponse;
    }
  );
};

export const contactUsSubmit = async (name, email, queries, header) => {
  return _baseRequest(
    API_END_POINT.CONTACT_US,
    "POST",
    { name, email, queries },
    header
  ).then((loginResponse) => {
    return loginResponse;
  });
};

export const verifyEmailWithToken = async (email, token) => {
  return _baseRequest(
    API_END_POINT.VERIFY_EMAIL + `?token=${token}&email=${email}`,
    "GET"
  ).then((loginResponse) => {
    return loginResponse;
  });
};

export const getUserProfileData = async (header) => {
  return _baseRequest(API_END_POINT.GET_PROFILE, "GET", undefined, header).then(
    (loginResponse) => {
      return loginResponse;
    }
  );
};

export const changeUserPassword = async (
  newPassword,
  confirmPassword,
  header
) => {
  return _baseRequest(
    API_END_POINT.CHANGE_PASSWORD,
    "POST",
    { newPassword, confirmPassword },
    header
  ).then((loginResponse) => {
    return loginResponse;
  });
};

export const forgotPassword = async (email, host) => {
  return _baseRequest(API_END_POINT.FORGOT_PASSWORD, "POST", {
    email,
    host,
  }).then((loginResponse) => {
    return loginResponse;
  });
};

export const register = async (name, email, password) => {
  return _baseRequest(API_END_POINT.REGISTER, "POST", {
    name,
    email,
    password,
  }).then((loginResponse) => {
    return loginResponse;
  });
};

export const otpVerification = async (email, otp) => {
  return _baseRequest(API_END_POINT.VERIFY_OTP, "POST", { email, otp }).then(
    (loginResponse) => {
      return loginResponse;
    }
  );
};

export const updateProfile = async (data, header) => {
  return _baseRequest(API_END_POINT.UPADTE_PROFILE, "POST", data, header).then(
    (loginResponse) => {
      return loginResponse;
    }
  );
};

const _baseRequest = (url, method = "GET", data, headers) => {
  return apiClient
    .request({
      method,
      url,
      headers,
      data,
    })
    .then((response) => response.data)

    .catch((err) =>
      Promise.reject({
        name: err.name,
        message: err.message,
        status: err.response?.status || -1,
        data: err.response?.data,
      })
    );
};

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-type": "application/json",
  },
});
