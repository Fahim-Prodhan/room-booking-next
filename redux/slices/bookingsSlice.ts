import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import baseUrl from "@/helper/baseUrl";

interface Booking {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  description: string;
  room: {
    name: string;
  };
}

interface FetchBookingsResponse {
  bookings: Booking[];
  currentPage: number;
  totalPages: number;
  totalBookings: number;
}

interface FetchBookingsParams {
  userId: string;
  page?: number;
  limit?: number;
}

// Fetch bookings for a user
export const fetchBookings = createAsyncThunk<
  FetchBookingsResponse,
  FetchBookingsParams,
  { rejectValue: string }
>(
  "bookings/fetchBookings",
  async ({ userId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${baseUrl}/api/bookings/user/${userId}?page=${page}&size=${limit}`
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch bookings");
      return data;
    } catch (err) {
      // Type guard to check if err is an instance of Error
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      // Handle cases where err is not an Error object
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// Delete a booking
export const deleteBooking = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "bookings/deleteBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseUrl}/api/bookings/${bookingId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete booking");
      return bookingId;
    } catch (err) {
      // Type guard to check if err is an instance of Error
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      // Handle cases where err is not an Error object
      return rejectWithValue("An unknown error occurred");
    }
  }
);
// Update a booking
interface UpdateBookingParams {
  bookingId: string;
  updatedData: {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
  };
}

export const updateBooking = createAsyncThunk<
  Booking,
  UpdateBookingParams,
  { rejectValue: string }
>(
  "bookings/updateBooking",
  async ({ bookingId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseUrl}/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update booking");
      return data;
    } catch (err) {
      // Type guard to check if err is an instance of Error
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      // Handle cases where err is not an Error object
      return rejectWithValue("An unknown error occurred");
    }
  }
);

interface BookingsState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalBookings: number;
}

const initialState: BookingsState = {
  bookings: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalBookings: 0,
};

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Bookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action: PayloadAction<FetchBookingsResponse>) => {
        state.loading = false;
        state.bookings = action.payload.bookings;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalBookings = action.payload.totalBookings;
      })
      .addCase(fetchBookings.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch bookings";
      })
  
      // Delete Booking
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBooking.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.bookings = state.bookings.filter(
          (booking) => booking.id !== action.payload
        );
      })
      .addCase(deleteBooking.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete booking";
      })
  
      // Update Booking
      .addCase(updateBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.loading = false;
        const updatedBooking = action.payload;
        state.bookings = state.bookings.map((booking) =>
          booking.id === updatedBooking.id ? updatedBooking : booking
        );
      })
      .addCase(updateBooking.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Failed to update booking";
      });
  },
});

export default bookingSlice.reducer;