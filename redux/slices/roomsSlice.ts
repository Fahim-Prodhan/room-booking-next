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

// Async thunk to delete a room
export const deleteRoom = createAsyncThunk('rooms/deleteRoom', async (id: number) => {
  const response = await axios.delete(`${baseUrl}/api/rooms/${id}`);
  return response.data; // Return the deleted room ID
});

// Async thunk to update a room
export const updateRoom = createAsyncThunk('rooms/updateRoom', async (room: Room) => {
  const response = await axios.put(`${baseUrl}/api/rooms/${room.id}`, room);
  return response.data; // Return the updated room
});

// Async thunk to create a room
export const createRoom = createAsyncThunk('rooms/createRoom', async (room: Omit<Room, 'id'>) => {
  const response = await axios.post(`${baseUrl}/api/rooms`, room);
  return response.data; // Return the created room
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
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        // Remove the deleted room from the state
        state.rooms = state.rooms.filter((room) => room.id !== action.payload.id);
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        // Update the room in the state
        state.rooms = state.rooms.map((room) =>
          room.id === action.payload.id ? action.payload : room
        );
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        // Add the new room to the state
        state.rooms.push(action.payload);
      });
  },
});


export default roomsSlice.reducer;