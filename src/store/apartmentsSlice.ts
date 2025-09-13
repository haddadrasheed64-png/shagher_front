import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface services {
  solar_power: boolean;
  internet: boolean;
  main_water: boolean;
  office: Boolean;
  secure_month: Boolean;
}
export interface Apartment {
  _id?: any;
  title: string;
  location: string;
  images: { url: string; public_id: string; type: "image" | "video" }[];
  rooms: number;
  gender: "ذكور" | "إناث" | "ذكور أو إناث" | "عائلات" | string;
  // نوع الإدراج
  listing_type: "sell" | "rent";
  // للإيجار
  rent?: number;
  payment_method?:
    | "سلف"
    | "شهري"
    | "يومي"
    | "سلف 3 أشهر"
    | "سلف 6 أشهر"
    | "سلف سنة"
    | any;
  // للبيع
  sale_price?: number;
  // العملة
  currency: "USD" | "SYP";
  services: services;
  description: string;
  owner_phone: any;
  email?: string;
}
interface ApartmentsState {
  items: Apartment[];
  filteredItems: Apartment[];
  loading: boolean;
  error: string | null | unknown | any;
}
const initialState: ApartmentsState = {
  items: [],
  filteredItems: [],
  loading: false,
  error: null,
};

export const website_analytics = createAsyncThunk(
  "website",
  async ({ method, content }: any, { rejectWithValue }) => {
    try {
      await axios.post("https://shagher.onrender.com/website", {
        method,
        content,
      });
    } catch (error: any) {
      if (!error.response) {
        return rejectWithValue("لا يوجد اتصال بالسيرفر");
      }
      return rejectWithValue(
        error.response.data?.message || "حدث خطأ غير متوقع"
      );
    }
  }
);

export const fetch_apartments = createAsyncThunk(
  "apartments/fetch_apartments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://shagher.onrender.com/getapartments"
      );
      return response.data;
    } catch (error: any) {
      // إذا السيرفر ما رد
      if (!error.response) {
        return rejectWithValue("لا يوجد اتصال بالسيرفر");
      }
      return rejectWithValue(
        error.response.data?.message || "حدث خطأ غير متوقع"
      );
    }
  }
);

export const add_apartment = createAsyncThunk(
  "apartment/add",
  async ({
    title,
    location,
    images,
    rooms,
    gender,
    listing_type,
    rent,
    payment_method,
    sale_price,
    currency,
    services,
    description,
    owner_phone,
    email,
  }: Apartment) => {
    try {
      const response = await axios.post(
        "https://shagher.onrender.com/addapartment",
        {
          title: title,
          location: location,
          images: images,
          rooms: rooms,
          gender: gender,
          listing_type: listing_type,
          rent: rent,
          payment_method: payment_method,
          sale_price: sale_price,
          currency: currency,
          services: services,
          description: description,
          owner_phone: owner_phone,
          email: email,
        }
      );
      return response.data;
    } catch (error: any) {
      return error.response.message;
    }
  }
);

export const delete_apartment = createAsyncThunk(
  "apartment/delete",
  async ({ apartment_id, email }: any, { rejectWithValue }) => {
    try {
      await axios.delete("https://shagher.onrender.com/deleteapartment", {
        data: { apartment_id, email },
      });
      return apartment_id;
    } catch (error: any) {
      if (!error.response) {
        return rejectWithValue("لا يوجد اتصال بالسيرفر");
      }
      return rejectWithValue(
        error.response.data?.message || "حدث خطأ غير متوقع"
      );
    }
  }
);

export const edit_apartment = createAsyncThunk(
  "apartment/edit",
  async (
    {
      _id,
      gender,
      rent,
      payment_method,
      services,
      description,
      owner_phone,
    }: any,
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        "https://shagher.onrender.com/editapartment",
        {
          _id,
          gender,
          rent,
          payment_method,
          owner_phone,
          services,
          description,
        }
      );
      return response.data;
    } catch (error: any) {
      if (!error.response) {
        return rejectWithValue("لا يوجد اتصال بالسيرفر");
      }
      return rejectWithValue(
        error.response.data?.message || "حدث خطأ غير متوقع"
      );
    }
  }
);

const apartmentsSlice = createSlice({
  name: "apartments",
  initialState,
  reducers: {
    filterApartments: (state, action: PayloadAction<any>) => {
      const { search, rooms, gender, payment_method, services, listing_type } =
        action.payload;
      let filtered = [...state.items];
      if (search) {
        filtered = filtered.filter(
          (apt) =>
            apt.title.includes(search) ||
            apt.location.includes(search) ||
            apt.description.includes(search)
        );
      }
      if (rooms) {
        filtered = filtered.filter((apt) => apt.rooms == rooms);
      }
      if (gender) {
        filtered = filtered.filter((apt) => apt.gender == gender);
      }
      if (payment_method) {
        filtered = filtered.filter(
          (apt) => apt.payment_method == payment_method
        );
      }
      if (listing_type) {
        filtered = filtered.filter((apt) => apt.listing_type == listing_type);
      }
      if (services) {
        if (services.solar_power) {
          filtered = filtered.filter((apt) => apt.services.solar_power);
        }
        if (services.internet) {
          filtered = filtered.filter((apt) => apt.services.internet);
        }
        if (services.main_water) {
          filtered = filtered.filter((apt) => apt.services.main_water);
        }
        if (services.no_office) {
          filtered = filtered.filter((apt) => !apt.services.office);
        }
        if (services.no_secure) {
          filtered = filtered.filter((apt) => !apt.services.secure_month);
        }
      }
      state.filteredItems = filtered;
    },
    loading_fun: (state) => {
      state.loading = true;
    },
    cleaning_error: (state) => {
      state.error = null;
    },
    filter_my_apartments: (state, action) => {
      const { apartments } = action.payload;
      let filtered = [...state.items];

      if (apartments && apartments.length > 0) {
        filtered = filtered.filter((apt) => apartments.includes(apt._id));
      }

      state.filteredItems = filtered;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetch_apartments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetch_apartments.fulfilled, (state, action) => {
        if (action.payload) {
          state.loading = false;
          state.error = null;
          state.items = action.payload;
          state.filteredItems = action.payload;
        }
      })
      .addCase(fetch_apartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "فشل في جلب البيانات";
      })

      .addCase(add_apartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(add_apartment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.items.push(action.payload);
        state.filteredItems.push(action.payload);
      })
      .addCase(add_apartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(delete_apartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(delete_apartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(delete_apartment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload) {
          state.items = state.items.filter((apt) => apt._id !== action.payload);
          state.filteredItems = state.filteredItems.filter(
            (apt) => apt._id !== action.payload
          );
        }
      })
      .addCase(edit_apartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(edit_apartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(edit_apartment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const index = state.items.findIndex(
          (apt) => apt._id == action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload; // ✅ هيك فعليًا تعدل العنصر
        }
      });
  },
});
export const {
  filterApartments,
  loading_fun,
  cleaning_error,
  filter_my_apartments,
} = apartmentsSlice.actions;
export default apartmentsSlice.reducer;
