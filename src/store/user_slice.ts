import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface User {
  _id: any;
  first_name: string;
  last_name: string;
  office_name: string;
  phone_number: number;
  email: string;
  password: string;
  limit: Number | unknown | undefined;
  apartments: [{ apartment_id: string }] | [];
}

export interface User_State {
  _id: any;
  first_name: string;
  last_name: string;
  office_name: string;
  phone_number: number;
  email: string;
  password: string;
  loading: boolean;
  error: string | null | unknown;
  is_auth: boolean;
  limit: Number | unknown | undefined;
  apartments: [{ apartment_id: string }] | [];
}

const stored_user = localStorage.getItem("user");
const user = stored_user ? JSON.parse(stored_user) : null;

const initialState: User_State = {
  _id: user?._id || "",
  first_name: user?.first_name || "",
  last_name: user?.last_name || "",
  office_name: user?.office_name || "",
  phone_number: user?.phone_number || 0,
  email: user?.email || "",
  password: user?.password || "",
  loading: false,
  error: null,
  is_auth: user ? true : false,
  limit: user?.limit || 0,
  apartments: user?.apartments || [],
};

export const login = createAsyncThunk(
  "login",
  async (
    { first_name, last_name, office_name, phone_number, email, password }: User,
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post("https://shagher.onrender.com/login", {
        first_name,
        last_name,
        office_name,
        phone_number,
        email,
        password,
      });

      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("حدث خطأ غير متوقع");
    }
  }
);

export const get_user = createAsyncThunk(
  "user/get",
  async ({
    email,
    phone_number,
  }: {
    email: string;
    phone_number: number | string;
  }) => {
    try {
      const response = await axios.post(
        "https://shagher.onrender.com/getuser",
        {
          email: email,
          phone_number: phone_number,
        }
      );

      return response.data;
    } catch (error: any) {
      return error.response.data.message;
    }
  }
);

const user_slice = createSlice({
  name: "login",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.clear();
      state._id = "";
      state.first_name = "";
      state.last_name = "";
      state.office_name = "";
      state.phone_number = 0;
      state.email = "";
      state.password = "";
      state.loading = false;
      state.error = null;
      state.is_auth = false;
      state.apartments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.is_auth = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state._id = action.payload._id;
          state.first_name = action.payload.first_name;
          state.last_name = action.payload.last_name;
          state.office_name = action.payload.office_name;
          state.phone_number = action.payload.phone_number;
          state.email = action.payload.email;
          state.password = action.payload.password;
          state.is_auth = true;
          state.limit = action.payload.limit;
          state.apartments = action.payload.apartments;

          localStorage.setItem("user", JSON.stringify(action.payload));
        }
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.is_auth = false;
        state.error = action.payload;
      })
      .addCase(get_user.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(get_user.fulfilled, (state, action) => {
        if (action.payload) {
          state.loading = false;
          state.error = null;
          state._id = action.payload._id;
          state.email = action.payload.email;
          state.password = action.payload.password;
          state.first_name = action.payload.first_name;
          state.last_name = action.payload.last_name;
          state.office_name = action.payload.office_name || "";
          state.phone_number = action.payload.phone_number;
          state.limit = action.payload.limit;
          state.apartments = action.payload.apartments;
        }
      })
      .addCase(get_user.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = user_slice.actions;
export default user_slice.reducer;
