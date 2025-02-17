import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "@/helper/baseUrl";

export type Room = {
  id: string;
  name: string;
  capacity: number;
  amenities: string[];
  image?: string;
};

type RoomsState = {
  rooms: Room[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    totalRooms: number;
    totalPages: number;
    currentPage:number;
  };
};

const initialState: RoomsState = {
  rooms: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    totalRooms: 0,
    totalPages: 1,
    currentPage:1,
  },
};

// Async thunk to fetch rooms with pagination
export const fetchRooms = createAsyncThunk(
  "rooms/fetchRooms",
  async ({ page, limit, search, capacity }: { page: number; limit: number; search: string; capacity: number }) => {
    const response = await axios.get(`${baseUrl}/api/rooms?page=${page}&limit=${limit}&capacity=${capacity}&search=${search}`);

    return response.data; // Ensure the response includes rooms and pagination metadata
  }
);

// Async thunk to delete a room
export const deleteRoom = createAsyncThunk("rooms/deleteRoom", async (id: string) => {
  await axios.delete(`${baseUrl}/api/rooms/${id}`);
  return id; // Return the deleted room ID
});

// Async thunk to update a room
export const updateRoom = createAsyncThunk("rooms/updateRoom", async (room: Room) => {
  const response = await axios.put(`${baseUrl}/api/rooms/${room.id}`, room);
  return response.data; // Return the updated room
});

// Async thunk to create a room
export const createRoom = createAsyncThunk("rooms/createRoom", async (room: Omit<Room, "id">) => {
  const response = await axios.post(`${baseUrl}/api/rooms`, room);
  return response.data; // Return the created room
});

const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Rooms
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload.data; // Update rooms
        state.pagination = action.payload.pagination; // Update pagination metadata
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch rooms";
      })

      // Delete Room
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.rooms = state.rooms.filter((room) => room.id !== action.payload);
        state.pagination.totalRooms -= 1; // Decrement totalRooms after deletion
      })

      // Update Room
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.rooms = state.rooms.map((room) =>
          room.id === action.payload.id ? action.payload : room
        );
      })

      // Create Room
      .addCase(createRoom.fulfilled, (state, action) => {
        state.rooms.push(action.payload);
        state.pagination.totalRooms += 1; // Increment totalRooms after creation
      });
  },
});

export default roomsSlice.reducer;
