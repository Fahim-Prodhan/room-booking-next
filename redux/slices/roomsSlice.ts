import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '@/helper/baseUrl';

export type Room = {
  id: number;
  name: string;
  capacity: number;
  amenities: string[];
  image?: string;
};

type RoomsState = {
  rooms: Room[];
  loading: boolean;
  error: string | null;
};

const initialState: RoomsState = {
  rooms: [],
  loading: false,
  error: null,
};

// Async thunk to fetch rooms
export const fetchRooms = createAsyncThunk('rooms/fetchRooms', async () => {
  const response = await axios.get(`${baseUrl}/api/rooms`);
  return response.data;
});

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch rooms';
      });
  },
});

export default roomsSlice.reducer;