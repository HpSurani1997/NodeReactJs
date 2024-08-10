import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../../api/api";

const initialState = {
  user: {},
  isLoggedIn: false,
};

export const userLogout = createAsyncThunk(
  "user/userLogout",
  async (options, { rejectWithValue }) => {
    try {
      return {};
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const loginWithEmail = createAsyncThunk(
  "user/login",
  async (options, { rejectWithValue }) => {
    try {
      return await api.login(options.email, options.password);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const contactUsSubmit = createAsyncThunk(
  "user/contactUsSubmit",
  async (options, { rejectWithValue }) => {
    try {
      return await api.contactUsSubmit(options.name, options.email, options.queries, options.header);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (options, { rejectWithValue }) => {
    try {
      return await api.forgotPassword(options.email, options.host);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const signUpWithEmail = createAsyncThunk(
  "user/signUpWithEmail",
  async (options, { rejectWithValue }) => {
    try {
      return await api.register(options.name, options.email, options.password);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const otpVerification = createAsyncThunk(
  "user/otpVerification",
  async (options, { rejectWithValue }) => {
    try {
      return await api.otpVerification(options.email, options.otp);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (options, { rejectWithValue }) => {
    try {
      return await api.updateProfile(options.data, options.header);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const verifyEmailWithToken = createAsyncThunk(
  "user/verifyEmailWithToken",
  async (options, { rejectWithValue }) => {
    try {
      return await api.verifyEmailWithToken(options.email, options.token);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  "user/changeUserPassword",
  async (options, { rejectWithValue }) => {
    try {
      return await api.changeUserPassword(options.newPassword, options.confirmPassword, options.header);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginWithEmail.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginWithEmail.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = action.payload.userData.status === "active";
      state.loading = false;
    });
    builder.addCase(loginWithEmail.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(signUpWithEmail.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signUpWithEmail.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = action.payload.userData.status === "active";
      state.loading = false;
    });
    builder.addCase(signUpWithEmail.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(otpVerification.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(otpVerification.fulfilled, (state, action) => {
      state.user.userData.status = "active";
      state.isLoggedIn = true;
      state.loading = false;
    });
    builder.addCase(otpVerification.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(updateProfile.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(updateProfile.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(userLogout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(userLogout.fulfilled, (state, action) => {
      state.user = {};
      state.isLoggedIn = false;
      state.loading = false;
    });
    builder.addCase(userLogout.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default userSlice.reducer;
